#!/bin/sh

echo ">> $0 $1 $2 $3 $4" > /dev/console

# waiting rcd
w=0
while [ ! -e /var/rcd ] && [ $w -lt 30 ]; do
	echo "$0 waiting rcd $w" > /dev/console
	sleep 1
	let w=w+1
done

idx=0

while [ ! -f "/proc/${1}_async" ] && [ $idx -lt 20 ]; do
        echo "Wait USB $1 async ($idx)" > /dev/console
        let idx=idx+1
        /usr/sbin/sleep 1
done

if [ $idx -eq 20 ]
then
    echo "async not done in 20 seconds, exit" > /dev/console
    exit 
fi


/usr/sbin/rc usb_service kmount "$1" "$2" "$3" "$4"
