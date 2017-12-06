/* Ringtone Orchestra - melody
  *   by Shuqi Dai
  */

// nokia
~melody[3] = Pbind(
	\instrument, "plucking",
	\degree, Pseq([8, 7, 2, 3, 6, 5, 0, 1, 5, 4, -1, 1, 4], inf) + Pfunc({~tune[3]}),
	\dur, Pseq([Pseq([1/4, 1/4, 1/2, 1/2], 3),3/2],inf)*1/2,
	\amp, 0.2 + Pfunc({~volume[3]}),
	\tempo, Pfunc({~beat[3]}),
);

// pure ring
~melody[2] = Pbind(
	\instrument, "ring1",
	\dur, Pseq([1/16, 1/16, 1/2], inf),
	\freq, 200+ Pfunc({~tune[2]})*10 ,
	\amp, 0.2 + Pfunc({~volume[2]}),
	\tempo,  Pfunc({~beat[2]}),
);

// iphone marimba
~melody[1] = Pbind(
	\degree, Pseq([4, 2, [6, 9], 2, 6, [7, 11], 6, 2, [7, 11], 6, 2, [6, 9]] , inf) + Pfunc({~tune[1]}),
	\dur, Pseq([Pn(1/6, 11), 2/3],inf),
	\amp, 0.2 + Pfunc({~volume[1]}),
	\tempo, Pfunc({~beat[1]}),
);

// iphone opening
~melody[0] = Pbind(
	//\instrument, "piano",
	\note, Pseq([12, 9, 6, 12, 4, 12, 10, 12, 4, \rest, 6, 6, 9, 12] , inf) + Pfunc({~tune[0]}),
	\dur, Pseq([1/4, 1/4, Pn(1/2, 7), 1, 1, Pn(1/2, 3)],inf)*1/2,
	\amp, 0.2 + Pfunc({~volume[0]}),
	\tempo, Pfunc({~beat[0]}),
);

// effects
// nokia
~effect1[3] = Pbind(
	\instrument,  Prand([~effect[0], ~effect[1]],inf),
	\degree, Pseq([8, 7, 2, 3, 6, 5, 0, 1, 5, 4, -1, 1, 4], inf) + Pfunc({~tune[3]}),
	\dur, Pseq([Pseq([1/4, 1/4, 1/2, 1/2], 3),3/2],inf)*1/2,
	\amp, 0.2 + Pfunc({~volume[3]}),
	\tempo, Pfunc({~beat[3]}),
);

// pure ring
~effect1[2] = Pbind(
	\instrument,   Prand([~effect[2], ~effect[3]],inf),
	\dur, Pseq([1/16, 1/16, 1/4], inf) + Pfunc({~tune[2]}),
	\freq, 500,
	\amp, 0.2 + Pfunc({~volume[2]}),
	\tempo,  Pfunc({~beat[2]}),
);

// iphone marimba
~effect1[1] = Pbind(
	\instrument,  Prand(~instruments, inf),
	\degree, Pseq([4, 2, [6, 9], 2, 6, [7, 11], 6, 2, [7, 11], 6, 2, [6, 9]] , inf) + Pfunc({~tune[1]}),
	\dur, Pseq([Pn(1/6, 11), 2/3],inf),
	\amp, 0.2 + Pfunc({~volume[1]}),
	\tempo, Pfunc({~beat[1]}),
);

// iphone opening
~effect1[0] = Pbind(
	\instrument,   Prand(~instruments, inf),
	\note, Pseq([12, 9, 6, 12, 4, 12, 10, 12, 4, \rest, 6, 6, 9, 12] , inf) + Pfunc({~tune[0]}),
	\dur, Pseq([1/4, 1/4, Pn(1/2, 7), 1, 1, Pn(1/2, 3)],inf)*1/2,
	\amp, 0.2 + Pfunc({~volume[0]}),
	\tempo, Pfunc({~beat[0]}),
);