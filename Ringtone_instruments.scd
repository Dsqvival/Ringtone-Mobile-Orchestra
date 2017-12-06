/* Ringtone Orchestra - Instruments
  *   by Shuqi Dai
  */

{ | dur = 0.15, atk = 0.005, amp = 1 |
	SinOsc.ar(
		EnvGen.ar( Env(
			NamedControl.kr(\freq_l, [2960, 70, 90]),
			NamedControl.kr(\freq_d, [0.07, 0.2]),
			NamedControl.kr(\freq_c, [-13, -1]),
		) ),
		mul:amp * EnvGen.ar(
			Env.perc( atk, dur - atk, curve: NamedControl.kr(\amp_c, [-1, 6])),
			doneAction: 2
		);
	) ! 2;
}.asSynthDef.name_("kick").add;

{ | atk = 0.01, dur = 0.15, freq = 50, amp=0.8 |
	BPF.ar(LFSaw.ar(freq), freq, 2, mul: EnvGen.kr( Env.perc( atk, dur-atk, amp, 6 ), doneAction: 2 )) ! 2;
}.asSynthDef.name_("bass").add;

{ | dur = 0.15, freq = 50, amp = 0.8, index = 10 |
	PMOsc.ar(freq, freq + 5, index, mul: amp * EnvGen.kr( Env.triangle( dur ), doneAction: 2 )) ! 2;
}.asSynthDef.name_("bazz").add;

SynthDef("hihat", {arg out = 0, amp = 0.5, att = 0.01, rel = 0.2, ffreq = 6000, pan = 0;
    var snd = WhiteNoise.ar(amp);
    var env = Env.perc(att, rel).kr(doneAction: 2);
    snd = HPF.ar(snd * env, ffreq);
    Out.ar(out, Pan2.ar(snd, pan));
}).add;

SynthDef("snare", {arg out = 0, amp = 0.1, sinfreq = 180, att = 0.01, rel = 0.2, ffreq = 2000, pan = 0;
    var snd1 = WhiteNoise.ar(amp);
    var snd2 = SinOsc.ar(sinfreq,0,amp);
    var env = EnvGen.kr(Env.perc(att, rel), doneAction: 2);
    var sum = HPF.ar(snd1 * env, ffreq)+(snd2*env);
    Out.ar(out, Pan2.ar(sum, pan));
}).add;

SynthDef("plucking", {arg amp = 0.1, freq = 440, decay = 5, dampen = 0.1;
             var env, snd;
            env = Env.linen(0, decay, 0).kr(doneAction: 2);
            snd = Pluck.ar(
                in: WhiteNoise.ar(amp),
                trig: Impulse.kr(0),
                maxdelaytime: 0.1,
                delaytime: freq.reciprocal,
                decaytime: decay,
                coef: dampen);
                Out.ar(0, [snd, snd]);
}).add;

SynthDef(\basicFM, {|out = 0, gate = 1, amp = 1, carFreq = 1000, modFreq = 100, modAmount = 2000, clipAmount = 0.1|
		var modEnv = EnvGen.ar(Env.adsr(0.5, 0.5, 0.7, 0.1, peakLevel: modAmount), gate);
		var mod = SinOsc.ar(modFreq) * modEnv;
		var car = SinOsc.ar(carFreq + mod);
		var ampEnv = EnvGen.ar(Env.adsr(0.1, 0.3, 0.7, 0.2, peakLevel: amp), gate, doneAction: 2);
		var clip = clipAmount * 500;
		Out.ar(out, (car * ampEnv * clip).clip(-0.7, 0.7) * 0.1);
	}).add;

SynthDef(\scansynth1, { arg out=0, amp=0.1, gate=1, pan=0, freq=200;
    var in, ou;
    var spring = (0.12).dup(40);
    var damp = (0.0564812).dup(40);
    var springs;
    var sel;
    in = LPF.ar(LocalIn.ar(1), XLine.ar(1,10,0.3)) * 0.97 + (LPF.ar(Trig.ar(gate, 0.01),200) * WhiteNoise.ar.range(0.98,1));
    ou = in;
    springs = spring.collect { arg spr, i;
        ou = Spring.ar(ou, spr, damp[i]);
    };
    LocalOut.ar(ou);
    sel = VarSaw.ar(freq * [0.999,1,0.499,2,1.01] * 0.5, width: LFNoise2.ar(1/2).range(0.2,0.5)).range(0, spring.size-1);
    ou = Splay.ar(SelectX.ar(sel, springs), 1);
    ou = ou * EnvGen.ar(\adsr.kr(Env.adsr(0.3,0.1,0.8,0.1)),gate,doneAction:2);
    ou = Pan2.ar(ou, pan, amp);
    Out.ar(out, ou);
}).add;

SynthDef(
	"ring1", {
		arg freq = 440, amp = 0.1;
		var env, snd;
		env = Env.perc.kr(doneActino: 2);
		snd = Saw.ar(freq: freq * [1, 1.5], mul:env);
		Out.ar(0, snd);
	}
).add;

/*
SynthDef(\piano, {
    |out = 0, vel = 100, freq = 100, gate = 1, amp = 0.1|
    var snd;
    snd = MdaPiano.ar(freq, gate, vel, 0.8, 0.8);
    snd = snd * EnvGen.kr(Env.asr(0, 1, 0.1), gate, doneAction: 2);
    Out.ar(out, snd * amp);
}).add;
*/