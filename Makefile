#
# see README
# 
#

include Rules.mak

.PHONY: root rootweb packages extrabin image

all:
	@echo 'make <kernel/root/rootweb/extrabin/source/image>';

image: kernel root source
	@cp $(NETGEAR_BASE_DIR)/Source/image/$(PROJECT).img .

root: extrabin packages rootweb

rootweb: rootweb/target-orig.tar.bz2
	make -C rootweb TARGET=target.tar.bz2
	@cp rootweb/target.tar.bz2 $(NETGEAR_BASE_DIR)/Source

extrabin:
	make -C extra_binaries
	
packages:
	make -C packages

kernel: $(NETGEAR_BASE_DIR)/Makefile
	make -C $(NETGEAR_BASE_DIR) kernel SHELL=/bin/bash

source: $(NETGEAR_BASE_DIR)/Makefile
	@sed -i '/SUB_VER=/c\SUB_VER=$(CUSTOM_VERSION)' $(NETGEAR_BASE_DIR)/Source/Builds/$(PROJECT).mak
	@$(foreach package, $(netgear_packages_not_needed), sed -i '/$(package)/c\# CUSTOM MOD: $(package) not needed for custom build' $(NETGEAR_BASE_DIR)/Source/apps/Makefile; )
	make -C $(NETGEAR_BASE_DIR) source SHELL=/bin/bash

source_clean:
	make -C $(NETGEAR_BASE_DIR) source_clean

kernel_clean:
	make -C $(NETGEAR_BASE_DIR) kernel_clean

all_clean: kernel_clean source_clean


#
# Autmaticing various pre-build processes
#
NETGEAR_DL_DIR=netgear-dl
NETGEAR_FW_OUR_NAME=netgear-fw.zip

#
# Hopefully this lot won't change, but Netgear don't
# seem to be consistent about this naming ...
#
NETGEAR_FW_ZIPFILE=$(PROJECT)_V$(NETGEAR_VERSION)_$(NETGEAR_REGION)_$(NETGEAR_FW_DATE).zip
NETGEAR_EXTRACT_DIR=$(PROJECT)_V$(NETGEAR_VERSION)_$(NETGEAR_REGION)_src_bak
NETGEAR_SOURCE_FILE_IN_ZIP=$(PROJECT)_V$(NETGEAR_VERSION)_$(NETGEAR_REGION)_src.tar.bz2
NETGEAR_TOOLCHAIN_FILE_IN_ZIP=uclibc-crosstools-gcc-4.4.2-1-with-ftw.tar.bz2


.flags/deps_installed:
	sudo aptitude install unzip bison flex build-essential libncurses5-dev gettext zlib1g-dev zip
	touch $@

$(NETGEAR_DL_DIR)/$(NETGEAR_FW_OUR_NAME): .flags/deps_installed
	@test -e $(NETGEAR_DL_DIR) || { mkdir $(NETGEAR_DL_DIR); }
	wget $(NETGEAR_DL_BASE)/$(NETGEAR_FW_ZIPFILE) -O $@
	touch $@

$(NETGEAR_DL_DIR)/$(NETGEAR_SOURCE_FILE_IN_ZIP): $(NETGEAR_DL_DIR)/$(NETGEAR_FW_OUR_NAME)
	@cd $(NETGEAR_DL_DIR); unzip $(NETGEAR_FW_OUR_NAME)
	touch $(NETGEAR_DL_DIR)/$(NETGEAR_SOURCE_FILE_IN_ZIP)
	touch $(NETGEAR_DL_DIR)/$(NETGEAR_TOOLCHAIN_FILE_IN_ZIP)

$(NETGEAR_DL_DIR)/$(NETGEAR_TOOLCHAIN_FILE_IN_ZIP): $(NETGEAR_DL_DIR)/$(NETGEAR_FW_OUR_NAME)
	@cd $(NETGEAR_DL_DIR); unzip $(NETGEAR_FW_OUR_NAME)
	touch $(NETGEAR_DL_DIR)/$(NETGEAR_SOURCE_FILE_IN_ZIP)
	touch $(NETGEAR_DL_DIR)/$(NETGEAR_TOOLCHAIN_FILE_IN_ZIP)

rootweb/target-orig.tar.bz2: $(NETGEAR_BASE_DIR)/Makefile
	@cp $(NETGEAR_EXTRACT_DIR)/Source/target.tar.bz2 $@

$(NETGEAR_BASE_DIR)/Makefile: $(NETGEAR_DL_DIR)/$(NETGEAR_SOURCE_FILE_IN_ZIP)
	tar xvfj  $(NETGEAR_DL_DIR)/$(NETGEAR_SOURCE_FILE_IN_ZIP)
	-include $(ROOT)/Builds/$(PROJECT).mak
	-include $(ROOT)/env.mak
	sed -i 's/.\/\$$(FLEX)/flex/' $(NETGEAR_EXTRACT_DIR)/Source/apps/flex-2.5.4/Makefile
	sed -i '215s/$$/)/' $(NETGEAR_EXTRACT_DIR)/Source/apps/flex-2.5.4/Makefile
	sed -i 's/\/usr\/lib/..\/..\/..\/target\/lib/' $(NETGEAR_EXTRACT_DIR)/Source/apps/ppp-2.4.1.pppoe4.orig/pppd/Makefile.linux
	touch $@
	





