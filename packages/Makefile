#
# In theory, everything in terms of overall information is set by
# this include. If you ned to change something, perhaps there
# is a better place.
#
include ../Rules.mak

#
# Set the following headline information
#
packages=inadyn-mt dnsmasq miniupnpc dropbear

all: real-all

#
# Set this list to include all possible target directories 
# Must start with a slash as this is for a root FS ...
#
target_dirs=/usr/sbin /lib

#
# For each package, set the following information up
# Only set .configure-options if there is a configure to execute in the package
#
inadyn-mt.url=http://sourceforge.net/projects/inadyn-mt/files/latest/download
inadyn-mt.pkg-dl-name=inadyn-mt-latest.tar.gz
inadyn-mt.tar-args=xvf
inadyn-mt.configure-options=--host=mips-linux CC=/opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/mips-linux-gcc --disable-sound ac_cv_func_malloc_0_nonnull=yes ac_cv_func_realloc_0_nonnull=yes --bindir=$(PKG_TARGET_DIR)/usr/sbin --libdir=$(PKG_TARGET_DIR)/usr/lib
inadyn-mt.make-command=make
inadyn-mt.test-compiled-file=src/inadyn-mt

dnsmasq.url=http://www.thekelleys.org.uk/dnsmasq/dnsmasq-2.76.tar.xz
dnsmasq.pkg-dl-name=dnsmasq-latest.tar.xz
dnsmasq.tar-args=Jxf
dnsmasq.make-command=make CC="/opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/mips-linux-gcc" CFLAGS="-O3 -W -Wall -march=mips32 -D_LARGEFILE64_SOURCE -D_FILE_OFFSET_BITS=64 -fomit-frame-pointer -fno-strict-aliasing -mabi=32 -G 0 -msoft-float -pipe -Wa,-mips32" COPTS="-DNO_INOTIFY -DNO_IPSET -DNO_IPV6 -DNO_DHCP6 -DNO_AUTH"
dnsmasq.test-compiled-file=src/dnsmasq

miniupnpc.url=http://miniupnp.free.fr/files/download.php?file=miniupnpc-2.0.tar.gz
miniupnpc.pkg-dl-name=miniupnpc-latest.tar.gz
miniupnpc.tar-args=xvf
miniupnpc.make-command=INSTALLPREFIX=$(PKG_SRC_DIR)/miniupnpc/_install make install LIBDIR="/lib" CC="/opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/mips-linux-gcc"
miniupnpc.test-compiled-file=_install/bin/upnpc

dropbear.url=http://matt.ucc.asn.au/dropbear/releases/dropbear-2016.73.tar.bz2
dropbear.pkg-dl-name=dropbear-latest.tar.bz2
dropbear.tar-args=jxf
dropbear.configure-options=--host=mips-linux --disable-zlib CC=/opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/mips-linux-gcc ac_cv_func_malloc_0_nonnull=yes ac_cv_func_realloc_0_nonnull=yes --bindir=$(PKG_TARGET_DIR)/usr/sbin --libdir=$(PKG_TARGET_DIR)/usr/lib
dropbear.make-command=make PROGRAMS="dropbear dropbearkey dbclient scp" MULTI=1
dropbear.test-compiled=dropbearmulti


#
# As yet have been unable to find a recent version that compiles, so this here awaiting inspiration
#
miniupnpd.url=http://miniupnp.free.fr/files/download.php?file=miniupnpd-1.6.20120509.tar.gz
miniupnpd.pkg-dl-name=miniupnpd-latest.tar.gz
miniupnpd.tar-args=xvf
miniupnpd.make-command=INSTALLPREFIX=$(PKG_SRC_DIR)/miniupnpc/_install make -f Makefile.linux install LIBDIR="/lib" CC="/opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/mips-linux-gcc"
miniupnpd.test-compiled-file=_install/bin/miniupnpd



#
# For each package, create a place rule which does all the necessary
# commands after the package has been made. Typically putting the
# executables and libraries in place.
#

dnsmasq.place:
	@cp $(PKG_SRC_DIR)/$(@:%.place=%)/src/dnsmasq $(PKG_TARGET_DIR)/usr/sbin
	@cp $(PKG_SRC_DIR)/$(@:%.place=%)/contrib/wrt/lease_update.sh $(PKG_TARGET_DIR)/usr/sbin/dhcp_lease_update.sh


inadyn-mt.place:
	@cp $(PKG_SRC_DIR)/$(@:%.place=%)/src/inadyn-mt $(PKG_TARGET_DIR)/usr/sbin


miniupnpc.place:
	@cp $(PKG_SRC_DIR)/$(@:%.place=%)/_install/bin/* $(PKG_TARGET_DIR)/usr/sbin
	@cp $(PKG_SRC_DIR)/$(@:%.place=%)/_install/lib/*.so* $(PKG_TARGET_DIR)/lib

miniupnpd.place:
	@cp $(PKG_SRC_DIR)/$(@:%.place=%)/_install/bin/* $(PKG_TARGET_DIR)/usr/sbin
	@cp $(PKG_SRC_DIR)/$(@:%.place=%)/_install/lib/*.so* $(PKG_TARGET_DIR)/lib

dropbear.place:
	@cp $(PKG_SRC_DIR)/$(@:%.place=%)/dropbearmulti $(PKG_TARGET_DIR)/usr/sbin
	@ln -sf dropbearmulti $(PKG_TARGET_DIR)/usr/sbin/dropbear
	@ln -sf dropbearmulti $(PKG_TARGET_DIR)/usr/sbin/dbclient
	@ln -sf dropbearmulti $(PKG_TARGET_DIR)/usr/sbin/dropbearconvert
	@ln -sf dropbearmulti $(PKG_TARGET_DIR)/usr/sbin/dropbearkey
	@ln -sf dropbearmulti $(PKG_TARGET_DIR)/usr/sbin/scp


#
# Below here should not need changing
# First, some variables
#
THIS_DIR=$(CUSTOM_BASE_DIR)/packages

PKG_CORRECTION_DIR=$(THIS_DIR)/corrections
PKG_SRC_DIR=$(THIS_DIR)/src
PKG_TARGET_DIR=$(THIS_DIR)/target
PKG_DOWNLOAD_DIR=$(THIS_DIR)/dl

WGET_EXTRA_ARGS=--no-check-certificate

CONFIG_DONE_MARKER=.dgnd.config.done

packages-get=$(packages:%=%.get)
packages-all=$(packages:%=%.all)
packages-configure=$(packages:%=%.configure)
packages-make=$(packages:%=%.make)
packages-place-wrap=$(packages:%=%.place-wrap)

full_path_target_dirs=$(target_dirs:%=$(PKG_TARGET_DIR)%)

#
# The rules
#
.PHONY: all real-all $(packages) $(packages-get) $(packages-all)

real-all: target_directories $(packages-all) $(packages-place-wrap)

$(packages-all):
	@echo "--"
	@echo "Getting $(@:%.all=%) ready for target"
	@test -e $(PKG_DOWNLOAD_DIR)/$($(@:%.all=%.pkg-dl-name)) || { make $(@:%.all=%.get); }
	@test -e $(PKG_SRC_DIR)/$(@:%.all=%)/$(CONFIG_DONE_MARKER) || { make $(@:%.all=%.configure); }
	@test $(PKG_SRC_DIR)/$(@:%.all=%)/$($(@:%.all=%.test-compiled-file)) -nt $(PKG_SRC_DIR)/$(@:%.all=%)/$(CONFIG_DONE_MARKER)  || { make $(@:%.all=%).make; }
	@echo "$(@:%.all=%) Ready"
	@echo ""

$(packages-get):
	wget $($(@:%.get=%.url)) -O $(PKG_DOWNLOAD_DIR)/$($(@:%.get=%.pkg-dl-name)) $(WGET_EXTRA_ARGS)
	rm -rf $(PKG_SRC_DIR)/$(@:%.get=%)
	tar $($(@:%.get=%.tar-args)) $(PKG_DOWNLOAD_DIR)/$($(@:%.get=%.pkg-dl-name)) -C $(PKG_SRC_DIR)
	test -e $(PKG_SRC_DIR)/$(@:%.get=%) || { mv $(PKG_SRC_DIR)/$(@:%.get=%)* $(PKG_SRC_DIR)/$(@:%.get=%); }

$(packages-configure):
	test -z $($(@:%.configure=%.configure-options)) || { cd $(PKG_SRC_DIR)/$(@:%.configure=%); ./configure $($(@:%.configure=%.configure-options)); }
	touch $(PKG_SRC_DIR)/$(@:%.configure=%)/$(CONFIG_DONE_MARKER)

$(packages-make):
	@test ! -d $(PKG_CORRECTION_DIR)/$(@:%.make=%) || { cp -R $(PKG_CORRECTION_DIR)/$(@:%.make=%)/* $(PKG_SRC_DIR)/$(@:%.make=%); }
	cd $(PKG_SRC_DIR)/$(@:%.make=%); $($(@:%.make=%.make-command))

$(packages-place-wrap):
	@echo "--"
	@echo "Putting in packages target: $(@:%.place-wrap=%)"
	@make $(@:%.place-wrap=%.place)
	@echo ""


#
# Making Directories
#
target_directories: $(full_path_target_dirs)

$(full_path_target_dirs):
	@test -e $@ || mkdir -p $@
