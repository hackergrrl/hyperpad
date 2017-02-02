var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hyperize = require('hyper-textarea')
var hstring = require('hyper-string')
var memdown = require('memdown')
var down = require('level-js')
var levelup = require('levelup')
var query = require('query-string')
var debug = console.log//require('debug')('hyperpad')
var eos = require('end-of-stream')
var hyperlog = require('hyperlog')

function getHeight () {
  var body = document.body
  var html = document.documentElement

  return document.body.clientHeight - 115
}

var ta = document.getElementById('pad')
ta.style.width = "100%"
ta.style.height = getHeight() + 'px'

onresize = function () {
  ta.style.width = "100%"
  ta.style.height = getHeight() + 'px'
}

onNewPad = function () {
  window.open(window.location.href.substring(0, window.location.href.indexOf('?')))
}

var q = query.parse(location.search)
var doc = 'Untitled_' + (''+Math.random()).substring(2, 25)
if (q.doc) {
  doc = q.doc
} else {
  window.location.href += '?doc=' + doc
}

// var string = hstring(levelup('hyperpad-'+doc, { db: down }))
// var string = hstring(levelup('hyperpad-'+doc, { db: memdown }))
var indexDb = levelup('hyperpad-'+doc, { db: down })
var memDb = levelup('hyperpad-'+doc, { db: memdown })
var string = hstring(memDb)
var storageLog = hyperlog(indexDb, string.log.valueEncoding)

var r = storageLog.replicate({ live: true })
var s = string.log.replicate({ live: true })
r.pipe(s).pipe(r)

r.on('end', function () {
  console.log('replication /w indexeddb log ended!')
})
r.on('error', function (err) {
  console.log('replication /w indexeddb log ended: ' + err)
})

hyperize(ta, string)

document.getElementById('title').innerHTML = doc

var hub = signalhub('hyperpad-' + doc, [
  'http://eight45.net:9400',
  // 'http://localhost:2500'
  // 'https://signalhub.mafintosh.com'
])

var rtcConfig = {
  "iceServers": [
    {
      "urls": "stun:23.21.150.121"
    },
    {
      "username": "a03c3482a5ac94f85f98bf6478c7b779ed1c45756798f5246e870741ef0cda04",
      "credential": "EIveHo0aA0i8WuCepOoWNGopB4LYxI72013GBv35ZGA=",
      "urls": "turn:global.turn.twilio.com:3478?transport=udp"
    },
    {
      "username": "a03c3482a5ac94f85f98bf6478c7b779ed1c45756798f5246e870741ef0cda04",
      "credential": "EIveHo0aA0i8WuCepOoWNGopB4LYxI72013GBv35ZGA=",
      "urls": "turn:global.turn.twilio.com:3478?transport=tcp"
    },
    {
      "username": "a03c3482a5ac94f85f98bf6478c7b779ed1c45756798f5246e870741ef0cda04",
      "credential": "EIveHo0aA0i8WuCepOoWNGopB4LYxI72013GBv35ZGA=",
      "urls": "turn:global.turn.twilio.com:443?transport=tcp"
    }
  ]
}

var sw = swarm(hub, {
  config: rtcConfig
})
sw.on('peer', function (peer, id) {
  debug('replicating to a new peer:', id)

  var r = string.createReplicationStream({ live: true })
  eos(r, end)
  eos(peer, end)
  r.pipe(peer).pipe(r)

  function end (err) {
    debug('replication stream ended:', err)
  }
})

sw.on('disconnect', function (peer, id) {
  debug('disconnected from a peer:', id)
})

sw.on('close', function () {
  debug('signalhub connection lost')
})

