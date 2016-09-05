/* This is a simple webserver, which always returns the same file, no matter what you ask for.
 * Based on a webserver created November 1999 by J. David Blackstone.
 * Brutalised to this by Neil Townsend
 */
#include <stdio.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <ctype.h>
#include <strings.h>
#include <string.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <stdlib.h>

#define ADBLOCK_PORT 8105
#define PATH_TO_ONLY_FILE "/www.adblock/index.html"
#define LOG_FILE "/var/log/adblockhttpd.log"

#define ISspace(x) isspace((int)(x))

#define SERVER_STRING "Server: ab_httpd/0.0.1\r\n"

FILE *fp_log = NULL;

void accept_request(int);
void bad_request(int);
void cat(int, FILE *);
void cannot_execute(int);
void error_die(const char *);
void execute_cgi(int, const char *, const char *, const char *);
void headers(int, const char *);
void serve_file(int, const char *);
int startup(u_short *);


void mylog(const char *msg1, const char *msg2) {
 fprintf(fp_log, "%s: %s\n", msg1, msg2);
 fflush(fp_log);
}

/**********************************************************************/
/* A request has caused a call to accept() on the server port to
 * return.  Process the request appropriately.
 * Parameters: the socket connected to the client */
/**********************************************************************/
void accept_request(int client)
{
  char  buf[32];
  int   numchars;

  /* Make sure that they are sending us a request */
  numchars = recv(client, buf, sizeof(buf), 0);
  while (numchars > 0) {
   numchars = recv(client, buf, sizeof(buf), MSG_DONTWAIT);
  }

  /* Send our (rather predicatable) response */
  serve_file(client, PATH_TO_ONLY_FILE);

  /* Read and ignore everything else the client is sending us */
  usleep(10);
  do {
   numchars = recv(client, buf, sizeof(buf), MSG_DONTWAIT);
  } while (numchars > 0);

  close(client);
}

/**********************************************************************/
/* Put the entire contents of a file out on a socket.  This function
 * is named after the UNIX "cat" command, because it might have been
 * easier just to do something like pipe, fork, and exec("cat").
 * Parameters: the client socket descriptor
 *             FILE pointer for the file to cat */
/**********************************************************************/
void cat(int client, FILE *resource)
{
 char buf[1024];

 fgets(buf, sizeof(buf), resource);
 while (!feof(resource))
 {
  send(client, buf, strlen(buf), 0);
  fgets(buf, sizeof(buf), resource);
 }
}

/**********************************************************************/
/* Print out an error message with perror() (for system errors; based
 * on value of errno, which indicates system call errors) and exit the
 * program indicating an error. */
/**********************************************************************/
void error_die(const char *sc)
{
 mylog("DIE", sc);
 perror(sc);
 exit(EXIT_FAILURE);
}

/**********************************************************************/
/* Return the informational HTTP headers about a file. */
/* Parameters: the socket to print the headers on
 *             the name of the file */
/**********************************************************************/
void headers(int client, const char *filename)
{
 char buf[1024];
 (void)filename;  /* could use filename to determine file type */

 strcpy(buf, "HTTP/1.0 200 OK\r\n");
 send(client, buf, strlen(buf), 0);
 strcpy(buf, SERVER_STRING);
 send(client, buf, strlen(buf), 0);
 sprintf(buf, "Content-Type: text/html\r\n");
 send(client, buf, strlen(buf), 0);
 strcpy(buf, "\r\n");
 send(client, buf, strlen(buf), 0);
}

/**********************************************************************/
/* Send a regular file to the client.  Use headers, and report
 * errors to client if they occur.
 * Parameters: a pointer to a file structure produced from the socket
 *              file descriptor
 *             the name of the file to serve */
/**********************************************************************/
void serve_file(int client, const char *filename)
{
 FILE *resource = NULL;

 resource = fopen(PATH_TO_ONLY_FILE, "r");
 if (resource != NULL)
 {
  headers(client, filename);
  cat(client, resource);
 }

 fclose(resource);
}

/**********************************************************************/
/* This function starts the process of listening for web connections
 * on a specified port.  If the port is 0, then dynamically allocate a
 * port and modify the original port variable to reflect the actual
 * port.
 * Parameters: pointer to variable containing the port to connect on
 * Returns: the socket */
/**********************************************************************/
int startup(u_short *port)
{
 int httpd = 0;
 struct sockaddr_in name;

 httpd = socket(PF_INET, SOCK_STREAM, 0);
 if (httpd == -1)
  error_die("socket");
 memset(&name, 0, sizeof(name));
 name.sin_family = AF_INET;
 name.sin_port = htons(*port);
 name.sin_addr.s_addr = htonl(INADDR_ANY);
 if (bind(httpd, (struct sockaddr *)&name, sizeof(name)) < 0)
  error_die("bind");
 if (*port == 0)  /* if dynamically allocating a port */
 {
  socklen_t namelen = sizeof(name);
  if (getsockname(httpd, (struct sockaddr *)&name, &namelen) == -1)
   error_die("getsockname");
  *port = ntohs(name.sin_port);
 }
 if (listen(httpd, 5) < 0)
  error_die("listen");
 return(httpd);
}

/**********************************************************************/

int main(void)
{
 int                server_sock = -1;
 u_short            port = ADBLOCK_PORT;
 int                client_sock = -1;
 struct sockaddr_in client_name;
 socklen_t          client_name_len = sizeof(client_name);

 fp_log = fopen(LOG_FILE, "a");
 if (fp_log == NULL) {
  fp_log = stderr;
  mylog("adblockhttpd startup", "Couldn't open log file");
 }

 server_sock = startup(&port);
 mylog("adblockhttpd startup", "httpd running");

 while (1)
 {
  client_sock = accept(server_sock,
                       (struct sockaddr *)&client_name,
                       &client_name_len);
  if (client_sock == -1)
   error_die("accept");

  accept_request(client_sock);
 }

 close(server_sock);

 return(0);
}
