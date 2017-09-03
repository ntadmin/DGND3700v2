#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>

#include <nvram.h>

#include "nvram_cache.h"

void mylog(char *, char *);
#define DEBUG_CORE    0
#define DEBUG_ACQUIRE 0
#define DEBUG_SYNC    0
#define DEBUG_GET     0
#define DEBUG_SET     0

// Remove this #define to make this code do everything except alter the nvram contents.
#define REALLY_WRITE_TO_NVRAM

#define ARRAY_ROW_END_CHAR   1
#define ARRAY_CELL_END_CHAR  2

// The actual like, cache
nvram_cache *nc;

void create_nvram_cache() {
    if (DEBUG_CORE) mylog("create_nvram_cache", "Creating");
    if (nc != NULL) return;

    nc = calloc(1, sizeof(nvram_cache));
    nc->num_used  = 0;
    nc->num_avail = 0;
    nc->cache = NULL;
    if (DEBUG_CORE) mylog("create_nvram_cache", "Created");
}

void free_nvram_entry(nvram_entry *ne) {
    int i, j;

    if (ne != NULL) {
        if (DEBUG_CORE) mylog("free_nvram_entry - freeing", ne->name);
        if (ne->name != NULL) free(ne->name);
        if (ne->value != NULL) free(ne->value);
        if (ne->data != NULL) {
            for (i=0; i<ne->rows_avail; i++) {
                if (ne->data[i] != NULL) {
                    for (j=0; j<ne->columns; j++) {
                        if (ne->data[i][j] != NULL) free(ne->data[i][j]);
                    }
                    free(ne->data[i]);
                }
            }
            free(ne->data);
        }
    }
}

void free_nvram_cache() {
    int i;

    if (nc != NULL) {
        if (nc->cache != NULL) {
            if (DEBUG_CORE) mylog("free_nvram_cache", "freeing");
            for (i=0; i<nc->num_used; i++) {
                free_nvram_entry(nc->cache[i]);
            }
            free(nc->cache);
        }
        nc = NULL;
    }
}

char *my_strchrnul(char *cp, int c) {
    while (*cp != 0) {
        if (*cp == c) return cp;
        cp++;
    }
    return cp;
}

char *my_strndup(char *src, size_t num) {
    if (src == NULL) return NULL;
    char *res = malloc((num+1)*sizeof(char));
    if (res == NULL) return NULL;
    memcpy(res, src, num);
    *(res+num)=0;
    return res;
}

char *my_strdup(char *src) {
    if (src == NULL) return NULL;
    return strdup(src);
}

nvram_entry *nvram_cache_create_entry(char *name, char *value) {
    nvram_entry *entry;

    entry = calloc(1, sizeof(nvram_entry));
    if (entry == NULL) return NULL;

    entry->type    = NVRAM_ENTRY_TYPE_UNKNOWN;
    entry->value   = my_strdup(value);
    entry->name    = my_strdup(name);
    entry->changed = false;
    entry->rows_used  = 0;
    entry->rows_avail = 0;
    entry->columns    = 0;

    return entry;
}

nvram_entry *nvram_cache_want_variable(char *name) {
    int          i, j;
    int          rcount;
    int          ccount;
    int          cmax;
    char        *cp;
    char        *value;
    char        *cp_row_end;
    char        *cp_col_end;
    nvram_entry *entry;

    if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable", name);

    if (name == NULL) return NULL;
    if (strlen(name) == 0) return NULL;
    if (nc == NULL) create_nvram_cache();
    if (nc == NULL) return NULL;

    if (DEBUG_CORE) mylog("nvram_cache_want_variable", "got cache");

    // Do we have it already? If so, return it.
    for (i=0; i<nc->num_used; i++) {
        if (nc->cache[i] != NULL) {
            entry = nc->cache[i];
            if (entry->name != NULL) {
                if (!strcmp(name, entry->name)) {
                    if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable", "already had it");
                    return entry;
                }
            }
        }
    }

    // Nope, so get the value and it it in
    if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable", "didn't have it, using nvram_get");
    value = nvram_get(name);
    if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable: value got", value);

    if (nc->num_avail == nc->num_used) {
        nc->num_avail += 10;
        nc->cache = realloc(nc->cache, nc->num_avail * sizeof(nvram_entry *));
    }

    entry = nvram_cache_create_entry(name, value);
    nc->cache[nc->num_used] = entry;
    nc->num_used++;

    // This may be adding in a variable which has a null value, or
    // which doesn't exist yet. If so, stop here.
    if (value == NULL) {
        if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable", "value is NULL so no value acquired");
        return entry;
    }

    if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable", "got from nvram");
    cp = value;
    ccount = 1;
    rcount = 1;
    cmax   = 1;
    while (*cp != '\0') {
        if      (*cp == ARRAY_CELL_END_CHAR) ccount++;
        else if (*cp == ARRAY_ROW_END_CHAR) {
            rcount++;
            if (ccount > cmax) cmax = ccount;
            ccount = 1;
        }
        cp++;
    }
    if (ccount > cmax) cmax = ccount;

    if (strlen(value) < 1) {
        if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable - it's zero length, so unknown type", value);
        entry->type = NVRAM_ENTRY_TYPE_UNKNOWN;
    }
    else if ((rcount == 1) && (cmax == 1)) {
        if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable - it's a TEXT", value);
        entry->type = NVRAM_ENTRY_TYPE_TEXT;
    }
    else {
        if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable - it's an ARRAY", value);
        entry->rows_used  = rcount;
        entry->rows_avail = rcount;
        entry->columns    = cmax;
        entry->type = NVRAM_ENTRY_TYPE_ARRAY;
        entry->data = calloc(entry->rows_avail, sizeof(char **));
        cp          = value;
        for (i=0; i<rcount; i++) {
            if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable - row start", "***");
            entry->data[i] = calloc(entry->columns, sizeof(char *));
            cp_row_end = my_strchrnul(cp, ARRAY_ROW_END_CHAR);
            for (j=0; j<entry->columns; j++) {
                cp_col_end = my_strchrnul(cp, ARRAY_CELL_END_CHAR);
                if (cp_col_end > cp_row_end) cp_col_end = cp_row_end;
                entry->data[i][j] = my_strndup(cp, (size_t)(cp_col_end-cp));
                if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable - next cell", entry->data[i][j]);
                cp = cp_col_end;
                if (*cp != '\0') cp++;
            }
        }
    }

    if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable", "Got it");
    return entry;
}

bool require_variable_in_nvram_cache(char *name, int type) {
    nvram_entry *entry;
    entry = nvram_cache_want_variable(name);

    if (entry == NULL) {
        if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable - fail", "No entry found or created");
        return false;
    }

    if (entry->type != type) {
        // OK, it didn't match, but there are a couple of exceptions to cater for ...
        switch (entry->type) {
        // If it is of unknown type, we can make it the type we want.
        case NVRAM_ENTRY_TYPE_UNKNOWN:
            entry->type = type;
            break;
        case NVRAM_ENTRY_TYPE_TEXT:
            // An array with 1 row and 1 column looks like a text, so it will have been misclassified up to this point.
            if (type == NVRAM_ENTRY_TYPE_ARRAY) {
                entry->type = NVRAM_ENTRY_TYPE_ARRAY;
                set_array_value_in_nvram_entry(entry, 0, 0, entry->value);
            }
        }

        // If it still doesn't match ...
        if (entry->type != type) {
            if (DEBUG_ACQUIRE) mylog("nvram_cache_want_variable - fail", "type wanted and nv type clash");
            return false;
        }
    }
    return true;
}

void nvram_entry_sync_value_to_data(nvram_entry *entry) {
    int   i, j;
    char *new_value;
    int   count;
    char *cp;

    if (entry == NULL) return;
    if (entry->type != NVRAM_ENTRY_TYPE_ARRAY) return;

    if (DEBUG_SYNC) mylog("nvram_entry_sync_value_to_data - aiming to sync array", entry->name);

    count = 0;
    for (i=0; i<entry->rows_used; i++) {
        for (j=0; j<entry->columns; j++) {
            if (entry->data[i][j] != NULL) count += strlen(entry->data[i][j]);
            count++;
        }
    }

    new_value = calloc(count + 11 /* for nul terminator and luck */, sizeof(char));
    cp = new_value;
    for (i=0; i<entry->rows_used; i++) {
        if (i != 0) {
            *cp = ARRAY_ROW_END_CHAR;
            cp++;
        }
        for (j=0; j<entry->columns; j++) {
            if (j != 0) {
                *cp = ARRAY_CELL_END_CHAR;
                cp++;
            }
            if (entry->data[i][j] != NULL) {
                strcpy(cp, entry->data[i][j]);
                if (DEBUG_SYNC) mylog("nvram_entry_sync_value_to_data - added to new_value", cp);
                cp += strlen(entry->data[i][j]);
            }
        }
    }
    *cp = 0;

    if (DEBUG_SYNC) mylog("nvram_entry_sync_value_to_data - new_value", new_value);

    if (entry->value != NULL) free(entry->value);
    entry->value = new_value;
}

int get_array_num_rows_from_nvram_cache(char *name) {
    nvram_entry *entry;

    if (nc == NULL) create_nvram_cache();
    if (nc == NULL) return NVRAM_POS_QUERY_FAILED;

    entry = nvram_cache_want_variable(name);
    if (entry == NULL) return NVRAM_POS_QUERY_FAILED;
    if (entry->type != NVRAM_ENTRY_TYPE_ARRAY) return NVRAM_POS_QUERY_FAILED;
    return entry->rows_used;
}

char *get_array_value_from_nvram_cache(char *name, int row, int column) {
    nvram_entry *entry;

    if (DEBUG_GET) {
        char log_space[50];
        sprintf(log_space, "%s(R%d,C%d)", name, row, column);
        mylog("get_array_value_from_nvram_cache - request for", log_space);
    }

    if (nc == NULL) create_nvram_cache();
    if (nc == NULL) {
        if (DEBUG_GET) mylog("get_array_value_from_nvram_cache - FAIL", "No cache");
        return NULL;
    }

    entry = nvram_cache_want_variable(name);
    if (entry == NULL) {
        if (DEBUG_GET) mylog("get_array_value_from_nvram_cache - FAIL", "No entry");
        return NULL;
    }
    if (entry->type != NVRAM_ENTRY_TYPE_ARRAY) {
        if (DEBUG_GET) mylog("get_array_value_from_nvram_cache - FAIL", "Not array");
        return NULL;
    }
    if ((row < 0) || (column < 0)) {
        if (DEBUG_GET) mylog("get_array_value_from_nvram_cache - FAIL", "row or column sub zero");
        return NULL;
    }
    if (row >= entry->rows_used) {
        if (DEBUG_GET) mylog("get_array_value_from_nvram_cache - FAIL", "row too high");
        return NULL;
    }
    if (column >= entry->columns) {
        if (DEBUG_GET) mylog("get_array_value_from_nvram_cache - FAIL", "column too high");
        return NULL;
    }
    if (entry->data == NULL) {
        if (DEBUG_GET) mylog("get_array_value_from_nvram_cache - FAIL", "no data");
        return NULL;
    }
    if (entry->data[row] == NULL) {
        if (DEBUG_GET) mylog("get_array_value_from_nvram_cache - FAIL", "no row in data");
        return NULL;
    }

    if (DEBUG_GET) mylog("get_array_value_from_nvram_cahce - SUCCESS", entry->data[row][column]);

    return entry->data[row][column];
}

char *get_value_from_nvram_cache(char *name) {
    nvram_entry *entry;

    if (nc == NULL) create_nvram_cache();
    if (nc == NULL) return NULL;

    entry = nvram_cache_want_variable(name);
    if (entry == NULL) return NULL;
    if (entry->type != NVRAM_ENTRY_TYPE_TEXT) return NULL;

    return entry->value;
}

void set_value_in_nvram_cache(char *name, char *value) {
    nvram_entry *entry;

    if (nc == NULL) create_nvram_cache();
    if (nc == NULL) return;

    entry = nvram_cache_want_variable(name);
    if (entry == NULL) return;
    if (entry->type != NVRAM_ENTRY_TYPE_TEXT) return;

    if (DEBUG_SYNC) mylog("set_value_in_nvram_cache - setting", name);
    if (DEBUG_SYNC) mylog("set_value_in_nvram_cache -      to", value);

    if (entry->value != NULL) free(entry->value);
    entry->value   = strdup(value);
    entry->changed = true;
}

void remove_row_from_array_in_nvram_cache(char *name, int row) {
    int           i;
    char        **row_to_go;
    nvram_entry  *entry;

    if (nc == NULL) create_nvram_cache();
    if (nc == NULL) return;

    entry = nvram_cache_want_variable(name);
    if (entry == NULL) return;
    if (entry->type != NVRAM_ENTRY_TYPE_ARRAY) return;
    if (row < 0) return;
    if (row >= entry->rows_used) return;

    row_to_go = entry->data[row];
    if (row_to_go != NULL) {
        for (i=0; i<entry->columns; i++) {
             if (row_to_go[i] != NULL) free(row_to_go[i]);
        }
        free(row_to_go);
    }

    entry->rows_used--;
    for (i=row; i<entry->rows_used; i++) {
        entry->data[i] = entry->data[i+1];
    }
    entry->data[i] = calloc(entry->columns, sizeof(char *));
    entry->changed = true;
}

void clear_array_rows_this_and_above_in_nvram_cache(char *name, int row) {
    nvram_entry *entry;

    if (nc == NULL) return;

    entry = nvram_cache_want_variable(name);
    if (entry == NULL) return;
    if (entry->type != NVRAM_ENTRY_TYPE_ARRAY) return;
    if (row < 0) return;
    if (row >= entry->rows_used) return;

    entry->rows_used = row;
}

void set_array_value_in_nvram_entry(nvram_entry *entry, int row, int column, char *value) {
    int i, j;
    int cmax, rmax;

    if (entry == NULL) return;
    if (entry->type == NVRAM_ENTRY_TYPE_UNKNOWN) {
        if (DEBUG_SET) mylog("set_array_value_in_nvram_entry", "Entry unknown type so setting to ARRAY with no data");
        entry->type = NVRAM_ENTRY_TYPE_ARRAY;
        entry->rows_avail = entry->rows_used = entry->columns = 0;
    }

    if (entry->type != NVRAM_ENTRY_TYPE_ARRAY) {
        if (DEBUG_SET) mylog("set_array_value_in_nvram_entry FAILED", "Not of type array");
        return;
    }
    if ((row < 0) || (column < 0)) {
        if (DEBUG_SET) mylog("set_array_value_in_nvram_entry FAILED", "row or column invalid");
        return;
    }

    // Determine the required max size for this entry before then reallocating rows and columns ...
    if (row >= entry->rows_avail) rmax = row + 5;
    else                          rmax = entry->rows_avail;
    if (column >= entry->columns) cmax = column + 1;
    else                          cmax = entry->columns;

    if (rmax != entry->rows_avail) {
        if (DEBUG_SET) mylog("set_array_value_in_nvram_entry", "Need more rows - adding them");
        entry->data = realloc(entry->data, rmax*sizeof(char **));
        for (i=entry->rows_avail; i<rmax; i++) {
            entry->data[i] = calloc(entry->columns, sizeof(char *));
        }
        // We don't update entry->rows_avail here because we want to know the old value in case we have to add columns as well
    }

    if (cmax != entry->columns) {
        if (DEBUG_SET) mylog("set_array_value_in_nvram_entry", "Need more columns - adding them");
        for (i=0; i<entry->rows_avail; i++) {
            entry->data[i] = realloc(entry->data[i], cmax*sizeof(char *));
            for (j=entry->columns; j<cmax; j++) {
                entry->data[i][j] = NULL;
            }
        }
        entry->columns = cmax;
    }

    // Now columns filled out if needed, admit to the updated (if) max rows avail
    entry->rows_avail = rmax;

    if (DEBUG_SET) {
        char log_space[50];
        sprintf(log_space, "%s(R%d,C%d)", entry->name, row, column);
        mylog("set_array_value_in_nvram_entry - setting", log_space);
        mylog("set_array_value_in_nvram_entry -    from", entry->data[row][column]);
        mylog("set_array_value_in_nvram_entry - to (in)", value);
    }

    if (value == NULL) {
        if (entry->data[row][column] != NULL) {
            free(entry->data[row][column]);
            entry->data[row][column] = NULL;
            entry->changed = true;
        }
    }
    else if (entry->data[row][column] == NULL) {
        entry->data[row][column] = strdup(value);
        entry->changed = true;
    }
    else if (strcmp(value, entry->data[row][column]) != 0) {
        free(entry->data[row][column]);
        entry->data[row][column] = strdup(value);
        entry->changed = true;
    }

    if (row >= entry->rows_used) entry->rows_used = row + 1;

    if (DEBUG_SYNC) mylog("set_array_value_in_nvram_entry -  stored", entry->data[row][column]);
}

void set_array_value_in_nvram_cache(char *name, int row, int column, char *value) {
    nvram_entry *entry;

    if (nc == NULL) {
        if (DEBUG_SET) mylog("set_array_value_in_nvram_cache FAILED", "Cache not initialised");
        return;
        }
    entry = nvram_cache_want_variable(name);
    set_array_value_in_nvram_entry(entry, row, column, value);
}

void sync_nvram_cache_back_to_nvram() {
    int i;
    nvram_entry *entry;

    if (nc == NULL) return;

    for (i=0; i<nc->num_used; i++) {
        entry = nc->cache[i];
        if (entry != NULL) {
            if (entry->changed) {
                if (entry->type == NVRAM_ENTRY_TYPE_ARRAY) {
                    nvram_entry_sync_value_to_data(entry);
                }
                if (DEBUG_SYNC) mylog("sync_nvram_cache_back_to_nvram - setting", entry->name);
                if (DEBUG_SYNC) mylog("sync_nvram_cache_back_to_nvram - to     ", entry->value);
#ifdef REALLY_WRITE_TO_NVRAM
                nvram_set(entry->name, entry->value);
#endif
                entry->changed = false;
            }
        }
    }

#ifdef REALLY_WRITE_TO_NVRAM
    nvram_commit();
#endif
}

