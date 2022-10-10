/*
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @typedef RecordRTC
 @class
 @example
 var recorder = RecordRTC(mediaStream or [arrayOfMediaStream], {
     type: 'video', // audio or video or gif or canvas
     recorderType: MediaStreamRecorder || CanvasRecorder || StereoAudioRecorder || Etc
 });
 recorder.startRecording();
 @see For further information:
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 @param {MediaStream} mediaStream - Single media-stream object, array of media-streams, html-canvas-element, etc.
 @param {object} config - {type:"video", recorderType: MediaStreamRecorder, disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, desiredSampRate: 16000, video: HTMLVideoElement, etc.}
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @typedef RecordRTCConfiguration
 @class
 @example
 var options = RecordRTCConfiguration(mediaStream, options);
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 @param {object} config - {type:"video", disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, video: HTMLVideoElement, getNativeBlob:true, etc.}
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @typedef GetRecorderType
 @class
 @example
 var RecorderType = GetRecorderType(options);
 var recorder = new RecorderType(options);
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 @param {object} config - {type:"video", disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, video: HTMLVideoElement, etc.}
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @typedef MRecordRTC
 @class
 @example
 var recorder = new MRecordRTC();
 recorder.addStream(MediaStream);
 recorder.mediaType = {
     audio: true, // or StereoAudioRecorder or MediaStreamRecorder
     video: true, // or WhammyRecorder or MediaStreamRecorder
     gif: true    // or GifRecorder
 };
 // mimeType is optional and should be set only in advance cases.
 recorder.mimeType = {
     audio: 'audio/wav',
     video: 'video/webm',
     gif:   'image/gif'
 };
 recorder.startRecording();
 @see For further information:
 @see {@link https://github.com/muaz-khan/RecordRTC/tree/master/MRecordRTC|MRecordRTC Source Code}
 @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 @requires {@link RecordRTC}
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @example
 Storage.AudioContext === webkitAudioContext
 @property {webkitAudioContext} AudioContext - Keeps a reference to AudioContext object.
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link https://github.com/muaz-khan|Muaz Khan}
 @typedef MediaStreamRecorder
 @class
 @example
 var config = {
     mimeType: 'video/webm', // vp8, vp9, h264, mkv, opus/vorbis
     audioBitsPerSecond : 256 * 8 * 1024,
     videoBitsPerSecond : 256 * 8 * 1024,
     bitsPerSecond: 256 * 8 * 1024,  // if this is provided, skip above two
     checkForInactiveTracks: true,
     timeSlice: 1000, // concatenate intervals based blobs
     ondataavailable: function() {}, // get intervals based blobs
     ignoreMutedMedia: true
 }
 var recorder = new MediaStreamRecorder(mediaStream, config);
 recorder.record();
 recorder.stop(function(blob) {
     video.src = URL.createObjectURL(blob);

     // or
     var blob = recorder.blob;
 });
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 @param {object} config - {disableLogs:true, initCallback: function, mimeType: "video/webm", timeSlice: 1000}
 @throws Will throw an error if first argument "MediaStream" is missing. Also throws error if "MediaRecorder API" are not supported by the browser.
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @typedef StereoAudioRecorder
 @class
 @example
 var recorder = new StereoAudioRecorder(MediaStream, {
     sampleRate: 44100,
     bufferSize: 4096
 });
 recorder.record();
 recorder.stop(function(blob) {
     video.src = URL.createObjectURL(blob);
 });
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 @param {object} config - {sampleRate: 44100, bufferSize: 4096, numberOfAudioChannels: 1, etc.}
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @typedef CanvasRecorder
 @class
 @example
 var recorder = new CanvasRecorder(htmlElement, { disableLogs: true, useWhammyRecorder: true });
 recorder.record();
 recorder.stop(function(blob) {
     video.src = URL.createObjectURL(blob);
 });
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 @param {HTMLElement} htmlElement - querySelector/getElementById/getElementsByTagName[0]/etc.
 @param {object} config - {disableLogs:true, initCallback: function}
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @typedef WhammyRecorder
 @class
 @example
 var recorder = new WhammyRecorder(mediaStream);
 recorder.record();
 recorder.stop(function(blob) {
     video.src = URL.createObjectURL(blob);
 });
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 @param {object} config - {disableLogs: true, initCallback: function, video: HTMLVideoElement, etc.}
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @typedef Whammy
 @class
 @example
 var recorder = new Whammy().Video(15);
 recorder.add(context || canvas || dataURL);
 var output = recorder.compile();
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @example
 DiskStorage.Store({
     audioBlob: yourAudioBlob,
     videoBlob: yourVideoBlob,
     gifBlob  : yourGifBlob
 });
 DiskStorage.Fetch(function(dataURL, type) {
     if(type === 'audioBlob') { }
     if(type === 'videoBlob') { }
     if(type === 'gifBlob')   { }
 });
 // DiskStorage.dataStoreName = 'recordRTC';
 // DiskStorage.onError = function(error) { };
 @property {function} init - This method must be called once to initialize IndexedDB ObjectStore. Though, it is auto-used internally.
 @property {function} Fetch - This method fetches stored blobs from IndexedDB.
 @property {function} Store - This method stores blobs in IndexedDB.
 @property {function} onError - This function is invoked for any known/unknown error.
 @property {string} dataStoreName - Name of the ObjectStore created in IndexedDB storage.
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @typedef GifRecorder
 @class
 @example
 var recorder = new GifRecorder(mediaStream || canvas || context, { onGifPreview: function, onGifRecordingStarted: function, width: 1280, height: 720, frameRate: 200, quality: 10 });
 recorder.record();
 recorder.stop(function(blob) {
     img.src = URL.createObjectURL(blob);
 });
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 @param {MediaStream} mediaStream - MediaStream object or HTMLCanvasElement or CanvasRenderingContext2D.
 @param {object} config - {disableLogs:true, initCallback: function, width: 320, height: 240, frameRate: 200, quality: 10}
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @typedef MultiStreamRecorder
 @class
 @example
 var options = {
     mimeType: 'video/webm'
 }
 var recorder = new MultiStreamRecorder(ArrayOfMediaStreams, options);
 recorder.record();
 recorder.stop(function(blob) {
     video.src = URL.createObjectURL(blob);

     // or
     var blob = recorder.blob;
 });
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 @param {MediaStreams} mediaStreams - Array of MediaStreams.
 @param {object} config - {disableLogs:true, frameInterval: 1, mimeType: "video/webm"}
 {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 @author {@link http://www.MuazKhan.com|Muaz Khan}
 @typedef RecordRTCPromisesHandler
 @class
 @example
 var recorder = new RecordRTCPromisesHandler(mediaStream, options);
 recorder.startRecording()
         .then(successCB)
         .catch(errorCB);
 @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 @param {MediaStream} mediaStream - Single media-stream object, array of media-streams, html-canvas-element, etc.
 @param {object} config - {type:"video", recorderType: MediaStreamRecorder, disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, video: HTMLVideoElement, etc.}
 @throws Will throw an error if "new" keyword is not used to initiate "RecordRTCPromisesHandler". Also throws error if first argument "MediaStream" is missing.
 @requires {@link RecordRTC}
*/
function RecordRTC(b,a){function f(p){p&&(a.initCallback=function(){p();p=a.initCallback=null});e=new (new GetRecorderType(b,a))(b,a);e.record();u("recording");a.disableLogs||console.log("Initialized recorderType:",e.constructor.name,"for output-type:",a.type)}function c(b){function p(p){if(e){Object.keys(e).forEach(function(a){"function"!==typeof e[a]&&(d[a]=e[a])});var h=e.blob;if(!h)if(p)e.blob=h=p;else throw"Recording failed.";h&&!a.disableLogs&&console.log(h.type,"->",bytesToSize(h.size));b&&
(p=URL.createObjectURL(h),"function"===typeof b.call?b.call(d,p):b(p));a.autoWriteToDisk&&r(function(b){var p={};p[a.type+"Blob"]=b;DiskStorage.Store(p)})}else"function"===typeof b.call?b.call(d,""):b("")}b=b||function(){};e?"paused"===d.state?(d.resumeRecording(),setTimeout(function(){c(b)},1)):("recording"===d.state||a.disableLogs||console.warn('Recording state should be: "recording", however current state is: ',d.state),a.disableLogs||console.log("Stopped recording "+a.type+" stream."),"gif"!==
a.type?e.stop(p):(e.stop(),p()),u("stopped")):l()}function q(a){postMessage((new FileReaderSync).readAsDataURL(a))}function r(b,k){function p(a){a=URL.createObjectURL(new Blob([a.toString(),"this.onmessage =  function (e) {"+a.name+"(e.data);}"],{type:"application/javascript"}));var b=new Worker(a);URL.revokeObjectURL(a);return b}if(!b)throw"Pass a callback function over getDataURL.";var h=k?k.blob:(e||{}).blob;if(h)if("undefined"===typeof Worker||navigator.mozGetUserMedia){var f=new FileReader;f.readAsDataURL(h);
f.onload=function(a){b(a.target.result)}}else f=p(q),f.onmessage=function(a){b(a.data)},f.postMessage(h);else a.disableLogs||console.warn("Blob encoder did not finish its job yet."),setTimeout(function(){r(b,k)},1E3)}function g(a){a=a||0;"paused"===d.state?setTimeout(function(){g(a)},1E3):"stopped"!==d.state&&(a>=d.recordingDuration?c(d.onRecordingStopped):(a+=1E3,setTimeout(function(){g(a)},1E3)))}function u(a){if(d)if(d.state=a,"function"===typeof d.onStateChanged.call)d.onStateChanged.call(d,a);
else d.onStateChanged(a)}function l(){!0!==a.disableLogs&&console.warn(n)}if(!b)throw"First parameter is required.";a=a||{type:"video"};a=new RecordRTCConfiguration(b,a);var d=this,n='It seems that recorder is destroyed or "startRecording" is not invoked for '+a.type+" recorder.",e,m={startRecording:function(p){p&&(a=new RecordRTCConfiguration(b,p));a.disableLogs||console.log("started recording "+a.type+" stream.");if(e)return e.clearRecordedData(),e.record(),u("recording"),d.recordingDuration&&g(),
d;f(function(){d.recordingDuration&&g()});return d},stopRecording:c,pauseRecording:function(){e?"recording"!==d.state?a.disableLogs||console.warn("Unable to pause the recording. Recording state: ",d.state):(u("paused"),e.pause(),a.disableLogs||console.log("Paused recording.")):l()},resumeRecording:function(){e?"paused"!==d.state?a.disableLogs||console.warn("Unable to resume the recording. Recording state: ",d.state):(u("recording"),e.resume(),a.disableLogs||console.log("Resumed recording.")):l()},
initRecorder:f,setRecordingDuration:function(a,b){if("undefined"===typeof a)throw"recordingDuration is required.";if("number"!==typeof a)throw"recordingDuration must be a number.";d.recordingDuration=a;d.onRecordingStopped=b||function(){};return{onRecordingStopped:function(a){d.onRecordingStopped=a}}},clearRecordedData:function(){e?(e.clearRecordedData(),a.disableLogs||console.log("Cleared old recorded data.")):l()},getBlob:function(){if(e)return e.blob;l()},getDataURL:r,toURL:function(){if(e)return URL.createObjectURL(e.blob);
l()},getInternalRecorder:function(){return e},save:function(a){e?invokeSaveAsDialog(e.blob,a):l()},getFromDisk:function(b){e?RecordRTC.getFromDisk(a.type,b):l()},setAdvertisementArray:function(b){a.advertisement=[];for(var k=b.length,p=0;p<k;p++)a.advertisement.push({duration:p,image:b[p]})},blob:null,bufferSize:0,sampleRate:0,buffer:null,reset:function(){e&&"function"===typeof e.clearRecordedData&&e.clearRecordedData();e=null;u("inactive");d.blob=null},onStateChanged:function(b){a.disableLogs||console.log("Recorder state changed:",
b)},state:"inactive",getState:function(){return d.state},destroy:function(){var b=a.disableLogs;a.disableLogs=!0;d.reset();a={};u("destroyed");m=d=null;Storage.AudioContextConstructor&&(Storage.AudioContextConstructor.close(),Storage.AudioContextConstructor=null);b||console.warn("RecordRTC is destroyed.")},version:"5.4.6"};if(!this)return d=m;for(var k in m)this[k]=m[k];d=this;return m}RecordRTC.version="5.4.6";"undefined"!==typeof module&&(module.exports=RecordRTC);
"function"===typeof define&&define.amd&&define("RecordRTC",[],function(){return RecordRTC});RecordRTC.getFromDisk=function(b,a){if(!a)throw"callback is mandatory.";console.log("Getting recorded "+("all"===b?"blobs":b+" blob ")+" from disk!");DiskStorage.Fetch(function(f,c){"all"!==b&&c===b+"Blob"&&a&&a(f);"all"===b&&a&&a(f,c.replace("Blob",""))})};
RecordRTC.writeToDisk=function(b){console.log("Writing recorded blob(s) to disk!");b=b||{};b.audio&&b.video&&b.gif?b.audio.getDataURL(function(a){b.video.getDataURL(function(f){b.gif.getDataURL(function(b){DiskStorage.Store({audioBlob:a,videoBlob:f,gifBlob:b})})})}):b.audio&&b.video?b.audio.getDataURL(function(a){b.video.getDataURL(function(b){DiskStorage.Store({audioBlob:a,videoBlob:b})})}):b.audio&&b.gif?b.audio.getDataURL(function(a){b.gif.getDataURL(function(b){DiskStorage.Store({audioBlob:a,
gifBlob:b})})}):b.video&&b.gif?b.video.getDataURL(function(a){b.gif.getDataURL(function(b){DiskStorage.Store({videoBlob:a,gifBlob:b})})}):b.audio?b.audio.getDataURL(function(a){DiskStorage.Store({audioBlob:a})}):b.video?b.video.getDataURL(function(a){DiskStorage.Store({videoBlob:a})}):b.gif&&b.gif.getDataURL(function(a){DiskStorage.Store({gifBlob:a})})};
function RecordRTCConfiguration(b,a){a.recorderType||a.type||(a.audio&&a.video?a.type="video":a.audio&&!a.video&&(a.type="audio"));a.recorderType&&!a.type&&(a.recorderType===WhammyRecorder||a.recorderType===CanvasRecorder?a.type="video":a.recorderType===GifRecorder?a.type="gif":a.recorderType===StereoAudioRecorder?a.type="audio":a.recorderType===MediaStreamRecorder&&(b.getAudioTracks().length&&b.getVideoTracks().length?a.type="video":b.getAudioTracks().length&&!b.getVideoTracks().length?a.type="audio":
!b.getAudioTracks().length&&b.getVideoTracks().length&&(a.type="audio")));"undefined"!==typeof MediaStreamRecorder&&"undefined"!==typeof MediaRecorder&&"requestData"in MediaRecorder.prototype&&(a.mimeType||(a.mimeType="video/webm"),a.type||(a.type=a.mimeType.split("/")[0]));a.type||(a.mimeType&&(a.type=a.mimeType.split("/")[0]),a.type||(a.type="audio"));return a}
function GetRecorderType(b,a){if(isChrome||isEdge||isOpera)var f=StereoAudioRecorder;"undefined"!==typeof MediaRecorder&&"requestData"in MediaRecorder.prototype&&!isChrome&&(f=MediaStreamRecorder);"video"===a.type&&(isChrome||isOpera)&&(f=WhammyRecorder);"gif"===a.type&&(f=GifRecorder);"canvas"===a.type&&(f=CanvasRecorder);isMediaRecorderCompatible()&&f!==CanvasRecorder&&f!==GifRecorder&&"undefined"!==typeof MediaRecorder&&"requestData"in MediaRecorder.prototype&&(b.getVideoTracks&&b.getVideoTracks().length||
b.getAudioTracks&&b.getAudioTracks().length)&&("audio"===a.type?"function"===typeof MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported("audio/webm")&&(f=MediaStreamRecorder):"function"===typeof MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported("video/webm")&&(f=MediaStreamRecorder));a.recorderType&&(f=a.recorderType);b instanceof Array&&b.length&&(f=MultiStreamRecorder);!a.disableLogs&&f&&f.name&&console.log("Using recorderType:",f.name||f.constructor.name);return f}
function MRecordRTC(b){this.addStream=function(a){a&&(b=a)};this.mediaType={audio:!0,video:!0};this.startRecording=function(){var a=this.mediaType,f=this.mimeType||{audio:null,video:null,gif:null};"function"!==typeof a.audio&&isMediaRecorderCompatible()&&b.getAudioTracks&&!b.getAudioTracks().length&&(a.audio=!1);"function"!==typeof a.video&&isMediaRecorderCompatible()&&b.getVideoTracks&&!b.getVideoTracks().length&&(a.video=!1);"function"!==typeof a.gif&&isMediaRecorderCompatible()&&b.getVideoTracks&&
!b.getVideoTracks().length&&(a.gif=!1);if(!a.audio&&!a.video&&!a.gif)throw"MediaStream must have either audio or video tracks.";if(a.audio){var c=null;"function"===typeof a.audio&&(c=a.audio);this.audioRecorder=new RecordRTC(b,{type:"audio",bufferSize:this.bufferSize,sampleRate:this.sampleRate,numberOfAudioChannels:this.numberOfAudioChannels||2,disableLogs:this.disableLogs,recorderType:c,mimeType:f.audio,timeSlice:this.timeSlice,onTimeStamp:this.onTimeStamp});a.video||this.audioRecorder.startRecording()}if(a.video){c=
null;"function"===typeof a.video&&(c=a.video);var q=b;if(isMediaRecorderCompatible()&&a.audio&&"function"===typeof a.audio){var r=b.getVideoTracks()[0];navigator.mozGetUserMedia?(q=new MediaStream,q.addTrack(r),c&&c===WhammyRecorder&&(c=MediaStreamRecorder)):q=new MediaStream([r])}this.videoRecorder=new RecordRTC(q,{type:"video",video:this.video,canvas:this.canvas,frameInterval:this.frameInterval||10,disableLogs:this.disableLogs,recorderType:c,mimeType:f.video,timeSlice:this.timeSlice,onTimeStamp:this.onTimeStamp});
a.audio||this.videoRecorder.startRecording()}if(a.audio&&a.video){var g=this;isMediaRecorderCompatible()?(g.audioRecorder=null,g.videoRecorder.startRecording()):g.videoRecorder.initRecorder(function(){g.audioRecorder.initRecorder(function(){g.videoRecorder.startRecording();g.audioRecorder.startRecording()})})}a.gif&&(c=null,"function"===typeof a.gif&&(c=a.gif),this.gifRecorder=new RecordRTC(b,{type:"gif",frameRate:this.frameRate||200,quality:this.quality||10,disableLogs:this.disableLogs,recorderType:c,
mimeType:f.gif}),this.gifRecorder.startRecording())};this.stopRecording=function(a){a=a||function(){};this.audioRecorder&&this.audioRecorder.stopRecording(function(b){a(b,"audio")});this.videoRecorder&&this.videoRecorder.stopRecording(function(b){a(b,"video")});this.gifRecorder&&this.gifRecorder.stopRecording(function(b){a(b,"gif")})};this.pauseRecording=function(){this.audioRecorder&&this.audioRecorder.pauseRecording();this.videoRecorder&&this.videoRecorder.pauseRecording();this.gifRecorder&&this.gifRecorder.pauseRecording()};
this.resumeRecording=function(){this.audioRecorder&&this.audioRecorder.resumeRecording();this.videoRecorder&&this.videoRecorder.resumeRecording();this.gifRecorder&&this.gifRecorder.resumeRecording()};this.getBlob=function(a){var b={};this.audioRecorder&&(b.audio=this.audioRecorder.getBlob());this.videoRecorder&&(b.video=this.videoRecorder.getBlob());this.gifRecorder&&(b.gif=this.gifRecorder.getBlob());a&&a(b);return b};this.destroy=function(){this.audioRecorder&&(this.audioRecorder.destroy(),this.audioRecorder=
null);this.videoRecorder&&(this.videoRecorder.destroy(),this.videoRecorder=null);this.gifRecorder&&(this.gifRecorder.destroy(),this.gifRecorder=null)};this.getDataURL=function(a){function b(a,b){if("undefined"!==typeof Worker){var g=c(function(a){postMessage((new FileReaderSync).readAsDataURL(a))});g.onmessage=function(a){b(a.data)};g.postMessage(a)}else g=new FileReader,g.readAsDataURL(a),g.onload=function(a){b(a.target.result)}}function c(a){a=URL.createObjectURL(new Blob([a.toString(),"this.onmessage =  function (e) {"+
a.name+"(e.data);}"],{type:"application/javascript"}));var b=new Worker(a);if("undefined"!==typeof URL)var c=URL;else if("undefined"!==typeof webkitURL)c=webkitURL;else throw"Neither URL nor webkitURL detected.";c.revokeObjectURL(a);return b}this.getBlob(function(c){c.audio&&c.video?b(c.audio,function(f){b(c.video,function(b){a({audio:f,video:b})})}):c.audio?b(c.audio,function(b){a({audio:b})}):c.video&&b(c.video,function(b){a({video:b})})})};this.writeToDisk=function(){RecordRTC.writeToDisk({audio:this.audioRecorder,
video:this.videoRecorder,gif:this.gifRecorder})};this.save=function(a){a=a||{audio:!0,video:!0,gif:!0};a.audio&&this.audioRecorder&&this.audioRecorder.save("string"===typeof a.audio?a.audio:"");a.video&&this.videoRecorder&&this.videoRecorder.save("string"===typeof a.video?a.video:"");a.gif&&this.gifRecorder&&this.gifRecorder.save("string"===typeof a.gif?a.gif:"")}}MRecordRTC.getFromDisk=RecordRTC.getFromDisk;MRecordRTC.writeToDisk=RecordRTC.writeToDisk;
"undefined"!==typeof RecordRTC&&(RecordRTC.MRecordRTC=MRecordRTC);var browserFakeUserAgent="Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45";
(function(b){if(b&&"undefined"===typeof window&&"undefined"!==typeof global){global.navigator={userAgent:browserFakeUserAgent,getUserMedia:function(){}};global.console||(global.console={});if("undefined"===typeof global.console.log||"undefined"===typeof global.console.error)global.console.error=global.console.log=global.console.log||function(){console.log(arguments)};"undefined"===typeof document&&(b.document={},document.createElement=document.captureStream=document.mozCaptureStream=function(){var a=
{getContext:function(){return a},play:function(){},pause:function(){},drawImage:function(){},toDataURL:function(){return""}};return a},b.HTMLVideoElement=function(){});"undefined"===typeof location&&(b.location={protocol:"file:",href:"",hash:""});"undefined"===typeof screen&&(b.screen={width:0,height:0});"undefined"===typeof URL&&(b.URL={createObjectURL:function(){return""},revokeObjectURL:function(){return""}});b.window=global}})("undefined"!==typeof global?global:null);
var requestAnimationFrame=window.requestAnimationFrame;
if("undefined"===typeof requestAnimationFrame)if("undefined"!==typeof webkitRequestAnimationFrame)requestAnimationFrame=webkitRequestAnimationFrame;else if("undefined"!==typeof mozRequestAnimationFrame)requestAnimationFrame=mozRequestAnimationFrame;else if("undefined"!==typeof msRequestAnimationFrame)requestAnimationFrame=msRequestAnimationFrame;else if("undefined"===typeof requestAnimationFrame){var lastTime=0;requestAnimationFrame=function(b,a){var f=(new Date).getTime(),c=Math.max(0,16-(f-lastTime)),
q=setTimeout(function(){b(f+c)},c);lastTime=f+c;return q}}var cancelAnimationFrame=window.cancelAnimationFrame;"undefined"===typeof cancelAnimationFrame&&("undefined"!==typeof webkitCancelAnimationFrame?cancelAnimationFrame=webkitCancelAnimationFrame:"undefined"!==typeof mozCancelAnimationFrame?cancelAnimationFrame=mozCancelAnimationFrame:"undefined"!==typeof msCancelAnimationFrame?cancelAnimationFrame=msCancelAnimationFrame:"undefined"===typeof cancelAnimationFrame&&(cancelAnimationFrame=function(b){clearTimeout(b)}));
var AudioContext=window.AudioContext;"undefined"===typeof AudioContext&&("undefined"!==typeof webkitAudioContext&&(AudioContext=webkitAudioContext),"undefined"!==typeof mozAudioContext&&(AudioContext=mozAudioContext));var URL=window.URL;"undefined"===typeof URL&&"undefined"!==typeof webkitURL&&(URL=webkitURL);
"undefined"!==typeof navigator&&"undefined"===typeof navigator.getUserMedia&&("undefined"!==typeof navigator.webkitGetUserMedia&&(navigator.getUserMedia=navigator.webkitGetUserMedia),"undefined"!==typeof navigator.mozGetUserMedia&&(navigator.getUserMedia=navigator.mozGetUserMedia));
var isEdge=-1!==navigator.userAgent.indexOf("Edge")&&(!!navigator.msSaveBlob||!!navigator.msSaveOrOpenBlob),isOpera=!!window.opera||-1!==navigator.userAgent.indexOf("OPR/"),isSafari=-1<navigator.userAgent.toLowerCase().indexOf("safari/"),isChrome=!isOpera&&!isEdge&&!!navigator.webkitGetUserMedia||isElectron()||isSafari,MediaStream=window.MediaStream;"undefined"===typeof MediaStream&&"undefined"!==typeof webkitMediaStream&&(MediaStream=webkitMediaStream);
"undefined"!==typeof MediaStream&&("getVideoTracks"in MediaStream.prototype||(MediaStream.prototype.getVideoTracks=function(){if(!this.getTracks)return[];var b=[];this.getTracks().forEach(function(a){-1!==a.kind.toString().indexOf("video")&&b.push(a)});return b},MediaStream.prototype.getAudioTracks=function(){if(!this.getTracks)return[];var b=[];this.getTracks().forEach(function(a){-1!==a.kind.toString().indexOf("audio")&&b.push(a)});return b}),"undefined"===typeof MediaStream.prototype.stop&&(MediaStream.prototype.stop=
function(){this.getTracks().forEach(function(b){b.stop()})}));function bytesToSize(b){if(0===b)return"0 Bytes";var a=parseInt(Math.floor(Math.log(b)/Math.log(1E3)),10);return(b/Math.pow(1E3,a)).toPrecision(3)+" "+["Bytes","KB","MB","GB","TB"][a]}
function invokeSaveAsDialog(b,a){if(!b)throw"Blob object is required.";if(!b.type)try{b.type="video/webm"}catch(q){}var f=(b.type||"video/webm").split("/")[1];a&&-1!==a.indexOf(".")&&(f=a.split("."),a=f[0],f=f[1]);f=(a||Math.round(9999999999*Math.random())+888888888)+"."+f;if("undefined"!==typeof navigator.msSaveOrOpenBlob)return navigator.msSaveOrOpenBlob(b,f);if("undefined"!==typeof navigator.msSaveBlob)return navigator.msSaveBlob(b,f);var c=document.createElement("a");c.href=URL.createObjectURL(b);
c.download=f;c.style="display:none;opacity:0;color:transparent;";(document.body||document.documentElement).appendChild(c);"function"===typeof c.click?c.click():(c.target="_blank",c.dispatchEvent(new MouseEvent("click",{view:window,bubbles:!0,cancelable:!0})));URL.revokeObjectURL(c.href)}
function isElectron(){return"undefined"!==typeof window&&"object"===typeof window.process&&"renderer"===window.process.type||"undefined"!==typeof process&&"object"===typeof process.versions&&process.versions.electron||"object"===typeof navigator&&"string"===typeof navigator.userAgent&&0<=navigator.userAgent.indexOf("Electron")?!0:!1}
function setSrcObject(b,a,f){if("createObjectURL"in URL&&!f)try{a.src=URL.createObjectURL(b)}catch(c){setSrcObject(b,a,!0)}else"srcObject"in a?a.srcObject=b:"mozSrcObject"in a?a.mozSrcObject=b:alert("createObjectURL/srcObject both are not supported.")}var Storage={};"undefined"!==typeof AudioContext?Storage.AudioContext=AudioContext:"undefined"!==typeof webkitAudioContext&&(Storage.AudioContext=webkitAudioContext);"undefined"!==typeof RecordRTC&&(RecordRTC.Storage=Storage);
function isMediaRecorderCompatible(){var b=!!window.opera||0<=navigator.userAgent.indexOf(" OPR/"),a=!!window.chrome&&!b||isElectron();if("undefined"!==typeof window.InstallTrigger)return!0;var f=navigator.userAgent,c=""+parseFloat(navigator.appVersion);parseInt(navigator.appVersion,10);var q;if(a||b)b=f.indexOf("Chrome"),c=f.substring(b+7);-1!==(q=c.indexOf(";"))&&(c=c.substring(0,q));-1!==(q=c.indexOf(" "))&&(c=c.substring(0,q));f=parseInt(""+c,10);isNaN(f)&&(parseFloat(navigator.appVersion),f=
parseInt(navigator.appVersion,10));return 49<=f}
function MediaStreamRecorder(b,a){function f(){g.timestamps.push((new Date).getTime());if("function"===typeof a.onTimeStamp)a.onTimeStamp(g.timestamps[g.timestamps.length-1],g.timestamps)}function c(a){return d&&d.mimeType?d.mimeType:a.mimeType||"video/webm"}function q(){l=[];d=null;g.timestamps=[]}function r(){if("active"in b){if(!b.active)return!1}else if("ended"in b&&b.ended)return!1;return!0}var g=this;if("undefined"===typeof b)throw'First argument "MediaStream" is required.';if("undefined"===
typeof MediaRecorder)throw"Your browser does not supports Media Recorder API. Please try other modules e.g. WhammyRecorder or StereoAudioRecorder.";a=a||{mimeType:"video/webm"};if("audio"===a.type){if(b.getVideoTracks().length&&b.getAudioTracks().length){if(navigator.mozGetUserMedia){var u=new MediaStream;u.addTrack(b.getAudioTracks()[0])}else u=new MediaStream(b.getAudioTracks());b=u}a.mimeType&&-1!==a.mimeType.toString().toLowerCase().indexOf("audio")||(a.mimeType=isChrome?"audio/webm":"audio/ogg");
a.mimeType&&"audio/ogg"!==a.mimeType.toString().toLowerCase()&&navigator.mozGetUserMedia&&(a.mimeType="audio/ogg")}var l=[];this.getArrayOfBlobs=function(){return l};this.record=function(){g.blob=null;g.clearRecordedData();g.timestamps=[];n=[];l=[];var e=a;a.disableLogs||console.log("Passing following config over MediaRecorder API.",e);d&&(d=null);isChrome&&!isMediaRecorderCompatible()&&(e="video/vp8");"function"===typeof MediaRecorder.isTypeSupported&&e.mimeType&&!MediaRecorder.isTypeSupported(e.mimeType)&&
(a.disableLogs||console.warn("MediaRecorder API seems unable to record mimeType:",e.mimeType),e.mimeType="audio"===a.type?"audio/webm":"video/webm");try{d=new MediaRecorder(b,e),a.mimeType=e.mimeType}catch(m){d=new MediaRecorder(b)}e.mimeType&&!MediaRecorder.isTypeSupported&&"canRecordMimeType"in d&&!1===d.canRecordMimeType(e.mimeType)&&(a.disableLogs||console.warn("MediaRecorder API seems unable to record mimeType:",e.mimeType));d.ignoreMutedMedia=!0===a.ignoreMutedMedia;d.ondataavailable=function(b){b.data&&
n.push("ondataavailable: "+bytesToSize(b.data.size));"number"===typeof a.timeSlice?b.data&&b.data.size&&100<b.data.size&&(l.push(b.data),f(),"function"===typeof a.ondataavailable&&(b=a.getNativeBlob?b.data:new Blob([b.data],{type:c(e)}),a.ondataavailable(b))):!b.data||!b.data.size||100>b.data.size||g.blob?g.recordingCallback&&(g.recordingCallback(new Blob([],{type:c(e)})),g.recordingCallback=null):(g.blob=a.getNativeBlob?b.data:new Blob([b.data],{type:c(e)}),g.recordingCallback&&(g.recordingCallback(g.blob),
g.recordingCallback=null))};d.onstart=function(){n.push("started")};d.onpause=function(){n.push("paused")};d.onresume=function(){n.push("resumed")};d.onstop=function(){n.push("stopped")};d.onerror=function(b){n.push("error: "+b);a.disableLogs||(-1!==b.name.toString().toLowerCase().indexOf("invalidstate")?console.error("The MediaRecorder is not in a state in which the proposed operation is allowed to be executed.",b):-1!==b.name.toString().toLowerCase().indexOf("notsupported")?console.error("MIME type (",
e.mimeType,") is not supported.",b):-1!==b.name.toString().toLowerCase().indexOf("security")?console.error("MediaRecorder security error",b):"OutOfMemory"===b.name?console.error("The UA has exhaused the available memory. User agents SHOULD provide as much additional information as possible in the message attribute.",b):"IllegalStreamModification"===b.name?console.error("A modification to the stream has occurred that makes it impossible to continue recording. An example would be the addition of a Track while recording is occurring. User agents SHOULD provide as much additional information as possible in the message attribute.",
b):"OtherRecordingError"===b.name?console.error("Used for an fatal error other than those listed above. User agents SHOULD provide as much additional information as possible in the message attribute.",b):"GenericError"===b.name?console.error("The UA cannot provide the codec or recording option that has been requested.",b):console.error("MediaRecorder Error",b));!g.manuallyStopped&&d&&"inactive"===d.state?(delete a.timeslice,d.start(6E5)):setTimeout(void 0,1E3);"inactive"!==d.state&&"stopped"!==d.state&&
d.stop()};"number"===typeof a.timeSlice?(f(),d.start(a.timeSlice)):d.start(36E5);a.initCallback&&a.initCallback()};this.timestamps=[];this.stop=function(b){g.manuallyStopped=!0;d&&(this.recordingCallback=b||function(){},"recording"===d.state&&d.stop(),"number"===typeof a.timeSlice&&setTimeout(function(){g.blob=new Blob(l,{type:c(a)});g.recordingCallback(g.blob)},100))};this.pause=function(){d&&"recording"===d.state&&d.pause()};this.resume=function(){d&&"paused"===d.state&&d.resume()};this.clearRecordedData=
function(){d&&"recording"===d.state&&g.stop(q);q()};var d;this.getInternalRecorder=function(){return d};this.blob=null;this.getState=function(){return d?d.state||"inactive":"inactive"};var n=[];this.getAllStates=function(){return n};"undefined"===typeof a.checkForInactiveTracks&&(a.checkForInactiveTracks=!1);g=this;(function m(){d&&!1!==a.checkForInactiveTracks&&(!1===r()?(a.disableLogs||console.log("MediaStream seems stopped."),g.stop()):setTimeout(m,1E3))})();this.name="MediaStreamRecorder";this.toString=
function(){return this.name}}"undefined"!==typeof RecordRTC&&(RecordRTC.MediaStreamRecorder=MediaStreamRecorder);
function StereoAudioRecorder(b,a){function f(){if(!1===a.checkForInactiveTracks)return!0;if("active"in b){if(!b.active)return!1}else if("ended"in b&&b.ended)return!1;return!0}function c(a,b){function h(a,b){function h(a,b,h){b=Math.round(b/h*a.length);h=[];var k=Number((a.length-1)/(b-1));h[0]=a[0];for(var c=1;c<b-1;c++){var p=c*k,t=Number(Math.floor(p)).toFixed(),d=Number(Math.ceil(p)).toFixed(),e=a[t];h[c]=e+(a[d]-e)*(p-t)}h[b-1]=a[a.length-1];return h}function k(a,b){for(var h=new Float64Array(b),
k=0,c=a.length,p=0;p<c;p++){var t=a[p];h.set(t,k);k+=t.length}return h}function p(a,b){for(var h=a.length+b.length,k=new Float64Array(h),c=0,p=0;p<h;)k[p++]=a[c],k[p++]=b[c],c++;return k}function c(a,b,h){for(var k=h.length,c=0;c<k;c++)a.setUint8(b+c,h.charCodeAt(c))}var d=a.numberOfAudioChannels,t=a.leftBuffers.slice(0),f=a.rightBuffers.slice(0),g=a.sampleRate,e=a.internalInterleavedLength,v=a.desiredSampRate;2===d&&(t=k(t,e),f=k(f,e),v&&(t=h(t,v,g),f=h(f,v,g)));1===d&&(t=k(t,e),v&&(t=h(t,v,g)));
v&&(g=v);var l;2===d&&(l=p(t,f));1===d&&(l=t);t=l.length;f=new ArrayBuffer(44+2*t);e=new DataView(f);c(e,0,"RIFF");e.setUint32(4,44+2*t,!0);c(e,8,"WAVE");c(e,12,"fmt ");e.setUint32(16,16,!0);e.setUint16(20,1,!0);e.setUint16(22,d,!0);e.setUint32(24,g,!0);e.setUint32(28,2*g,!0);e.setUint16(32,2*d,!0);e.setUint16(34,16,!0);c(e,36,"data");e.setUint32(40,2*t,!0);d=44;for(g=0;g<t;g++)e.setInt16(d,32767*l[g],!0),d+=2;if(b)return b({buffer:f,view:e});postMessage({buffer:f,view:e})}if(isEdge||isOpera||isSafari||
a.noWorker)h(a,function(a){b(a.buffer,a.view)});else{var k=q(h);k.onmessage=function(a){b(a.data.buffer,a.data.view);URL.revokeObjectURL(k.workerURL)};k.postMessage(a)}}function q(a){a=URL.createObjectURL(new Blob([a.toString(),";this.onmessage =  function (e) {"+a.name+"(e.data);}"],{type:"application/javascript"}));var b=new Worker(a);b.workerURL=a;return b}function r(){d=[];n=[];m=0;z=e=A=!1;v=null;l.leftchannel=d;l.rightchannel=n;l.numberOfAudioChannels=k;l.desiredSampRate=p;l.sampleRate=y;l.recordingLength=
m;B=[];C=[];D=0}function g(){x&&(x.onaudioprocess=null,x.disconnect(),x=null);w&&(w.disconnect(),w=null);r()}function u(){e&&"function"===typeof a.ondataavailable&&"undefined"!==typeof a.timeSlice&&(B.length?(c({desiredSampRate:p,sampleRate:y,numberOfAudioChannels:k,internalInterleavedLength:D,leftBuffers:B,rightBuffers:1===k?[]:C},function(b,h){var k=new Blob([h],{type:"audio/wav"});a.ondataavailable(k);setTimeout(u,a.timeSlice)}),B=[],C=[],D=0):setTimeout(u,a.timeSlice))}if(!b.getAudioTracks().length)throw"Your stream has no audio tracks.";
a=a||{};var l=this,d=[],n=[],e=!1,m=0,k=2,p=a.desiredSampRate;!0===a.leftChannel&&(k=1);1===a.numberOfAudioChannels&&(k=1);if(!k||1>k)k=2;a.disableLogs||console.log("StereoAudioRecorder is set to record number of channels: ",k);"undefined"===typeof a.checkForInactiveTracks&&(a.checkForInactiveTracks=!0);this.record=function(){if(!1===f())throw"Please make sure MediaStream is active.";r();A=z=!1;e=!0;"undefined"!==typeof a.timeSlice&&u()};this.stop=function(a){a=a||function(){};e=!1;c({desiredSampRate:p,
sampleRate:y,numberOfAudioChannels:k,internalInterleavedLength:m,leftBuffers:d,rightBuffers:1===k?[]:n},function(b,h){l.blob=new Blob([h],{type:"audio/wav"});l.buffer=new ArrayBuffer(h.buffer.byteLength);l.view=h;l.sampleRate=p||y;l.bufferSize=t;l.length=m;A=!1;a&&a(l.blob)})};Storage.AudioContextConstructor||(Storage.AudioContextConstructor=new Storage.AudioContext);var v=Storage.AudioContextConstructor,w=v.createMediaStreamSource(b),h=[0,256,512,1024,2048,4096,8192,16384],t="undefined"===typeof a.bufferSize?
4096:a.bufferSize;-1===h.indexOf(t)&&(a.disableLogs||console.warn("Legal values for buffer-size are "+JSON.stringify(h,null,"\t")));if(v.createJavaScriptNode)var x=v.createJavaScriptNode(t,k,k);else if(v.createScriptProcessor)x=v.createScriptProcessor(t,k,k);else throw"WebAudio API has no support on this browser.";w.connect(x);a.bufferSize||(t=x.bufferSize);var y="undefined"!==typeof a.sampleRate?a.sampleRate:v.sampleRate||44100;if(22050>y||96E3<y)a.disableLogs||console.warn("sample-rate must be under range 22050 and 96000.");
a.disableLogs||(console.log("sample-rate",y),console.log("buffer-size",t),a.desiredSampRate&&console.log("Desired sample-rate",a.desiredSampRate));var z=!1;this.pause=function(){z=!0};this.resume=function(){if(!1===f())throw"Please make sure MediaStream is active.";e?z=!1:(a.disableLogs||console.log("Seems recording has been restarted."),this.record())};this.clearRecordedData=function(){a.checkForInactiveTracks=!1;e&&this.stop(g);g()};this.name="StereoAudioRecorder";this.toString=function(){return this.name};
var A=!1;x.onaudioprocess=function(b){if(!z)if(!1===f()&&(a.disableLogs||console.log("MediaStream seems stopped."),x.disconnect(),e=!1),e){if(!A){A=!0;if(a.onAudioProcessStarted)a.onAudioProcessStarted();a.initCallback&&a.initCallback()}var h=b.inputBuffer.getChannelData(0);h=new Float32Array(h);d.push(h);if(2===k){b=b.inputBuffer.getChannelData(1);var c=new Float32Array(b);n.push(c)}m+=t;l.recordingLength=m;"undefined"!==typeof a.timeSlice&&(D+=t,B.push(h),2===k&&C.push(c))}else w&&(w.disconnect(),
w=null)};x.connect(v.destination);this.leftchannel=d;this.rightchannel=n;this.numberOfAudioChannels=k;this.desiredSampRate=p;this.sampleRate=y;l.recordingLength=m;var B=[];var C=[];var D=0}"undefined"!==typeof RecordRTC&&(RecordRTC.StereoAudioRecorder=StereoAudioRecorder);
function CanvasRecorder(b,a){function f(){p.frames=[];m=e=!1}function c(){var a=document.createElement("canvas"),k=a.getContext("2d");a.width=b.width;a.height=b.height;k.drawImage(b,0,0);return a}function q(){if(m)return k=(new Date).getTime(),setTimeout(q,500);if("canvas"===b.nodeName.toLowerCase()){var d=(new Date).getTime()-k;k=(new Date).getTime();p.frames.push({image:c(),duration:d});e&&setTimeout(q,a.frameInterval)}else html2canvas(b,{grabMouse:"undefined"===typeof a.showMousePointer||a.showMousePointer,
onrendered:function(b){var h=(new Date).getTime()-k;if(!h)return setTimeout(q,a.frameInterval);k=(new Date).getTime();p.frames.push({image:b.toDataURL("image/webp",1),duration:h});e&&setTimeout(q,a.frameInterval)}})}if("undefined"===typeof html2canvas)throw"Please link: https://cdn.webrtc-experiment.com/screenshot.js";a=a||{};a.frameInterval||(a.frameInterval=10);var r=!1;["captureStream","mozCaptureStream","webkitCaptureStream"].forEach(function(a){a in document.createElement("canvas")&&(r=!0)});
var g=(!!window.webkitRTCPeerConnection||!!window.webkitGetUserMedia)&&!!window.chrome,u=50,l=navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);g&&l&&l[2]&&(u=parseInt(l[2],10));g&&52>u&&(r=!1);var d;if(r)if(a.disableLogs||console.log("Your browser supports both MediRecorder API and canvas.captureStream!"),b instanceof HTMLCanvasElement)var n=b;else if(b instanceof CanvasRenderingContext2D)n=b.canvas;else throw"Please pass either HTMLCanvasElement or CanvasRenderingContext2D.";else navigator.mozGetUserMedia&&
(a.disableLogs||console.error("Canvas recording is NOT supported in Firefox."));var e;this.record=function(){e=!0;if(r&&!a.useWhammyRecorder){var b;"captureStream"in n?b=n.captureStream(25):"mozCaptureStream"in n?b=n.mozCaptureStream(25):"webkitCaptureStream"in n&&(b=n.webkitCaptureStream(25));try{var c=new MediaStream;c.addTrack(b.getVideoTracks()[0]);b=c}catch(h){}if(!b)throw"captureStream API are NOT available.";d=new MediaStreamRecorder(b,{mimeType:"video/webm"});d.record()}else p.frames=[],k=
(new Date).getTime(),q();a.initCallback&&a.initCallback()};this.getWebPImages=function(k){if("canvas"===b.nodeName.toLowerCase()){var c=p.frames.length;p.frames.forEach(function(b,k){var h=c-k;a.disableLogs||console.log(h+"/"+c+" frames remaining");if(a.onEncodingCallback)a.onEncodingCallback(h,c);h=b.image.toDataURL("image/webp",1);p.frames[k].image=h});a.disableLogs||console.log("Generating WebM")}k()};this.stop=function(b){e=!1;var k=this;r&&d?d.stop(b):this.getWebPImages(function(){p.compile(function(h){a.disableLogs||
console.log("Recording finished!");k.blob=h;k.blob.forEach&&(k.blob=new Blob([],{type:"video/webm"}));b&&b(k.blob);p.frames=[]})})};var m=!1;this.pause=function(){m=!0;d instanceof MediaStreamRecorder&&d.pause()};this.resume=function(){m=!1;d instanceof MediaStreamRecorder?d.resume():e||this.record()};this.clearRecordedData=function(){e&&this.stop(f);f()};this.name="CanvasRecorder";this.toString=function(){return this.name};var k=(new Date).getTime(),p=new Whammy.Video(100)}
"undefined"!==typeof RecordRTC&&(RecordRTC.CanvasRecorder=CanvasRecorder);
function WhammyRecorder(b,a){function f(a){a="undefined"!==typeof a?a:10;var b=(new Date).getTime()-e;if(!b)return setTimeout(f,a,a);if(u)return e=(new Date).getTime(),setTimeout(f,100);e=(new Date).getTime();n.paused&&n.play();d.drawImage(n,0,0,l.width,l.height);m.frames.push({duration:b,image:l.toDataURL("image/webp")});g||setTimeout(f,a,a)}function c(a){var b=-1,c=a.length;(function h(){b++;b===c?a.callback():setTimeout(function(){a.functionToLoop(h,b)},1)})()}function q(a,b,d,e,h){var k=document.createElement("canvas");
k.width=l.width;k.height=l.height;var p=k.getContext("2d"),g=[],f=-1===b,m=b&&0<b&&b<=a.length?b:a.length,q=Math.sqrt(Math.pow(255,2)+Math.pow(255,2)+Math.pow(255,2)),v=d&&0<=d&&1>=d?d:0,r=e&&0<=e&&1>=e?e:0,n=!1;c({length:m,functionToLoop:function(b,h){var c,k,d,e=function(){!n&&d-c<=d*r||(f&&(n=!0),g.push(a[h]));b()};if(n)e();else{var t=new Image;t.onload=function(){p.drawImage(t,0,0,l.width,l.height);var a=p.getImageData(0,0,l.width,l.height);c=0;k=a.data.length;d=a.data.length/4;for(var b=0;b<
k;b+=4)Math.sqrt(Math.pow(a.data[b]-0,2)+Math.pow(a.data[b+1]-0,2)+Math.pow(a.data[b+2]-0,2))<=q*v&&c++;e()};t.src=a[h].image}},callback:function(){g=g.concat(a.slice(m));0>=g.length&&g.push(a[a.length-1]);h(g)}})}function r(){m.frames=[];g=!0;u=!1}a=a||{};a.frameInterval||(a.frameInterval=10);a.disableLogs||console.log("Using frames-interval:",a.frameInterval);this.record=function(){a.width||(a.width=320);a.height||(a.height=240);a.video||(a.video={width:a.width,height:a.height});a.canvas||(a.canvas=
{width:a.width,height:a.height});l.width=a.canvas.width||320;l.height=a.canvas.height||240;d=l.getContext("2d");a.video&&a.video instanceof HTMLVideoElement?(n=a.video.cloneNode(),a.initCallback&&a.initCallback()):(n=document.createElement("video"),setSrcObject(b,n),n.onloadedmetadata=function(){a.initCallback&&a.initCallback()},n.width=a.video.width,n.height=a.video.height);n.muted=!0;n.play();e=(new Date).getTime();m=new Whammy.Video;a.disableLogs||(console.log("canvas resolutions",l.width,"*",
l.height),console.log("video width/height",n.width||l.width,"*",n.height||l.height));f(a.frameInterval)};var g=!1;this.stop=function(b){b=b||function(){};g=!0;var c=this;setTimeout(function(){q(m.frames,-1,null,null,function(k){m.frames=k;a.advertisement&&a.advertisement.length&&(m.frames=a.advertisement.concat(m.frames));m.compile(function(a){c.blob=a;c.blob.forEach&&(c.blob=new Blob([],{type:"video/webm"}));b&&b(c.blob)})})},10)};var u=!1;this.pause=function(){u=!0};this.resume=function(){u=!1;
g&&this.record()};this.clearRecordedData=function(){g||this.stop(r);r()};this.name="WhammyRecorder";this.toString=function(){return this.name};var l=document.createElement("canvas"),d=l.getContext("2d"),n,e,m}"undefined"!==typeof RecordRTC&&(RecordRTC.WhammyRecorder=WhammyRecorder);
var Whammy=function(){function b(a){this.frames=[];this.duration=a||1;this.quality=.8}function a(a){a=URL.createObjectURL(new Blob([a.toString(),"this.onmessage =  function (e) {"+a.name+"(e.data);}"],{type:"application/javascript"}));var b=new Worker(a);URL.revokeObjectURL(a);return b}function f(a){function b(a,b,c){return[{data:a,id:231}].concat(c.map(function(a){var h=d({discardable:0,frame:a.data.slice(4),invisible:0,keyframe:1,lacing:0,trackNum:1,timecode:Math.round(b)});b+=a.duration;return{data:h,
id:163}}))}function c(a){for(var b=[];0<a;)b.push(a&255),a>>=8;return new Uint8Array(b.reverse())}function g(a){return new Uint8Array(a.split("").map(function(a){return a.charCodeAt(0)}))}function f(a){var b=[];a=(a.length%8?Array(9-a.length%8).join("0"):"")+a;for(var c=0;c<a.length;c+=8)b.push(parseInt(a.substr(c,8),2));return new Uint8Array(b)}function l(a){for(var b=[],d=0;d<a.length;d++){var k=a[d].data;"object"===typeof k&&(k=l(k));"number"===typeof k&&(k=f(k.toString(2)));"string"===typeof k&&
(k=g(k));var h=k.size||k.byteLength||k.length,e=Math.ceil(Math.ceil(Math.log(h)/Math.log(2))/8);h=h.toString(2);h=Array(7*e+8-h.length).join("0")+h;e=Array(e).join("0")+"1"+h;b.push(c(a[d].id));b.push(f(e));b.push(k)}return new Blob(b,{type:"video/webm"})}function d(a){var b=0;a.keyframe&&(b|=128);a.invisible&&(b|=8);a.lacing&&(b|=a.lacing<<1);a.discardable&&(b|=1);if(127<a.trackNum)throw"TrackNumber > 127 not supported";return[a.trackNum|128,a.timecode>>8,a.timecode&255,b].map(function(a){return String.fromCharCode(a)}).join("")+
a.frame}function n(a,b){return parseInt(a.substr(b+4,4).split("").map(function(a){a=a.charCodeAt(0).toString(2);return Array(8-a.length+1).join("0")+a}).join(""),2)}function e(a){for(var b=0,c={};b<a.length;){var d=a.substr(b,4),h=n(a,b),k=a.substr(b+4+4,h);b+=8+h;c[d]=c[d]||[];"RIFF"===d||"LIST"===d?c[d].push(e(k)):c[d].push(k)}return c}function m(a){return[].slice.call(new Uint8Array((new Float64Array([a])).buffer),0).map(function(a){return String.fromCharCode(a)}).reverse().join("")}a=new function(a){if(a[0]){var c=
a[0].width;for(var d=a[0].height,e=a[0].duration,h=1;h<a.length;h++)e+=a[h].duration;c={duration:e,width:c,height:d}}else postMessage({error:"Something went wrong. Maybe WebP format is not supported in the current browser."}),c=void 0;if(!c)return[];c=[{id:440786851,data:[{data:1,id:17030},{data:1,id:17143},{data:4,id:17138},{data:8,id:17139},{data:"webm",id:17026},{data:2,id:17031},{data:2,id:17029}]},{id:408125543,data:[{id:357149030,data:[{data:1E6,id:2807729},{data:"whammy",id:19840},{data:"whammy",
id:22337},{data:m(c.duration),id:17545}]},{id:374648427,data:[{id:174,data:[{data:1,id:215},{data:1,id:29637},{data:0,id:156},{data:"und",id:2274716},{data:"V_VP8",id:134},{data:"VP8",id:2459272},{data:1,id:131},{id:224,data:[{data:c.width,id:176},{data:c.height,id:186}]}]}]}]}];for(e=d=0;d<a.length;){var g=[];h=0;do g.push(a[d]),h+=a[d].duration,d++;while(d<a.length&&3E4>h);g={id:524531317,data:b(e,0,g)};c[1].data.push(g);e+=h}return l(c)}(a.map(function(a){var b=e(atob(a.image.slice(23)));for(var c=
b.RIFF[0].WEBP[0],d=c.indexOf("\u009d\u0001*"),h=0,g=[];4>h;h++)g[h]=c.charCodeAt(d+3+h);h=g[1]<<8|g[0];d=h&16383;h=g[3]<<8|g[2];b={width:d,height:h&16383,data:c,riff:b};b.duration=a.duration;return b}));postMessage(a)}b.prototype.add=function(a,b){"canvas"in a&&(a=a.canvas);"toDataURL"in a&&(a=a.toDataURL("image/webp",this.quality));if(!/^data:image\/webp;base64,/ig.test(a))throw"Input must be formatted properly as a base64 encoded DataURI of type image/webp";this.frames.push({image:a,duration:b||
this.duration})};b.prototype.compile=function(b){var c=a(f);c.onmessage=function(a){a.data.error?console.error(a.data.error):b(a.data)};c.postMessage(this.frames)};return{Video:b}}();"undefined"!==typeof RecordRTC&&(RecordRTC.Whammy=Whammy);
var DiskStorage={init:function(){function b(){function b(b){g.objectStore(a.dataStoreName).get(b).onsuccess=function(c){a.callback&&a.callback(c.target.result,b)}}var g=c.transaction([a.dataStoreName],"readwrite");a.videoBlob&&g.objectStore(a.dataStoreName).put(a.videoBlob,"videoBlob");a.gifBlob&&g.objectStore(a.dataStoreName).put(a.gifBlob,"gifBlob");a.audioBlob&&g.objectStore(a.dataStoreName).put(a.audioBlob,"audioBlob");b("audioBlob");b("videoBlob");b("gifBlob")}var a=this;if("undefined"===typeof indexedDB||
"undefined"===typeof indexedDB.open)console.error("IndexedDB API are not available in this browser.");else{var f=this.dbName||location.href.replace(/\/|:|#|%|\.|\[|\]/g,""),c,q=indexedDB.open(f,1);q.onerror=a.onError;q.onsuccess=function(){c=q.result;c.onerror=a.onError;c.setVersion?1!==c.version?c.setVersion(1).onsuccess=function(){c.createObjectStore(a.dataStoreName);b()}:b():b()};q.onupgradeneeded=function(b){b.target.result.createObjectStore(a.dataStoreName)}}},Fetch:function(b){this.callback=
b;this.init();return this},Store:function(b){this.audioBlob=b.audioBlob;this.videoBlob=b.videoBlob;this.gifBlob=b.gifBlob;this.init();return this},onError:function(b){console.error(JSON.stringify(b,null,"\t"))},dataStoreName:"recordRTC",dbName:null};"undefined"!==typeof RecordRTC&&(RecordRTC.DiskStorage=DiskStorage);
function GifRecorder(b,a){if("undefined"===typeof GIFEncoder){var f=document.createElement("script");f.src="https://cdn.webrtc-experiment.com/gif-recorder.js";(document.body||document.documentElement).appendChild(f)}a=a||{};var c=b instanceof CanvasRenderingContext2D||b instanceof HTMLCanvasElement;this.record=function(){function b(f){if(!0!==m.clearedRecordedData){if(q)return setTimeout(function(){b(f)},100);d=requestAnimationFrame(b);if(!(90>f-n)){!c&&l.paused&&l.play();c||g.drawImage(l,0,0,r.width,
r.height);if(a.onGifPreview)a.onGifPreview(r.toDataURL("image/png"));e.addFrame(g);n=f}}}if("undefined"===typeof GIFEncoder)setTimeout(m.record,1E3);else if(u){c||(a.width||(a.width=l.offsetWidth||320),a.height||(a.height=l.offsetHeight||240),a.video||(a.video={width:a.width,height:a.height}),a.canvas||(a.canvas={width:a.width,height:a.height}),r.width=a.canvas.width||320,r.height=a.canvas.height||240,l.width=a.video.width||320,l.height=a.video.height||240);e=new GIFEncoder;e.setRepeat(0);e.setDelay(a.frameRate||
200);e.setQuality(a.quality||10);e.start();if("function"===typeof a.onGifRecordingStarted)a.onGifRecordingStarted();Date.now();d=requestAnimationFrame(b);a.initCallback&&a.initCallback()}else setTimeout(m.record,1E3)};this.stop=function(a){a=a||function(){};d&&cancelAnimationFrame(d);Date.now();this.blob=new Blob([new Uint8Array(e.stream().bin)],{type:"image/gif"});a(this.blob);e.stream().bin=[]};var q=!1;this.pause=function(){q=!0};this.resume=function(){q=!1};this.clearRecordedData=function(){m.clearedRecordedData=
!0;e&&(e.stream().bin=[])};this.name="GifRecorder";this.toString=function(){return this.name};var r=document.createElement("canvas"),g=r.getContext("2d");c&&(b instanceof CanvasRenderingContext2D?(g=b,r=g.canvas):b instanceof HTMLCanvasElement&&(g=b.getContext("2d"),r=b));var u=!0;if(!c){var l=document.createElement("video");l.muted=!0;l.autoplay=!0;u=!1;l.onloadedmetadata=function(){u=!0};setSrcObject(b,l);l.play()}var d=null,n,e,m=this}"undefined"!==typeof RecordRTC&&(RecordRTC.GifRecorder=GifRecorder);
function MultiStreamsMixer(b){function a(b,c,d){if("createObjectURL"in p&&!d)try{c.src=p.createObjectURL(b)}catch(y){a(b,c,!0)}else"srcObject"in c?c.srcObject=b:"mozSrcObject"in c?c.mozSrcObject=b:alert("createObjectURL/srcObject both are not supported.")}function f(){if(!d){var a=l.length,b=!1,e=[];l.forEach(function(a){a.stream||(a.stream={});a.stream.fullcanvas?b=a:e.push(a)});if(b)n.width=b.stream.width,n.height=b.stream.height;else if(e.length){n.width=1<a?2*e[0].width:e[0].width;var g=1;if(3===
a||4===a)g=2;if(5===a||6===a)g=3;if(7===a||8===a)g=4;if(9===a||10===a)g=5;n.height=e[0].height*g}else n.width=m.width||360,n.height=m.height||240;b&&b instanceof HTMLVideoElement&&c(b);e.forEach(function(a,b){c(a,b)});setTimeout(f,m.frameInterval)}}function c(a,b){if(!d){var c=0,h=0,g=a.width,f=a.height;1===b&&(c=a.width);2===b&&(h=a.height);3===b&&(c=a.width,h=a.height);4===b&&(h=2*a.height);5===b&&(c=a.width,h=2*a.height);6===b&&(h=3*a.height);7===b&&(c=a.width,h=3*a.height);"undefined"!==typeof a.stream.left&&
(c=a.stream.left);"undefined"!==typeof a.stream.top&&(h=a.stream.top);"undefined"!==typeof a.stream.width&&(g=a.stream.width);"undefined"!==typeof a.stream.height&&(f=a.stream.height);e.drawImage(a,c,h,g,f);if("function"===typeof a.stream.onRender)a.stream.onRender(e,c,h,g,f,b)}}function q(){u();var a;"captureStream"in n?a=n.captureStream():"mozCaptureStream"in n?a=n.mozCaptureStream():m.disableLogs||console.error("Upgrade to latest Chrome or otherwise enable this flag: chrome://flags/#enable-experimental-web-platform-features");
var b=new v;a.getVideoTracks().forEach(function(a){b.addTrack(a)});return n.stream=b}function r(){w.AudioContextConstructor||(w.AudioContextConstructor=new w.AudioContext);m.audioContext=w.AudioContextConstructor;m.audioSources=[];!0===m.useGainNode&&(m.gainNode=m.audioContext.createGain(),m.gainNode.connect(m.audioContext.destination),m.gainNode.gain.value=0);var a=0;b.forEach(function(b){b.getAudioTracks().length&&(a++,b=m.audioContext.createMediaStreamSource(b),!0===m.useGainNode&&b.connect(m.gainNode),
m.audioSources.push(b))});if(a)return m.audioDestination=m.audioContext.createMediaStreamDestination(),m.audioSources.forEach(function(a){a.connect(m.audioDestination)}),m.audioDestination.stream}function g(b){var c=document.createElement("video");a(b,c);c.muted=!0;c.volume=0;c.width=b.width||m.width||360;c.height=b.height||m.height||240;c.play();return c}function u(a){l=[];a=a||b;a.forEach(function(a){if(a.getVideoTracks().length){var b=g(a);b.stream=a;l.push(b)}})}var l=[],d=!1,n=document.createElement("canvas"),
e=n.getContext("2d");n.style="opacity:0;position:absolute;z-index:-1;top: -100000000;left:-1000000000; margin-top:-1000000000;margin-left:-1000000000;";(document.body||document.documentElement).appendChild(n);this.disableLogs=!1;this.frameInterval=10;this.width=360;this.height=240;this.useGainNode=!0;var m=this,k=window.AudioContext;"undefined"===typeof k&&("undefined"!==typeof webkitAudioContext&&(k=webkitAudioContext),"undefined"!==typeof mozAudioContext&&(k=mozAudioContext));var p=window.URL;"undefined"===
typeof p&&"undefined"!==typeof webkitURL&&(p=webkitURL);"undefined"!==typeof navigator&&"undefined"===typeof navigator.getUserMedia&&("undefined"!==typeof navigator.webkitGetUserMedia&&(navigator.getUserMedia=navigator.webkitGetUserMedia),"undefined"!==typeof navigator.mozGetUserMedia&&(navigator.getUserMedia=navigator.mozGetUserMedia));var v=window.MediaStream;"undefined"===typeof v&&"undefined"!==typeof webkitMediaStream&&(v=webkitMediaStream);"undefined"!==typeof v&&("getVideoTracks"in v.prototype||
(v.prototype.getVideoTracks=function(){if(!this.getTracks)return[];var a=[];this.getTracks.forEach(function(b){-1!==b.kind.toString().indexOf("video")&&a.push(b)});return a},v.prototype.getAudioTracks=function(){if(!this.getTracks)return[];var a=[];this.getTracks.forEach(function(b){-1!==b.kind.toString().indexOf("audio")&&a.push(b)});return a}),"undefined"===typeof v.prototype.stop&&(v.prototype.stop=function(){this.getTracks().forEach(function(a){a.stop()})}));var w={};"undefined"!==typeof k?w.AudioContext=
k:"undefined"!==typeof webkitAudioContext&&(w.AudioContext=webkitAudioContext);this.startDrawingFrames=function(){f()};this.appendStreams=function(a){if(!a)throw"First parameter is required.";a instanceof Array||(a=[a]);b.concat(a);a.forEach(function(a){if(a.getVideoTracks().length){var b=g(a);b.stream=a;l.push(b)}a.getAudioTracks().length&&m.audioContext&&(a=m.audioContext.createMediaStreamSource(a),a.connect(m.audioDestination),m.audioSources.push(a))})};this.releaseStreams=function(){l=[];d=!0;
m.gainNode&&(m.gainNode.disconnect(),m.gainNode=null);m.audioSources.length&&(m.audioSources.forEach(function(a){a.disconnect()}),m.audioSources=[]);m.audioDestination&&(m.audioDestination.disconnect(),m.audioDestination=null);m.audioContext=null;e.clearRect(0,0,n.width,n.height);n.stream&&(n.stream.stop(),n.stream=null)};this.resetVideoStreams=function(a){!a||a instanceof Array||(a=[a]);u(a)};this.name="MultiStreamsMixer";this.toString=function(){return this.name};this.getMixedStream=function(){d=
!1;var a=q(),c=r();c&&c.getAudioTracks().forEach(function(b){a.addTrack(b)});b.forEach(function(a){});return a}}
function MultiStreamRecorder(b,a){function f(){var a=[];b.forEach(function(b){b.getVideoTracks().forEach(function(b){a.push(b)})});return a}b=b||[];var c=this,q,r;a=a||{mimeType:"video/webm",video:{width:360,height:240}};a.frameInterval||(a.frameInterval=10);a.video||(a.video={});a.video.width||(a.video.width=360);a.video.height||(a.video.height=240);this.record=function(){q=new MultiStreamsMixer(b);f().length&&(q.frameInterval=a.frameInterval||10,q.width=a.video.width||360,q.height=a.video.height||
240,q.startDrawingFrames());a.previewStream&&"function"===typeof a.previewStream&&a.previewStream(q.getMixedStream());r=new MediaStreamRecorder(q.getMixedStream(),a);r.record()};this.stop=function(a){r&&r.stop(function(b){c.blob=b;a(b);c.clearRecordedData()})};this.pause=function(){r&&r.pause()};this.resume=function(){r&&r.resume()};this.clearRecordedData=function(){r&&(r.clearRecordedData(),r=null);q&&(q.releaseStreams(),q=null)};this.addStreams=function(a){if(!a)throw"First parameter is required.";
a instanceof Array||(a=[a]);b.concat(a);r&&q&&q.appendStreams(a)};this.resetVideoStreams=function(a){q&&(!a||a instanceof Array||(a=[a]),q.resetVideoStreams(a))};this.name="MultiStreamRecorder";this.toString=function(){return this.name}}"undefined"!==typeof RecordRTC&&(RecordRTC.MultiStreamRecorder=MultiStreamRecorder);
function RecordRTCPromisesHandler(b,a){if(!this)throw'Use "new RecordRTCPromisesHandler()"';if("undefined"===typeof b)throw'First argument "MediaStream" is required.';var f=this;f.recordRTC=new RecordRTC(b,a);this.startRecording=function(){return new Promise(function(a,b){try{f.recordRTC.startRecording(),a()}catch(r){b(r)}})};this.stopRecording=function(){return new Promise(function(a,b){try{f.recordRTC.stopRecording(function(b){f.blob=f.recordRTC.getBlob();a(b)})}catch(r){b(r)}})};this.getDataURL=
function(a){return new Promise(function(a,b){try{f.recordRTC.getDataURL(function(b){a(b)})}catch(g){b(g)}})};this.getBlob=function(){return f.recordRTC.getBlob()};this.blob=null}"undefined"!==typeof RecordRTC&&(RecordRTC.RecordRTCPromisesHandler=RecordRTCPromisesHandler);