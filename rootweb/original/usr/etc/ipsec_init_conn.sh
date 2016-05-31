#!/bin/sh

echo ">> $0 $1" > /dev/console

if ps | grep "whack" | grep "initiate" | grep $1
then
  echo "connection $1 is initiating"
  exit
fi
/usr/sbin/ipsec whack --initiate --name $1 &
exit