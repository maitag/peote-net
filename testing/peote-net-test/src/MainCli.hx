package;

using tink.CoreApi;
#if macro
using tink.MacroApi;
#end

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
		var peoteNetTest = new PeoteNetTest();
		Cli.process(Sys.args(), peoteNetTest).handle(
			function(result:Outcome<Noise, Error>) {
				switch result
				{
					case Success(_): //Sys.exit(0);
					case Failure(e):
						var message = "\nError while parsing commandline parameters: " + e.message;
						if(e.data != null) message += ', ${e.data}';
						Sys.println(message);
						peoteNetTest.doc(); 
						Sys.exit(e.code);
				}
			}
		);
	}
	
}

@:alias(false)
class PeoteNetTest {
	// ---------------- Commandline Parameters
	/**
		maximum Servers to spawn
		*
	**/
	@:flag('--maxServers','-s') @:alias(false)
	public var maxServers:Int = 0;
	
	/**
		maximum Clients to spawn		
		*
	**/
	@:flag('--maxClients','-c') @:alias(false)
	public var maxClients:Int = 0;
	
	/**
		minimum number of random Bytes to send per chunk		
		*
	**/
	@:flag('--minBytes','-min') @:alias(false)
	public var minBytes:Int = 1;
	
	/**
		maximum number of random Bytes to send per chunk		
		*
	**/
	@:flag('--maxBytes','-max') @:alias(false)
	public var maxBytes:Int = 32768;
	
	/**
		host/ip of the running peote-server
		*
	**/
	@:flag('--host', '-o') @:alias(false)
	public var host:String = "localhost";
	
	/**
		port of running peote-server
		*
	**/
	@:flag('--port', '-p') @:alias(false)
	public var port:Int = 7680;
	
	/**
		name of the channels to create (default is "testserver")		
		*
	**/
	@:flag('--channelName', '-n') @:alias(false)
	public var channelName:String = "testserver";
	
	/**
		max channels to try enter/create ("testserver0", "testserver1", ... "testserver10" default is 10)		
		*
	**/
	@:flag('--maxChannel', '-m') @:alias(false)
	public var maxChannel:Int = 10;
	
	/**
		delay time in milliseconds between send(client)/resend(server) of data-chunk
		*
	**/
	@:flag('--delayTime', '-d') @:alias(false)
	public var delayTime:Int = 0;
	
	/**
		 prints out amount of bytes each send/recieve of data-chunk 
		*
	**/
	@:flag('--verbose', '-v') @:alias(false)
	public var verbose:Bool = false;
	
	/**
		stop the client/server on error		
		*
	**/
	@:flag('--stopOnError', '-e') @:alias(false)
	public var stopOnError:Bool = false;
	
	/**
		print this help
	**/
	@:flag('--help','-h') @:alias(false)
	public var help:Bool = false;
	// --------------------------------------
	
	var test:Stress;
	public function new() {}

	/**
		Little tool that spawns multiple server and clients for testing stability of peote-net.
		(https://github.com/maitag/peote-net)
		
		Clients tryes to connect a server to repetitive sending random bytes to it.
		Server sends same data back to let the Client check for integrity.
		Client will repeat if not data get lost, otherwise it stops with an error message.

		Before get starting you need to run a peote-server. 
		(https://github.com/maitag/peote-server)
	**/
	@:defaultCommand
	public function stress(rest:Rest<String>) {
		if (help) doc();
		else {
			Sys.println('channelName: $channelName');
			//Sys.println('rest: $rest');
			
			if (maxServers == 0 && maxClients == 0) maxServers = 1;
			
			test = new Stress(host, port, log, maxServers, maxClients, 
							  channelName, maxChannel, minBytes, maxBytes,
							  delayTime, verbose, stopOnError);
		}
	}
	
	public function log(s:String, type:Int, nr:Int):Void {
		Sys.println('$s');
		// TODO: using good lib for colored output here
	}
	
	public function doc():Void {
		Sys.println(Cli.getDoc(this));
	}

}
