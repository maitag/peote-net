package peote.net;

enum abstract Reason(Int) from Int to Int
{
	var DISCONNECT = 0; // disconnected from peote-server (channel-owner/user)
	var CLOSE      = 1; // owner closed channel or user leaves
	var KICK       = 2; // user was kicked by channel-owner (TODO!!!)

	var ID         = 10; // can't enter/open channel with this id (server: wrong id or already used, client: no chan with this id)
	var FULL       = 11; // channel is full (max of 256 users already connected) (max is 128)
	var MAX        = 12; // server created or client joined to much channels on this server (max is 128)

	var MALICIOUS  = 20; // malicious input

	@:to public function toString():String {
		return switch(this)
		{
			case DISCONNECT : "DISCONNECT"; 
			case CLOSE      : "CLOSE"; 
			case KICK       : "KICK"; // not yet implemented !!!

			case ID         : "ID"; 
			case FULL       : "FULL"; 
			case MAX        : "MAX"; 

			case MALICIOUS  : "MALICIOUS";

			default: "unknown";
		}
	}
}
