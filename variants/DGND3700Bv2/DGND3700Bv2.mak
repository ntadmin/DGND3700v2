#Make PID need HW_ID VER PRODUCT_ID
BOARD_ID=DGND3700Bv2
HW_ID=ADH
VER=1.1.00.21
SUB_VER=1.00.21
GUI_VER=1.1.00.16
HW_TYPE=DGND3700v2
PRODUCT_ID=A001
REGION=WW
MTCODE=0

#------------------------------------------------#

MODULE=Netgear
COMPANY=72
# Do we have ADSL WAN? 1-Yes 0-No
ADSL=1
ANNEX=B
WIFI=1
USB=1
FLASH=128M
CHIP_ID=6361
BLOCKSIZE=128
#------------------------------------------------#

MULTI_PVC=0
VPN=1
MT_CODE=0
ADSL2=0
BRIDGE=0
SNMP=0
DNSHJ=1
SIPALG=1
TMSS=0
VOIP=0
CA=1
POT=1
RIP=1
DPF=0
LLTD=1
IGMP=1
PPTPC=1
BCM_WPS=1
MSSID=1
WIZARD_LOG=1
SETUPWIZARD=1
DSLDIAG=0
PORTTRIGGER=1
PORTFORWARD=1
HTTPS=1
# connect track manager module, 1=yes, 0=no
CT_MGR=1
IPV6=1
IPV6_LOGO=0
IP6_6RD_CE=0
IPQOS=1
TR069=0
TRAFFIC_METER=1
HACK_DNS=1
# Netgear Router Debugging Mode -- Spec V1.9
# adsl spec prefer to use setup.cgi?todo=debug to open telnetd
DEBUG_MODE=0
WIFI_ISOLATION=1
# Hide password in config file
HIDDEN_PASSWORD=1
#..................special feature...............#
US_ONLY=0
AUTOUPG=1
MODIFYMAC=0
OPENDNS=1
CONENAT=1
IP_ASSIGN_CHK=1
PNPX=1
DUAL_WAN=1
DUAL_BAND=1
EXTERNAL_SWITCH=1
READY_SHARE_PRINTER=1
GENIE_GUI=1
NBTSCAN_DBG=0
#------------------------------------------------#
DEFAULT_FILE=default.dgnd3700bv2
#................. SetUpWizard 3.0...............#
SingleWIFI=1
#................. Block Site ...................#
ALL_TCP_CHECK=1
#................. dirty solution, it will be fixed later .................#
TEMP_SOLUTION=0
CHIP_VENDOR=BCM
DLNA=1
USE_MINIDLNA=1
BOOT_NAND_FLASH=1
XML_DEFAULT_CFG=$(ROOT)/UI/default/default.xml.DGN2200
GPL=1
