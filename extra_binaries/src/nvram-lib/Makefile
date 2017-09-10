include ../../../Rules.mak


BINS = libscnvram.so 

all: $(BINS)

libscnvram.so : nvram.o nvram_lock.o
	$(CC) $(CFLAGS) -Os -s -shared -Wl,-soname,libscnvram.so -o libscnvram.so $^ 

nvram.o : nvram.c
	$(CC) $(CFLAGS) -Os -s -Wall -Werror -fPIC -g -c $^ -o $@

nvram_lock.o: nvram_lock.c
	$(CC) $(CFLAGS) -Os -s -g -Wall -fPIC -c $^ -o $@

install :
	cp -f libscnvram.so $(DESTLIB)

clean:
	rm -rf *~ *.o *.so nvram $(BINS)
	-rm -rf $(DESTLIB)/libscnvram.so



