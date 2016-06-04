#
# see README
# 
#

include Rules.mak

.PHONY: root rootweb packages extrabin

all:
	@echo 'make <kernel/root/rootweb/extrabin/source>';

root: extrabin packages rootweb

rootweb:
	make -C rootweb TARGET=target.tar.bz2
	cp rootweb/target.tar.bz2 $(NETGEAR_BASE_DIR)/Source

extrabin:
	make -C extra_binaries
	
packages:
	make -C packages

kernel:
	make -C $(NETGEAR_BASE_DIR) kernel SHELL=/bin/bash

source:
	sed -i '/SUB_VER=/c\SUB_VER=$(CUSTOM_VERSION)' $(NETGEAR_BASE_DIR)/Source/Builds/$(PROJECT).mak
	$(foreach package, $(netgear_packages_not_needed), sed -i '/$(package)/c\# CUSTOM MOD: $(package) not needed for custom build' $(NETGEAR_BASE_DIR)/Source/apps/Makefile; )
	make -C $(NETGEAR_BASE_DIR) source SHELL=/bin/bash

source_clean:
	make -C $(NETGEAR_BASE_DIR) source_clean

kernel_clean:
	make -C $(NETGEAR_BASE_DIR) kernel_clean

all_clean: kernel_clean source_clean
