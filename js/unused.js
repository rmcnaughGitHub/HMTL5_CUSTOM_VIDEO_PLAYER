//SEEK TIMER UPDATE FUNCTION
//pBar.value = time;//progress bar with <progress></progress> tag
//seekBar.value = time;//seek bar


//SEEK BAR
//var seekBar = document.getElementById('seekBar');
//seekBar.addEventListener("change", scrollBarSeek, false);
/*function scrollBarSeek(){
		var slide = vid.duration * (seekBar.value/100);
		vid.currentTime = slide;
}*/


//ALTERNATE way of buffering
var startBuffer = function(){
	var maxduration = vid.duration,
	currentBuffer = vid.buffered.end(0),
	percentage = Math.round(100 * currentBuffer / maxduration);
	pBarBuffer.style.width = percentage + '%';

	if(currentBuffer < maxduration){
		setTimeout(startBuffer, 500);
	}
	console.log(pBarBuffer.style.width);
};

setTimeout(startBuffer, 500);