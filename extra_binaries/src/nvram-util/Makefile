include ../../../Rules.mak

CINCFLAGS = -I../nvram-lib
LIBSNEEDED = -lscnvram
LDFLAGS = -L../nvram-lib

TARGET=nvram-util
OBJS=nvram-util.o

all : $(TARGET)
	
install :
	$(CP) $(TARGET) $(DESTBIN)

$(TARGET) : $(OBJS)
	$(CC) -o $@ $^ $(LDFLAGS) $(LIBSNEEDED)

%.o : %.c
	$(CC) -o $@ -c $< $(CFLAGS) $(CINCFLAGS)

clean :
	$(RM) $(TARGET) $(OBJS)

.PHONY: all install
