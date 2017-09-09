#include <stdio.h>
#include <stdlib.h>
#include "nvram.h"

#define ARRAY_ROW_END_CHAR   1
#define ARRAY_CELL_END_CHAR  2

void dump_details(FILE* fp, char *string) {
    int i;
    int length;
    int c;

    length = strlen(string);

    for (i=0; i<length; i++) {
        c = string[i];
        fprintf(fp, "[%3d] '%c' %03d\n", i, (((c<32) || (c>=128)) ? '@' : c), c);
    }
}

void make_array_readable(char *array, char comma, char endline) {
    char *cp = array;
    while (*cp != '\0') {
        if      (*cp == ARRAY_CELL_END_CHAR) *cp = comma;
        else if (*cp == ARRAY_ROW_END_CHAR)  *cp = endline;
        cp++;
    }
}

void exit_insufficient_args() {
    fprintf(stderr, "Insufficient arguments.\n");
    exit(0);
}

int main(int argc, const char *argv[]) {
    char *pre_result = NULL;
    char *result  = NULL;
    char *cp_found;
    int   i;
    int   offset;
    int   length;

    if (argc < 3) exit_insufficient_args();

    if (!strcmp(argv[1], "get")) {
        result = nvram_get(argv[2]);
        fprintf(stdout, "%s\n", result);
    }
    else if (!strcmp(argv[1], "set")) {
        nvram_set(argv[2], argv[3]);
        nvram_commit();
    }
    else if (!strcmp(argv[1], "examine")) {
        result = nvram_get(argv[2]);
        if (result == NULL) fprintf(stdout, "(null)\n");
        else                dump_details(stdout, result);
    }
    else if (!strcmp(argv[1], "getarray")) {
        if (argc < 4) exit_insufficient_args();
        pre_result = nvram_get(argv[2]);
        if (pre_result != NULL) {
            result = strdup(pre_result);
            if (result != NULL) {
                make_array_readable(result, *argv[3], '\n');
                fprintf(stdout, "%s\n", result);
                free(result);
            }
        }
    }
    else if (!strcmp(argv[1], "setarray")) {
        if (argc < 6) exit_insufficient_args();
        length = strlen(argv[5]);
        result = strdup(argv[5]);
        for (i=0; i<length; i++) {
            if      (result[i] == argv[3][0]) result[i] = ARRAY_CELL_END_CHAR;
            else if (result[i] == argv[4][0]) result[i] = ARRAY_ROW_END_CHAR;
        }
        nvram_set(argv[2], result);
        nvram_commit();
        free(result);
    }
    else if (!strcmp(argv[1], "getarray-grep-row")) {
        if (argc < 5) exit_insufficient_args();
        pre_result = nvram_get(argv[2]);
        if (pre_result != NULL) {
            cp_found = strstr(pre_result, argv[3]);
            if (cp_found != NULL) {
                result = strdup(pre_result);
                if (result != NULL) {
                    make_array_readable(result, *argv[4], '\n');
                    offset = cp_found - pre_result;
                    cp_found = result + offset;
                    while ((*cp_found != '\0') && (*cp_found != '\n')) cp_found++;
                    *cp_found = '\0';
                    cp_found = result + offset;
                    while ((cp_found != result) && (*cp_found != '\n')) cp_found--;
                    if (*cp_found == '\n') cp_found++;
                    fprintf(stdout, "%s\n", cp_found);
                    free(result);
                }
            }
        }
    }

return 1;
}
