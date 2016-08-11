include ../Rules.mak

DIRECTORIES_TO_MAKE = $(wildcard src/*/)

DESTBASE=$(CUSTOM_BASE_DIR)/extra_binaries/target
DESTBIN=$(DESTBASE)/usr/sbin
DESTLIB=$(DESTBASE)/lib

.PHONY: target

all: target
	$(foreach dir, $(DIRECTORIES_TO_MAKE), make -C $(dir);)
	$(foreach dir, $(DIRECTORIES_TO_MAKE), make -C $(dir) install DESTBIN=$(DESTBIN) DESTLIB=$(DESTLIB);)
	@rm $(DESTBIN)/../bin/flash_eraseall
	@mv $(DESTBIN)/../../bin/busybox $(DESTBIN)/flash_eraseall
	@rmdir  $(DESTBIN)/../bin/
	@rmdir  $(DESTBIN)/../../bin/

target:
	@rm -rf $(DESTBASE);
	@mkdir $(DESTBASE)
	@mkdir $(DESTBASE)/usr
	@mkdir $(DESTBIN)
	@mkdir $(DESTLIB)

clean:
	$(foreach dir, $(DIRECTORIES_TO_MAKE), make -C $(dir) clean;)


