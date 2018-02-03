package;
import tink.cli.*;
import tink.Cli;


/**
 * simple commandline stresstest of peote-net
 * by Sylvio Sell, Rostock 2018
 * 
 **/
import test.Stress;


class MainCli 
{
	
	static function main()
	{
		var test = new Stress("localhost", 7680, function(s:String, type:Int, nr:Int) {trace(s);}, 0, 1, "testserver", 10);
		//Cli.process(Sys.args(), new PeoteNetTest()).handle(Cli.exit);
	}
	
}

@:alias(false)
class PeoteNetTest {
	// ---------------- Commandline Parameters
	@:flag('-s')
	public var maxServers:Int;
	
	@:flag('-c')
	public var maxClients:Int;
	
	// --------------------------------------
	var host:String = "localhost";
	var port:Int = 7680;
	var channelName:String = "testserver";
	var maxChannel:Int = 10; // try testserver0, testserver1, testserver2 ...
	
	var test:Stress;
	public function new() {}

	@:defaultCommand
	public function run(rest:Rest<String>) {
		//Sys.println('maxServers: $maxServers');
		//Sys.println('maxClients: $maxClients');
		//Sys.println('rest: $rest');
		
		// do it
		test = new Stress(host, port, log, maxServers, maxClients, channelName, maxChannel);
	}
	
	public function log(s:String, type:Int, nr:Int):Void {
		trace(s);
		// TODO: use good lib for colored output here
	}

}
