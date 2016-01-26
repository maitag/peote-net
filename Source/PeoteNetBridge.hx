package;

//import haxe.remoting.ExternalConnection;
import flash.external.ExternalInterface;
import flash.utils.ByteArray;
import haxe.io.Bytes;

import de.peote.net.flash.bridge.PeoteServer;
import de.peote.net.flash.bridge.PeoteClient;
// as js lib

class PeoteNetBridge {
	
    public static var peoteServer:Map<String, PeoteServer>;
    public static var peoteClient:Map<String, PeoteClient>;
    public static function CAN_I_HAS_PEOTENET() { return true; }

	public function new()
	{
		peoteServer = new Map<String, PeoteServer>();
		peoteClient = new Map<String, PeoteClient>();
		trace("PeoteNet - ExternalInterface.available:",ExternalInterface.available);
        
		// like: http://ionel-whatever-code.googlecode.com/svn/trunk/HaxeSocketBridge/
		
		ExternalInterface.addCallback("createJoint", createJoint);    
        ExternalInterface.addCallback("deleteJoint", deleteJoint);    
        ExternalInterface.addCallback("send", send); 
		
		ExternalInterface.addCallback("enterJoint", enterJoint);    
        ExternalInterface.addCallback("leaveJoint", leaveJoint);    
        ExternalInterface.addCallback("sendClient", sendClient);
		
        ExternalInterface.addCallback("CAN_I_HAS_PEOTENET", CAN_I_HAS_PEOTENET);
        
		ExternalInterface.call([
		"(function(){",
            "if (window.PeoteServer) return;",
			
            "var Class = function(properties){",
                "var klass = function(event_handlers){ ",
                    "for (var p in event_handlers) {",
                        "if (event_handlers.hasOwnProperty(p)) {",
                            "this[p] = event_handlers[p];",
                        "}",
                    "}",
                    "return this.init.apply(this);",
                "};",
                "klass.prototype = properties;",
                "klass.constructor = arguments.callee;",
                "return klass;",
            "};",
			
            "window.PeoteServer = new Class({",
                "init: function(){",
                    "this._instance = ''+window.PeoteServer._instances.length;",
                    "window.PeoteServer._instances.push(this);",
                "},",
                "createJoint: function(host, port, joint_id) {",
                    "window.PeoteServer._bridge.createJoint(this._instance, host, port, joint_id);",
                "},",
                "deleteJoint: function() {",
                    "window.PeoteServer._instances[this._instance] = null;",
                    "window.PeoteServer._bridge.deleteJoint(this._instance );",
                "},",
                "send: function(userNr, data) {",
                    "window.PeoteServer._bridge.send(this._instance, userNr, data);",
                "},",
            "});",
            "window.PeoteServer._instances = [];",
			
            "window.PeoteClient = new Class({",
                "init: function(){",
                    "this._instance = ''+window.PeoteClient._instances.length;",
                    "window.PeoteClient._instances.push(this);",
                "},",
                "enterJoint: function(host, port, joint_id) {",
                    "window.PeoteServer._bridge.enterJoint(this._instance, host, port, joint_id);",
                "},",
                "leaveJoint: function() {",
                    "window.PeoteClient._instances[this._instance] = null;",
                    "window.PeoteServer._bridge.leaveJoint(this._instance);",
                "},",
                "send: function(data) {",
                    "window.PeoteServer._bridge.sendClient(this._instance, data);",
                "},",
            "});",
            "window.PeoteClient._instances = [];",
			
            "var f = function(tag){",
                "var elems = document.getElementsByTagName(tag);",
                "for (var i=0; i<elems.length; i++) if (elems[i].CAN_I_HAS_PEOTENET) return elems[i];",
            "};",
            "window.PeoteServer._bridge = f('embed') || f('object');",
        "})" ].join('') );
		
        if (flash.Lib.current.loaderInfo.parameters.onloadcallback != null)
            ExternalInterface.call(flash.Lib.current.loaderInfo.parameters.onloadcallback);
		else ExternalInterface.call("PeoteNetBridge");
	}
	
    
	// -------------------------------------------------------------
	// ---------------------------- PeoteServer --------------------
	// -------------------------------------------------------------
    public static function createJoint(id:String, server:String, port:Int, joint_id:String) {
        trace('createJoint');
		var p:PeoteServer = peoteServer.get(id);
        if (p != null)  {
            p.deleteJoint();
			p.createJoint(server, port, joint_id);
        } else {
            p = new PeoteServer(id);
			p.createJoint(server, port, joint_id);
            peoteServer.set(id, p);
        }       
    }
    public static function deleteJoint(id:String) {
        var p:PeoteServer = peoteServer.get(id);
        if (p != null) p.deleteJoint();
    }
    public static function send(id:String, userNr:Int, data:Array<Int>) {
        var p:PeoteServer = peoteServer.get(id);
        var ba:ByteArray = new ByteArray();
		for (i in 0...data.length) ba.writeByte(data[i]);
        if (p != null) p.send(userNr, Bytes.ofData(ba));
    }
	
	// -------------------------------------------------------------
	// -------------------------- PeoteClient ----------------------
	// -------------------------------------------------------------
    public static function enterJoint(id:String, server:String, port:Int, joint_id:String) {
        trace('enterJoint');
		var p:PeoteClient = peoteClient.get(id);
        if (p != null)  {
            p.leaveJoint();
			p.enterJoint(server, port, joint_id);
        } else {
            p = new PeoteClient(id);
			p.enterJoint(server, port, joint_id);
            peoteClient.set(id, p);
        }       
    }
    public static function leaveJoint(id:String) {
        var p:PeoteClient = peoteClient.get(id);
        if (p != null) p.leaveJoint();
    }
    public static function sendClient(id:String, data:Array<Int>) {
        var p:PeoteClient = peoteClient.get(id);
        var ba:ByteArray = new ByteArray();
		for (i in 0...data.length) ba.writeByte(data[i]);
		if (p != null) p.send(Bytes.ofData(ba));
    }	
	
}