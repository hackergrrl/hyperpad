var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hyperize = require('hyper-textarea')
// var memdb = require('memdb')
var leveljs = require('level-js')
var levelup = require('levelup')
var query = require('query-string')

function getHeight () {
  var body = document.body
  var html = document.documentElement

  // return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
  return document.body.clientHeight - 115
}

var ta = document.getElementById('pad')
ta.setAttribute('placeholder', 'Write your brilliant things here! ♥')
ta.style.width = "100%"
ta.style.height = getHeight() + 'px'

onresize = function () {
  ta.style.width = "100%"
  ta.style.height = getHeight() + 'px'
}

var q = query.parse(location.search)
var doc = (''+Math.random()).substring(2, 25)
if (q.doc) {
  doc = q.doc
} else {
  window.location.href += '?doc=' + doc
}

var string = hyperize(ta, levelup('hyperpad-'+doc, { db: leveljs }))

document.getElementById('title').innerHTML = 'Untitled ' + doc

var hub = signalhub('hyperpad-' + doc, [
  'https://signalhub.mafintosh.com'
])

var sw = swarm(hub)

sw.on('peer', function (peer, id) {
  console.log('connected to a new peer:', id)
  var r = string.createReplicationStream({ live: true })
  r.pipe(peer).pipe(r)
})

sw.on('disconnect', function (peer, id) {
  console.log('disconnected from a peer:', id)
})
