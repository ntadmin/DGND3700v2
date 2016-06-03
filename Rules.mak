# 
# This file provides headline information for all the makefiles
# The early lines should be edited to reflect your actual situion
# The later lines should hopefullly not need changing
#
NETGEAR_VERSION=1.1.00.26
CUSTOM_VERSION=NEWT16A
NETGEAR_EXTRACT_DIR=DGND3700v2_V1.1.00.26_WW_src_bak
CROSS_TOOLS_ROOT=/opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw
CUSTOM_BASE_DIR=/usr/src/DGND3700v2/DGND3700v2

#
# These should set automatically to the directory this file is in
# and the one the Netgear code has been extracted to. Shouldn't
# need touching
#
NETGEAR_BASE_DIR=$(CUSTOM_BASE_DIR)/$(NETGEAR_EXTRACT_DIR)

#
# Things not to edit
#
FULL_VERSION=$(NETGEAR_VERSION)_$(CUSTOM_VERSION)
FULL_FULL_VERSION=$(ANNEX)$(FULL_VERSION)

#
# Get what we need from the Netgear mak includes, these should all
# be there on initial untar.
#
PROJECT=DGND3700v2
export ROOT=$(NETGEAR_BASE_DIR)/Source/
export CROSS=$(CROSS_TOOLS_ROOT)/usr/bin/mips-linux-

include $(ROOT)/Builds/$(PROJECT).mak
-include $(ROOT)/env.mak

#
# And we also need:
#
CC=$(CROSS)gcc
CP=cp

CFLAGS  = -O2 -s -Wall
CFLAGS += -Werror
CFLAGS += -DTEST


