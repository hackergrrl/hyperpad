var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hyperize = require('hyper-textarea')
var memdb = require('memdb')
var query = require('query-string')

var ta = document.createElement('textarea')
// ta.setAttribute('cols', 80)
// ta.setAttribute('rows', 24)
document.body.appendChild(ta)
ta.style.width = '100%'
ta.style.height = '100%'

onresize = function () {
  ta.style.width = '100%'
  ta.style.height = '100%'
}

var string = hyperize(ta, memdb())

var q = query.parse(location.search)
var doc = (''+Math.random()).substring(2, 25)
if (q.doc) {
  doc = q.doc
} else {
  window.location.href += '?doc=' + doc
}

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
