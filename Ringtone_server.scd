(
s.boot;

~getUserID = {
  arg usr_name;
  var usr_id = -1;
  var i = 0;
		while(
			{i < 5},
			{
				if (~playerName[i] == usr_name,
					{usr_id = i; i = i + 1},
					{i = i + 1;};
				);
		});
	usr_id.postln;
};

OSCdef(
	key: '\playing',
	func: {
		arg msg;
		var usr_name = msg[1];
		var control = msg[2];
		var usr_id = ~getUserID.value(usr_name);
		if (usr_id == -1,
			{
				~playerName[~playerCount] = usr_name;
				usr_id = ~playerCount;
				~playerCount = ~playerCount + 1;
			},
			{}
		);
		if (control == 1,
			{
				usr_id.postln;
				~player[usr_id] = ~melody[usr_id].play(quant: ~q[usr_id]);
			},
			{
                ~player[usr_id].stop;
				~effectPlayer[usr_id].stop;
			}
		);
		msg.postln;},
	path: '/play/playing');

OSCdef(
	key:'\vol',
	func: {
		arg msg;
		var usr_name = msg[1];
		var control = msg[2];
		var usr_id = ~getUserID.value(usr_name);
		if (control == 1,
			{
				~volume[usr_id] = rrand(0.1, 0.5);
			},
			{
                ~volume[usr_id] = rrand(-0.1, -0.5);
			}
		) ;
		msg.postln;},
	path: '/play/volume');

OSCdef(
	key:'\beatean',
	func: {
		arg msg;
		var usr_name = msg[1];
		var control = msg[2];
		var usr_id = ~getUserID.value(usr_name);
		if (control == 1,
			{
				~beat[usr_id] = rrand(~beat[usr_id], ~beat[usr_id] + 5);
			},
			{
                ~beat[usr_id] = rrand(1, ~beat[usr_id]);
			}
		) ;
		msg.postln;},
	path: '/play/beat');

OSCdef(
	key:'\tunes',
	func: {
		arg msg;
		var usr_name = msg[1];
		var control = msg[2];
		var usr_id = ~getUserID.value(usr_name);
		if (control == 1,
			{
				~tune[usr_id] = rrand(0.5, 10.0);
			},
			{
               ~tune[usr_id] = rrand(-0.5, -10.0);
			}
		) ;
		msg.postln;},
	path: '/play/tune');

OSCdef(
	key:'\effects',
	func: {
		arg msg;
		var usr_name = msg[1];
		var usr_id = ~getUserID.value(usr_name);
		~effect[usr_id] = ~instruments[rrand(0, 8)];
		~effectPlayer[usr_id].stop;
		~effectPlayer[usr_id] = ~effect1[usr_id].play(quant: ~q[usr_id]);
		msg.postln;},
	path: '/play/effect');

OSCdef(
	key:'\args',
	func: { arg msg; msg.postln;},
	path: '/play/companiment');
)