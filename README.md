# hyperpad

> The peer-to-peer collaborative text editor.

**WIP Demo**: http://pad.eight45.net

## Current Status

First alpha release: *it works*! Desktop Chrome users can edit documents on- and
off-line, and collaborate with others in real-time. Firefox is known to have
some issues, and other browsers and mobile are untested.

## What is it?

Hyperpad is a free, open source, distributed text editor for use by groups and
individuals. Document authors control who gets access, and nobody needs to pay
for perpetual server hosting. No technical know-how is required beyond opening
up http://hyperpad.io and writing a document.

## Why another collaborative editor?

Some of the most popular collaborative document editors today include [Google
Docs](https://www.google.com/docs/about/) and [Etherpad](http://etherpad.org/).

Google Docs gets the fundamental piece right: real-time text editing. However,
all of your data is stored by and readable by Google, Inc. It is closed source
proprietary software.

Etherpad takes this a step further in multiple directions: it is [open
source](https://github.com/ether/etherpad-lite), and can be deployed by anyone
on any server. This lets any individual or group run etherpad and keep ownership
and privacy to their data.

Etherpad is most of the way there, but falls short in two ways:

1. The individual or group must have a) the resources and b) the technical
   knowledge to perpetually pay for and operate a server running the etherpad
   software. Those without the resources or knowledge must resort to using a
   "public pad", like [Mozilla's](https://public.etherpad-mozilla.org/). This is
   an excellent altruistic service, but these pads are public, and Mozilla could
   lose your data or decide to not run the service at any time.
2. Users *must* have an active internet connection in order to participate. The
   software becomes useless if an author is in a rural area or in transit on a
   train, plane, or subway.

## How does it work?

Hyperpad relies on the browser itself for storing documents, and powerful
peer-to-peer primitives like
[WebRTC](https://developer.mozilla.org/en-US/docs/Web/Guide/API/WebRTC) and
[hyperlog](https://github.com/mafintosh/hyperlog) to organize and transfer
documents to those with access.

The act of having a document open in your browser immediately lets a user act
like a host for that document's data, sharing it in real-time with others with
others. In the case that a user is offline, they can still freely make edits
locally, which will propagate to others storing the document when they
re-establish a network connection.

Hyperpad is built in a modular fashion atop a set of do-one-thing-well modules:

- [hyper-textarea](https://github.com/noffle/hyper-textarea): back a textarea
  with a hyper-string for conflict-free p2p replication
- [hyper-string](https://github.com/noffle/hyper-string): a conflict-free p2p
  string data structure
- [textarea-op-stream](https://github.com/noffle/textarea-op-stream): readable
  stream of a textarea's inserts and deletes
- lots of great modules from [mafintosh](https://github.com/mafintosh/):
  [hyperlog](https://github.com/mafintosh/hyperlog),
  [signalhub](https://github.com/mafintosh/signalhub), and others!

## License

ISC
