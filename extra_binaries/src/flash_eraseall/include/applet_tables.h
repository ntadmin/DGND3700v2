/* This is a generated file, don't edit */

#define NUM_APPLETS 1
#define SINGLE_APPLET_STR "flash_eraseall"
#define SINGLE_APPLET_MAIN flash_eraseall_main

const char applet_names[] ALIGN1 = ""
"flash_eraseall" "\0"
;

int (*const applet_main[])(int argc, char **argv) = {
flash_eraseall_main,
};
const uint16_t applet_nameofs[] ALIGN2 = {
0x8000,
};
#define MAX_APPLET_NAME_LEN 14
