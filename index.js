var swarm = require('webrtc-swarm')
var signalhub = require('signalhub')
var hyperize = require('./')
var memdb = require('memdb')

document.body.innerHTML = ''

var ta = document.createElement('textarea')
ta.setAttribute('cols', 80)
ta.setAttribute('rows', 8)
document.body.appendChild(ta)
var string = hyperize(ta, memdb())


var hub = signalhub('hyper-textarea', [
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
