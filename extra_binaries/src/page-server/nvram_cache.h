#define NVRAM_ENTRY_TYPE_UNKNOWN -1
#define NVRAM_ENTRY_TYPE_TEXT     0
#define NVRAM_ENTRY_TYPE_ARRAY    1

#define NVRAM_POS_QUERY_FAILED -1

typedef struct nvram_entry {
    char *name;
    char *value;
    char ***data;
    int   type;
    int   rows_used;
    int   rows_avail;
    int   columns;
    bool  changed;
    } nvram_entry;

typedef struct nvram_cache {
    int    num_avail;
    int    num_used;
    nvram_entry **cache;
} nvram_cache;


void free_nvram_cache();

bool require_variable_in_nvram_cache(char * /* name */, int type);

char *get_array_value_from_nvram_cache(char * /* name */, int /* row */, int /* column */);
int   get_array_num_rows_from_nvram_cache(char * /* name */);
char *get_value_from_nvram_cache(char * /* name */);

void set_value_in_nvram_cache(char * /* name */, char * /* value */);
void set_array_value_in_nvram_cache(char * /* name */, int /* row */, int /* column */, char * /* value */);
void set_array_value_in_nvram_entry(nvram_entry *, int /* row */, int /* column */, char * /* value */);
void clear_array_rows_this_and_above_in_nvram_cache(char * /* name */, int /* row */);
void remove_row_from_array_in_nvram_cache(char * /* name */, int /* row */);
void sync_nvram_cache_back_to_nvram();
