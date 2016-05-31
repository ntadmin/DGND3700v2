#include <stdio.h>
#include "nvram.h"

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

int main(int argc, const char *argv[]) {
    char *result  = NULL;

    if (argc < 3) {
        fprintf(stderr, "Insufficient arguments.\n");
        return(0);
    }

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

return 1;
}
