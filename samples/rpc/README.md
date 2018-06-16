# peote-rpc sample

Remote Procedure Call sample for [peote-net](https://github.com/maitag/peote-net).  
  
  (Todo: api is not finalized yet!)

## Build and run with OpenFL

`openfl test <target>`

Before testing with network-cability you need to run a [peote-server](https://github.com/maitag/peote-server).  

build and run a server:
`openfl test <target> -Dserver` 

build and run a client:
`openfl test <target> -Dclient`

The folder `build/openfl/` will contain a build-directory for each compiled target.  


## TODO:

- more datatypes and custom serialization
- hardening against wrong input sizes in remote-functionparams
