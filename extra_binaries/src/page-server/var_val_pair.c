/*
 * Utility code for creating collections of variable names with their values
 */

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <ctype.h> // isspace
#include "var_val_pair.h"

// define these as needed
#define DEBUG_ON  1
#define DEBUG_OFF 0
#define DEBUG_LOGGING DEBUG_OFF

char *my_strchrdup(char *src, char eow) {
    int  l;
    char *res;
    char *cp = strchr(src, eow);
    if (cp == NULL) return NULL;
    l = cp - src;
    res = calloc(l, sizeof(char));
    memcpy(res, src, l);
    *(res+l) = '\0';
    return res;
}

void free_var_val_pair(var_val_pair *vvp) {
    if (vvp != NULL) {
        if (vvp->var != NULL)   free(vvp->var);
        if (vvp->value != NULL) free(vvp->value);
        free(vvp);
    }
}

var_val_pair *create_var_val_pair(char *var, char *value) {
    var_val_pair *vvp = (var_val_pair *)calloc(sizeof(var_val_pair), 1);
    if (var != NULL)   vvp->var   = strdup(var);
    if (value != NULL) vvp->value = strdup(value);
    return vvp;
}

void free_var_val_pair_array(var_val_pair_array *vvpa) {
    int i;
    if (vvpa != NULL) {
        for (i=0; i<vvpa->num_used; i++) {
            if (vvpa->vvps[i] != NULL) free_var_val_pair(vvpa->vvps[i]);
        }
        if (vvpa->vvps != NULL) free(vvpa->vvps);
        free(vvpa);
    }
}

var_val_pair_array *create_var_val_pair_array() {
    var_val_pair_array *vvpa = calloc(sizeof(var_val_pair_array), 1);
    vvpa->num_alloc = 0;
    vvpa->num_used  = 0;
    return vvpa;
}

void free_var_val_pair_plus(var_val_pair_plus *vvpp) {
    if (vvpp != NULL) {
        if (vvpp->var != NULL)   free(vvpp->var);
        if (vvpp->value != NULL) free(vvpp->value);
        free(vvpp);
    }
}

var_val_pair_plus *create_var_val_pair_plus(char *var, char *value) {
    var_val_pair_plus *vvpp = (var_val_pair_plus *)calloc(sizeof(var_val_pair_plus), 1);
    if (var != NULL)   vvpp->var   = strdup(var);
    if (value != NULL) vvpp->value = strdup(value);
    return vvpp;
}

void free_var_val_pair_plus_array(var_val_pair_plus_array *vvppa) {
    var_val_pair_plus *vvpp;
    int i;
    if (vvppa != NULL) {
        for (i=0; i<vvppa->num_used; i++) {
            vvpp = vvppa->vvpps[i];
            free_var_val_pair_plus(vvpp);
        }
        free(vvppa);
    }
}

var_val_pair_plus_array *create_var_val_pair_plus_array() {
    var_val_pair_plus_array *vvppa = calloc(sizeof(var_val_pair_plus_array), 1);
    vvppa->num_alloc = 0;
    vvppa->num_used  = 0;
    return vvppa;
}

void vvp_update_value(var_val_pair *vvp, char *new_value) {
    if (vvp != NULL) {
        if (vvp->value != NULL) free(vvp->value);
        if (new_value == NULL) vvp->value = NULL;
        else                   vvp->value = strdup(new_value);
    }
}

void set_var_val_pair_plus_type(var_val_pair_plus *vvpp, int type) {
    if (vvpp != NULL) {
        vvpp->type = type;
    }
}

void add_var_val_pair_plus_attribute(var_val_pair_plus *vvpp, int attribute, int val1, int val2) {
    if (vvpp != NULL) {
        vvpp->has |= attribute;
        switch(attribute) {
        case VVPP_HAS_RC_INFO:
            vvpp->row    = val1;
            vvpp->column = val2;
            break;
        }
        // Other HAS options of this kind don't requite info storage
    }
}

void add_var_val_pair_plus_text_attribute(var_val_pair_plus *vvpp, int attribute_code, char *attribute, char eow) {
    if ((vvpp != NULL) && (attribute != NULL)) {
        switch(attribute_code) {
        case VVPP_HAS_ROW_ID:
            vvpp->row_identifier = my_strchrdup(attribute, eow);
            if (vvpp->row_identifier != NULL) vvpp->has |= VVPP_HAS_ROW_ID;
            break;
        }
    }
}

void set_var_val_pair_plus_translation_vvpa(var_val_pair_plus *vvpp, var_val_pair_array *translate_vvpa) {
    if (vvpp != NULL) {
        if (vvpp->translate_vvpa != NULL) free_var_val_pair_array(vvpp->translate_vvpa);
        vvpp->translate_vvpa = translate_vvpa;
        vvpp->has |= VVPP_HAS_TRANSLATE;
    }
}

int  first_var_occurence_in_vvpa(var_val_pair_array *vvpa, char *var) {
    int i;

    if (var == NULL)  return VVPA_NOT_FOUND;
    if (vvpa == NULL) return VVPA_NOT_FOUND;
    for (i=0; i<vvpa->num_used; i++) {
        if (vvpa->vvps[i]->var != NULL) {
            if (!strcmp(var, vvpa->vvps[i]->var)) return i;
        }
    }
    return VVPA_NOT_FOUND;
}

bool var_exists_in_vvpa(var_val_pair_array *vvpa, char *var) {
    if (first_var_occurence_in_vvpa(vvpa, var) == VVPA_NOT_FOUND) return false;
    return true;
}

void vvpp_log_to_file(FILE *fp, var_val_pair_plus *vvpp, char *line) {
    var_val_pair *vvp;
    char         *var;
    char         *value;
    char         *null_string = "NULL";
    int           i;
    char buffer[256];
    char num[7];

    if (DEBUG_LOGGING == DEBUG_ON) {
        fprintf(fp, "vvpp_log_to_file - starting up\n");
        fprintf(fp, "vvpp_log_to_file - vvpp: %s\n", (vvpp == NULL ? "NULL" : "non-NULL"));
    }

    if (vvpp == NULL) {
        fprintf(fp, "vvpp_log_to_file: NULL struct sent, nothing doing");
        return;
    }

    sprintf(buffer, "@%s# %s ", vvpp->var, vvpp->value);

    if (DEBUG_LOGGING == DEBUG_ON) fprintf(fp, "vvpp_log_to_file - vars: %s\n", buffer);

    switch(vvpp->type) {
    case VVPP_TYPE_TEXT:
        strcat(buffer, "text");
        break;
    case VVPP_TYPE_OPTS:
        strcat(buffer, "opts");
        break;
    case VVPP_TYPE_OPTION_LIST:
        strcat(buffer, "httpoptionlistfromarray");
        break;
    case VVPP_TYPE_ARRAY_ENTRY:
        strcat(buffer, "array_entry");
        break;
    case VVPP_TYPE_LIST:
        strcat(buffer, "listfromarray");
        break;
    }

    if (vvpp->has & VVPP_HAS_RC_INFO) {
        strcat(buffer, ":#");
        if (vvpp->row == VVPP_ALL_ROWS) strcat(buffer, "ALLR");
        else if (vvpp->row == VVPP_SELECTED_ROW) strcat(buffer, vvpp->row_identifier);
        else {
            sprintf(num, "%d", vvpp->row);
            strcat(buffer, num);
        }
        sprintf(num, ",%d", vvpp->column);
        strcat(buffer, num);
    }
    if (vvpp->has & VVPP_HAS_IP_START) {
        strcat(buffer, ":@ipstart");
    }
    if (vvpp->has & VVPP_HAS_IP_END) {
        strcat(buffer, ":@ipend");
    }
    if (vvpp->has & VVPP_HAS_TRANSLATE) {
        strcat(buffer, ":");
        for (i=0; i<vvpp->translate_vvpa->num_used; i++) {
            if (i != 0) strcat(buffer, ";");
            vvp   = vvpp->translate_vvpa->vvps[i];
            var   = vvp->var;
            value = vvp->value;
            if (var == NULL)   var   = null_string;
            if (value == NULL) value = null_string;
            strcat(buffer, var);
            strcat(buffer, "=");
            strcat(buffer, value);
        }
    }

    fprintf(fp, line, buffer);
}

void vvppa_log_to_file(FILE *fp, var_val_pair_plus_array *vvppa, char *line) {
    int i;

    fprintf(fp, "vvppa_log_to_file - starting up\n");
    for (i=0; i<vvppa->num_used; i++) {
        fprintf(fp, "vvppa_log_to_file - entry %d\n", i);
        vvpp_log_to_file(fp, vvppa->vvpps[i], line);
    }
}

void vvpa_log_to_file(FILE *fp, var_val_pair_array *vvpa, char *line) {
    var_val_pair *vvp;
    char         *var;
    char         *value;
    char         *null_string = "NULL";
    int           i;

    if (vvpa == NULL) {
        fprintf(fp, line, "array sent", "NULL");
        return;
    }

    for (i=0; i<vvpa->num_used; i++) {
        vvp   = vvpa->vvps[i];
        var   = vvp->var;
        value = vvp->value;
        if (var == NULL)   var   = null_string;
        if (value == NULL) value = null_string;
        fprintf(fp, line, var, value);
    }
}

void update_value_in_var_val_pair_array(var_val_pair_array *vvpa, char *var, char *new_value) {
    int index;

    if (vvpa == NULL) return;
    index = find_index_of_var_in_vvpa(vvpa, var);
    if (index == VVPA_NOT_FOUND) return;
    vvp_update_value(vvpa->vvps[index], new_value);
}

var_val_pair_array *addto_var_val_pair_array(var_val_pair_array *vvpa, char *var, char *value) {
    if (vvpa == NULL) vvpa = create_var_val_pair_array();
    if (vvpa->num_alloc == vvpa->num_used) {
        vvpa->num_alloc += 10;
        vvpa->vvps = (var_val_pair **)realloc(vvpa->vvps, vvpa->num_alloc*sizeof(var_val_pair *));
    }
    vvpa->vvps[vvpa->num_used] = create_var_val_pair(var, value);
    vvpa->num_used++;
    return vvpa;
}

var_val_pair_plus *addto_var_val_pair_plus_array(var_val_pair_plus_array *vvppa, char *var, char *value) {
    var_val_pair_plus *new_vvpp;

    if (vvppa == NULL) return NULL;

    new_vvpp = create_var_val_pair_plus(var, value);
    if (new_vvpp == NULL) return NULL;

    if (vvppa->num_alloc == vvppa->num_used) {
        vvppa->num_alloc += 10;
        vvppa->vvpps = (var_val_pair_plus **)realloc(vvppa->vvpps, vvppa->num_alloc*sizeof(var_val_pair_plus *));
    }
    vvppa->vvpps[vvppa->num_used] = new_vvpp;
    vvppa->num_used++;
    return new_vvpp;
}

char *find_value_from_var(var_val_pair_array *vvpa, char *var) {
    int           i;
    char         *ref_var;
    var_val_pair *vvp;

    if ((vvpa == NULL) || (var == NULL)) return NULL;

    for (i=0; i<vvpa->num_used; i++) {
        vvp = vvpa->vvps[i];
        if (vvp != NULL) {
            ref_var = vvp->var;
            if ((ref_var != NULL) && (!strcmp(ref_var, var))) {
                return vvp->value;
            }
        }
    }

    return NULL;
}

int find_index_of_var_in_vvppa(var_val_pair_plus_array *vvppa, char *var) {
    int                i;
    char              *ref_var;
    var_val_pair_plus *vvpp;

    if ((vvppa == NULL) || (var == NULL)) return VVPPA_NOT_FOUND;

    for (i=0; i<vvppa->num_used; i++) {
        vvpp = vvppa->vvpps[i];
        if (vvpp != NULL) {
            ref_var = vvpp->var;
            if ((ref_var != NULL) && (!strcmp(ref_var, var))) return i;
        }
    }

    return VVPPA_NOT_FOUND;
}

int find_index_of_var_in_vvpa(var_val_pair_array *vvpa, char *var) {
    int           i;
    char         *ref_var;
    var_val_pair *vvp;

    if ((vvpa == NULL) || (var == NULL)) return VVPA_NOT_FOUND;

    for (i=0; i<vvpa->num_used; i++) {
        vvp = vvpa->vvps[i];
        if (vvp != NULL) {
            ref_var = vvp->var;
            if ((ref_var != NULL) && (!strcmp(ref_var, var))) return i;
        }
    }

    return VVPA_NOT_FOUND;
}

char *find_var_from_value(var_val_pair_array *vvpa, char *value) {
    int           i;
    char         *ref_value;
    var_val_pair *vvp;

    if ((vvpa != NULL) && (value != NULL)) {
        for (i=0; i<vvpa->num_used; i++) {
            vvp = vvpa->vvps[i];
            if (vvp != NULL) {
                ref_value = vvp->value;
                if (ref_value != NULL) {
                    if ((ref_value[0] == '*') && (ref_value[1] == '\0')) return vvp->var;
                    if (!strcmp(ref_value, value)) return vvp->var;
                    if ((ref_value[0] == '!') && (strchr(value, ref_value[1]) == NULL)) return vvp->var;
                }
            }
        }
    }
    return NULL;
}

void free_env(char **env) {
    int i = 0;
    if (env == NULL) return;
    while (env[i] != NULL) {
        free(env[i]);
        i++;
    }
    free(env);
}

// TODO This should be made to handle an arbitrary number of either envs or vvpas.
// The loop code at the end of this is just awful.
char **vvpas_into_environment_variables(char **env, var_val_pair_array *vvpa1, var_val_pair_array *vvpa2) {
    int    tick;
    int    index;
    int    count;
    int    length;
    int    env_in_size = 0;
    int    env_size = 0;
    char  *empty_string = "";
    char  *var;
    char  *value;
    char  *entry;
    char **result;
    var_val_pair *vvp;
    var_val_pair_array *vvpa;

    if (env != NULL) {
       env_in_size = 0;
       while (env[env_in_size] != NULL) env_in_size++;
    }

    env_size = env_in_size + 1;
    if (vvpa1 != NULL) env_size += vvpa1->num_used;
    if (vvpa2 != NULL) env_size += vvpa2->num_used;

    result = calloc(env_size, sizeof(char *));
    index  = 0;
    if (env != NULL) {
        while (env[index] != NULL) {
            result[index] = strdup(env[index]);
            index++;
        }
    }

    vvpa = vvpa1;
    tick = 2;
    while (tick > 0) {
        if (vvpa != NULL) {
            for (count = 0; count<vvpa->num_used; count++) {
                vvp   = vvpa->vvps[count];
                var   = vvp->var;
                value = vvp->value;
                length = 2; // '=' and '\0' terminator.
                if (var != NULL) length += strlen(var);
                else             var = empty_string;
                if (value != NULL) length += strlen(value);
                else               value = empty_string;
                entry = calloc(length, sizeof(char));
                sprintf(entry, "%s=%s", var, value);
                result[index] = entry;
                index++;
            }
        }
        tick--;
        vvpa = vvpa2;
    }

    result[env_size-1] = NULL;

    return result;
}

var_val_pair *parse_var(char *s) {
    char *vname;
    char *val;
    char *value;
    char *s2;
    int   c;
    int   vlen;
    int   vcount;
    char  buf[3];
    var_val_pair *vvp;

    if (!s) return NULL;

    // create space for the value
    vlen  = strlen(s);
    value = calloc(vlen, sizeof(char));

    // Get the variable name
    vname = s;
    while(*s && (*s != '=')) s++;
    if(!*s) return NULL;
    *s = '\0';

    // Trim spaces at beginning (important for var, not done for value).
    while (isspace(*vname)) vname++;
    if (vname == s) return NULL; // There is no variable name, just space!

    // And end (ditto)
    s2 = s-1;
    while (isspace(*s2)) {
        *s2 = '\0';
        s2--;
    }

    // Create space for the value
    s++;
    vcount = 0;
    for(val=s; *val; val++) {
        // If the char isn't on the discard list, process it
        if (*val != '\r') {
            switch( *val ) {
            case '%':
                buf[0]=*(++val); buf[1]=*(++val);
                buf[2]='\0';
                sscanf(buf,"%2x",&c);
                break;
            case '+':
                c = ' ';
                break;
            default:
                c = *val;
            }

/*
            if ((c == '\\') || (c == '\'') || (c == '\n')) {
                value[vcount] = '\\';
                vcount++;
                if (vcount == vlen) {
                    value = realloc(value, vlen+20);
                    vlen += 20;
                }
            }
*/
            value[vcount] = c;
            vcount++;
            if (vcount == vlen) {
                value = realloc(value, vlen+20);
                vlen += 20;
            }
        }
    }
    value[vcount] = 0;
    vvp           = create_var_val_pair(vname, value);
    free(value);
    return vvp;
}

var_val_pair_array *parse_var_equals_val_into_vvpa(char *s, var_val_pair_array *vvpa) {
    var_val_pair *vvp = parse_var(s);
    if (vvp != NULL) {
        vvpa = addto_var_val_pair_array(vvpa, vvp->var, vvp->value);
        free_var_val_pair(vvp);
    }
    return vvpa;
}

var_val_pair_array *parse_argv_type_data_into_vvpa(char **argv, var_val_pair_array *vvpa) {
    int   i;
    char *phrase;
    char *phrase_copy;

    if (argv != NULL) {
        i=0;
        while (argv[i] != NULL) {
            phrase = argv[i];
            if (phrase != NULL) {
                phrase_copy = strdup(phrase);
                vvpa = parse_var_equals_val_into_vvpa(phrase_copy, vvpa);
                free(phrase_copy);
            }
            i++;
        }
    }
    return vvpa;
}

var_val_pair_array *parse_post_get_type_data_into_vvpa(char *data, var_val_pair_array *vvpa, char *split_char) {
    char *phrase;
    char *data_copy;

    if (data != NULL) {
        data_copy = strdup(data);
        if (data_copy != NULL) {
            phrase = strtok(data_copy, split_char);
            while (phrase != NULL) {
                vvpa = parse_var_equals_val_into_vvpa(phrase, vvpa);
                phrase = strtok((char *)0, split_char);
            }
            free(data_copy);
        }
    }
    return vvpa;
}

