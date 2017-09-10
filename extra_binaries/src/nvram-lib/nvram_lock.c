
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <linux/limits.h>

int nvram_lock(const char *path)
{
	char lock_path[PATH_MAX];
	char *p;
	int fd;

	sprintf(lock_path, "/var/lock/%s.lock", path);
	p = lock_path + sizeof("/var/lock/");
	while (*p) {
		if (*p == '/') *p = '_';
		p++;
	}

	fd = open(lock_path, O_CREAT|O_WRONLY|O_TRUNC,S_IRUSR|S_IWUSR);
	if (fd < 0)
		return -1;
	if (lockf(fd,F_LOCK,0) < 0) {
		close(fd);
		return -1;
	}
	return fd;
}

void nvram_unlock(int fd)
{
	if (fd >= 0) {
		lockf(fd,F_ULOCK,0);
		close(fd);
	}
}
