# peote-net-test

Remote Procedure Call sample for [peote-net](https://github.com/maitag/peote-net).  
  
  (Todo: api here)

## Build with OpenFL

To build a gui application with [OpenFL framework](https://github.com/openfl)  
choose a `<target>` (neko, linux, windows, html5, android) and  

build and test without network:
`openfl test <target>` -Dserver -Dclient


Before test into network you need to run a [peote-server](https://github.com/maitag/peote-server).  

build and run a server:
`openfl test <target>` -Dserver 

build and run a client:
`openfl test <target>` -Dclient

The folder `build/openfl/` will contain a build-directory for each compiled target.  


## TODO:

- class generation for remote calling
- multiple remote-objects and onRemote handlers
- better readme
