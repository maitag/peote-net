package;
import haxe.macro.Expr;
import haxe.macro.Context;
import haxe.macro.Type;
import haxe.macro.TypeTools;
import haxe.macro.Expr.Field;

class RemoteOrNotRemote {
#if macro
	public static var cache = new Map<String, Bool>();
	public static function build():ComplexType {

		//var className = 'Alice';
		//trace(Context.getLocalClass());
		//trace(Context.getLocalType());
		//trace(TypeTools.getClass( Context.getLocalType() ).name);
		var className = TypeTools.getClass( Context.getLocalType() ).name;
		var fields = Context.getBuildFields();

		//trace(Context.getLocalType());
		switch ( Context.getLocalType() )
		{
			case TInst(_,[TInst(_.get() => { kind: KExpr(macro $v{(i:String)}) },_)]):
				//trace("remote");
				if (i == "remote") {
					className += "Remote";
					fields = doRemote(fields);
				} else className += "Local";

			case t:
				//trace("not remote");
				className += "Local";
		}

		if ( !cache.exists(className) )
		{
			trace("build Class:"+className+"--------------");
			// create new class
			var typeDefinition:TypeDefinition = {
					pos : Context.currentPos(),
					pack : [],
					name : className,
					kind: TDClass(),
					fields:fields,
					params: [],
			}
			Context.defineType(typeDefinition);
			cache.set(className, true);
		}
		
		//return TPath({ pack:[], name:className, params:[] });
		return Context.toComplexType(Context.getType(className));
	}

	public static function doRemote(fields:Array<Field>) {
		/*
		var args = [];
		var states = [];
		for (f in fields) {
			trace(f);
			switch (f.kind) {
			case FVar(t,_):
				args.push({name:f.name, type:t, opt:false, value:null});
				states.push(macro $p{["this", f.name]} = $i{f.name});
				f.access.push(APublic); // did all existing public
			default:
		  }
		}

		// add constructor ("new")
		fields.push({
		  name: "new",
		  access: [APublic],
		  pos: Context.currentPos(),
		  kind: FFun({
			args: args,
			expr: macro $b{states},
			params: [],
			ret: null
		  })
		});

		// add update function
		var update:Function = { 
		  args:[{name:"a", type:macro:String, opt:false, value:null}], // arguments
		  expr: macro {
			  var out:String = "";
			  out += a;
			  return out;
		  },
		  ret: (macro:String), // ret = return type
		}

		fields.push({
		  name: "update",
		  access: [APublic],
		  pos: Context.currentPos(),
		  kind: FieldType.FFun(update),
		});

		*/

		return fields; 
	}

#end
}