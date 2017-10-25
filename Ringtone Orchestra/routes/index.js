var express = require('express');
var router = express.Router();

var db = require('../models/db');
var raccoon = require('../models/raccoon');
var osc = require("osc");

var udpPort = new osc.UDPPort({
    // This is the port we're listening on.
    localAddress: "127.0.0.1",
    localPort: 57121,

    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120
});

udpPort.open();

router.get('/effects', function(req, res) {
  var msg = {
        address: "/play/effect",
        args: [req.cookies.id]
    };

    console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
    console.log("effect sending ok");
    res.json(0);
});


router.get('/startplay', function(req, res) {
  var msg = {
        address: "/play/playing",
        args: [req.cookies.id, 1]
    };

    console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
    console.log("play sending ok");
    res.json(0);
});

router.get('/endplay', function(req, res) {
  var msg = {
        address: "/play/playing",
        args: [req.cookies.id, 0]
    };

    console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
    console.log("end sending ok");
    res.json(0);
});

router.get('/volumeUp', function(req, res) {
  var msg = {
        address: "/play/volume",
        args: [req.cookies.id, 1]
    };

    console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
    console.log("volumeup sending ok");
    res.json(0);
});

router.get('/volumeDown', function(req, res) {
  var msg = {
        address: "/play/volume",
        args: [req.cookies.id, 0]
    };

    console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
    console.log("volumedown sending ok");
    res.json(0);
});

router.get('/beatUp', function(req, res) {
  var msg = {
        address: "/play/beat",
        args: [req.cookies.id, 1]
    };

    console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
    console.log("beatup sending ok");
    res.json(0);
});

router.get('/beatDown', function(req, res) {
  var msg = {
        address: "/play/beat",
        args: [req.cookies.id, 0]
    };

    console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
    console.log("beatDown sending ok");
    res.json(0);
});

router.get('/tuneUp', function(req, res) {
  var msg = {
        address: "/play/tune",
        args: [req.cookies.id, 1]
    };

    console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
    console.log("tuneup sending ok");
    res.json(0);
});

router.get('/tuneDown', function(req, res) {
  var msg = {
        address: "/play/tune",
        args: [req.cookies.id, 0]
    };

    console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    udpPort.send(msg);
    console.log("tunedown sending ok");
    res.json(0);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'XoX' }); 
});

module.exports = router;
