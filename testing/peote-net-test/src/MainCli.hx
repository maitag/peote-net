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
		Cli.process(Sys.args(), new PeoteNetTest()).handle(function(o) {});
	}
	
}

@:alias(false)
class PeoteNetTest {
	// ---------------- Commandline Parameters
	@:flag('-s')
	public var maxServers:Int = 0;
	
	@:flag('-c')
	public var maxClients:Int = 0;
	
	@:flag('-min')
	public var minBytes:Int = 1;
	//public var minBytes:Int = 65535;//-> TODO: why max 65536 not work ?
	
	@:flag('-max')
	public var maxBytes:Int = 65535;//-> TODO: why max 65536 not work ?
	
	// --------------------------------------
	var host:String = "localhost";
	var port:Int = 7680;
	var channelName:String = "testserver";
	var maxChannel:Int = 10; // try testserver0, testserver1, testserver2 ...
	
	var test:Stress;
	public function new() {}

	@:defaultCommand
	public function run(rest:Rest<String>) {
		//Sys.println('minBytes: $minBytes');
		//Sys.println('rest: $rest');
		
		if (maxServers == 0 && maxClients == 0) maxServers = 1;
		
		test = new Stress(host, port, log, maxServers, maxClients, channelName, maxChannel, minBytes, maxBytes);
	}
	
	public function log(s:String, type:Int, nr:Int):Void {
		Sys.println('$s');
		// TODO: use good lib for colored output here
	}

}
