var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hyperize = require('hyper-textarea')
// var down = require('memdb')
var down = require('level-js')
var levelup = require('levelup')
var query = require('query-string')
var debug = require('debug')('hyperpad')
var eos = require('end-of-stream')

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

var string = hyperize(ta, levelup('hyperpad-'+doc, { db: down }))

document.getElementById('title').innerHTML = doc

var hub = signalhub('hyperpad-' + doc, [
  'https://signalhub.mafintosh.com'
])

var sw = swarm(hub)
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
