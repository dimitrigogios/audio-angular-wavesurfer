<!DOCTYPE html>
<?php
    include_once("../../common.inc.php");
    $pageId = 10;
?> 
<html lang="en">
    <head>
        <title>Dimiri Gogios - An AngularJS example for Audio elements, featuring Wavesurfer.js </title>
        <?php
            include_once(ROOT."includes/shared/code-block-header.php");
        ?>

        <!--
            include audio-app file, can be minified from gruntfile
        -->
        <script src="origin/js/components/wavesurfer/wavesurfer.min.js"></script>
        <script src="properties/js/audio-app.js"></script>
        <!--
            include styles
        -->
        <link rel="stylesheet" type="text/css" href="properties/css/style.css">

    </head>
    <body class="block code-block relative" ng-app="audio">
        <?php  
            include_once(ROOT."includes/shared/body.php");
        ?>
        <div class="menu h100 fixed z1 collapsed" data-document="false">
            <?php  
                include(ROOT."includes/shared/menu-list.php");
            ?>
        </div>
        <div class="site-content w100 relative z2">
            <nav class="navigation z2 s-buff-top s-buff-bottom">
                <? 
                    //navigation included
                    include_once(ROOT."includes/shared/navigation-element.php");
                ?>
            </nav>
            <a name="to-top"></a>

            <div class="block">
                <div class="box is-relative z1 m-buff-right m-buff-left t-buff-right t-buff-left">
                    <div class="line no-margin">
                        <header>
                            <h1 itemprop="name">
                                Angular Audio element, featuring wavesurfer.js
                            </h1>
                        </header>
                        <p>
                            <span itemscope="" itemprop="author">
                                by <span itemprop="name" class="semi-bold">Dimitri Gogios</span>
                            </span>
                        </p>
                        <hr class="s-blank-space no-border">
                        <div class="w100" ng-controller="audiolist-ctrl">
                            <div class="wavesurfer float-left w100"></div>
                            <div class="audio-wrapper w50 m-w100 trailing07" ng-repeat="(key,val) in audioList" ng-class-odd="'st-buff-right'" ng-class-even="'st-buff-left'" ng-mouseup="deactivatePlayhead(val.id, $event)">
                                <div class="audio-track block overflow" data-id="{{key}}" data-url="{{val.audiourl}}">
                                    <div class="w100 relative pointer timeline timeline-{{val.id}}" id="timeline-{{val.id}}" ng-click="timeLineClick(val.id, $event)" ng-mousemove="dragPlayhead(val.id, $event)">
                                        <span id="line-{{val.id}}" class="progress-line absolute"></span><div class="playhead relative block pointer" id="playhead-{{val.id}}" ng-mousedown="activatePlayhead(val.id, $event)"></div>
                                    </div>
                                    <div class="audio-title w20 semi-bold">{{val.title}}</div>
                                    <div class="w80 audio-ctrls" id="audio-ctrls-{{val.id}}" data-current-time="0" data-voicedemo="{{val.audiourl}}" get-duration>
                                        <!-- If you want a fallback to IE 8/9.. But you probably won't, eh !!
                                            <div class="v-ctrl hide text-center" id="v-{{val.id}}">
                                                <audio id="audio-{{val.id}}" preload controls>
                                                    <source ng-src='{{trustSrc(val.audiourl)}}' type="audio/mpeg" />
                                                </audio>
                                            </div>
                                        -->
                                        <div class="audio-buttons text-center">
                                            <span class="fastbackward-btn inline-block pointer relative s-buff-right" data-audioid="v-audio-{{val.id}}" ng-click="fastBackward(val.id)"><i class="fa fa-backward"></i></span>
                                            <span class="play-btn inline-block pointer" id="play-{{val.id}}" ng-click="play(val.audiourl, val.id, $event)"><i class="fa fa-play"></i></span>
                                            <span class="pause-btn inline-block pointer hide" id="pause-{{val.id}}" ng-click="pause(val.id, $event)"><i class="fa fa-pause"></i></span>
                                            <span class="fastforward-btn inline-block pointer relative s-buff-left" data-audioid="v-audio-{{val.id}}" ng-click="fastForward(val.id)"><i class="fa fa-forward"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="w100">
                            <hr class="s-blank-space no-border">
                            <div class="w80 m-w100 t-buff-right">
                                <article itemprop="articleBody">
                                    <h2>
                                        Why my awesome Audio Angular controller
                                    </h2>
                                    <p>
                                        I wanted to mess around a bit with the html audio element. Build my own audio controls, timeline-scroller, forward-, backward- , pause- and play buttons. A premise was also that the list of would-be-audio elements was loaded with AngularJS.<br />
                                        There are some audio plugins and audio code examples out there, but I couldn't find custom audio controls that could work out of the box on an Angular loaded list, especially the bit about the timeline control.<br/>
                                        The play and the pause buttons wasn't in them selves that difficult to handle it was updating the timeline control to the specific audio element that was playing.<br/>
                                        So.
                                        <br/>
                                        <br/>
                                    </p>
                                    <h3>
                                        Finding code examples to work for my Audio Angular controller
                                    </h3>
                                    <p>
                                        For the audio controls I found a fairly easy-to-understand example on CodePen to work with, by Alex Katz, and another really nice audio plugin, wavesurfer.js by katspaugh, giving me better callback events to work with. <span class="size12">(se my <a href="https://github.com/dimitrigogios" target="_blank">github</a> for credits)</span><br/>
                                        After a bit of time of tumbling with the code I mixed all the code together and got a working Angular loaded list of audio elements.
                                    </p>
                                </article>
                            </div>
                            <hr class="s-blank-space t-hide dl-hide dxl-hide no-border" />
                            <div class="w20 m-w100 float-right t-buff-left">
                                <? 
                                    //navigation included
                                    include_once(ROOT."includes/shared/right-column.php");
                                ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <footer class="footer absolute bottom0 w100 s-text z2">
            <? 
                //script loaded before /body
                include_once(ROOT."includes/shared/footer-element.php");
            ?>
        </footer>
    </body>
</html>
