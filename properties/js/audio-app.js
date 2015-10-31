(function($, exports) {
    "use strict";
    var app = angular.module("audio", [ "ngRoute", "audiolistControllers" ]);
    var audiolistControllers = angular.module("audiolistControllers", [ "ngRoute" ]);
    audiolistControllers.controller("audiolist-ctrl", [ "$scope", "$http", "audioListService", "$sce", "$timeout", function($scope, $http, audioListService, $sce, $timeout) {
        var activeUrl = null, activeId = null, tempId = null, audio_is_playing = false;
        $scope.wavesurfer;
        $scope.audioList = audioListService.getAudioList();
        function loadWaveSurfer(audiourl) {
            var result = document.getElementsByClassName("wavesurfer");
            var wrappedResult = angular.element(result);
            wrappedResult[0].innerHTML = "";
            $scope.wavesurfer = Object.create(WaveSurfer);
            $scope.wavesurfer.init({
                container: wrappedResult[0],
                backend: "MediaElement",
                height: 90,
                progressColor: "#e5a213",
                waveColor: "#e5c513",
                cursorColor: "#f8bf43"
            });
            $scope.wavesurfer.load(audiourl);
            $scope.$emit("playerPressed", $scope.wavesurfer);
        }
        function getElementsTime(id) {
            var this_element = document.getElementById("audio-ctrls-" + id);
            this_element = angular.element(this_element);
            return parseFloat(this_element.attr("data-current-time"));
        }
        var duration, timeline, timelineWidth, timeLineOffsetleft, line, playhead, activatePlayhead = false, duration = 0, clckTime = 0;
        function initTimeline(id) {
            timeline = document.getElementById("timeline-" + id);
            playhead = document.getElementById("playhead-" + id);
            line = document.getElementById("line-" + id);
            timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
        }
        function getDuration(id) {
            var this_element = document.getElementById("audio-ctrls-" + id);
            this_element = angular.element(this_element);
            duration = this_element.attr("data-duration");
        }
        function updateElementsTime(time, id) {
            var this_element = document.getElementById("audio-ctrls-" + id);
            this_element = angular.element(this_element);
            this_element.attr("data-current-time", time);
        }
        function updateCrtTime(id, clckTime) {
            var this_element = document.getElementById("audio-ctrls-" + id);
            this_element = angular.element(this_element);
            this_element.attr("data-current-time", clckTime);
            if (clckTime > duration) {
                clckTime = duration - .2;
            }
            if (audio_is_playing && id == activeId) {
                $scope.wavesurfer.play(clckTime);
            }
        }
        function timeUpdate(id) {
            var playPercent = timelineWidth * ($scope.wavesurfer.getCurrentTime() / duration);
            playhead.style.marginLeft = playPercent + "px";
            $("#line-" + activeId).width(playPercent);
        }
        function togglePlayPause(id) {
            var playbtn = document.getElementById("play-" + id);
            var playResult = angular.element(playbtn);
            playResult.toggleClass("hide");
            var pausebtn = document.getElementById("pause-" + id);
            var pauseResult = angular.element(pausebtn);
            pauseResult.toggleClass("hide");
        }
        function clickPercent(e) {
            return (e.pageX - timeline.getBoundingClientRect().left) / timelineWidth;
        }
        function moveplayhead(e) {
            var newMargLeft = e.pageX - timeline.getBoundingClientRect().left;
            if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
                playhead.style.marginLeft = newMargLeft + "px";
                $("#line-" + tempId).width(newMargLeft);
            }
            if (newMargLeft < 0) {
                playhead.style.marginLeft = "0px";
                $("#line-" + tempId).width(0);
            }
            if (newMargLeft > timelineWidth) {
                playhead.style.marginLeft = timelineWidth + "px";
                $("#line-" + tempId).width(timelineWidth);
            }
        }
        function checkIds(id) {
            console.log("id: " + id);
            console.log("activeId: " + activeId);
        }
        $scope.activatePlayhead = function(id, e) {
            console.log("playhead activated");
            if (!activatePlayhead) {
                initTimeline(id);
                getDuration(id);
            }
            activatePlayhead = true;
        };
        $scope.deactivatePlayhead = function(id, e) {
            activatePlayhead = false;
        };
        $scope.timeLineClick = function(id, e) {
            if (audio_is_playing && id != activeId) {
                $scope.pause(activeId);
            }
            initTimeline(id);
            $timeout(function() {
                moveplayhead(e);
                getDuration(id);
                clckTime = duration * clickPercent(e);
                updateCrtTime(id, clckTime);
            }, 1);
        };
        $scope.dragPlayhead = function(id, e) {
            if (activatePlayhead) {
                moveplayhead(e);
            }
        };
        $scope.trustSrc = function(src) {
            return $sce.trustAsResourceUrl(src);
        };
        $scope.play = function(audiourl, id, evt) {
            if (audio_is_playing) {
                togglePlayPause(activeId);
            }
            if (id != activeId && activeId != null) {
                updateElementsTime($scope.wavesurfer.getCurrentTime(), activeId);
            }
            activeUrl = audiourl;
            activeId = id;
            togglePlayPause(activeId);
            loadWaveSurfer(activeUrl);
            $scope.wavesurfer.play(getElementsTime(id));
        };
        $scope.$on("playerPressed", function(e, wavesurfer) {
            $scope.wavesurfer.on("play", function() {
                audio_is_playing = true;
                initTimeline(activeId);
                getDuration(activeId);
                $scope.wavesurfer.on("audioprocess", timeUpdate, false);
                console.log("wavesurfer is playing");
            });
            $scope.wavesurfer.on("pause", function() {
                audio_is_playing = false;
                console.log("paused");
            });
            $scope.wavesurfer.on("finish", function() {
                audio_is_playing = false;
                $scope.wavesurfer.seekTo(0);
                updateCrtTime(activeId, 0);
                togglePlayPause(activeId);
                $scope.$apply();
                console.log("finished");
            });
        });
        $scope.pause = function(id) {
            if (!$scope.wavesurfer) {
                return;
            }
            updateElementsTime($scope.wavesurfer.getCurrentTime(), activeId);
            togglePlayPause(id);
            $scope.wavesurfer.pause();
        };
        $scope.fastForward = function(id) {
            if (!$scope.wavesurfer || id != activeId) {
                return;
            }
            $scope.wavesurfer.skipForward();
        };
        $scope.fastBackward = function(id) {
            if (!$scope.wavesurfer || id != activeId) {
                return;
            }
            $scope.wavesurfer.skipBackward();
        };
    } ]);
    audiolistControllers.directive("getDuration", [ "$timeout", function($timeout) {
        return {
            restrict: "A",
            link: function($scope, $element, $attrs) {
                var temp_audio = new Audio($attrs.voicedemo);
                temp_audio.load();
                temp_audio.addEventListener("loadedmetadata", function() {
                    $element.attr("data-duration", temp_audio.duration);
                }, false);
            }
        };
    } ]);
    audiolistControllers.service("audioListService", function() {
        var audiolist = [ {
            id: 1,
            audiourl: "upload/audio/audio-sample1.mp3",
            title: "title-1"
        }, {
            id: 2,
            audiourl: "upload/audio/audio-sample2.mp3",
            title: "title-2"
        }, {
            id: 3,
            audiourl: "upload/audio/audio-sample3.mp3",
            title: "title-3"
        }, {
            id: 4,
            audiourl: "upload/audio/audio-sample4.mp3",
            title: "title-4"
        } ];
        var addAudio = function(newAudio) {
            audiolist.push(newAudio);
        };
        var getAudioList = function() {
            return audiolist;
        };
        var countAudioList = function() {
            return audiolist.length;
        };
        return {
            addAudio: addAudio,
            getAudioList: getAudioList,
            countAudioList: countAudioList
        };
    });
})(jQuery, window);