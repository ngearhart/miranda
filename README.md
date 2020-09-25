---
This repository is no longer maintained. Feel free to use it for reference, but this is one of my first large coding projects and there are definitely bits that could use some cleanup.

---

<h1 id="miranda">Miranda</h1>
<p>A smart IoT interface for a Raspberry Pi.</p>
<h2 id="what-is-miranda">What is Miranda?</h2>
<p>Miranda is <s>a bunch of if statements</s> an AI that controls basic home automation tasks. It mostly runs on a Raspberry Pi, but uses AWS to allow control from anywhere, especially when a firewall blocks a normal web server. AWS acts as the server, and the RPi just sends it data occasionally.</p>
<h2 id="how-does-it-work">How does it work?</h2>
<p>The server and clients work in tandem to provide the services.</p>
<div class="mermaid"><svg xmlns="http://www.w3.org/2000/svg" id="mermaid-svg-bNkerOb0tOKdF4I3" height="100%" width="100%" style="max-width:900px;" viewBox="-50 -10 900 426"><g></g><g><line id="actor1441" x1="75" y1="5" x2="75" y2="415" class="actor-line" stroke-width="0.5px" stroke="#999"></line><rect x="0" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="75" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle;"><tspan x="75" dy="0">Raspberry Pi</tspan></text></g><g><line id="actor1442" x1="275" y1="5" x2="275" y2="415" class="actor-line" stroke-width="0.5px" stroke="#999"></line><rect x="200" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="275" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle;"><tspan x="275" dy="0">NodeJS Backend</tspan></text></g><g><line id="actor1443" x1="475" y1="5" x2="475" y2="415" class="actor-line" stroke-width="0.5px" stroke="#999"></line><rect x="400" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="475" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle;"><tspan x="475" dy="0">Angular Frontend</tspan></text></g><defs><marker id="arrowhead" refX="5" refY="2" markerWidth="6" markerHeight="4" orient="auto"><path d="M 0,0 V 4 L6,2 Z"></path></marker></defs><defs><marker id="crosshead" markerWidth="15" markerHeight="8" orient="auto" refX="16" refY="4"><path fill="black" stroke="#000000" stroke-width="1px" d="M 9,2 V 6 L16,4 Z" style="stroke-dasharray: 0, 0;"></path><path fill="none" stroke="#000000" stroke-width="1px" d="M 0,1 L 6,7 M 6,1 L 0,7" style="stroke-dasharray: 0, 0;"></path></marker></defs><g><text x="175" y="93" class="messageText" style="text-anchor: middle;">Events, like door entry</text><line x1="75" y1="100" x2="275" y2="100" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line></g><g><text x="175" y="128" class="messageText" style="text-anchor: middle;">Database lookups</text><line x1="275" y1="135" x2="75" y2="135" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line></g><g><text x="175" y="163" class="messageText" style="text-anchor: middle;">Scheduled events, like lights</text><line x1="275" y1="170" x2="75" y2="170" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line></g><g><text x="375" y="198" class="messageText" style="text-anchor: middle;">Database requests</text><line x1="275" y1="205" x2="475" y2="205" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line></g><g><text x="275" y="233" class="messageText" style="text-anchor: middle;">User commands</text><line x1="475" y1="240" x2="75" y2="240" class="messageLine1" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="stroke-dasharray: 3, 3; fill: none;"></line></g><g><rect x="500" y="250" fill="#EDF2AE" stroke="#666" width="300" height="80" rx="0" ry="0" class="note"></rect></g><g><text x="516" y="280" fill="black" class="noteText"><tspan x="516">The user commands are send through the</tspan><tspan dy="23" x="516">backend then to the RPi, not directly from</tspan><tspan dy="23" x="516">the frontend.</tspan></text></g><g><rect x="0" y="350" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="75" y="382.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle;"><tspan x="75" dy="0">Raspberry Pi</tspan></text></g><g><rect x="200" y="350" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="275" y="382.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle;"><tspan x="275" dy="0">NodeJS Backend</tspan></text></g><g><rect x="400" y="350" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect><text x="475" y="382.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle;"><tspan x="475" dy="0">Angular Frontend</tspan></text></g></svg></div>

