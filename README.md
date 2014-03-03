js_popup
========

Stand-alone Inline popup library in JavaScript and CSS. 
It uses the CSS for Moxiecode's inline popups (because I am NOT an artist) 
and the basic div structure (so I can use the css).<br> 
The code, though, is all mine.<br>
<br>
Overall, this code is licensed with the LGPL 2.1 license (some portions may have other licensing arrangements. Please look at all source modules). You are free to use or modify this code in any way for your works (open or closed source), with only the following stipulations: Retain all copyright headers in the existing code, and if you make bug fixes to the existing code, we ask that you please be considerate and post your fixes to this repository as well.
<br>
<br>
The test files (popuptest.html and iframetest.html) should be more than enough documentation on how to use the library.<br>
<br>
The library supports resizing the window, dragging, adding interactions to
the buttons, enabling a status line at the bottom of the window, etc. There are
also  minimize, maximize, and a restore buttons available. These do pretty much
what you would expect them to do.<br>
<br>
All you need to do is include inlinepopups.js and then call the constructor:<br>
<br>
$handle = new Popup( x, y, width, height, title, options, contentHtml, url, parameters);<br>
<br>
Options include MIN, MAX, RESIZE, MOVE, STATUS, FOCUS, SCROLL, and MODAL, and are passed as a 
pipe delimited list. MIN and MAX show or hide those respective buttons.
MOVE allows dragging the window around. RESIZE allows the window to be resized.
STATUS shows the status bar, SCROLL enables the scroll bars, FOCUS gives the window focus,
and MODAL makes the window a modal window.<br>
<br>
You can set contentHtml or the url. If contentHtml is set, the contents will be loaded into the
window as-is. If url is set, then the page will be loaded into an iframe within the window.
Parameteres are json parameters to be passed into the iframe (including callbacks, etc). Note that
same origin policy applies. <br>
<br>
For a working demo, check out <a href='http://www.bbroerman.net/popups/popuptest.html'> This Link </a>

 
