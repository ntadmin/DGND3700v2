include ../Rules.mak

DIRECTORIES_TO_MAKE = $(wildcard src/*/)

DESTBIN=$(CUSTOM_BASE_DIR)/extra_binaries/target/usr/sbin
DESTLIB=$(CUSTOM_BASE_DIR)/extra_binaries/target/lib

all:
	$(foreach dir, $(DIRECTORIES_TO_MAKE), make -C $(dir);)
	$(foreach dir, $(DIRECTORIES_TO_MAKE), make -C $(dir) install DESTBIN=$(DESTBIN) DESTLIB=$(DESTLIB);)

clean:
	$(foreach dir, $(DIRECTORIES_TO_MAKE), make -C $(dir) clean;)


