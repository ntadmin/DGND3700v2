# 
# This file provides headline information for all the makefiles
# The early lines should be edited to reflect your actual situion
# The later lines should hopefullly not need changing
#

CUSTOM_BASE_DIR=/usr/src/DGND3700v2/DGND3700v2
NETGEAR_BASE_DIR=/usr/src/DGND3700v2/DGND3700v2/DGND3700v2_V1.1.00.26_WW_src_bak

#
# Things not to edit
#

include $(NETGEAR_BASE_DIR)/Source/Rules.mak

CC=$(CROSS)gcc
CP=cp

CFLAGS  = -O2 -s -Wall
CFLAGS += -Werror
CFLAGS += -DTEST


