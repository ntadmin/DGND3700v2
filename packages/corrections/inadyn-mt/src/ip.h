/*
Copyright (C) 2003-2004 Narcis Ilisei

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
*/
/*
	History:

	Dec. 2010
		added pointer to addrinfo structure to IP_SOCKET
		changed IP_SOCKET SOCKET field to pointer to SOCKET
		added IPv6 function headers
		bhoover@wecs.com
*/

/* interface for tcp functions */

#ifndef _IP_H_INCLUDED
#define _IP_H_INCLUDED

#include "os.h"
#include "errorcode.h"

#ifndef EXCLUDE_CONFIG_H

#include "config.h"

#endif

/* SOME DEFAULT CONFIGURATIONS */
#define IP_DEFAULT_TIMEOUT		20000 /*ms*/
#define IP_SOCKET_MAX_PORT		65535
#define IP_DEFAULT_READ_CHUNK_SIZE	100

/*socket shutdown types*/
#define SD_RECEIVE      0x00
#define SD_SEND         0x01
#define SD_BOTH         0x02

/*snag from linux/in6.h because of namespace conflicts otherwise - not yet impemented here for Windows
  I don't know whether win32 defines these so they should really just be renamed here to avoid re-
  introducing the same problem I'm avoiding in linux.  No problem compiling on Windows 2000 though.
*/
/* RFC5014: Source address selection */
#define IPV6_ADDR_PREFERENCES   72

#define IPV6_PREFER_SRC_TMP             0x0001
#define IPV6_PREFER_SRC_PUBLIC          0x0002
#define IPV6_PREFER_SRC_PUBTMP_DEFAULT  0x0100
#define IPV6_PREFER_SRC_COA             0x0004
#define IPV6_PREFER_SRC_HOME            0x0400
#define IPV6_PREFER_SRC_CGA             0x0008
#define IPV6_PREFER_SRC_NONCGA          0x0800

/* typedefs */

#ifndef _WIN32

#if defined(HAVE_IFADDRS_H) && !(defined(__sun) && defined(__SVR4))
#include <sys/types.h>
#include <ifaddrs.h>
#endif

typedef struct linger LINGER;

#else

#include <winsock2.h>
#include <windows.h>
#include <ws2tcpip.h>
#include <iphlpapi.h>
#endif

typedef enum
{
    TYPE_TCP,
    TYPE_UDP
} IP_TYPES;

/*Wrap getifaddrs for Windows, earlier Solaris.
*/

#if !(defined(__sun) && defined(__SVR4)) && defined(HAVE_IFADDRS_H)

#define ifaddrs_w ifaddrs

#else

#if ( defined(_WIN32) || !defined(HAVE_IFADDR_H) )

/*Wrap ifaddrs, getifaddrs for Windows, earlier Solaris.
*/
struct ifaddrs_w
{
	struct ifaddrs_w	*ifa_next;
	char			*ifa_name;
	unsigned int		ifa_flags;
	struct sockaddr		*ifa_addr;
	struct sockaddr		*ifa_netmask; /* Netmask of interface */
	union {
		/* Broadcast address of interface */
		struct sockaddr *ifu_broadaddr;
		/* Point-to-point destination address */
		struct sockaddr *ifu_dstaddr;
	} ifa_ifu;
	#define	ifa_broadaddr	ifa_ifu.ifu_broadaddr
	#define ifa_dstaddr	ifa_ifu.ifu_dstaddr
	void			*ifa_data;    /* Address-specific data */

}ifaddrs_w;

#endif
#endif

typedef struct IPV6_PRIV_EXT
{
        char            addr_pref[26];  /*ipv6 address preference - pub, policy - possibly future others*/
        unsigned        flags;
} IPV6_PRIV_EXT;

typedef struct
{
	BOOL				initialized;
	BOOL				is_constructed;
	BOOL				is_ipv4;
	int				type;
	SOCKET				*socket;
	int				sock_index;
	struct sockaddr_in		remote_addr;
	const char			*p_remote_host_name;

	unsigned short			port;
	int				timeout;

	char				*if_name;
	IPV6_PRIV_EXT			addr_pref;

	/*source address*/
	char				**s_src_addr;
	struct sockaddr_storage		**p_net_addr;

	/*IPv6 trans*/
	struct				addrinfo *addr;
	struct				addrinfo **addr_ar;
	int				server_socket_count;
} IP_SOCKET;

typedef enum
{
	/*begin parse*/

	NEW_LINE_IP,
	NUMERIC,
	NEWLINE_COLON,

	/*"." after i'th digit group*/

	DOT_1,
	DOT_2,
	DOT_3,

	/*digit group number/state*/

	IPV4_NUMERIC_2,
	IPV4_NUMERIC_3,
	IPV4_NUMERIC_4,

	/*check for double (consecutive) colon
	  and trans to DBL state if so (non dbl
	  state if not)*/

	COLON_DETECT_1,
	COLON_DETECT_2,
	COLON_DETECT_3,
	COLON_DETECT_4,
	COLON_DETECT_5,
	COLON_DETECT_6,
	COLON_DETECT_7,

	/*digit group number/state*/

	IPV6_NUMERIC_2,
	IPV6_NUMERIC_3,
	IPV6_NUMERIC_4,
	IPV6_NUMERIC_5,
	IPV6_NUMERIC_6,
	IPV6_NUMERIC_7,
	IPV6_NUMERIC_8,
	IPV6_FINAL,

	/*have had a double colon*/

	DBL_COLON_A,
	DBL_COLON_B,

	/*detect double colon as already in
	  DBL state -- it's an error*/

	DBL_COLON_DETECT_A,
	DBL_COLON_DETECT_B

} IP_PARSER_STATE;

typedef struct
{
	FILE		*p_file;
	IP_PARSER_STATE	state;
} IP_FILE_PARSER;

/*public functions*/

/*
	 basic resource allocations for the  object
*/
RC_TYPE ip_construct(IP_SOCKET *p_self);

/*
	CAUTION:  only the pre-init stuff is copy (see the function) in present implementation.
*/
RC_TYPE ip_clone(IP_SOCKET *p_self_dest,IP_SOCKET *p_self_src);

/*
	Resource free .
*/
RC_TYPE ip_destruct(IP_SOCKET *p_self);

/*
	Sets up the object.

	- ...
*/
RC_TYPE ip_initialize(IP_SOCKET *p_self);

/*
	Disconnect and some other clean up.
*/
RC_TYPE ip_shutdown(IP_SOCKET *p_self);

/* send data*/
RC_TYPE ip_send(IP_SOCKET *p_self, const char *p_buf, int len);

/* receive data*/
RC_TYPE ip_recv(IP_SOCKET *p_self, char *p_buf, int max_recv_len, int *p_recv_len);


/*Accessors */
RC_TYPE ip_set_port(IP_SOCKET *p_self, int p);
RC_TYPE ip_set_remote_name(IP_SOCKET *p_self, const char* p);
RC_TYPE ip_set_remote_timeout(IP_SOCKET *p_self, int t);
RC_TYPE ip_set_is_ipv4(IP_SOCKET *p_self, BOOL is_ipv4);

RC_TYPE ip_get_port(IP_SOCKET *p_self, int *p_port);
RC_TYPE ip_get_remote_name(IP_SOCKET *p_self, const char* *p);
RC_TYPE ip_get_remote_timeout(IP_SOCKET *p_self, int *p);
RC_TYPE ip_get_is_ipv4(IP_SOCKET *p_self, BOOL *is_ipv4);

RC_TYPE ip_set_priv_ext(IP_SOCKET *p_self,IPV6_PRIV_EXT addr_pref);
IPV6_PRIV_EXT* ip_get_priv_ext(IP_SOCKET *p_self,IPV6_PRIV_EXT *addr_pref);
RC_TYPE ip_set_if_name(IP_SOCKET *p_self,char *if_name);
char* ip_get_if_name(IP_SOCKET *p_self,char **if_name);

/*extract string representation ipv4 or ipv6 ip from string*/
RC_TYPE parse_ip_address(char **str_ip,char *in_str);

const char* addr_family_get_name(int in_val);
RC_TYPE do_ip_set_addr_pref(SOCKET socket,char *if_name,IPV6_PRIV_EXT addr_pref);
RC_TYPE ip_set_addr_pref(IP_SOCKET *p_self);
struct sockaddr_storage* if_address(char *if_name,int addr_family,struct IPV6_PRIV_EXT *addr_pref);
RC_TYPE if_bind(IP_SOCKET *p_self,int sock_index);
RC_TYPE if_addr_pref_bind(SOCKET socket,char *if_name,IPV6_PRIV_EXT addr_pref);
int getifaddrs_w(struct ifaddrs_w** in_ifaddrs);
int freeifaddrs_w(struct ifaddrs_w* in_ifaddrs);
#ifdef _WIN32
int get_adapters_info(PIP_ADAPTER_INFO *adapterInfo);
int get_adapters_addresses(PIP_ADAPTER_ADDRESSES *adapterAddresses);
#endif
int inet_pton_w(int family, const char * strptr, void* addrptr);
const char* inet_ntop_w(int addr_family,const void *net_addr_in,char *s_out_addr,int buff_len);
RC_TYPE ip_parser_init(IP_FILE_PARSER *p_cfg, FILE *p_file);
RC_TYPE ip_parser_read(IP_FILE_PARSER *p_cfg,char *p_buffer,int maxlen,char *ch,int *count,int *parse_end);

#endif /*_IP_H_INCLUDED*/
