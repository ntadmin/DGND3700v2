#ifndef VAR_VAL_PAIR_H
#define VAR_VAL_PAIR_H

#define VVPA_NOT_FOUND  -1
#define VVPPA_NOT_FOUND -1

typedef struct var_val_pair {
    char *var;
    char *value;
} var_val_pair;

typedef struct var_val_pair_array {
    int            num_alloc;
    int            num_used;
    var_val_pair **vvps;
} var_val_pair_array;

typedef struct var_val_pair_plus {
    char *var;
    char *value;
    int   type;
    int   has;
    int   row;
    int   column;
    char *row_identifier;
    var_val_pair_array *translate_vvpa;
} var_val_pair_plus;

typedef struct var_val_pair_plus_array {
    int                  num_alloc;
    int                  num_used;
    var_val_pair_plus  **vvpps;
} var_val_pair_plus_array;

#define VVPP_HAS_NO_EXTRAS 0
#define VVPP_HAS_RC_INFO   1
#define VVPP_HAS_IP_START  2
#define VVPP_HAS_IP_END    4
#define VVPP_HAS_TRANSLATE 8
#define VVPP_HAS_ROW_ID    16
#define VVPP_HAS_IP_NUM    32
#define VVPP_HAS_IP_PORT   64

#define VVPP_HAS_IP_RANGE    (VVPP_HAS_IP_START | VVPP_HAS_IP_END)
#define VVPP_HAS_IP_NUM_PORT (VVPP_HAS_IP_NUM | VVPP_HAS_IP_PORT)

#define VVPP_ALL_ROWS     -1
#define VVPP_SELECTED_ROW -2

#define VVPP_TYPE_TEXT         0
#define VVPP_TYPE_OPTS         1
#define VVPP_TYPE_OPTION_LIST  2
#define VVPP_TYPE_ARRAY_ENTRY  3
#define VVPP_TYPE_LIST         4

var_val_pair            *create_var_val_pair(char * /*var*/, char * /*value*/);
var_val_pair_array      *create_var_val_pair_array();
var_val_pair_plus_array *create_var_val_pair_plus_array();

void free_var_val_pair(var_val_pair *);
void free_var_val_pair_array(var_val_pair_array *);
void free_var_val_pair_plus_array(var_val_pair_plus_array *);

void          vvpa_log_to_file(FILE *, var_val_pair_array *, char * /*line to output with two %s*/);
void          vvp_update_value(var_val_pair *, char *);
int           first_var_occurence_in_vvpa(var_val_pair_array *, char * /*var to find*/);
bool          var_exists_in_vvpa(var_val_pair_array *, char * /*var to see if present */);

var_val_pair_array *addto_var_val_pair_array(var_val_pair_array *, char * /*var*/, char * /*value*/);
var_val_pair_array *parse_var_equals_val_into_vvpa(char *, var_val_pair_array *);
var_val_pair_array *parse_post_get_type_data_into_vvpa(char */*data*/, var_val_pair_array *, char */*split_char*/);
var_val_pair_array *parse_argv_type_data_into_vvpa(char ** /*argv*/, var_val_pair_array *);
char               *find_value_from_var(var_val_pair_array *, char * /*var*/);
char               *find_var_from_value(var_val_pair_array *, char * /*value*/);
int                 find_index_of_var_in_vvpa(var_val_pair_array *, char * /*var*/);
void                update_value_in_var_val_pair_array(var_val_pair_array *, char * /* var */, char * /* new_value */);

var_val_pair_plus *addto_var_val_pair_plus_array(var_val_pair_plus_array *, char * /*var*/, char * /*value*/);
int                find_index_of_var_in_vvppa(var_val_pair_plus_array *, char * /*var*/);
void               vvppa_log_to_file(FILE *, var_val_pair_plus_array *, char */* line inv one %s for the info */);

void   set_var_val_pair_plus_type(var_val_pair_plus *, int /* type */);
void   set_var_val_pair_plus_translation_vvpa(var_val_pair_plus *, var_val_pair_array * /* translation_vvpa */);
void   add_var_val_pair_plus_attribute(var_val_pair_plus *, int /* HAS attribute */, int /* attribute value 1 */, int /* attribute value 2 */);
void   add_var_val_pair_plus_text_attribute(var_val_pair_plus *, int /* HAS attribute */, char * /* attribute */, char /* End of attribute char (normally '\0' */);

void   free_env(char **);
char **vvpas_into_environment_variables(char ** /* incoming env */, var_val_pair_array * /*to be added to env */, var_val_pair_array * /*to be added to env */);


#endif /* VAR_VAL_PAIR_H */
