include ../../../Rules.mak

CINCFLAGS = -I$(NETGEAR_BASE_DIR)/Source/apps/nvram
LIBSNEEDED = -lscnvram
LDFLAGS = -L$(NETGEAR_BASE_DIR)/Source/apps/nvram

TARGET=page-server.cgi
OBJS=nvram_cache.o var_val_pair.o page-server.o

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
