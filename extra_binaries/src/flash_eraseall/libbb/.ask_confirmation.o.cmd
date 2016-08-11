cmd_libbb/ask_confirmation.o := /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/mips-linux-gcc -Wp,-MD,libbb/.ask_confirmation.o.d   -std=gnu99 -Iinclude -Ilibbb  -include include/autoconf.h -D_GNU_SOURCE -DNDEBUG  -D"BB_VER=KBUILD_STR(1.13.4)" -DBB_BT=AUTOCONF_TIMESTAMP  -Wall -Wshadow -Wwrite-strings -Wundef -Wstrict-prototypes -Wunused -Wunused-parameter -Wmissing-prototypes -Wmissing-declarations -Wdeclaration-after-statement -Wold-style-definition -fno-builtin-strlen -finline-limit=0 -fomit-frame-pointer -ffunction-sections -fdata-sections -fno-guess-branch-probability -funsigned-char -static-libgcc -falign-functions=1 -falign-jumps=1 -falign-labels=1 -falign-loops=1 -Os    -D"KBUILD_STR(s)=\#s" -D"KBUILD_BASENAME=KBUILD_STR(ask_confirmation)"  -D"KBUILD_MODNAME=KBUILD_STR(ask_confirmation)" -c -o libbb/ask_confirmation.o libbb/ask_confirmation.c

deps_libbb/ask_confirmation.o := \
  libbb/ask_confirmation.c \
  include/libbb.h \
    $(wildcard include/config/selinux.h) \
    $(wildcard include/config/locale/support.h) \
    $(wildcard include/config/feature/shadowpasswds.h) \
    $(wildcard include/config/use/bb/pwd/grp.h) \
    $(wildcard include/config/use/bb/shadow.h) \
    $(wildcard include/config/lfs.h) \
    $(wildcard include/config/feature/buffers/go/on/stack.h) \
    $(wildcard include/config/buffer.h) \
    $(wildcard include/config/ubuffer.h) \
    $(wildcard include/config/feature/buffers/go/in/bss.h) \
    $(wildcard include/config/inux.h) \
    $(wildcard include/config/feature/ipv6.h) \
    $(wildcard include/config/feature/check/names.h) \
    $(wildcard include/config/feature/prefer/applets.h) \
    $(wildcard include/config/busybox/exec/path.h) \
    $(wildcard include/config/getopt/long.h) \
    $(wildcard include/config/feature/pidfile.h) \
    $(wildcard include/config/feature/syslog.h) \
    $(wildcard include/config/feature/individual.h) \
    $(wildcard include/config/o.h) \
    $(wildcard include/config/ntf.h) \
    $(wildcard include/config/t.h) \
    $(wildcard include/config/l.h) \
    $(wildcard include/config/wn.h) \
    $(wildcard include/config/.h) \
    $(wildcard include/config/route.h) \
    $(wildcard include/config/feature/hwib.h) \
    $(wildcard include/config/feature/crond/d.h) \
    $(wildcard include/config/use/bb/crypt.h) \
    $(wildcard include/config/ioctl/hex2str/error.h) \
    $(wildcard include/config/feature/editing.h) \
    $(wildcard include/config/feature/editing/history.h) \
    $(wildcard include/config/ture/editing/savehistory.h) \
    $(wildcard include/config/feature/editing/savehistory.h) \
    $(wildcard include/config/feature/tab/completion.h) \
    $(wildcard include/config/feature/username/completion.h) \
    $(wildcard include/config/feature/editing/vi.h) \
    $(wildcard include/config/feature/topmem.h) \
    $(wildcard include/config/feature/top/smp/process.h) \
    $(wildcard include/config/killall.h) \
    $(wildcard include/config/pgrep.h) \
    $(wildcard include/config/pkill.h) \
    $(wildcard include/config/pidof.h) \
    $(wildcard include/config/sestatus.h) \
    $(wildcard include/config/feature/devfs.h) \
  include/platform.h \
    $(wildcard include/config/werror.h) \
    $(wildcard include/config///.h) \
    $(wildcard include/config/nommu.h) \
    $(wildcard include/config//nommu.h) \
    $(wildcard include/config//mmu.h) \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/byteswap.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/byteswap.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/endian.h \
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
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/ctype.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/uClibc_touplow.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/dirent.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/dirent.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/errno.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/errno.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/errno_values.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/syscall.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/sysnum.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/fcntl.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/fcntl.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sgidefs.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/stat.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/stat.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/inttypes.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/netdb.h \
    $(wildcard include/config/3/ascii/rules.h) \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/rpc/netdb.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/siginfo.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/netdb.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/setjmp.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/setjmp.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/signal.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/signum.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/sigaction.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/sigcontext.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/sigstack.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/ucontext.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/ucontext.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/sigthread.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/stdio.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/uClibc_stdio.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/wchar.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/uClibc_mutex.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/pthread.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sched.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/uClibc_clk_tck.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/initspin.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/uClibc_pthread.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/bin/../lib/gcc/mips-linux-uclibc/4.4.2/include/stdarg.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/stdlib.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/waitflags.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/waitstatus.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/alloca.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/string.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/poll.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/poll.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/mman.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/mman.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/time.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/wait.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/resource.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/resource.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/termios.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/termios.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/unistd.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/posix_opt.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/environments.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/confname.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/getopt.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/utime.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/param.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/linux/param.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/asm/param.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/mntent.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/paths.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/sys/statfs.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/bits/statfs.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/pwd.h \
  /opt/toolchains/uclibc-crosstools-gcc-4.4.2-1-with-ftw/usr/include/grp.h \
  include/xatonum.h \

libbb/ask_confirmation.o: $(deps_libbb/ask_confirmation.o)

$(deps_libbb/ask_confirmation.o):
