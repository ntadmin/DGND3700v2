include ../../../Rules.mak


TARGET=netgear_sendarp
OBJS=sendarp.o

all : $(TARGET)
	
install :
	@echo This sendarp only needed if busybox is upgraded, so currently not installing
#	$(CP) $(TARGET) $(DESTBIN)

$(TARGET) : $(OBJS)
	$(CC) -o $@ $^ $(LDFLAGS) $(LIBSNEEDED)

%.o : %.c
	$(CC) -o $@ -c $< $(CFLAGS) $(CINCFLAGS)

clean :
	$(RM) $(TARGET) $(OBJS)

.PHONY: all install
