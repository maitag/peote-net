# peote-net-test

Little tool that spawns multiple server and clients for testing stability of [peote-net](https://github.com/maitag/peote-server).  
  
Clients tryes to connect a server to repetitive sending random bytes to it.  
Server sends same data back to let the Client check for integrity.  
Client will repeat if not data get lost, otherwise it stops with an error message.  
  
Before get starting you need to run a [peote-server](https://github.com/maitag/peote-server).  

## Building and using as Commandline-Tool:

Install [tink_cli](https://github.com/haxetink/tink_cli) library first:  
`haxelib install tink_cli`.  
  
There are build-scripts `cli_build.sh` (Linux) and `cli_build.bat` (Windows)  
that will copy the binaries into `bin/` folder after compilation.  
Customize `cli.hxml` file for special targets (default is neko + cpp)  
and use the script or build it manually with `haxe cli.hxml`.  
  
  
#### Examples for commandline parameters:

Without parameters the default behavior is to start one __Server__.
You can also spawn more with `-s <amount>` option:  
`peote-net-test -s 2`

open another shell/console and start one or more __Clients__ with `-c <amount>`:  
`peote-net-test -c 1`

With `-v` you can get verbose output of sended/recieved datachunks.  

Use `-h` for help with other options.  


## Build with OpenFL

To build a gui application with [OpenFL framework](https://github.com/openfl)  
choose a `<target>` (neko, hl, linux, windows, html5, android) and  

build and run a server:
`openfl test openflProject.xml -Dserver <target>`

build and run a client:
`openfl test openflProject.xml -Dclient <target>`

The folder `build/openfl/` will contain a build-directory for each compiled target.  


## TODO:
- more different tests
- better errorhandling
- bandwidth-output