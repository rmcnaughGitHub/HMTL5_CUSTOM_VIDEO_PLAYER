/* 
------------------
The MIT License (MIT)
Copyright (c) 2016 RAYMOND R-MCNAUGHT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE R OTHER DEALINGS IN THE SOFTWARE.
------------------
*/


$(document).ready(function () {

	//-Cross browser Video player - https://developer.mozilla.org/en-US/Apps/Build/Audio_and_video_delivery/cross_browser_video_player
	var vid = document.getElementById("vid"),
	playBttn = document.getElementById("playBttn"),
	playBttnBig = document.getElementById("playBttnBig"),
	pauseBttnBig = document.getElementById("pauseBttnBig"),
	skipOne = document.getElementById("skipOne"),
	skipTwo = document.getElementById("skipTwo"),
	skipThree = document.getElementById("skipThree"),
	skipRan = document.getElementById("skipRan"),
	videoControls = document.getElementById('videoControls'),

	pBarContainer = document.getElementById('pBarContainer'),
	pBar = document.getElementById('pBar'),
	progress_box = document.getElementById('progress_box'),
	currTime_box = document.getElementById('currTime_box'),
	volumeBar = document.getElementById('volumeBar'),
	volumeMute = document.getElementById('volumeMute'),
	fullScreenToggleButton = document.getElementById('fullScreen');

	//PLAY BUTTON
	playBttn.addEventListener('click', function() { 
		if(vid.paused){
			vid.play();
			playBttn.title = 'Pause';
			playBttn.innerHTML = '<span id="pauseButton">&#x2590;&#x2590;</span>';
		}else{
			vid.pause();
			playBttn.title = 'Play';
			playBttn.innerHTML = '&#x25BA';
		}
	});

	//VID PLAY BUTTONS
	vid.addEventListener('click', function() { 
		if(vid.paused){
			vid.play();
			playBttn.title = 'Pause';
			playBttn.innerHTML = '<span id="pauseButton">&#x2590;&#x2590;</span>';
			pauseBttnBig.style.display = 'block';
			$('#pauseBttnBig').fadeTo(300, 0.7, function(){
				$('#pauseBttnBig').fadeTo(300, 0, function(){
					pauseBttnBig.style.display = 'none';
				});
			});
		}else{
			vid.pause();
			playBttn.title = 'Play';
			playBttn.innerHTML = '&#x25BA';
			playBttnBig.style.display = 'block';
			$('#playBttnBig').fadeTo(300, 0.7, function(){
				$('#playBttnBig').fadeTo(300, 0, function(){
					playBttnBig.style.display = 'none';
				});

			});
		}
	});

	//SKIP TO A SECTION IN VIDEO - http://jsfiddle.net/sCvxm/1/
	skipOne.addEventListener('click', function() { 
		vid.currentTime = 7;
	});
	skipTwo.addEventListener('click', function() { 
		vid.currentTime = 11;
	});
	skipThree.addEventListener('click', function() { 
		vid.currentTime = 17;
	});
	skipRan.addEventListener('click', function() { 
		vid.currentTime =  (vid.duration * Math.random());
	});

	//BUFFER BAR - http://jspro.brothercake.com/media-events/progress.html
	vid.addEventListener('progress', bufferAmount, false);
	function bufferAmount(){
		var ranges = []//get buffered ranges
		for( var i = 0; i< vid.buffered.length; i++ ){
			ranges.push( [
				vid.buffered.start(i),
				vid.buffered.end(i)
				] );
		}

		//iterate through the ranges convert set of timings to percentage
		for( var i = 0; i< vid.buffered.length; i++ ){
			pBarBuffer.style.width = Math.round( (100/vid.duration) * (ranges[i][1] - ranges[i][0]) ) + '%';
		}
	}
	

	//PROGRESS BAR GET VIDEO PROGRESSION CODE - http://www.developphp.com/video/JavaScript/Video-Duration-and-Current-Play-Time-Programming-Tutorial
	vid.addEventListener('timeupdate', seekTimerUpdate, false);
	function seekTimerUpdate(){
		var time = vid.currentTime * (100/vid.duration),
		curmins = Math.floor(vid.currentTime /60),
		cursecs = Math.floor(vid.currentTime - curmins * 60),
		durmins = Math.floor(vid.duration /60),
		dursecs = Math.floor(vid.duration - durmins * 60);

		if(cursecs < 10){ cursecs = "0" + cursecs; };
		if(dursecs < 10){ dursecs = "0" + dursecs; };
		if(curmins < 10){ curmins = "0" + curmins; };
		if(durmins < 10){ durmins = "0" + durmins; };

		currTime_box.innerHTML = curmins+":"+cursecs + " /";
		progress_box.innerHTML = durmins+":"+dursecs;


		pBar.style.width = time + '%';
		//console.log(pBar.style.width);

	}

	//DRAGGALBE PROGRESS BAR - http://www.inwebson.com/html5/custom-html5-video-controls-with-jquery/
	var timeDrag = false; 
	pBarContainer.addEventListener('mousedown', function(e) {
	   timeDrag = true;
	   updatebar(e.pageX);
	});
	pBarContainer.addEventListener('mouseup', function(e) {
	   if(timeDrag) {
	      timeDrag = false;
	      updatebar(e.pageX);
	   }
	});
	pBarContainer.addEventListener('mousemove', function(e) {
	   if(timeDrag) {
	      updatebar(e.pageX);
	   }
	});
	 
	//update Progress Bar control
	var updatebar = function(x) {
	   var progress = $('#pBarContainer');
	   var maxduration = vid.duration; //Video duraiton
	   var position = x - progress.offset().left; //Click pos
	   var percentage = 100 * position / progress.width();
	 
	   //Check within range
	   if(percentage > 100) {
	      percentage = 100;
	   }
	   if(percentage < 0) {
	      percentage = 0;
	   }
	 
	   //Update progress bar and video currenttime
	   $('#pBar').css('width', percentage+'%');
	   vid.currentTime = maxduration * percentage / 100;
	};


	//VOLUME - MUTE - MINUS - PLUS
	vid.volume = 1;//set video volume
	var currentVolume = vid.volume;//get currentvolume
	var rTime = null;//repeat action var
	var rSpeed = 100;//speed of repetition

	volumeMute.addEventListener('mousedown', function(){//mute
		if(vid.volume > 0){
			vid.volume = 0;
			volumeMute.style.backgroundPosition = '-34px 48%';
			volumeMute.removeEventListener('mouseover', muteOn);
			volumeMute.removeEventListener('mouseout', muteOff);
		}else{
			vid.volume = currentVolume; 
			volumeMute.style.backgroundPosition = '0 48%';
			volumeMute.addEventListener('mouseover', muteOn);
			volumeMute.addEventListener('mouseout', muteOff);
		}
		console.log(vid.volume);
	}, false);
	volumeMute.addEventListener('mouseover', muteOn);
	volumeMute.addEventListener('mouseout', muteOff);
	function muteOn(){
		volumeMute.style.backgroundPosition = '-34px 48%';
	}
	function muteOff(){
		volumeMute.style.backgroundPosition = '0 48%';
	}

	//lowerVolume
	function lowerVolume(){
		if(vid.volume > 0){
		vid.volume  -= 0.1;
		}
		if(vid.volume <= 0.10000000000000014){
			vid.volume = 0;
		}
		currentVolume = vid.volume;
		console.log(vid.volume);	
	}
	volumeMinus.addEventListener('mouseover', function(){
		volumeMinus.style.backgroundPosition = '-34px 48%';
	}, false);
	volumeMinus.addEventListener('mouseout', function(){
		volumeMinus.style.backgroundPosition = '0 48%';
	}, false);
	volumeMinus.addEventListener('mousedown', function(){
		rTime = setInterval(lowerVolume, rSpeed);
	}, false);
	volumeMinus.addEventListener('mouseup', function(){
		var c = window.clearInterval(rTime);
	}, false);

	//raiseVolume
	function raiseVolume(){
		if(vid.volume < 1){
			vid.volume += 0.1;
		}
		if(vid.volume >= 0.9999999999999999){
			vid.volume = 1;
		}
		currentVolume = vid.volume;
		console.log(vid.volume);	
	}
	volumePlus.addEventListener('mouseover', function(){
		volumePlus.style.backgroundPosition = '-34px 48%';
	}, false);
	volumePlus.addEventListener('mouseout', function(){
		volumePlus.style.backgroundPosition = '0 48%';
	}, false);
	volumePlus.addEventListener('mousedown', function(){
		rTime = setInterval(raiseVolume, rSpeed);
	}, false);
	volumePlus.addEventListener('mouseup', function(){
		var c = window.clearInterval(rTime);
	}, false);


	//FULLSCREEN TOGGLE BUTTON - http://davidwalsh.name/fullscreen
	var screenFull = false;
	fullScreenToggleButton.addEventListener('mouseover', fullOn);
	fullScreenToggleButton.addEventListener('mouseout', fullOff);
	function fullOn(){
		fullScreenToggleButton.style.backgroundPosition = '-34px 48%';
	}
	function fullOff(){
		fullScreenToggleButton.style.backgroundPosition = '0 48%';
	}
	fullScreenToggleButton.addEventListener('click', enterFullscreen);	
	function enterFullscreen(){
		if( vid.requestFullscreen ){
			vid.requestFullscreen;
			screenFull = true;
		}else if( vid.mozRequestFullScreen ){
			vid.mozRequestFullScreen();//firefox
			screenFull = true;
		}else if( vid.webkitRequestFullscreen ){
			vid.webkitRequestFullscreen();
			screenFull = true;
		}
		fullScreenToggleButton.removeEventListener('mouseover', fullOn);
		fullScreenToggleButton.removeEventListener('mouseout', fullOff);
		fullScreenToggleButton.removeEventListener('click', enterFullscreen);
		fullScreenToggleButton.addEventListener('click', closeFullscreen);
		//console.log("Fullscreen");
	};
	function closeFullscreen(){
		if(document.exitFullscreen) {
		    document.exitFullscreen();
		  } else if(document.mozCancelFullScreen) {
		    document.mozCancelFullScreen();
		  } else if(document.webkitExitFullscreen) {
		    document.webkitExitFullscreen();
		}
		fullScreenToggleButton.addEventListener('mouseover', fullOn);
		fullScreenToggleButton.addEventListener('mouseout', fullOff);
		fullScreenToggleButton.style.backgroundPosition = '0 48%';
		fullScreenToggleButton.removeEventListener('click', closeFullscreen);
		fullScreenToggleButton.addEventListener('click', enterFullscreen);
		//console.log("closeFullscreen");
	};

	//CLOSE WINDOW IF ESCAPE IS PRESSED
	document.onkeydown = function(e){
		if(e == null){//IE
				keycode = event.keycode;
		}else{//Mozilla
				keycode = e.which;
		}
		if(keycode == 27){//escape
			videoControls.style.position = "relative";
			videoControls.style.bottom = '30px';
			console.log("Escape");
		}
	}


	//RESIZE FOR FULLSCREEN VIDEO CONTROL-BAR
	$(window).resize(function(event) {
		playBttnBig.style.top = '40%';
		pauseBttnBig.style.top = '40%';
		if(screenFull == true){
			videoControls.style.position = "fixed";
			videoControls.style.bottom = 0;	
		}
		else if(screenFull == false){
			videoControls.style.position = "relative";
			videoControls.style.bottom = '30px';	
		}
	});


	//OTHER FUNCTIONS
	var videoPlayer = {

		init:function(){
			var $this = $(this); //this is equal to the videoPlayer object. 
			document.documentElement.className = 'js';//css trigger from js
			//A neat way that we style elements based upon whether JavaScript
			//is enabled is by apply a class of "js" to the documentElement, or the html element.
			vid.removeAttribute('controls');//remove basic controls - redundant if shadow dom is disabled in CSS
			vid.onloadeddata = function(){//show controls when metadata is ready
				videoPlayer.showHideControls();
				//console.log("Start");
			}
			
		},

		showHideControls:function(){
			/*vid.addEventListener('mouseover', function(){
				videoControls.style.opacity = 0.7;//$('#videoControls').fadeTo(300, 0.70);
			}, false);
			videoControls.addEventListener('mouseover', function(){
				videoControls.style.opacity = 0.7;//$('#videoControls').fadeTo(300, 0.70);
			}, false);

			vid.addEventListener('mouseout', function(){
				videoControls.style.opacity = 0;//$('#videoControls').fadeTo(300, 0);
			}, false);
			videoControls.addEventListener('mouseout', function(){
				videoControls.style.opacity = 0;//$('#videoControls').fadeTo(300, 0);
			}, false);
			//video ended
			vid.addEventListener('ended', function(){
				vid.currentTime = 0;
				vid.pause();
				console.log("ended");
			}, false);*/

			//console.log("showHideControls");
		}

		//Within this method, we again attach a handful of new events that are
		//available to the (video element: play, pause, and ended).
		/*play: Fired when the video begins playing.
		  pause: Fired when the video is paused.
		  ended: Fired when the video has concluded. 
		  This event listener can be used to reset the video back to the beginning.*/
		

	}

	videoPlayer.init();

});