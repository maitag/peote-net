package peote.net;

/**
 * by Sylvio Sell - Rostock 2018
 */

import haxe.macro.Expr;
import haxe.macro.Context;
import haxe.macro.ExprTools;
//import peote.net.PeoteClient; // <----- HERE error: Class<lime._backend.native.NativeCFFI> has no field lime_system_get_device_model


@:remove @:autoBuild(peote.net.Remote.RemoteImpl.build())
extern interface Remote {}

class RemoteImpl
{

#if macro
	public static function build()
	{
		var remoteNames  = new Array<String>();
		var remoteParams = new Array<Array<TypePath>>();
		var hasNoNew:Bool = true;
		
		var classname = Context.getLocalClass().get().name;
		var fields = Context.getBuildFields();
		for (f in fields)
		{
			function hasMeta(s:String):Bool {for (m in f.meta) { if (m.name == s) return true;} return false;}
			
			if (f.name == "new") {
				hasNoNew = false;
			}
			else if ( hasMeta(":remote") )
			{
				var remParams = new Array<TypePath>();
				switch (f.kind)
				{
					case FVar(TFunction(params,ret),_):
						switch (ret) 
						{
							case TPath(param): 
								if (param.name != "Void") {
									throw throw Context.error('Remote function has no Void return type', f.pos);
								}
							default:
						}
						for (p in params)
						{
							switch (p)
							{
								case TPath(param): 
									switch (param.name) {
										case "Void":
										default: remParams.push(param); // add param type
									}
								default:
							}
						}
					case FFun(func):
						if (func.ret != null)
						{
							switch (func.ret) {
								case TPath(param): 
									if (param.name != "Void") {
										throw Context.error('Remote function has no Void return type', f.pos);
									}
								default:
							}
						}
						for (p in func.args)
						{
							switch (p.type)
							{
								case TPath(param): 
									switch (param.name) {
										case "Void":
										default: remParams.push(param); // add param type
									}
								default:
							}
						}
					default:
				}
				
				// error if more then 256 remote-functions
				if (remoteNames.length == 256) throw Context.error('To much @remote functions (max is 256)', f.pos);
				remoteNames.push(f.name);
				remoteParams.push(remParams);
			}
		}		
		
		// add constructor ("new") if it is not there
		if (hasNoNew) fields.push({
			name: "new",
			access: [APublic],
			pos: Context.currentPos(),
			kind: FFun({
				args: [],
				expr: macro {},
				params: [],
				ret: null
			})
		});
		
		var exprs = [];
		exprs.push(Context.parse('var v = new haxe.ds.Vector<peote.io.PeoteBytesInput->Void>(${remoteNames.length})', Context.currentPos()));
		for ( i in 0...remoteNames.length)
		{
			var fbody = "";
			for ( j in 0...remoteParams[i].length)
				switch (remoteParams[i][j].name) {
					case "Bool":   fbody += 'var p$j = input.readBool();';
					case "Byte":   fbody += 'var p$j = input.readByte();';
					case "UInt16": fbody += 'var p$j = input.readUInt16(); ';
					case "Int16":  fbody += 'var p$j = input.readInt16(); ';
					case "Int32":  fbody += 'var p$j = input.readInt32(); ';
					case "Int":    fbody += 'var p$j = input.readInt32(); ';
					case "Float":  fbody += 'var p$j = input.readFloat(); ';
					case "Double": fbody += 'var p$j = input.readDouble(); ';
					case "String": fbody += 'var p$j = input.readString();';
					case "Bytes":  fbody += 'var p$j = input.read();';
					default:       fbody += 'var p$j = haxe.Unserializer.run(input.readString());';
				}
			fbody += "if (input.bytesLeft() > 0) throw('flooded');";
			fbody += remoteNames[i] + "(" + [for (j in 0...remoteParams[i].length) 'p$j' ].join(",") + ");"; // remote function call
			exprs.push(Context.parse('v.set($i, function(input:peote.io.PeoteBytesInput):Void { $fbody })', Context.currentPos()));
		}
		exprs.push(Context.parse("return v", Context.currentPos())); // trace( ExprTools.toString( macro $b{exprs} ) );
		
		// add getRemotes function
		var getRemotes:Function = { 
			args:[],
			expr: macro $b{exprs},
			ret: macro:haxe.ds.Vector<peote.io.PeoteBytesInput->Void>, // ret = return type
		}
 		fields.push({
		  name: "getRemotes",
		  access: [APublic],
		  pos: Context.currentPos(),
		  kind: FieldType.FFun(getRemotes),
		});
		

		// -------------------------------------------------------------------------------------------------
		// ------------------------------------- generates new classs for remote-calling ---------------------
		// -------------------------------------------------------------------------------------------------
		var classnameRemote = classname+"RemoteServer";
		Context.defineType(generateRemoteCaller(classnameRemote, true, remoteNames, remoteParams));		
		// add function to return an instanze of that class
		var getRemoteServer:Function = {
			args:[ {name:"server", type:macro:peote.net.PeoteServer, opt:false, value:null},
			       {name:"user", type:macro:Int, opt:false, value:null},
			       {name:"remoteId", type:macro:Int, opt:false, value:null}
			],
			expr: Context.parse( 'return new $classnameRemote(server, user, remoteId)', Context.currentPos()) ,
			ret: TPath({ name:classnameRemote, pack:[], params:[] }) // ret = return type
		}
 		fields.push({
		  name: "getRemoteServer",
		  access: [APublic,AStatic],
		  pos: Context.currentPos(),
		  kind: FieldType.FFun(getRemoteServer),
		});
		
		classnameRemote = classname+"RemoteClient";
		Context.defineType(generateRemoteCaller(classnameRemote, false, remoteNames, remoteParams));		
		// add function to return an instanze of that class
		var getRemoteClient:Function = {
			args:[ {name:"client", type:macro:peote.net.PeoteClient, opt:false, value:null},
			       {name:"remoteId", type:macro:Int, opt:false, value:null}
			],
			expr: Context.parse( 'return new $classnameRemote(client, remoteId)', Context.currentPos()) ,
			ret: TPath({ name:classnameRemote, pack:[], params:[] }) // ret = return type
		}
 		fields.push({
		  name: "getRemoteClient",
		  access: [APublic,AStatic],
		  pos: Context.currentPos(),
		  kind: FieldType.FFun(getRemoteClient),
		});
		
		return fields;
	}
	
	// -------------------------------------------------------------------------------------------------
	public static function generateRemoteCaller(classname:String, isServer:Bool, remoteNames:Array<String>, remoteParams:Array<Array<TypePath>>):TypeDefinition
	{
		var c:TypeDefinition;
		if (isServer) {
			c = macro class $classname {
				var server:peote.net.PeoteServer;
				var user:Int;
				var remoteId:Int;
				public function new(server:peote.net.PeoteServer, user:Int, remoteId:Int) { this.server = server; this.user = user; this.remoteId = remoteId; }
			}
		} else {
			c = macro class $classname {
				var client:peote.net.PeoteClient;
				var remoteId:Int;
				public function new(client:peote.net.PeoteClient, remoteId:Int) { this.client = client; this.remoteId = remoteId; }
			}
		}
		
		for ( i in 0...remoteNames.length)
		{
			var fbody = "{var output = new peote.io.PeoteBytesOutput();";
			fbody += 'output.writeByte(remoteId);';
			fbody += 'output.writeByte($i);';
			for ( j in 0...remoteParams[i].length)
				switch (remoteParams[i][j].name) {
					case "Bool":   fbody += 'output.writeBool(p$j);';
					case "Byte":   fbody += 'output.writeByte(p$j);';
					case "UInt16": fbody += 'output.writeUInt16(p$j);';
					case "Int16":  fbody += 'output.writeInt16(p$j);';
					case "Int32":  fbody += 'output.writeInt32(p$j);';
					case "Int":    fbody += 'output.writeInt32(p$j);';
					case "Float":  fbody += 'output.writeFloat(p$j);';
					case "Double": fbody += 'output.writeDouble(p$j);';
					case "String": fbody += 'output.writeString(p$j);';
					case "Bytes":  fbody += 'output.write(p$j);';
					default:       fbody += 'output.writeString(haxe.Serializer.run(p$j));';
				}
			if (isServer) fbody += "server.sendChunk(user, output.getBytes());}";
			else fbody += "client.sendChunk(output.getBytes());}";
			
			var f:Function = {
				args:[for (j in 0...remoteParams[i].length) {
					name:'p$j',
					type:TPath({
						name: remoteParams[i][j].name,
						pack: switch(remoteParams[i][j].name) {
							case "Byte"|"UInt16"|"Int16"|"Int32"|"Double": ["peote", "io"];
							case "Bytes": ["haxe", "io"];							
							default:remoteParams[i][j].pack; 
						},
						params:remoteParams[i][j].params						
					}), opt:false
				}],
				expr: Context.parse( fbody, Context.currentPos()),
				ret: null,
			}
			c.fields.push({
				name: remoteNames[i],
				access: [APublic],
				pos: Context.currentPos(),
				kind: FieldType.FFun(f),
			});
		}
		return(c);
	}
	
#end

}
abstract UInt16(Int) from Int to Int { inline public function new(i:Int) {this = i;} }