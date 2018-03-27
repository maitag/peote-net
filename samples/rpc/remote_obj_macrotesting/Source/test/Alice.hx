package test;

import RemoteOrNotRemote;

@:genericBuild(RemoteOrNotRemote.build())
class Alice<Const> {
    
    public function new() {
		trace("Alice.new");
	}
    public function send(msg:String) {
		trace("Alice.send: "+msg);
	}
}
