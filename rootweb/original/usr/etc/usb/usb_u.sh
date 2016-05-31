#!/bin/sh

echo ">> $0 $1" > /dev/console

# waiting rcd
w=0
while [ ! -e /var/rcd ] && [ $w -lt 30 ]; do
	echo "$0 waiting rcd $w" > /dev/console
	sleep 1
	let w=w+1
done

/usr/sbin/rc usb_service kumount "$1"
