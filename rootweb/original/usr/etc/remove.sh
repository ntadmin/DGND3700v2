#!/bin/sh
echo 8 > /proc/sys/kernel/printk

rmmod others_dos.ko
rmmod clamp_total_session_for_one_src.ko
rmmod tcp_syn_dos.ko
rmmod psd_and_special_udp_dos.ko
rmmod fake_source_dos.ko
rmmod firewall_block.ko
rmmod common.ko

