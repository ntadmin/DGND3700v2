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
#include <errno.h>
#include <stdbool.h>

#define ADBLOCK_PORT         8105
#define LOG_FILE             "/var/log/adblockhttpd.log"
#define HTTP_HEADER          "HTTP/1.0 200 OK\r\nServer: ab_httpd/0.0.1\r\nContent-Type: text/html\r\n\r\n"
#define HTTP_ADBLOCK_MESSAGE "<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/html4/strict.dtd'><html lang='en'><head><meta http-equiv='content-type' content='text/html; charset=utf-8'><title>Ad blocked</title></head><body>Ad blocked :-)</body></html>"

#define HEADER_TIMEOUT  0.2

#define ISspace(x) isspace((int)(x))

#define SERVER_STRING "Server: ab_httpd/0.0.1\r\n"

FILE *fp_log = NULL;

void accept_request(int);
void bad_request(int);
void cat(int, FILE *);
void cannot_execute(int);
void error_die(const char *);
void execute_cgi(int, const char *, const char *, const char *);
void serve_file(int);
int  startup(u_short *);

int  server_sock = -1;

void mylog(const char *msg1, const char *msg2) {
 fprintf(fp_log, "%s: %s\n", msg1, msg2);
 fflush(fp_log);
}

void mylogerr(const char *msg) {
 char num[10];
 sprintf(num, "%d", errno);
 mylog(msg, num);
}

void mylogchar(char c) {
 fprintf(fp_log, "%c", c);
 fflush(fp_log);
}

/**********************************************************************/
/* A request has caused a call to accept() on the server port to
 * return.  Process the request appropriately.
 * Parameters: the socket connected to the client */
/**********************************************************************/
void accept_request(int client)
{
  char  buf[80];
  int   max_recv = sizeof(buf) - 1;
  int   numchars;
  bool  last_was_r = false;
  bool  last_was_rn = false;
  bool  loop_done = false;
  time_t start_time;
  time_t now_time;

  sprintf(buf, "%d", client);
  mylog("handling request on client socket", buf);

  /* Make sure that they are sending us a request */
  last_was_r  = false;
  last_was_rn = false;
  loop_done   = false;
  time(&start_time);
  do {
    numchars = recv(client, buf, 1, MSG_DONTWAIT);
    if ((numchars < 0) && (errno != EAGAIN)) { // Better not fail on "Try Again!"
     mylogerr("recv FAIL closing connection, errno");
     close(client);
     return;
    }
    else if (numchars == 1) {
//     mylogchar(buf[0]);
     if (last_was_r && (buf[0] == '\n')) {
      if (last_was_rn) loop_done   = true;
      else             last_was_rn = true;
     }
     else if (buf[0] == '\r') last_was_r = true;
     else {
      last_was_r  = false;
      last_was_rn = false;
     }
    }
    time(&now_time);
    if (difftime(now_time, start_time) > HEADER_TIMEOUT) {
     mylog("Header Timeout", "(probably HTTPS)");
     loop_done = true;
    }
   } while (!loop_done);

  /* Send our (rather predicatable) response */
  mylog("Got (or not) header", "sending response");
  serve_file(client);

  /* Read and ignore everything else the client is sending us */
  usleep(10);
  do {
   buf[0] = '\0';
   numchars = recv(client, buf, max_recv, MSG_DONTWAIT);
   if (numchars > 0) buf[numchars]='\0';
//   mylog("incomingf", buf);
  } while (numchars > 0);

  mylog("All done", "closing client");
  close(client);
  mylog("Client closed", "back to waiting");
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
 char errnostr[128];
 sprintf(errnostr, "%s (errno %d)", sc, errno);
 mylog("DIE", errnostr);
 perror(sc);
 if (server_sock != -1) close(server_sock);
 exit(EXIT_FAILURE);
}

/**********************************************************************/
/* Send a regular file to the client.  Use headers, and report
 * errors to client if they occur.
 * Parameters: a pointer to a file structure produced from the socket
 *              file descriptor
 *             the name of the file to serve */
/**********************************************************************/
void serve_file(int client)
{
 mylogchar('H');
 send(client, HTTP_HEADER, strlen(HTTP_HEADER), 0);
 mylogchar('P');
 send(client, HTTP_ADBLOCK_MESSAGE, strlen(HTTP_ADBLOCK_MESSAGE), 0);
 mylogchar('X');
 mylogchar('\n');
}

/**********************************************************************
 * This function catches kill signals and closes the socket down
 * nicely
 **********************************************************************/
void handle_kill(int sig) {
 if (server_sock != -1) close(server_sock);
 mylogerr("killed by external signal");
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
 int value = 1;
 struct sockaddr_in name;

 httpd = socket(PF_INET, SOCK_STREAM, 0);

 if (httpd == -1) error_die("socket");

 setsockopt(httpd, SOL_SOCKET, SO_REUSEADDR, &value, sizeof(int));

 memset(&name, 0, sizeof(name));
 name.sin_family = AF_INET;
 name.sin_port = htons(*port);
 name.sin_addr.s_addr = htonl(INADDR_ANY);
 if (bind(httpd, (struct sockaddr *)&name, sizeof(name)) < 0)
  error_die("bind");

 if (*port == 0) { /* if dynamically allocating a port */
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
 u_short            port = ADBLOCK_PORT;
 int                client_sock = -1;

 signal(SIGTERM, handle_kill);
 signal(SIGKILL, handle_kill);
 signal(SIGBUS, handle_kill);
 signal(SIGFPE, handle_kill);
 signal(SIGSEGV, handle_kill);

 fp_log = fopen(LOG_FILE, "a");
 if (fp_log == NULL) {
  fp_log = stderr;
  mylog("adblockhttpd startup", "Couldn't open log file");
 }

 if (daemon(1, 0) != 0) {
  error_die("daemonise failed");
 }

 server_sock = startup(&port);
 mylog("adblockhttpd startup", "httpd running");

 while (1)
 {
  mylog("main loop", "waiting");
  client_sock = accept(server_sock, NULL, NULL);
  if (client_sock == -1)
   error_die("accept");

  accept_request(client_sock);
 }

 close(server_sock);

 return(0);
}
