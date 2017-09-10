#ifndef _NVRAM_
#define _NVRAM_

#include <string.h>

/*
 * 2003/02/27  		             			    
 * 		       				released by Ron     
 */

/* line terminator by 0x00 
 * data terminator by two 0x00
 * value separaed by 0x01
 */	

/* nvram path */
#ifndef BOOT_NAND_FLASH
//#define NVRAM_PATH     "/dev/mtdblock/3"          /* ex:  /dev/mtd/nvram */
#define NVRAM_PATH     "/dev/mtdblock14"          /* ex:  /dev/mtd/nvram */
#else
#define NVRAM_PATH   "/config/nvram/nvram"            /* ex:  /dev/mtd/nvram */
#endif

#define NVRAM_TMP_PATH "/tmp/nvram"		  /* ex:  /tmp/nvram     */
#define NVRAM_BCM_PATH "/tmp/nvram.bcm"		  /* ex:  /tmp/nvram     */
#define NVRAM_DEFAULT  "/etc/default"             /* ex:  /etc/default   */


#define END_SYMBOL	    0x00		  	
#define DIVISION_SYMBOL	    0x01		  

/* NVRAM_HEADER MAGIC*/ 
#define NVRAM_MAGIC 		    0x004E4F52		 /* RON */

/* used 12bytes, 28bytes reserved */
#define NVRAM_HEADER_SIZE   40       		 
/* max size in flash*/
#define NVRAM_SIZE          65535		  /* nvram size 64k bytes*/

/* each line max size*/
#define NVRAM_BUFF_SIZE           4096		 

/* errorno */
#define NVRAM_SUCCESS       	    0
#define NVRAM_FLASH_ERR           1 
#define NVRAM_MAGIC_ERR	    2
#define NVRAM_LEN_ERR	    3
#define NVRAM_CRC_ERR	    4
#define NVRAM_SHADOW_ERR	    5

/*
 * nvram header struct 		            
 * magic    = 0x004E4F52 (RON)             
 * len      = 0~65495                      
 * crc      = use crc-32                    
 * reserved = reserved 	                    
 */
 
typedef struct nvram_header_s{
	unsigned long magic;
	unsigned long len;
	unsigned long crc;
	unsigned long reserved;
	
}nvram_header_t;


/* Copy data from flash to NVRAM_TMP_PATH
 * @return	0 on success and errorno on failure     
 */
int nvram_load(void);


/*
 * Write data from NVRAM_TMP_PATH to flash   
 * @return	0 on success and errorno on failure     
 */
int nvram_commit(void);

/*
 * Get the value of an NVRAM variable
 * @param	name	name of variable to get
 * @return	value of variable or NULL if undefined
 */
char* nvram_get_func(const char *name,char *path);
#define nvram_get_def(name) nvram_get_func(name,NVRAM_DEFAULT)
#define nvram_bcm_get(name) nvram_get_func(name,NVRAM_BCM_PATH)
#define nvram_safe_get(msg) (nvram_get(msg)?:"")
#define nvram_bcm_safe_get(msg) (nvram_bcm_get(msg)?:"")
char* nvram_get(const char *name);

/*
 * Match an NVRAM variable
 * @param	name	name of variable to match
 * @param	match	value to compare against value of variable
 * @return	TRUE if variable is defined and its value is string equal to match or FALSE otherwise
 */
static inline int nvram_match(char *name, char *match) {
	const char *value = nvram_get(name);
	return (value && !strcmp(value, match));
}

/*
 * IN_Match an NVRAM variable
 * @param	name	name of variable to match
 * @param	match	value to compare against value of variable
 * @return	TRUE if variable is defined and its value is not string equal to invmatch or FALSE otherwise
 */
static inline int nvram_invmatch(char *name, char *invmatch) {
	const char *value = nvram_get(name);
	return (value && strcmp(value, invmatch));
}

/*
 * Set the value of an NVRAM variable
 * @param	name	name of variable to set
 * @param	value	value of variable
 * @return	0 on success and errorno on failure
 * NOTE: use nvram_commit to commit this change to flash.
 */
int nvram_set(const char* name,const char* value);

int nvram_bcm_set(const char* name,const char* value);
int nvram_bcm_unset(const char* name);

/*
	get or set the value of a key
*/
int nv_set(const char* category, const char* key, int key_idx, const char* value);
int nv_setFX(const char* category, const char* key, int key_idx, const char *value_format, ...);

char* nv_get(const char* category, const char* key, int key_idx);
/*
	get or set the value of a key as an integer
*/
int nv_set_int(const char* category, const char* key, int key_idx, int value);
int nv_get_int(const char* category, const char* key, int key_idx);

#endif
