package;

import test.Alice;


#if lime
import lime.app.Application;
class Main extends Application {
	public function new () { super ();
#else
class Main {
	public static function main() {
#end
		
		// not changed by macro
		var alice = new Alice();
		alice.send("test");
		
		// changed by macro
		var aliceRemote= new Alice<"remote">();
		aliceRemote.send("test");
		
		
		
	}
	

	
	
	
}

