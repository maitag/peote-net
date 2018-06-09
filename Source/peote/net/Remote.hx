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
		var remoteParams = new Array<Array<String>>();
		var hasNoNew:Bool = true;
		
		var fields = Context.getBuildFields();
		for (f in fields)
		{
			function hasMeta(s:String):Bool {for (m in f.meta) { if (m.name == s) return true;} return false;}
			
			if (f.name == "new") {
				hasNoNew = false;
			}
			else if ( hasMeta(":remote") )
			{
				var remParams = new Array<String>();
				switch (f.kind)
				{
					case FVar(TFunction(params,ret),_):
						switch (ret) {
							case TPath(param): 
								if (param.name != "Void") {
									throw throw Context.error('Remote function has no Void return type', f.pos);
								}
							default:
						}
						for (p in params)
						{	switch (p) {
								case TPath(param): 
									switch (param.name) {
										case "Void":
										default: remParams.push(param.name); // add param
									}
								default:
							}
						}
					case FFun(func):
						if (func.ret != null) {
							switch (func.ret) {
								case TPath(param): 
									if (param.name != "Void") {
										throw Context.error('Remote function has no Void return type', f.pos);
									}
								default:
							}
						}
						for (param in func.args) {
							remParams.push(param.name); // add param
						}
					default:
				}
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
		for ( i in 0...remoteNames.length)
		{
			var remoteName = remoteNames[i];
			var fbody = "";
			for ( j in 0...remoteParams[i].length)
			{
				var remoteParam = remoteParams[i][j];
				switch (remoteParam) {
					case "String": fbody += 'var p$j = input.readString();';
					case "Byte":   fbody += 'var p$j = input.readByte();';
					case "Int":    fbody += 'var p$j = input.readInt32();';
					default:       fbody += 'var p$j = remoteParam.fromPeoteBytesInput(input);'; // TODO -> give own datatypes an obj.serialization
				}
			}
			fbody += remoteName + "(" + 
					[for (j in 0...remoteParams[i].length) 'p$j' ].join(",") +
				");";
			exprs.push( Context.parse( 'function (input:peote.io.PeoteBytesInput):Void { $fbody }', Context.currentPos()) );
		}
		
		trace( ExprTools.toString( macro return $a{exprs} ) );
		
		// add getRemotes function
		var getRemotes:Function = { 
			//args:[{name:"a", type:macro:String, opt:false, value:null}], // arguments
			args:[],
			expr: macro return $a{exprs},
			ret: macro:Array<peote.io.PeoteBytesInput->Void>, // ret = return type
		}
    
		fields.push({
		  name: "getRemotes",
		  access: [APublic],
		  pos: Context.currentPos(),
		  kind: FieldType.FFun(getRemotes),
		});
		

		// -------------------------------------------------------------------------------------------------
		// ------------------------------------- generate new class for remote-calling ---------------------
		// -------------------------------------------------------------------------------------------------
		//var c = macro class ServerFunctionsRemote {
			//var client:PeoteClient;
			//public function new(client:peote.net.PeoteClient) { this.client = client; }
			//public function $funcName() {
			//		trace($v{funcName} + " was called");
			//}
		//}
		//Context.defineType(c);

		
		
		
		// -------------------------------------------------------------------------------------------------
		return fields;
	}

#end

}