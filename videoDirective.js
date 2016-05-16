var app = angular.module('myApp', []);
app.directive('videoCapture',function(){
return {
	restrict : 'EAC',
	template : 
		"<VIDEO controls autoplay></VIDEO>'\
		<br>\
		<BUTTON ng-click='videoController.checkWebcamDriverAndStartRecording()'>Start Recording</BUTTON>\
		<BUTTON id='saveVideo'>SAVE</BUTTON>\
		<a id='downloadLink'></a>",
	controllerAs: 'videoController',
	controller :
		function(){
			this.checkWebcamDriverAndStartRecording = checkWebcamDriverAndStartRecording;
			this.errorCallback = errorCallback;
			this.stoplocalStream = stoplocalStream;

			function errorCallback(e) 
			{
				console.log('Rejected', e);
			};

			function checkWebcamDriverAndStartRecording()
			{
				if (hasGetUserMedia()) {
					navigator.getUserMedia = navigator.getUserMedia ||
						navigator.webkitGetUserMedia ||
						navigator.mozGetUserMedia ||
						navigator.msGetUserMedia;

					console.log('Good to go!');
					navigator.getUserMedia({video: true, audio: true}, startRecording, errorCallback);
				} 
				else 
				{
					alert('getUserMedia() is not supported in your browser');
				}
			}
		
			function hasGetUserMedia() 
			{
				return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia || navigator.msGetUserMedia);
			}

			function startRecording(localStream) 
			{
				var chunks = [];
				console.log('Starting...');
				var video = document.querySelector('video');
				video.src = window.URL.createObjectURL(localStream);

				mediaRecorder = new MediaRecorder(localStream);
				mediaRecorder.start();

				document.getElementById('saveVideo').addEventListener('click', function () {
					stoplocalStream(localStream);
				});

				mediaRecorder.ondataavailable = function(e) 
				{
					chunks.push(e.data);
				};

				mediaRecorder.onstop = function() 
				{
					console.log('Stopped, state = ' + mediaRecorder.state);
					var blob = new Blob(chunks, {type: "video/webm"});
					chunks = [];

					var videoURL = window.URL.createObjectURL(blob);
					var downloadLink = document.getElementById('downloadLink');
					downloadLink.href = videoURL;
					video.src = videoURL;
					downloadLink.innerHTML = 'Download video file';

					var rand = Math.floor((Math.random() * 10000000));
					var name = "video_"+rand+".webm" ;

					downloadLink.setAttribute( "download", name);
					downloadLink.setAttribute( "name", name);

					var f = new FormData();
					f.append('videofile', blob);
					var xhr = new XMLHttpRequest();
					xhr.open('POST','upload.php');
					xhr.send(f);
				};
			}

			function stoplocalStream(localStream) 
			{
				console.log('stop called');
				localStream.getAudioTracks()[0].stop();
				localStream.getVideoTracks()[0].stop();
			}

		}
	}
});
