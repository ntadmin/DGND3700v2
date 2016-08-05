# 
# This file provides headline information for all the makefiles
# The early lines should be edited to reflect your actual situion
# The later lines should hopefullly not need changing
#
# You probably don't want ot touch the first one of these two,
# but the CUSTOM_VERSION should be set appropriately, as well as
# where this file is in CUSTOM_BASE_DIR
#
PROJECT=DGND3700v2
CUSTOM_VERSION=NEWT16B4
CUSTOM_BASE_DIR=/usr/src/DGND3700v2/DGND3700v2

#
# Set these to reflect the base Netgear firmware being used.
#
NETGEAR_VERSION=1.1.00.26
NETGEAR_REGION=WW
NETGEAR_FW_DATE=20150901
NETGEAR_DL_BASE=http://www.downloads.netgear.com/files/GPL/

#
# Set this to reflect where the cross tools are
#
CROSS_TOOLS_ROOT=/opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw

#
# These should set automatically to the directory this file is in
# and the one the Netgear code has been extracted to. Shouldn't
# need touching
#
NETGEAR_EXTRACT_DIR=$(PROJECT)_V$(NETGEAR_VERSION)_$(NETGEAR_REGION)_src_bak
NETGEAR_BASE_DIR=$(CUSTOM_BASE_DIR)/$(NETGEAR_EXTRACT_DIR)
NETGEAR_APPS=$(NETGEAR_BASE_DIR)/Source/apps


#
# Update this to control which of the packages that comes with
# the netgear distruibution is not needed because it is superceded
# by something in the custom packages directory
#
netgear_packages_not_needed=noip dnrd udhcp dhcpv6 totd busybox lsof

#
# Things not to edit
#
FULL_VERSION=$(NETGEAR_VERSION)_$(CUSTOM_VERSION)
FULL_FULL_VERSION=$(ANNEX)$(FULL_VERSION)

#
# Get what we need from the Netgear mak includes, these should all
# be there on initial untar.
#
export ROOT=$(NETGEAR_BASE_DIR)/Source/
export CROSS=$(CROSS_TOOLS_ROOT)/usr/bin/mips-linux-

-include $(ROOT)/Builds/$(PROJECT).mak
-include $(ROOT)/env.mak

#
# And we also need:
#
CC=$(CROSS)gcc
CP=cp

CFLAGS  = -O3 -Os -s -Wall
CFLAGS += -Werror
CFLAGS += -DTEST


