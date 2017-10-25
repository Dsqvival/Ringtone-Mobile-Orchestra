(

var p, l;
p = Pipe.new("/Users/qiqi/Desktop/shaking/startnodemon");            // list directory contents in long format
l = p.getLine;                    // get the first line
while({l.notNil}, {l.postln; l = p.getLine; });    // post until l = nil
p.close;                    // close the pipe to avoid that nasty buildup
)

File.getcwd;
thisProcess.nowExecutingPath.dirname;