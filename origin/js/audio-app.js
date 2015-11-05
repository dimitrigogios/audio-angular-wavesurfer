;(function($, exports) {
    
    'use strict';

    var app = angular.module('audio', [
        'ngRoute',
        'audiolistControllers'
    ]);

    var audiolistControllers = angular.module('audiolistControllers', ['ngRoute']);

    audiolistControllers
    .controller('audiolist-ctrl', ['$scope', '$http', 'audioListService', '$sce', '$timeout', function($scope, $http, audioListService, $sce, $timeout) {
        // set of used variables
        var activeUrl = null,
            activeId = null,
            audio_is_playing = false,
            duration,
            timeline,
            timelineWidth,
            timeLineOffsetleft,
            line,
            playhead,
            activatePlayhead = false,
            duration = 0,
            clckTime = 0;

        $scope.wavesurfer;

        // set datalist
        $scope.audioList = audioListService.getAudioList();

        //load the wavesurfer !!
        function loadWaveSurfer(audiourl) {
            var result = document.getElementsByClassName('wavesurfer');
            var wrappedResult = angular.element(result);
            // clean html:
            wrappedResult[0].innerHTML = '';

            $scope.wavesurfer = Object.create(WaveSurfer);
            $scope.wavesurfer.init({
                container: wrappedResult[0],
                backend: 'MediaElement',
                height: 90,
                progressColor: '#e5a213',
                waveColor: '#e5c513',
                cursorColor: '#f8bf43'
            });
            $scope.wavesurfer.load(audiourl);
            $scope.$emit('playerPressed', $scope.wavesurfer);
        }

        // return the current time
        function getElementsTime(id) {
            var this_element    = document.getElementById('audio-ctrls-'+id);
            this_element        = angular.element(this_element);

            return parseFloat(this_element.attr('data-current-time'));
        }

        // Sets the different timeline elements
        function initTimeline(id) {
            timeline            = document.getElementById('timeline-'+id);
            playhead            = document.getElementById('playhead-'+id);
            line                = document.getElementById('line-'+id);

            // progressed time
            timelineWidth       = timeline.offsetWidth - playhead.offsetWidth;
        }

        // Sets the duration variable from the data attribute. Duration is loaded via angular-directive
        function getDuration(id){
            var this_element    = document.getElementById('audio-ctrls-'+id);
            this_element        = angular.element(this_element);
            duration            = this_element.attr('data-duration');
        }

        // update current time data-attribute
        function updateElementsTime(time, id) {
            var this_element    = document.getElementById('audio-ctrls-'+id);
            this_element        = angular.element(this_element);

            this_element.attr('data-current-time', time);
        }

        // updates the current time for the data-current-time attribute
        // happens when the pause button is pressed or timeline is pressed
        function updateCrtTime(id, clckTime) {
            var this_element    = document.getElementById('audio-ctrls-'+id);
            this_element        = angular.element(this_element);
            this_element.attr('data-current-time', clckTime);

            // if calculated time for some reason is larger than the actual duration, then correct the "clicked" time
            if( clckTime > duration ) {
                clckTime        = duration-0.2;
            }

            // if timeline is pressed on the audio element that is playing, 
            // then use wavesurfer .play() to play from the new "clicked" time
            if( audio_is_playing && id == activeId ) {
                $scope.wavesurfer.play(clckTime);
            }
        }

        function timeUpdate(id) {
            // update the progessed time for the current audio element
            // (when it is playing!! callback event - $scope.wavesurfer.on('audioprocess', timeUpdate, false);
            var playPercent             = timelineWidth * ($scope.wavesurfer.getCurrentTime() / duration);
            playhead.style.marginLeft   = playPercent + 'px';

            $('#line-'+activeId).width(playPercent);
        }

        function togglePlayPause(id) {
            // find the play-button for the correct audio element
            var playbtn         = document.getElementById( 'play-'+id );
            var playResult      = angular.element(playbtn);

            // toggle the class "hide"
            playResult.toggleClass('hide');

            // find the pause-button for the correct audio element
            var pausebtn        = document.getElementById( 'pause-'+id );
            var pauseResult     = angular.element(pausebtn);

            // toggle the class "hide"
            pauseResult.toggleClass('hide');
        }

        // returns click as decimal (.77) of the total timelineWidth
        function clickPercent(e) {
            return (e.pageX - timeline.getBoundingClientRect().left) / timelineWidth;
        }
        // move the playhead accordingly
        function moveplayhead(id, e) {
            // use getBoundingClientRect because of angular use
            var newMargLeft = e.pageX - timeline.getBoundingClientRect().left;

            if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
                playhead.style.marginLeft = newMargLeft + "px";
                $('#line-'+id).width(newMargLeft);
            }
            if (newMargLeft < 0) {
                playhead.style.marginLeft = "0px";
                $('#line-'+id).width(0);
            }
            if (newMargLeft > timelineWidth) {
                playhead.style.marginLeft = timelineWidth + "px";
                $('#line-'+id).width(timelineWidth);
            }
        }

        // if ids needs to be checked up on, then call this function
        function checkIds(id) {
            console.log('id: '+id);
            console.log('activeId: '+activeId);
        }

        // playhed is pressed
        $scope.activatePlayhead = function(id, e) {
            console.log('playhead activated');
            // before allow the movement of the playhead, then initialize the timeline elements
            if( !activatePlayhead ) {
                initTimeline(id);
                getDuration(id);
            }
            // now set the variable to true in order to allow it to move
            activatePlayhead = true;
        }

        // user moves mouse outside element, then set active playhead variable to "false"
        $scope.deactivatePlayhead = function(id, e) {
            activatePlayhead = false;
        }

        // when the timeline has been clicked
        $scope.timeLineClick = function(id, e) {
            // an audio element is playing, then toggle pause/play by the activeId variable
            if( audio_is_playing && id != activeId ) {
                $scope.pause(activeId);
            }

            // get timeline elements by this "id"
            initTimeline(id);

            // delaying the function a bit in order to allow all other functions to be handled
            $timeout(function() {
                // move the playhead for the current audio element pressed
                moveplayhead(id, e);
                // get current audio element's duration
                getDuration(id);
                // calculate the new time
                clckTime = duration*clickPercent(e);
                // update the current time data-attribute
                updateCrtTime(id, clckTime);
            }, 1);
        }

        // when playhead is dragged, then move playhead by $events
        $scope.dragPlayhead = function(id, e) {
            if( activatePlayhead ) {
                moveplayhead(id, e);
            }
        }
        
        // return a trusted src
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        }

        // user press play
        $scope.play = function(audiourl, id, evt) {
            // if an audio element is playing, then toggle pause/play by activeId variable
            if( audio_is_playing ) {
                togglePlayPause(activeId);
            }
            // if the id doesn't match the active id, then update the current audio's time elements
            // (new elements will be loaded further down)
            if( id != activeId && activeId != null ) {
                updateElementsTime($scope.wavesurfer.getCurrentTime(),activeId);
            }

            // set the active id and set the active url
            // the active id is used to check up on what element is playing
            activeId = id;
            activeUrl = audiourl;

            togglePlayPause(activeId);

            // load the wavesurfer plugin with the correct url
            loadWaveSurfer(activeUrl);
            //$scope.$apply();

            // start the actual audio element when wavesurfer has finished loading
            $scope.wavesurfer.on('ready', function () {
                $scope.wavesurfer.play(getElementsTime(id));
            });
            //
        }
            // the play button has been pressed, 3 events need to listen to
            $scope.$on('playerPressed', function (e, wavesurfer) {

                // when the audio actually starts, then
                $scope.wavesurfer.on('play', function () {
                    // set this variable to true for later use
                    audio_is_playing = true;

                    // active which elements needs to be moved around
                    initTimeline(activeId);
                    // get the duration (loaded from the angular directive)
                    getDuration(activeId);

                    // when the actual audio element is playing, update the timelie by
                    $scope.wavesurfer.on('audioprocess', timeUpdate, false);

                    console.log('wavesurfer is playing');
                });

                $scope.wavesurfer.on('pause', function () {
                    audio_is_playing = false;

                    console.log('paused');
                });

                $scope.wavesurfer.on('finish', function () {
                    audio_is_playing = false;
                    $scope.wavesurfer.seekTo(0);
                    updateCrtTime(activeId, 0);
                    togglePlayPause(activeId);
                    $scope.$apply();
                    
                    console.log('finished');
                });

            });

        // if no wavesurfer is loaded, then prehibit the pause button's actions
        $scope.pause = function (id) {
            if (!$scope.wavesurfer) {
                return;
            }
            // When pause is pressed, then update theese elements 
            updateElementsTime($scope.wavesurfer.getCurrentTime(),activeId);

            // toggle the play and pause buttons visibilities
            togglePlayPause(id);

            // pause the acutal audio element
            $scope.wavesurfer.pause();
        };

        // if no wavesurfer is loaded, then prehibit any skipping!
        $scope.fastForward = function(id) {
            if (!$scope.wavesurfer || id != activeId) {
                return;
            }
            $scope.wavesurfer.skipForward();
        }
        $scope.fastBackward = function(id) {
            if (!$scope.wavesurfer || id != activeId) {
                return;
            }
            $scope.wavesurfer.skipBackward();
        }

    }]);
    
    // This directive is made for the sole purpose of getting the duration of the Audio element
    // The duration is set in a data-attribute
    audiolistControllers.directive('getDuration', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                var temp_audio = new Audio($attrs.voicedemo);
                temp_audio.load();
                temp_audio.addEventListener("loadedmetadata", function() {
                    $element.attr('data-duration', temp_audio.duration);
                }, false);
            }
        }
    }]);

    // This angular service is just to illustrate that a list of elements was loaded by Angular.
    audiolistControllers.service('audioListService', function() {
        var audiolist = [
                    {'id': 1,
                     'audiourl': 'upload\/audio\/audio-sample1.mp3',
                     'title': 'title-1'},
                    {'id': 2,
                     'audiourl': 'upload\/audio\/audio-sample2.mp3',
                     'title': 'title-2'},
                    {'id': 3,
                     'audiourl': 'upload\/audio\/audio-sample3.mp3',
                     'title': 'title-3'},
                    {'id': 4,
                     'audiourl': 'upload\/audio\/audio-sample4.mp3',
                     'title': 'title-4'}];

        var addAudio = function(newAudio) {
            audiolist.push(newAudio);
        };

        var getAudioList = function() {
            return audiolist;
        };

        var countAudioList = function() {
            return audiolist.length;
        }

        return {
            addAudio        : addAudio,
            getAudioList    : getAudioList,
            countAudioList  : countAudioList
        };

    });

})(jQuery, window);