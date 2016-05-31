#!/bin/sh
#
#insert SPI firewall module into the Linux Kernel
#
/sbin/insmod /lib/modules/common.ko
/sbin/insmod /lib/modules/firewall_block.ko
/sbin/insmod /lib/modules/fake_source_dos.ko
/sbin/insmod /lib/modules/psd_and_special_udp_dos.ko
/sbin/insmod /lib/modules/tcp_syn_dos.ko
/sbin/insmod /lib/modules/clamp_total_session_for_one_src.ko
/sbin/insmod /lib/modules/others_dos.ko

