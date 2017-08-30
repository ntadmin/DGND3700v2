# This file provides headline information for all the makefiles
# The early lines should be edited to reflect your actual situion
# The later lines should hopefully not need changing

#######################################################################
#
# Proboably don't need to change this one, but it's nice to have it
# at the start.
#
PROJECT=DGND3700v2
#
# Set this to DGND3700v2 or DGND3700Bv2 depending on which router you
# are building for
#
VARIANT=DGND3700v2
#
# This doesn't affect the build at all, it is simply displayed on
# the web pages so you know which version is on the router. Set as
# appropriate.
#
CUSTOM_VERSION=NEWT17A6
#
# Set this to where this file is on your system.
#
CUSTOM_BASE_DIR=/usr/src/DGND3700v2/DGND3700v2
#
# Set these to reflect the base Netgear firmware source being used.
#
NETGEAR_VERSION=1.1.00.26
NETGEAR_REGION=WW
NETGEAR_FW_DATE=20150901
NETGEAR_DL_BASE=http://www.downloads.netgear.com/files/GPL/
#
# Set this to reflect where the cross tools are
#
CROSS_TOOLS_ROOT=/opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw


#########################################################################
#
# These should set automatically to the directory this file is in
# and the one the Netgear code has been extracted to. Shouldn't
# need touching.
#
NETGEAR_EXTRACT_DIR=$(PROJECT)_V$(NETGEAR_VERSION)_$(NETGEAR_REGION)_src_bak
NETGEAR_BASE_DIR=$(CUSTOM_BASE_DIR)/$(NETGEAR_EXTRACT_DIR)
NETGEAR_APPS=$(NETGEAR_BASE_DIR)/Source/apps


##########################################################################
#
# Things not to edit below here. Unless there's a bug, anyway!
#
FULL_VERSION=$(NETGEAR_VERSION)_$(CUSTOM_VERSION)
FULL_FULL_VERSION=$(ANNEX)$(FULL_VERSION)

#
# Turn Variant into useful information for the Netgear bits
# 
# Default (DGND3700v2)
#
ANNEX=A
FLASH=32M

#
# Variants
#
ifeq "$(VARIANT)" "DGND3700Bv2"
ANNEX=B
FLASH=128M
endif

ifeq "$(VARIANT)" "DGND3700v2h2"
ANNEX=A
FLASH=128M
endif

#
# Get what we need from the Netgear mak includes, these should all
# be there on initial untar.
#
export ROOT=$(NETGEAR_BASE_DIR)/Source/
export CROSS=$(CROSS_TOOLS_ROOT)/usr/bin/mips-linux-

-include $(ROOT)/Builds/$(VARIANT).mak
-include $(ROOT)/env.mak

#
# And we also need:
#
CC=$(CROSS)gcc
CP=cp

CFLAGS  = -O3 -Os -s -Wall
CFLAGS += -Werror
CFLAGS += -DTEST


