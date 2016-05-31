#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h> // bool
#include <string.h>
#include <unistd.h>
#include <errno.h> // errno
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/wait.h>

#include "var_val_pair.h"
#include "nvram_cache.h"

//
// The reason for this program: all the page requests on the DGND3700v2
// end up being handled by setup.cgi. This acts as a wrapper to that
// proprietary code and for any reqest it does one of the following
//
//  * Determines that it is simply a case of rendering a page for which
//    has enough information, in which case it does so.
//
//  * Determines that it is a processing request, for which it has enough
//    informationation, in which case it does so.
//
//  * Failing those two, it simply passes the request to the original
//    setup.cgi (now netgear_setup.cgi) to handle.
//
//  This allows the core of the system to run as designed and for bits
//  to be handled seperately as they get improved.
//

#define DEBUG_FILE   "/var/log/page-server.log"
#define DEBUG_TONS   3
#define DEBUG_LOTS   2
#define DEBUG_ACTION 1
#define DEBUG_NONE   0

#define DEBUG_LEVEL DEBUG_LOTS

FILE *fp_debug = NULL;

// Enviroment variables en masse for passing on.
extern char **environ;

// Stuff about page vairables which are hidden
char    *page_var_hidden_prefix = "h_";
#define  PAGE_VAR_HIDDEN_PREFIX_LENGTH 2

// Actual data for processing
char *cookies;
char *get_data = NULL;
char *post_data = NULL;
char **incoming_argv = NULL;

var_val_pair_array *post_data_vvpa       = NULL;
var_val_pair_array *get_data_vvpa        = NULL;
var_val_pair_array *cookies_vvpa         = NULL;
var_val_pair_array *data_for_render_vvpa = NULL;
var_val_pair_array *env_vvpa             = NULL;

var_val_pair_plus_array *action_page_vars = NULL;
var_val_pair_plus_array *render_page_vars = NULL;

char **env_for_our_scripts = NULL;

// Some utility functions that are way down below
void                render_page(char *);

void cleanup() {
    if (get_data != (char *)NULL) free(get_data);
    if (post_data != (char *)NULL) free(post_data);
    free_var_val_pair_array(post_data_vvpa);
    free_var_val_pair_array(get_data_vvpa);
    free_var_val_pair_array(data_for_render_vvpa);
    free_var_val_pair_array(cookies_vvpa);
    free_var_val_pair_plus_array(action_page_vars);
    free_var_val_pair_plus_array(render_page_vars);
    free_var_val_pair_array(env_vvpa);
    free_nvram_cache();
    if (fp_debug != NULL) fclose(fp_debug);
    if (env_for_our_scripts != NULL) free_env(env_for_our_scripts);
}

void mylog(char *source, char *comment) {
    fprintf(fp_debug, "%s: %s\n", source, comment);
    fflush(fp_debug);
}

char *get_post_value(char *var) {
    return find_value_from_var(post_data_vvpa, var);
}

char *get_get_value(char *var) {
    return find_value_from_var(get_data_vvpa, var);
}

char *get_env_value(char *var) {
    return find_value_from_var(env_vvpa, var);
}

char *get_get_or_post_value(char *var) {
    char *h_var;
    char *result;

    if (var == NULL) return NULL;
    h_var = malloc(strlen(var) + PAGE_VAR_HIDDEN_PREFIX_LENGTH + 1);
    if (h_var == NULL) return NULL;
    sprintf(h_var, "%s%s", page_var_hidden_prefix, var);

    result = get_get_value(h_var);
    if (result == NULL) result = get_post_value(h_var);
    if (result == NULL) result = get_get_value(var);
    if (result == NULL) result = get_post_value(var);

    free(h_var);
    return result;
}

bool is_hidden_page_var(char *v) {
    if (strncmp(v, page_var_hidden_prefix, PAGE_VAR_HIDDEN_PREFIX_LENGTH) == 0) return true;
    return false;
}

void get_post_data() {
    char *lengthstr;
    long  length;

    lengthstr = getenv("CONTENT_LENGTH");
    if (lengthstr != NULL) {
        sscanf(lengthstr, "%ld", &length);
        post_data = calloc(length+2, sizeof(char)); // for luck
        fgets(post_data, length+1, stdin);
    }
}

int run_external_prog(char *file_to_run, char **env_for_prog, char **argv_for_prog, char *input_to_prog, bool output_to_log, bool child_stderr_to_log) {
    int   pipe_to_child[2];
    int   pipe_from_child[2];
    int   child_exit_status = -1;
    int   wait_res;
    char *cmd;
    char  buf;
    char  msg_buffer[256];
    bool  need_to_free_argv = false;
    bool  need_to_free_env  = false;
    bool  need_to_free_cmd = false;;
    bool  pass_output_through = false;

    if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("run_external_prog - action calling", file_to_run);

    if (argv_for_prog == NULL) {
        argv_for_prog     = calloc(1, sizeof(char *));
        need_to_free_argv = true;
    }
    if (env_for_prog == NULL) {
        env_for_prog     = calloc(1, sizeof(char *));
        need_to_free_env = true;
    }

    if (output_to_log) {
        cmd = malloc(strlen(file_to_run) + 11 /* " >>  2>&1\0" and one for luck*/ + strlen(DEBUG_FILE));
        if (cmd == NULL) {
            mylog("run_external_prog - memory fail", "trying to create a string for command (Log output and error)");
        }
        need_to_free_cmd = true;
        sprintf(cmd, "%s >> %s", file_to_run, DEBUG_FILE);
        if (child_stderr_to_log) strcat(cmd, " 2>&1");
    }
    else if (child_stderr_to_log) {
        cmd = malloc(strlen(file_to_run) + 7 /* " 2>> \0" and one for luck*/ + strlen(DEBUG_FILE));
        if (cmd == NULL) {
            mylog("run_external_prog - memory fail", "trying to create a string for command (Log error)");
        }
        need_to_free_cmd = true;
        sprintf(cmd, "%s 2>> %s", file_to_run, DEBUG_FILE);
    }
    else {
        cmd = file_to_run;
        pass_output_through = true;
    }

    if (input_to_prog)       pipe(pipe_to_child);
    if (pass_output_through) pipe(pipe_from_child);

    pid_t child_pid = fork();
    if (child_pid == 0) {
        /* child so hand over to the prog */
        // Set up child's stdin to receive what we pass through if it's going to be used, if not close it
        if (input_to_prog != NULL) {
            dup2(pipe_to_child[0], STDIN_FILENO);
            close(pipe_to_child[1]); // close child's write end (parent writes to this one)
        }
        // Set up stdout to be caught if we're passing it through
        if (pass_output_through) {
            dup2(pipe_from_child[1], STDOUT_FILENO);
            close(pipe_from_child[0]); // close child's read end
        }

        if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("run_external_prog - child calling prog now", cmd);
        execve(file_to_run, argv_for_prog, env_for_prog);

        // If we get here, something has gone wrong: report and close the pipes to enure EOF sending etc.
        if (DEBUG_LEVEL >= DEBUG_ACTION) {
            sprintf(msg_buffer, "prog call failed errno: %d", errno);
            mylog("run_external_prog - child failed", msg_buffer);
        }
        if (input_to_prog)       close(pipe_to_child[0]);
        if (pass_output_through) close(pipe_from_child[1]);
        exit(child_exit_status);
    }
    else {
        /* Still me, so send post data and pass back the html via stdout as expected */
        if (DEBUG_LEVEL >= DEBUG_TONS) mylog("run_external_prog - parent", "tidying pipes and sending data");

        // Write the post data to the child
        if (input_to_prog != NULL) {
            close(pipe_to_child[0]); // Close the read end - that's for the child, not the parent
            write(pipe_to_child[1], input_to_prog, strlen(input_to_prog)); // Send the stdin stuff
            close(pipe_to_child[1]); // Done so send EOF
        }
        if (pass_output_through) close(pipe_from_child[1]); // Close the write end, we read this one.

        if (DEBUG_LEVEL >= DEBUG_LOTS) mylog("run_external_prog - parent", "waiting for child");

        // Get all the data from them and dump it to STDOUT or log depending ...
        if (pass_output_through) {
            while(read(pipe_from_child[0], &buf, 1) > 0) {
                write(STDOUT_FILENO, &buf, 1);
            }
            write(STDOUT_FILENO, "\n", 1);
            close(pipe_from_child[0]);
        }

        // When child done, stop.
        wait_res = waitpid(child_pid, &child_exit_status, 0/*WNOHANG*/);

        if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("run_external_prog - parent", "child completed");
    }

    if (need_to_free_argv) free(argv_for_prog);
    if (need_to_free_env)  free(env_for_prog);
    if (need_to_free_cmd)  free(cmd);
    return child_exit_status;
}

void pass_to_netgear_setup_and_exit() {
    int exit_val = run_external_prog("netgear-setup.cgi", environ, incoming_argv, post_data, false, false);
    exit(exit_val);
}

var_val_pair_plus_array *get_page_vars(FILE *fp) {
    int   l;
    int   tmp1, tmp2;
    char  line[128];
    char  page_var[128];
    char  nv_var[128];
    char  var_rel_act[123];
    char *var_rel_p;
    char *pv;
    char *phrase;
    char *colon_pos;
    var_val_pair_array *extra_vvpa;
    var_val_pair_plus  *new_vvpp;
    var_val_pair_plus_array *result;

    result = create_var_val_pair_plus_array();

    while (fgets(line, 128, fp)) {
        extra_vvpa = NULL;
        page_var[0] = nv_var[0] = var_rel_act[0] = '\0';
        sscanf(line, "%s %s %s", page_var, nv_var, var_rel_act);

        // Front trim "@" and the "h_" if it's there on the page var.
        pv = &(page_var[0]);
        if (*pv == '@') pv++;
        if (is_hidden_page_var(pv)) pv += 2;
        // Trim the "#" at the end
        l = strlen(pv);
        l--;
        if (*(pv+l) == '#') *(pv+l) = 0;

        new_vvpp = addto_var_val_pair_plus_array(result, pv, nv_var);

        if ((strlen(pv) > 0) && (strcmp(nv_var, "UNDEFINED") != 0)) {
            require_variable_in_nvram_cache(nv_var);

            var_rel_p = &var_rel_act[0];
            colon_pos = strchr(var_rel_p, ':');

            while (var_rel_p != NULL) {
                if (colon_pos != NULL) *colon_pos = '\0';

                if (*var_rel_p == '#') {
                    var_rel_p++;
                    tmp1 = tmp2 = 0;
                    if (!strncmp(var_rel_p, "ALLR,", 5)) {
                        tmp1 = VVPP_ALL_ROWS;
                        sscanf(var_rel_p+5, "%d", &tmp2);
                    }
                    else if (sscanf(var_rel_p, "%d", &tmp1) == 1) {
                        var_rel_p = strchr(var_rel_p, ',');
                        if (var_rel_p != NULL) sscanf(var_rel_p+1, "%d", &tmp2);
                    }
                    else {
                        tmp1 = VVPP_SELECTED_ROW;
                        add_var_val_pair_plus_text_attribute(new_vvpp, VVPP_HAS_ROW_ID, var_rel_p, ',');
                        var_rel_p = strchr(var_rel_p, ',');
                        if (var_rel_p != NULL) sscanf(var_rel_p+1, "%d", &tmp2);
                    }
                    add_var_val_pair_plus_attribute(new_vvpp, VVPP_HAS_RC_INFO, tmp1, tmp2);
                }
                else if (*var_rel_p == '@') {
                    var_rel_p++;
                    if      (!strncmp(var_rel_p, "ipstart", 7)) add_var_val_pair_plus_attribute(new_vvpp, VVPP_HAS_IP_START, 0, 0);
                    else if (!strncmp(var_rel_p, "ipend", 5))   add_var_val_pair_plus_attribute(new_vvpp, VVPP_HAS_IP_END, 0, 0);
                    else if (!strncmp(var_rel_p, "ipnum", 5))   add_var_val_pair_plus_attribute(new_vvpp, VVPP_HAS_IP_NUM, 0, 0);
                    else if (!strncmp(var_rel_p, "ipport", 6))  add_var_val_pair_plus_attribute(new_vvpp, VVPP_HAS_IP_PORT, 0, 0);
                }
                else if (!strcmp(var_rel_p, "text")) {
                    set_var_val_pair_plus_type(new_vvpp, VVPP_TYPE_TEXT);
                }
                else if (!strcmp(var_rel_p, "opts")) {
                    set_var_val_pair_plus_type(new_vvpp, VVPP_TYPE_OPTS);
                }
                else if (!strcmp(var_rel_p, "httpoptionlistfromarray")) {
                    set_var_val_pair_plus_type(new_vvpp, VVPP_TYPE_OPTION_LIST);
                }
                else if (!strcmp(var_rel_p, "array_entry")) {
                    set_var_val_pair_plus_type(new_vvpp, VVPP_TYPE_ARRAY_ENTRY);
                }
                else {
                    // In the absence of all the above, this is a translation list
                    phrase = strtok(var_rel_p, ";");
                    while (phrase != NULL) {
                        extra_vvpa = parse_var_equals_val_into_vvpa(phrase, extra_vvpa);
                        phrase = strtok((char *)0,";");
                    }
                    set_var_val_pair_plus_translation_vvpa(new_vvpp, extra_vvpa);
                }

                if (colon_pos != NULL) {
                    var_rel_p = colon_pos + 1;
                    colon_pos = strchr(var_rel_p, ':');
                }
                else var_rel_p = NULL;
            }
        }
    }

    return result;
}

void get_render_page_vars(FILE *fp) {
    render_page_vars = get_page_vars(fp);
    if (DEBUG_LEVEL >= DEBUG_TONS) vvppa_log_to_file(fp_debug, render_page_vars, "get_render_page_vars entry: %s\n");
}

void get_action_page_vars(FILE *fp) {
    action_page_vars = get_page_vars(fp);
    if (DEBUG_LEVEL >= DEBUG_TONS) vvppa_log_to_file(fp_debug, action_page_vars, "get_action_page_vars entry: %s\n");
}

void core_info_to_render_data() {
    FILE *fp;
    char  sid[16];
    char  post_par[32];

    // Add the session ID and model number to the list as they will be wanted
    sid[0] = '\0';

    fp = fopen("/tmp/SessionFile", "r");
    if (fp != NULL) fgets(sid, 16, fp);

    if (strlen(sid) < 5) { // That wasn't real ....
        sprintf(sid, get_get_value("id"));
    }

    // This was my best guess for this one, but it seems to be wrong
    //data_for_render_vvpa = addto_var_val_pair_array(data_for_render_vvpa, "SID", sid);

    // This seems to be how this parameter is used ...
    sprintf(post_par, "?id=%s", sid);
    data_for_render_vvpa = addto_var_val_pair_array(data_for_render_vvpa, "post_par", post_par);

    // TODO: There must be a better way of setting this.
    data_for_render_vvpa = addto_var_val_pair_array(data_for_render_vvpa, "model_name", "DGND3700v2");
}

void save_data() {
    int           i;
    int           row;
    int           col;
    int           pv_index;
    int           occur_place;
    bool          is_hidden;
    char         *cp;
    char         *page_var;
    char         *nv_value;
    char         *cur_value;
    char          no_ip_range[4] = "0/0";
    char          arbitrary_ip[12] = "192.168.1.1";
    char          new_ip_value[32];
    var_val_pair       *vvp;
    var_val_pair_plus  *vvpp_entry;
    var_val_pair_array *extra_vvpa;
    var_val_pair_array *vars_so_far_vvpa = NULL;

    if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("save_data - going through data", "start");
    // Go through all the post data and save to nvram where possible
    for (i=0; i<post_data_vvpa->num_used; i++) {
        vvp       = post_data_vvpa->vvps[i];
        page_var  = vvp->var;
        is_hidden = false;
        if (is_hidden_page_var(page_var)) {
            page_var += PAGE_VAR_HIDDEN_PREFIX_LENGTH;
            is_hidden = true;
        }

        if (DEBUG_LEVEL >= DEBUG_LOTS) mylog("save_data - assessing post variable", page_var);

        row = col = 0; // Naff fall over options. Should never be used.
        vvpp_entry = NULL;
        nv_value   = NULL;
        cur_value  = NULL;
        pv_index   = find_index_of_var_in_vvppa(action_page_vars, page_var);
        if (pv_index != VVPPA_NOT_FOUND) vvpp_entry = action_page_vars->vvpps[pv_index];

        if (vvpp_entry != NULL) {
            // Has this one already been supplied by the page? If so, hidden one seems to trumpt visible one ...
            occur_place = first_var_occurence_in_vvpa(vars_so_far_vvpa, page_var);
            if (occur_place == VVPA_NOT_FOUND) {
                if (DEBUG_LEVEL >= DEBUG_TONS) mylog("save_data - post data assessed", "not seen before");
            }
            else {
                if (DEBUG_LEVEL >= DEBUG_TONS) mylog("save_data - post data assessed", "repeat");
                if (!is_hidden) vvpp_entry = NULL;
                else {
                    if (DEBUG_LEVEL >= DEBUG_TONS) mylog("save_data - post data assessed", "hidden so trumps");
                }
            }
        }

        if (vvpp_entry != NULL) {
            if (DEBUG_LEVEL >= DEBUG_TONS) mylog("save_data - getting value (with trans if needed for)", vvpp_entry->value);
            // Do conversion if needed
            nv_value   = NULL;
            extra_vvpa = vvpp_entry->translate_vvpa;
            if (extra_vvpa != NULL) nv_value = find_value_from_var(extra_vvpa, vvp->value);
            else                    nv_value = vvp->value;
        }

        if (nv_value != NULL) {
            // Check it's not an unsettbale derivative
            if      ((nv_value[0] == '*') && (nv_value[1] == '\0')) nv_value = NULL;
            else if (nv_value[0] == '!') nv_value = NULL;
            if ((DEBUG_LEVEL >= DEBUG_TONS) && (nv_value == NULL)) mylog("save_data", "Unsettable derivative");
        }

	// Get current value and use if needed.
        if (nv_value != NULL) {
            switch (vvpp_entry->type) {
            case VVPP_TYPE_TEXT:
            case VVPP_TYPE_OPTS:
                cur_value = get_value_from_nvram_cache(vvpp_entry->value);
                if (DEBUG_LEVEL >= DEBUG_TONS) mylog("save_data - entry currently", cur_value);
                break;
            case VVPP_TYPE_ARRAY_ENTRY:
                col = vvpp_entry->column;
                switch(vvpp_entry->row) {
                case VVPP_ALL_ROWS: // Shouldn't happen, but if it does treat a selected row
                case VVPP_SELECTED_ROW:
                    cp = vvpp_entry->row_identifier;
                    if (cp != NULL) {
                        // It should be in the incoming information.
                        cp = get_get_or_post_value(cp);
                        if (cp != NULL) row = atoi(cp);
                    }
                    break;
                default:
                    row = vvpp_entry->row;
                }
                cur_value = get_array_value_from_nvram_cache(vvpp_entry->value, row, col);
                if (DEBUG_LEVEL >= DEBUG_TONS) mylog("save_data - array entry currently", cur_value);
                break;
            }

            if (vvpp_entry->has & VVPP_HAS_IP_START) {
                if (strlen(nv_value) == 0) nv_value = no_ip_range;
                else if (cur_value != NULL) {
                    cp = strchr(cur_value, '-');
                    if (cp != NULL) {
                        sprintf(new_ip_value, "%s%s", nv_value, cp);
                        nv_value = new_ip_value;
                    }
                }
                // If cur_value is NULL, just let nvram through as the new sole or start IP.
            }

            if (vvpp_entry->has & VVPP_HAS_IP_END) {
                if (strlen(nv_value) > 0) {
                    if (cur_value != NULL) {
                        cp = strchr(cur_value, '-');
                        if (cp != NULL) *cp = '\0';
                        sprintf(new_ip_value, "%s-%s", cur_value, nv_value);
                        if (cp != NULL) *cp = '-';
                    }
                    else {
                        sprintf(new_ip_value, "-%s", nv_value);
                    }
                    nv_value = new_ip_value;
                }
                else nv_value = cur_value;
            }

            if (vvpp_entry->has & VVPP_HAS_IP_NUM) {
                if (strlen(nv_value) == 0) nv_value = arbitrary_ip;
                else if (cur_value != NULL) {
                    cp = strchr(cur_value, ':');
                    if (cp != NULL) {
                        sprintf(new_ip_value, "%s%s", nv_value, cp);
                        nv_value = new_ip_value;
                    }
                }
                // If cur_value is NULL, just let nv_value through as the new IP.
            }

            if (vvpp_entry->has & VVPP_HAS_IP_PORT) {
                if (strlen(nv_value) > 0) {
                    if (cur_value != NULL) {
                        cp = strchr(cur_value, ':');
                        if (cp != NULL) *cp = '\0';
                        sprintf(new_ip_value, "%s:%s", cur_value, nv_value);
                        if (cp != NULL) *cp = ':';
                    }
                    else {
                        sprintf(new_ip_value, ":%s", nv_value);
                    }
                    nv_value = new_ip_value;
                }
                else nv_value = cur_value;
            }
        }

        if (nv_value != NULL) {
            switch (vvpp_entry->type) {
            case VVPP_TYPE_TEXT:
            case VVPP_TYPE_OPTS:
                if (DEBUG_LEVEL >= DEBUG_TONS) mylog("save_data - to     ", nv_value);
                set_value_in_nvram_cache(vvpp_entry->value, nv_value);
                vars_so_far_vvpa = addto_var_val_pair_array(vars_so_far_vvpa, page_var, nv_value);
                break;
            case VVPP_TYPE_ARRAY_ENTRY:
                if (DEBUG_LEVEL >= DEBUG_TONS) mylog("save_data - array entry to", nv_value);
                set_array_value_in_nvram_cache(vvpp_entry->value, row, col, nv_value);
                vars_so_far_vvpa = addto_var_val_pair_array(vars_so_far_vvpa, page_var, nv_value);
            }
        }
    }

    // And store
    sync_nvram_cache_back_to_nvram();

    if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("save_data - going through data", "done");
}

void create_environment_vars_for_our_scripts() {
    if (env_for_our_scripts == NULL) {
        env_for_our_scripts = vvpas_into_environment_variables(environ, post_data_vvpa, get_data_vvpa);
    }
}

void do_pre_save_action(char *file) {
    char   fn[512];
    struct stat sb;

    if (file == NULL) return;
    sprintf(fn, "save-actions/%s.pre", file);
    if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("do_pre_save_action - file", fn);

    // Check it is executable ...
    if ((stat(fn, &sb) == 0) && (sb.st_mode & S_IXUSR)) {
        create_environment_vars_for_our_scripts();
        run_external_prog(fn, env_for_our_scripts, NULL, NULL, true, true);
    }
    else {
        if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("do_pre_save_action - call fail", "not executable");
    }
}

void do_post_save_action(char *file) {
    char   fn[512];
    struct stat sb;

    if (file == NULL) return;
    sprintf(fn, "save-actions/%s.post", file);
    if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("do_post_save_action - file", fn);

    // Check it is executable ...
    if ((stat(fn, &sb) == 0) && (sb.st_mode & S_IXUSR)) {
        create_environment_vars_for_our_scripts();
        run_external_prog(fn, env_for_our_scripts, NULL, NULL, true, true);
    }
    else {
        if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("do_post_save_action - call fail", "not executable");
    }
}

int main(int argc, char *argv[]) {
    char *todo_value;
    char *next_file_value = NULL; // The file to render once the actions are complete
    char *this_file_value = NULL; // The file which is triggering the todo action, eg save
    char  filename[128];
    FILE *fp;
    bool  have_data_for_render = false;
    bool  have_data_for_action = false;

    // Initiat debug log if needed
    if (DEBUG_LEVEL > DEBUG_NONE) {
        fp_debug = fopen(DEBUG_FILE, "a");
        if (DEBUG_LEVEL >= DEBUG_LOTS) mylog("main - start", "opened log file");
    }

    // Get the data and process the get info as it should tell us what we are doing ...
    incoming_argv = argv;
    get_data      = getenv("QUERY_STRING");
    get_post_data();

    if (get_data == NULL) {
        if (DEBUG_LEVEL >= DEBUG_NONE) mylog("main - action", "no get data so passing to Netgear setup.cgi");
        pass_to_netgear_setup_and_exit();
    }

    env_vvpa       = parse_argv_type_data_into_vvpa(environ, env_vvpa);
    get_data_vvpa  = parse_post_get_type_data_into_vvpa(get_data, NULL, "&");
    post_data_vvpa = parse_post_get_type_data_into_vvpa(post_data, NULL, "&");
    cookies_vvpa   = parse_post_get_type_data_into_vvpa(get_env_value("HTTP_COOKIE"), NULL, ";");

    todo_value      = get_get_or_post_value("todo");
    next_file_value = get_get_or_post_value("next_file");
    this_file_value = get_get_or_post_value("this_file");

    if (DEBUG_LEVEL >= DEBUG_TONS) {
        vvpa_log_to_file(fp_debug, get_data_vvpa, "main - get data incoming : %s=%s\n");
        vvpa_log_to_file(fp_debug, post_data_vvpa, "main - post data incoming : %s=%s\n");
        vvpa_log_to_file(fp_debug, cookies_vvpa, "main - cookie data incoming : %s=%s\n");
        vvpa_log_to_file(fp_debug, env_vvpa, "main - environment incoming : %s=%s\n");
    }

    if (DEBUG_LEVEL >= DEBUG_LOTS) {
        if (todo_value == NULL) mylog("main - todo", "NULL");
        else                    mylog("main - todo", todo_value);
        if (next_file_value == NULL) mylog("main - next_file", "NULL");
        else                         mylog("main - next_file", next_file_value);
        if (this_file_value == NULL) mylog("main - this_file", "NULL");
        else                         mylog("main - this_file", this_file_value);
    }

    // Do the todo (if we can) before rendering.
    if (todo_value != NULL) {
        // If there is a this_file
        if (this_file_value != NULL) {
            if (strlen(this_file_value) > 80) {
                if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("main - action", "wildly long this_file so capping at 80 chars");
                this_file_value[80] = '\0';
            }
            sprintf(filename, "render-data/%s", this_file_value);
            if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("main - page data from file (if possible)", filename);
            fp = fopen(filename, "r");
            if (fp  != NULL) {
                if (DEBUG_LEVEL >= DEBUG_LOTS) mylog("main - action", "getting page data");
                get_action_page_vars(fp);
                fclose(fp);
                have_data_for_action = true;
            }
        }

        // Handle todo actions that must be done before page render.
        if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("main - action", "considering todo");
        if (have_data_for_action && !strcmp(todo_value, "save")) {
            if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("main - action", "saving data");
            do_pre_save_action(this_file_value);
            save_data();
            do_post_save_action(this_file_value);
        }
    }

    // Get page vars if possible: the relationship betwwen vars in html and vars in nvram.
    if (next_file_value != NULL) {
        if (strlen(next_file_value) > 80) {
            if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("main - action", "wildly long next_file so capping at 80 chars");
            next_file_value[80] = '\0';
        }
        sprintf(filename, "render-data/%s", next_file_value);
        if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("main - page data from file (if possible)", filename);
        fp = fopen(filename, "r");
        if (fp  != NULL) {
            if (DEBUG_LEVEL >= DEBUG_LOTS) mylog("main - action", "getting page data");
            get_render_page_vars(fp);
            fclose(fp);
            core_info_to_render_data();
            have_data_for_render = true;
        }
    }

    if (have_data_for_render) {
        if (DEBUG_LEVEL >= DEBUG_LOTS) mylog("main - action", "getting core info");
        if (DEBUG_LEVEL >= DEBUG_TONS) vvpa_log_to_file(fp_debug, data_for_render_vvpa, "main - core var to renderer : %s -> %s\n");
        if (DEBUG_LEVEL >= DEBUG_ACTION) mylog("main - action", "have page data so calling render");
        render_page(next_file_value);
        cleanup();
        exit(0);
    }

    if (DEBUG_LEVEL > DEBUG_NONE) mylog("main - action", "nothing for us to do, calling netgear setup.cgi");
    pass_to_netgear_setup_and_exit();

    // Shouldn't get to this return, so it is a fail if it gets to it ...
    return -1;
}

void render_page_variable_to_stdout(char *pv) {
    int   i;
    int   vvppa_i;
    int   col;
    int   row;
    int   num_rows;
    char *cp = NULL;
    char *cp2;
    char  blank_string[1] = "";
    char  buffer[128];
    var_val_pair_plus  *vvpp;

    if (DEBUG_LEVEL >= DEBUG_LOTS) mylog("render_page_variable_to_stdout rending var", pv);
    if (pv == NULL) return;

    // 0. It may be in core render info or already in the incoming data ...
    cp = get_get_or_post_value(pv);
    if (cp == NULL) cp = find_value_from_var(data_for_render_vvpa, pv);
    if (cp != NULL) {
        if (DEBUG_LEVEL >= DEBUG_LOTS) mylog("render_page_variable_to_stdout was in core or post or get; value", cp);
        write(STDOUT_FILENO, cp, strlen(cp));
        return;
    }

    // 1. Get the VVPP for the page variable
    if (DEBUG_LEVEL >= DEBUG_TONS) mylog("render_page_variable_to_stdout", "not in core, post or get, checking page vars");
    vvppa_i = find_index_of_var_in_vvppa(render_page_vars, pv);

    if (vvppa_i == VVPPA_NOT_FOUND) {
        // Can't use that information, try a couple of lucky guesses
        cp = get_value_from_nvram_cache(pv); // Failing that, see if the page var just happens to be in the nvram
        if (cp != NULL) {
            write(STDOUT_FILENO, cp, strlen(cp));
            if (DEBUG_LEVEL >= DEBUG_LOTS) mylog("render_page_variable_to_stdout was in nvram; value", cp);
        }
        else if (DEBUG_LEVEL > DEBUG_NONE) mylog("render_page failed to resolve variable", pv);
        return;
    }

    vvpp = render_page_vars->vvpps[vvppa_i];

    // 2. Based on it's type and HAS attrbiutes, get the value to STDOUT ...
    cp = NULL;
    switch (vvpp->type) {
    case VVPP_TYPE_TEXT:
        if (DEBUG_LEVEL >= DEBUG_TONS) mylog("render_page_variable_to_stdout; type", "text");
        cp = get_value_from_nvram_cache(vvpp->value);
        break;
    case VVPP_TYPE_OPTS:
        if (DEBUG_LEVEL >= DEBUG_TONS) mylog("render_page_variable_to_stdout; type", "opts");
        cp = get_value_from_nvram_cache(vvpp->value);
        break;
    case VVPP_TYPE_OPTION_LIST:
        if (DEBUG_LEVEL >= DEBUG_TONS) mylog("render_page_variable_to_stdout; type", "option list");
        // We are assuming ALL_ROWS here as it must be
        col      = vvpp->column;
        num_rows = get_array_num_rows_from_nvram_cache(vvpp->value);
        if (num_rows != NVRAM_POS_QUERY_FAILED) {
            for (i=0; i<num_rows; i++) {
                cp = get_array_value_from_nvram_cache(vvpp->value, i, col);
                if (DEBUG_LEVEL >= DEBUG_TONS) mylog("render_page_variable_to_stdout option", cp);
                write(STDOUT_FILENO, "<option name=\"", 13);
                write(STDOUT_FILENO, cp, strlen(cp));
                write(STDOUT_FILENO, "\">", 2);
                write(STDOUT_FILENO, cp, strlen(cp));
                write(STDOUT_FILENO, "</option>", 9);
            }
        }
        return;
    case VVPP_TYPE_ARRAY_ENTRY:
        if (DEBUG_LEVEL >= DEBUG_TONS) mylog("render_page_variable_to_stdout; type", "array list");
        row = 0; // Naff failover option. Should never happen.
        col = vvpp->column;
        switch(vvpp->row) {
        case VVPP_ALL_ROWS: // Shouldn't happen, but if it does treat a selected row
        case VVPP_SELECTED_ROW:
            cp = vvpp->row_identifier;
            if (cp != NULL) {
                // It should be in the incoming information.
                cp = get_get_or_post_value(cp);
                if (cp != NULL) row = atoi(cp);
            }
            break;
        default:
            row = vvpp->row;
        }
        cp = get_array_value_from_nvram_cache(vvpp->value, row, col);
    }

    if (vvpp->has & VVPP_HAS_IP_RANGE) {
        if (!strcmp(cp, "0/0") || (strlen(cp) == 0)) cp = blank_string;
        else {
            cp2 = strchr(cp, '-');
            if (cp2 != NULL) {
                if (vvpp->has & VVPP_HAS_IP_END) cp = cp2;
                else {
                    i = cp2 - cp;
                    if (i > 120) i=120;
                    strncpy(buffer, cp, i);
                    cp = buffer;
                }
            }
            else {
                if (vvpp->has & VVPP_HAS_IP_END) cp = blank_string;
            }
        }
    }
    else if (vvpp->has & VVPP_HAS_IP_NUM_PORT) {
        cp2 = strchr(cp, ':');
        if (cp2 != NULL) {
            if (vvpp->has & VVPP_HAS_IP_PORT) cp = cp2+1;
            else {
                /* VVPP_HAS_IP_NUM */
                i = cp2 - cp;
                if (i > 120) i=120;
                strncpy(buffer, cp, i);
                cp = buffer;
            }
        }
        else {
            if (vvpp->has & VVPP_HAS_IP_PORT) cp = blank_string;
        }
    }

    if ((vvpp->has & VVPP_HAS_TRANSLATE) && (cp != NULL)) {
        if (DEBUG_LEVEL >= DEBUG_TONS) mylog("render_page_variable_to_stdout; calling translate with", cp);
        cp = find_var_from_value(vvpp->translate_vvpa, cp);
        if (DEBUG_LEVEL >= DEBUG_TONS) mylog("render_page_variable_to_stdout; translate returns", cp);
    }

    if (cp != NULL) {
        write(STDOUT_FILENO, cp, strlen(cp));
        if (DEBUG_LEVEL >= DEBUG_LOTS) mylog("render_page_variable_to_stdout final val", cp);
    }
    else if (DEBUG_LEVEL > DEBUG_NONE) mylog("render_page failed to resolve variable", pv);
}

void render_page(char *page) {
    char  char_from_source = 0;
    int   vc = 0;
    char  variable[128];
    char *v  = NULL;
    FILE *fp = NULL;
    bool in_variable = false;

    if (DEBUG_LEVEL > DEBUG_NONE) mylog("render_page - action", "trying to render");

    // We know we have the data, so open the 'html' source
    fp = fopen(page, "r");
    if (fp == NULL) {
        if (DEBUG_LEVEL > DEBUG_ACTION) mylog("render_page - failure cant open file", page);
        pass_to_netgear_setup_and_exit();
    }

    write(STDOUT_FILENO, "Content-Type: text/html\n\n", 25);

    // Go through the file either passing it through or spotting variables and replacing them ...
    in_variable = false;
    while ((char_from_source = fgetc(fp)) != EOF) {
        if (in_variable) {
            if (char_from_source == '@') {
                if (DEBUG_LEVEL >= DEBUG_TONS) mylog("render_page", "variable start within potential variable");
                variable[vc] = 0;
                write(STDOUT_FILENO, variable, vc);
                vc = 0;
            }
            else if (char_from_source == '#') {
                variable[vc] = 0;
                v = &(variable[0]);
                if (DEBUG_LEVEL >= DEBUG_TONS) mylog("render page - evaluating variable", v);
                // We have removed the '@' and '#' in the way we extracted the vairable;
                // remove the 'h_' if it is there.
                if ((*v == 'h') && (*(v+1) == '_')) v += 2;
                render_page_variable_to_stdout(v);
                in_variable = false;
                vc = 0;
            }
            else {
                variable[vc++] = char_from_source;
                if (vc == 127) {
                    if (DEBUG_LEVEL >= DEBUG_TONS) mylog("render_page", "over-long variable");
                    variable[127] = 0;
                    write(STDOUT_FILENO, variable, 127);
                    in_variable = false;
                    vc = 0;
                }
            }
        }
        else {
            if (char_from_source == '@') {
                if (DEBUG_LEVEL >= DEBUG_TONS) mylog("render_page", "variable start");
                in_variable = true;
                vc = 0;
            }
            else {
                write(STDOUT_FILENO, &char_from_source, 1);
            }
        }
    }
    // Done!
}

