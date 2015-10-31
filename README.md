![Screenshot](upload/audio-angular-wavesurfer.jpg?raw=true "Screenshot")

## Why my awesome Audio Angular controller
I wanted to mess around a bit with the html audio element. Build my own audio controls, timeline-scroller, forward-, backward- , pause- and play buttons. A premise was also that the list of would-be-audio elements was loaded with AngularJS.<br />
There are some audio plugins and audio code examples out there, but I couldn't find custom audio controls that could work out of the box on an Angular loaded list, especially the bit about the timeline control.<br/>
The play and the pause buttons wasn't in them selves that difficult to handle it was updating the timeline control to the specific audio element that was playing.<br/>
So.
<br/>
<br/>
## Finding code examples to work for my Audio Angular controller
For the audio controls I found a fairly easy-to-understand example on CodePen to work with, by Alex Katz, and another really nice audio plugin, wavesurfer.js by katspaugh, giving me better callback events to work with. <span class="size12">(se my <a href="https://github.com/dimitrigogios" target="_blank">github</a> for credits)</span><br/>
After a bit of time of tumbling with the code I mixed all the code together and got a working Angular loaded list of audio elements.

## Wavesurfer.js
If you want to see the documentation for the cool wavesurfer.js plugin, you can visit [Katspaugh](https://github.com/katspaugh/wavesurfer.js/)'s repository

## Credits

Custom html5 audio controls by <br/>
[Alex Katz](http://codepen.io/katzkode/pen/Kfgix)

Wavesurfer.js plugin by<br/>
[Katspaugh](https://github.com/katspaugh/wavesurfer.js/)

## License

![cc-by](https://i.creativecommons.org/l/by/3.0/88x31.png)

This work is licensed under a
[Creative Commons Attribution 3.0 Unported License](https://creativecommons.org/licenses/by/3.0/deed.en_US).

