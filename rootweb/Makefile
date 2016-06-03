include ../Rules.mak

CP=cp
RM=rm
MV=mv
LN=ln -s

TARGET_FROM_NETGEAR=target-orig.tar.bz2
TARGET_FOR_SOURCE=target.tar.bz2
TAR_DESTDIR=$(NETGEAR_BASE_DIR)/Source
TAR=tar
TAR_CREATE_ARGS=--format=gnu -acf
TAR_EXTRACT_ARGS=-axf
NETGEAR_TARGET_DIR=target
UPDATES_TARGET_DIR=additions
PACKAGES_DIR=../packages/target
EXTRA_BINARIES_DIR=../extra_binaries/target

.PHONY: $(TAR_DESTDIR)/$(TARGET_FOR_SOURCE) version

all : $(TAR_DESTDIR)/$(TARGET_FOR_SOURCE)

$(TAR_DESTDIR)/$(TARGET_FOR_SOURCE) : 
	$(RM) -rf $(NETGEAR_TARGET_DIR)
	$(TAR) $(TAR_EXTRACT_ARGS) $(TARGET_FROM_NETGEAR)
	$(MV) $(NETGEAR_TARGET_DIR)/usr/sbin/setup.cgi $(NETGEAR_TARGET_DIR)/usr/sbin/netgear-setup.cgi
	$(CP) -R $(UPDATES_TARGET_DIR)/* $(NETGEAR_TARGET_DIR) 
	$(CP) -R $(PACKAGES_DIR)/* $(NETGEAR_TARGET_DIR) 
	$(CP) -R $(EXTRA_BINARIES_DIR)/* $(NETGEAR_TARGET_DIR)
	make version
	$(TAR) $(TAR_CREATE_ARGS) $(TARGET_FOR_SOURCE) $(NETGEAR_TARGET_DIR)

version:
	echo $(FULL_FULL_VERSION) > $(NETGEAR_TARGET_DIR)/usr/etc/version
	echo "Firmware=V"$(FULL_VERSION) > $(NETGEAR_TARGET_DIR)/www.eng/currentsetting.htm
	echo "RegionTag=$(PROJECT)_WW" >>  $(NETGEAR_TARGET_DIR)/www.eng/currentsetting.htm
	echo "Region=WW"  >> $(NETGEAR_TARGET_DIR)/www.eng/currentsetting.htm
	echo "Model="$(PROJECT_ID)  >> $(NETGEAR_TARGET_DIR)/www.eng/currentsetting.htm
	echo "InternetConnectionStatus=Up" >> $(NETGEAR_TARGET_DIR)/www.eng/currentsetting.htm
	echo "InternetConnectionStatus=@if_wan_up#" >> $(NETGEAR_TARGET_DIR)/www.eng/currentsetting.htm
	echo "ParentalControlSupported=1" >> $(NETGEAR_TARGET_DIR)/www.eng/currentsetting.htm
	echo "SOAPVersion=1.13" >> $(NETGEAR_TARGET_DIR)/www.eng/currentsetting.htm
	echo "ReadyShareSupportedLevel=5" >> $(NETGEAR_TARGET_DIR)/www.eng/currentsetting.htm

