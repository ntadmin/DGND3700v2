cmd_libbb/perror_nomsg.o := /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/mips-linux-gcc -Wp,-MD,libbb/.perror_nomsg.o.d   -std=gnu99 -Iinclude -Ilibbb  -include include/autoconf.h -D_GNU_SOURCE -DNDEBUG  -D"BB_VER=KBUILD_STR(1.13.4)" -DBB_BT=AUTOCONF_TIMESTAMP  -Wall -Wshadow -Wwrite-strings -Wundef -Wstrict-prototypes -Wunused -Wunused-parameter -Wmissing-prototypes -Wmissing-declarations -Wdeclaration-after-statement -Wold-style-definition -fno-builtin-strlen -finline-limit=0 -fomit-frame-pointer -ffunction-sections -fdata-sections -fno-guess-branch-probability -funsigned-char -static-libgcc -falign-functions=1 -falign-jumps=1 -falign-labels=1 -falign-loops=1 -Os    -D"KBUILD_STR(s)=\#s" -D"KBUILD_BASENAME=KBUILD_STR(perror_nomsg)"  -D"KBUILD_MODNAME=KBUILD_STR(perror_nomsg)" -c -o libbb/perror_nomsg.o libbb/perror_nomsg.c

deps_libbb/perror_nomsg.o := \
  libbb/perror_nomsg.c \
  include/platform.h \
    $(wildcard include/config/werror.h) \
    $(wildcard include/config///.h) \
    $(wildcard include/config/nommu.h) \
    $(wildcard include/config//nommu.h) \
    $(wildcard include/config//mmu.h) \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/byteswap.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/byteswap.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/endian.h \
    $(wildcard include/config/.h) \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/../lib/gcc/mips-linux-uclibc/4.4.2/include-fixed/features.h \
    $(wildcard include/config/c99.h) \
    $(wildcard include/config/ix.h) \
    $(wildcard include/config/ix2.h) \
    $(wildcard include/config/ix199309.h) \
    $(wildcard include/config/ix199506.h) \
    $(wildcard include/config/en.h) \
    $(wildcard include/config/en/extended.h) \
    $(wildcard include/config/x98.h) \
    $(wildcard include/config/en2k.h) \
    $(wildcard include/config/gefile.h) \
    $(wildcard include/config/gefile64.h) \
    $(wildcard include/config/e/offset64.h) \
    $(wildcard include/config/d.h) \
    $(wildcard include/config/c.h) \
    $(wildcard include/config/ile.h) \
    $(wildcard include/config/ntrant.h) \
    $(wildcard include/config/tify/level.h) \
    $(wildcard include/config/i.h) \
    $(wildcard include/config/ern/inlines.h) \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/uClibc_config.h \
    $(wildcard include/config/mips/o32/abi//.h) \
    $(wildcard include/config/mips/n32/abi//.h) \
    $(wildcard include/config/mips/n64/abi//.h) \
    $(wildcard include/config/mips/isa/1//.h) \
    $(wildcard include/config/mips/isa/2//.h) \
    $(wildcard include/config/mips/isa/3//.h) \
    $(wildcard include/config/mips/isa/4//.h) \
    $(wildcard include/config/mips/isa/mips32//.h) \
    $(wildcard include/config/mips/isa/mips64//.h) \
    $(wildcard include/config//.h) \
    $(wildcard include/config/link//.h) \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/uClibc_arch_features.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/cdefs.h \
    $(wildcard include/config/espaces.h) \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/endian.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/arpa/inet.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/netinet/in.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/stdint.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/wchar.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/wordsize.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/socket.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/uio.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/types.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/types.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/../lib/gcc/mips-linux-uclibc/4.4.2/include/stddef.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/kernel_types.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/typesizes.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/pthreadtypes.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/sched.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/time.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/select.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/select.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/sigset.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/time.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/sysmacros.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/uio.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/socket.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/../lib/gcc/mips-linux-uclibc/4.4.2/include-fixed/limits.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/../lib/gcc/mips-linux-uclibc/4.4.2/include-fixed/syslimits.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/limits.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/posix1_lim.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/local_lim.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/linux/limits.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/uClibc_local_lim.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/posix2_lim.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/xopen_lim.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/stdio_lim.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/sockaddr.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/asm/socket.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/asm/sockios.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/asm/ioctl.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/in.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/../lib/gcc/mips-linux-uclibc/4.4.2/include/stdbool.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/mount.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/ioctl.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/ioctls.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/asm/ioctls.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/ioctl-types.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/ttydefaults.h \

libbb/perror_nomsg.o: $(deps_libbb/perror_nomsg.o)

$(deps_libbb/perror_nomsg.o):
