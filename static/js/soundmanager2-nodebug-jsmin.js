/*
   SoundManager 2: Javascript Sound for the Web
   --------------------------------------------
   http://schillmania.com/projects/soundmanager2/

   Copyright (c) 2008, Scott Schiller. All rights reserved.
   Code licensed under the BSD License:
   http://schillmania.com/projects/soundmanager2/license.txt

   V2.93a.20090117
*/
var soundManager=null;function SoundManager(b,a){this.flashVersion=8;this.debugMode=true;this.useConsole=true;this.consoleOnly=false;this.waitForWindowLoad=false;this.nullURL="null.mp3";this.allowPolling=true;this.useMovieStar=false;this.bgColor="#ffffff";this.useHighPerformance=true;this.defaultOptions={autoLoad:false,stream:true,autoPlay:false,onid3:null,onload:null,whileloading:null,onplay:null,onpause:null,onresume:null,whileplaying:null,onstop:null,onfinish:null,onbeforefinish:null,onbeforefinishtime:5000,onbeforefinishcomplete:null,onjustbeforefinish:null,onjustbeforefinishtime:200,multiShot:true,position:null,pan:0,volume:100};this.flash9Options={isMovieStar:null,usePeakData:false,useWaveformData:false,useEQData:false};this.movieStarOptions={onmetadata:null,useVideo:false};var f=null;var e=this;this.version=null;this.versionNumber="V2.93a.20090117";this.movieURL=null;this.url=null;this.altURL=null;this.swfLoaded=false;this.enabled=false;this.o=null;this.id=(a||"sm2movie");this.oMC=null;this.sounds={};this.soundIDs=[];this.muted=false;this.isIE=(navigator.userAgent.match(/MSIE/i));this.isSafari=(navigator.userAgent.match(/safari/i));this.isGecko=(navigator.userAgent.match(/gecko/i));this.debugID="soundmanager-debug";this._debugOpen=true;this._didAppend=false;this._appendSuccess=false;this._didInit=false;this._disabled=false;this._windowLoaded=false;this._hasConsole=(typeof console!="undefined"&&typeof console.log!="undefined");this._debugLevels=["log","info","warn","error"];this._defaultFlashVersion=8;this.filePatterns={flash8:/\.mp3(\?.*)?$/i,flash9:/\.mp3(\?.*)?$/i};this.netStreamTypes=["aac","flv","mov","mp4","m4v","f4v","m4a","mp4v","3gp","3g2"];this.netStreamPattern=new RegExp("\\.("+this.netStreamTypes.join("|")+")(\\?.*)?$","i");this.filePattern=null;this.features={peakData:false,waveformData:false,eqData:false,movieStar:false};this.sandbox={type:null,types:{remote:"remote (domain-based) rules",localWithFile:"local with file access (no internet access)",localWithNetwork:"local with network (internet access only, no local access)",localTrusted:"local, trusted (local + internet access)"},description:null,noRemote:null,noLocal:null};this._setVersionInfo=function(){if(e.flashVersion!=8&&e.flashVersion!=9){alert('soundManager.flashVersion must be 8 or 9. "'+e.flashVersion+'" is invalid. Reverting to '+e._defaultFlashVersion+".");e.flashVersion=e._defaultFlashVersion}e.version=e.versionNumber+(e.flashVersion==9?" (AS3/Flash 9)":" (AS2/Flash 8)");if(e.flashVersion>8){e.defaultOptions=e._mergeObjects(e.defaultOptions,e.flash9Options)}if(e.flashVersion>8&&e.useMovieStar){e.defaultOptions=e._mergeObjects(e.defaultOptions,e.movieStarOptions);e.filePatterns.flash9=new RegExp("\\.(mp3|"+e.netStreamTypes.join("|")+")(\\?.*)?$","i");e.features.movieStar=true}else{e.useMovieStar=false;e.features.movieStar=false}e.filePattern=e.filePatterns[(e.flashVersion!=8?"flash9":"flash8")];e.movieURL=(e.flashVersion==8?"soundmanager2.swf":"soundmanager2_flash9.swf");e.features.peakData=e.features.waveformData=e.features.eqData=(e.flashVersion==9)};this._overHTTP=(document.location?document.location.protocol.match(/http/i):null);this._waitingforEI=false;this._initPending=false;this._tryInitOnFocus=(this.isSafari&&typeof document.hasFocus=="undefined");this._isFocused=(typeof document.hasFocus!="undefined"?document.hasFocus():null);this._okToDisable=!this._tryInitOnFocus;this.useAltURL=!this._overHTTP;var d="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html";this.supported=function(){return(e._didInit&&!e._disabled)};this.getMovie=function(g){return e.isIE?window[g]:(e.isSafari?document.getElementById(g)||document[g]:document.getElementById(g))};this.loadFromXML=function(g){try{e.o._loadFromXML(g)}catch(h){e._failSafely();return true}};this.createSound=function(h){if(!e._didInit){throw new Error("soundManager.createSound(): Not loaded yet - wait for soundManager.onload() before calling sound-related methods")}if(arguments.length==2){h={id:arguments[0],url:arguments[1]}}var i=e._mergeObjects(h);var g=i;if(e._idCheck(g.id,true)){return e.sounds[g.id]}if(e.flashVersion>8&&e.useMovieStar){if(g.isMovieStar===null){g.isMovieStar=(g.url.match(e.netStreamPattern)?true:false)}if(g.isMovieStar&&(g.usePeakData||g.useWaveformData||g.useEQData)){g.usePeakData=false;g.useWaveformData=false;g.useEQData=false}}e.sounds[g.id]=new f(g);e.soundIDs[e.soundIDs.length]=g.id;if(e.flashVersion==8){e.o._createSound(g.id,g.onjustbeforefinishtime)}else{e.o._createSound(g.id,g.url,g.onjustbeforefinishtime,g.usePeakData,g.useWaveformData,g.useEQData,g.isMovieStar,(g.isMovieStar?g.useVideo:false))}if(g.autoLoad||g.autoPlay){if(e.sounds[g.id]){e.sounds[g.id].load(g)}}if(g.autoPlay){e.sounds[g.id].play()}return e.sounds[g.id]};this.createVideo=function(g){if(arguments.length==2){g={id:arguments[0],url:arguments[1]}}if(e.flashVersion>=9){g.isMovieStar=true;g.useVideo=true}else{return false}return e.createSound(g)};this.destroySound=function(h,g){if(!e._idCheck(h)){return false}for(var j=0;j<e.soundIDs.length;j++){if(e.soundIDs[j]==h){e.soundIDs.splice(j,1);continue}}e.sounds[h].unload();if(!g){e.sounds[h].destruct()}delete e.sounds[h]};this.destroyVideo=this.destroySound;this.load=function(g,h){if(!e._idCheck(g)){return false}e.sounds[g].load(h)};this.unload=function(g){if(!e._idCheck(g)){return false}e.sounds[g].unload()};this.play=function(g,h){if(!e._idCheck(g)){if(typeof h!="Object"){h={url:h}}if(h&&h.url){h.id=g;e.createSound(h)}else{return false}}e.sounds[g].play(h)};this.start=this.play;this.setPosition=function(g,h){if(!e._idCheck(g)){return false}e.sounds[g].setPosition(h)};this.stop=function(g){if(!e._idCheck(g)){return false}e.sounds[g].stop()};this.stopAll=function(){for(var g in e.sounds){if(e.sounds[g] instanceof f){e.sounds[g].stop()}}};this.pause=function(g){if(!e._idCheck(g)){return false}e.sounds[g].pause()};this.pauseAll=function(){for(var g=e.soundIDs.length;g--;){e.sounds[e.soundIDs[g]].pause()}};this.resume=function(g){if(!e._idCheck(g)){return false}e.sounds[g].resume()};this.resumeAll=function(){for(var g=e.soundIDs.length;g--;){e.sounds[e.soundIDs[g]].resume()}};this.togglePause=function(g){if(!e._idCheck(g)){return false}e.sounds[g].togglePause()};this.setPan=function(g,h){if(!e._idCheck(g)){return false}e.sounds[g].setPan(h)};this.setVolume=function(h,g){if(!e._idCheck(h)){return false}e.sounds[h].setVolume(g)};this.mute=function(g){if(typeof g!="string"){g=null}if(!g){for(var h=e.soundIDs.length;h--;){e.sounds[e.soundIDs[h]].mute()}e.muted=true}else{if(!e._idCheck(g)){return false}e.sounds[g].mute()}};this.muteAll=function(){e.mute()};this.unmute=function(g){if(typeof g!="string"){g=null}if(!g){for(var h=e.soundIDs.length;h--;){e.sounds[e.soundIDs[h]].unmute()}e.muted=false}else{if(!e._idCheck(g)){return false}e.sounds[g].unmute()}};this.unmuteAll=function(){e.unmute()};this.getMemoryUse=function(){if(e.flashVersion==8){return 0}if(e.o){return parseInt(e.o._getMemoryUse(),10)}};this.setPolling=function(g){if(!e.o||!e.allowPolling){return false}e.o._setPolling(g)};this.disable=function(g){if(e._disabled){return false}e._disabled=true;for(var h=e.soundIDs.length;h--;){e._disableObject(e.sounds[e.soundIDs[h]])}e.initComplete();e._disableObject(e)};this.canPlayURL=function(g){return(g?(g.match(e.filePattern)?true:false):null)};this.getSoundById=function(h,i){if(!h){throw new Error("SoundManager.getSoundById(): sID is null/undefined")}var g=e.sounds[h];if(!g&&!i){}return g};this.onload=function(){soundManager._wD("<em>Warning</em>: soundManager.onload() is undefined.",2)};this.onerror=function(){};this._idCheck=this.getSoundById;var c=function(){return false};c._protected=true;this._disableObject=function(h){for(var g in h){if(typeof h[g]=="function"&&typeof h[g]._protected=="undefined"){h[g]=c}}g=null};this._failSafely=function(){if(!e._disabled){e.disable()}};this._normalizeMovieURL=function(g){var h=null;if(g){if(g.match(/\.swf(\?.*)?$/i)){h=g.substr(g.toLowerCase().lastIndexOf(".swf?")+4);if(h){return g}}else{if(g.lastIndexOf("/")!=g.length-1){g=g+"/"}}}return(g&&g.lastIndexOf("/")!=-1?g.substr(0,g.lastIndexOf("/")+1):"./")+e.movieURL};this._getDocument=function(){return(document.body?document.body:(document.documentElement?document.documentElement:document.getElementsByTagName("div")[0]))};this._getDocument._protected=true;this._createMovie=function(z,o){if(e._didAppend&&e._appendSuccess){return false}if(window.location.href.indexOf("debug=1")+1){e.debugMode=true}e._didAppend=true;e._setVersionInfo();var y=(o?o:e.url);var t=(e.altURL?e.altURL:y);e.url=e._normalizeMovieURL(e._overHTTP?y:t);o=e.url;var u=null;if(e.useHighPerformance&&e.useHighPerformance!="always"&&navigator.platform.match(/win32/i)&&navigator.userAgent.match(/firefox/i)){u="Note: disabling highPerformance, known issues with this browser/OS combo.";e.useHighPerformance=false}if(e.useHighPerformance&&e.useMovieStar){u="Note: disabling highPerformance, not applicable with movieStar mode on";e.useHighPerformance=false}var B={name:z,id:z,src:o,width:"100%",height:"100%",quality:"high",allowScriptAccess:"always",bgcolor:e.bgColor,pluginspage:"http://www.macromedia.com/go/getflashplayer",type:"application/x-shockwave-flash"};var i={id:z,data:o,type:"application/x-shockwave-flash",width:"100%",height:"100%"};var g={movie:o,AllowScriptAccess:"always",quality:"high",bgcolor:e.bgColor};if(e.useHighPerformance&&!e.useMovieStar){B.wmode="transparent";g.wmode="transparent"}var p=null;var C=null;if(e.isIE){p=document.createElement("div");var v='<object id="'+z+'" data="'+o+'" type="application/x-shockwave-flash" width="100%" height="100%"><param name="movie" value="'+o+'" /><param name="AllowScriptAccess" value="always" /><param name="quality" value="high" />'+(e.useHighPerformance&&!e.useMovieStar?'<param name="wmode" value="transparent" /> ':"")+'<param name="bgcolor" value="'+e.bgColor+'" /><!-- --></object>'}else{p=document.createElement("embed");for(C in B){if(B.hasOwnProperty(C)){p.setAttribute(C,B[C])}}}var k=document.createElement("div");k.id=e.debugID+"-toggle";var l={position:"fixed",bottom:"0px",right:"0px",width:"1.2em",height:"1.2em",lineHeight:"1.2em",margin:"2px",textAlign:"center",border:"1px solid #999",cursor:"pointer",background:"#fff",color:"#333",zIndex:10001};k.appendChild(document.createTextNode("-"));k.onclick=e._toggleDebug;k.title="Toggle SM2 debug console";if(navigator.userAgent.match(/msie 6/i)){k.style.position="absolute";k.style.cursor="hand"}for(C in l){if(l.hasOwnProperty(C)){k.style[C]=l[C]}}var h="soundManager._createMovie(): appendChild/innerHTML set failed. May be app/xhtml+xml DOM-related.";var w=e._getDocument();if(w){e.oMC=document.getElementById("sm2-container")?document.getElementById("sm2-container"):document.createElement("div");if(!e.oMC.id){e.oMC.id="sm2-container";e.oMC.className="movieContainer";var q=null;var r=null;if(e.useHighPerformance){q={position:"fixed",width:"8px",height:"8px",bottom:"0px",left:"0px",zIndex:-1}}else{q={position:"absolute",width:"1px",height:"1px",bottom:"0px",left:"0px"}}var m=null;for(m in q){if(q.hasOwnProperty(m)){e.oMC.style[m]=q[m]}}try{if(!e.isIE){e.oMC.appendChild(p)}w.appendChild(e.oMC);if(e.isIE){r=e.oMC.appendChild(document.createElement("div"));r.className="sm2-object-box";r.innerHTML=v}e._appendSuccess=true}catch(A){throw new Error(h)}}else{e.oMC.appendChild(p);if(e.isIE){r=e.oMC.appendChild(document.createElement("div"));r.className="sm2-object-box";r.innerHTML=v}e._appendSuccess=true}if(!document.getElementById(e.debugID)&&((!e._hasConsole||!e.useConsole)||(e.useConsole&&e._hasConsole&&!e.consoleOnly))){var n=document.createElement("div");n.id=e.debugID;n.style.display=(e.debugMode?"block":"none");if(e.debugMode){try{w.appendChild(k)}catch(j){throw new Error(h)}}w.appendChild(n)}w=null}};this._writeDebug=function(g,i,h){};this._writeDebug._protected=true;this._wD=this._writeDebug;this._wDAlert=function(g){alert(g)};this._toggleDebug=function(){};this._toggleDebug._protected=true;this._debug=function(){};this._debugTS=function(j,g,h){if(typeof sm2Debugger!="undefined"){try{sm2Debugger.handleEvent(j,g,h)}catch(i){}}};this._debugTS._protected=true;this._mergeObjects=function(h,g){var l={};for(var j in h){if(h.hasOwnProperty(j)){l[j]=h[j]}}var k=(typeof g=="undefined"?e.defaultOptions:g);for(var m in k){if(k.hasOwnProperty(m)&&typeof l[m]=="undefined"){l[m]=k[m]}}return l};this.createMovie=function(g){if(g){e.url=g}e._initMovie()};this.go=this.createMovie;this._initMovie=function(){if(e.o){return false}e.o=e.getMovie(e.id);if(!e.o){e._createMovie(e.id,e.url);e.o=e.getMovie(e.id)}};this.waitForExternalInterface=function(){if(e._waitingForEI){return false}e._waitingForEI=true;if(e._tryInitOnFocus&&!e._isFocused){return false}setTimeout(function(){if(!e._didInit){e._debugTS("flashtojs",false,": Timed out"+(e._overHTTP)?" (Check flash security)":" (No plugin/missing SWF?)")}if(!e._didInit&&e._okToDisable){e._failSafely()}},750)};this.handleFocus=function(){if(e._isFocused||!e._tryInitOnFocus){return true}e._okToDisable=true;e._isFocused=true;if(e._tryInitOnFocus){window.removeEventListener("mousemove",e.handleFocus,false)}e._waitingForEI=false;setTimeout(e.waitForExternalInterface,500);if(window.removeEventListener){window.removeEventListener("focus",e.handleFocus,false)}else{if(window.detachEvent){window.detachEvent("onfocus",e.handleFocus)}}};this.initComplete=function(){if(e._didInit){return false}e._didInit=true;if(e._disabled){e._debugTS("onload",false);e.onerror.apply(window);return false}else{e._debugTS("onload",true)}if(e.waitForWindowLoad&&!e._windowLoaded){if(window.addEventListener){window.addEventListener("load",e.initUserOnload,false)}else{if(window.attachEvent){window.attachEvent("onload",e.initUserOnload)}}return false}else{e.initUserOnload()}};this.initUserOnload=function(){e.onload.apply(window)};this.init=function(){e._initMovie();if(e._didInit){return false}if(window.removeEventListener){window.removeEventListener("load",e.beginDelayedInit,false)}else{if(window.detachEvent){window.detachEvent("onload",e.beginDelayedInit)}}try{e.o._externalInterfaceTest(false);e.setPolling(true);if(!e.debugMode){e.o._disableDebug()}e.enabled=true;e._debugTS("jstoflash",true)}catch(g){e._debugTS("jstoflash",false);e._failSafely();e.initComplete();return false}e.initComplete()};this.beginDelayedInit=function(){e._windowLoaded=true;setTimeout(e.waitForExternalInterface,500);setTimeout(e.beginInit,20)};this.beginInit=function(){if(e._initPending){return false}e.createMovie();e._initMovie();e._initPending=true;return true};this.domContentLoaded=function(){if(document.removeEventListener){document.removeEventListener("DOMContentLoaded",e.domContentLoaded,false)}e.go()};this._externalInterfaceOK=function(){if(e.swfLoaded){return false}e._debugTS("swf",true);e._debugTS("flashtojs",true);e.swfLoaded=true;e._tryInitOnFocus=false;if(e.isIE){setTimeout(e.init,100)}else{e.init()}};this._setSandboxType=function(g){var h=e.sandbox;h.type=g;h.description=h.types[(typeof h.types[g]!="undefined"?g:"unknown")];if(h.type=="localWithFile"){h.noRemote=true;h.noLocal=false}else{if(h.type=="localWithNetwork"){h.noRemote=false;h.noLocal=true}else{if(h.type=="localTrusted"){h.noRemote=false;h.noLocal=false}}}};this.destruct=function(){e.disable(true)};f=function(g){var h=this;this.sID=g.id;this.url=g.url;this.options=e._mergeObjects(g);this.instanceOptions=this.options;this._iO=this.instanceOptions;this.pan=this.options.pan;this.volume=this.options.volume;this._debug=function(){if(e.debugMode){var k=null;var m=[];var j=null;var l=null;var i=64;for(k in h.options){if(h.options[k]!==null){if(h.options[k] instanceof Function){j=h.options[k].toString();j=j.replace(/\s\s+/g," ");l=j.indexOf("{");m[m.length]=" "+k+": {"+j.substr(l+1,(Math.min(Math.max(j.indexOf("\n")-1,i),i))).replace(/\n/g,"")+"... }"}else{m[m.length]=" "+k+": "+h.options[k]}}}}};this._debug();this.id3={};this.resetProperties=function(i){h.bytesLoaded=null;h.bytesTotal=null;h.position=null;h.duration=null;h.durationEstimate=null;h.loaded=false;h.playState=0;h.paused=false;h.readyState=0;h.muted=false;h.didBeforeFinish=false;h.didJustBeforeFinish=false;h.instanceOptions={};h.instanceCount=0;h.peakData={left:0,right:0};h.waveformData=[];h.eqData=[]};h.resetProperties();this.load=function(i){if(typeof i!="undefined"){h._iO=e._mergeObjects(i);h.instanceOptions=h._iO}else{i=h.options;h._iO=i;h.instanceOptions=h._iO}if(typeof h._iO.url=="undefined"){h._iO.url=h.url}if(h._iO.url==h.url&&h.readyState!==0&&h.readyState!=2){return false}h.loaded=false;h.readyState=1;h.playState=0;try{if(e.flashVersion==8){e.o._load(h.sID,h._iO.url,h._iO.stream,h._iO.autoPlay,(h._iO.whileloading?1:0))}else{e.o._load(h.sID,h._iO.url,h._iO.stream?true:false,h._iO.autoPlay?true:false);if(h._iO.isMovieStar&&h._iO.autoLoad&&!h._iO.autoPlay){h.pause()}}}catch(j){e._debugTS("onload",false);e.onerror();e.disable()}};this.unload=function(){if(h.readyState!==0){if(h.readyState!=2){h.setPosition(0,true)}e.o._unload(h.sID,e.nullURL);h.resetProperties()}};this.destruct=function(){e.o._destroySound(h.sID);e.destroySound(h.sID,true)};this.play=function(j){if(!j){j={}}h._iO=e._mergeObjects(j,h._iO);h._iO=e._mergeObjects(h._iO,h.options);h.instanceOptions=h._iO;if(h.playState==1){var i=h._iO.multiShot;if(!i){return false}}if(!h.loaded){if(h.readyState===0){h._iO.stream=true;h._iO.autoPlay=true;h.load(h._iO)}else{if(h.readyState==2){return false}}}if(h.paused){h.resume()}else{h.playState=1;if(!h.instanceCount||e.flashVersion==9){h.instanceCount++}h.position=(typeof h._iO.position!="undefined"&&!isNaN(h._iO.position)?h._iO.position:0);if(h._iO.onplay){h._iO.onplay.apply(h)}h.setVolume(h._iO.volume,true);h.setPan(h._iO.pan,true);e.o._start(h.sID,h._iO.loop||1,(e.flashVersion==9?h.position:h.position/1000))}};this.start=this.play;this.stop=function(i){if(h.playState==1){h.playState=0;h.paused=false;if(h._iO.onstop){h._iO.onstop.apply(h)}e.o._stop(h.sID,i);h.instanceCount=0;h._iO={}}};this.setPosition=function(j,i){if(typeof j=="undefined"){j=0}var k=Math.min(h.duration,Math.max(j,0));h._iO.position=k;e.o._setPosition(h.sID,(e.flashVersion==9?h._iO.position:h._iO.position/1000),(h.paused||!h.playState))};this.pause=function(){if(h.paused||h.playState===0){return false}h.paused=true;e.o._pause(h.sID);if(h._iO.onpause){h._iO.onpause.apply(h)}};this.resume=function(){if(!h.paused||h.playState===0){return false}h.paused=false;e.o._pause(h.sID);if(h._iO.onresume){h._iO.onresume.apply(h)}};this.togglePause=function(){if(!h.playState){h.play({position:(e.flashVersion==9?h.position:h.position/1000)});return false}if(h.paused){h.resume()}else{h.pause()}};this.setPan=function(j,i){if(typeof j=="undefined"){j=0}if(typeof i=="undefined"){i=false}e.o._setPan(h.sID,j);h._iO.pan=j;if(!i){h.pan=j}};this.setVolume=function(i,j){if(typeof i=="undefined"){i=100}if(typeof j=="undefined"){j=false}e.o._setVolume(h.sID,(e.muted&&!h.muted)||h.muted?0:i);h._iO.volume=i;if(!j){h.volume=i}};this.mute=function(){h.muted=true;e.o._setVolume(h.sID,0)};this.unmute=function(){h.muted=false;var i=typeof h._iO.volume!="undefined";e.o._setVolume(h.sID,i?h._iO.volume:h.options.volume,i?false:true)};this._whileloading=function(i,j,k){if(!h._iO.isMovieStar){h.bytesLoaded=i;h.bytesTotal=j;h.duration=Math.floor(k);h.durationEstimate=parseInt((h.bytesTotal/h.bytesLoaded)*h.duration,10);if(h.readyState!=3&&h._iO.whileloading){h._iO.whileloading.apply(h)}}else{h.bytesLoaded=i;h.bytesTotal=j;h.duration=Math.floor(k);h.durationEstimate=h.duration;if(h.readyState!=3&&h._iO.whileloading){h._iO.whileloading.apply(h)}}};this._onid3=function(n,k){var o=[];for(var m=0,l=n.length;m<l;m++){o[n[m]]=k[m]}h.id3=e._mergeObjects(h.id3,o);if(h._iO.onid3){h._iO.onid3.apply(h)}};this._whileplaying=function(j,k,i,l){if(isNaN(j)||j===null){return false}h.position=j;if(h._iO.usePeakData&&typeof k!="undefined"&&k){h.peakData={left:k.leftPeak,right:k.rightPeak}}if(h._iO.useWaveformData&&typeof i!="undefined"&&i){h.waveformData=i}if(h._iO.useEQData&&typeof l!="undefined"&&l){h.eqData=l}if(h.playState==1){if(h._iO.whileplaying){h._iO.whileplaying.apply(h)}if(h.loaded&&h._iO.onbeforefinish&&h._iO.onbeforefinishtime&&!h.didBeforeFinish&&h.duration-h.position<=h._iO.onbeforefinishtime){h._onbeforefinish()}}};this._onload=function(i){i=(i==1?true:false);h.loaded=i;h.readyState=i?3:2;if(h._iO.onload){h._iO.onload.apply(h)}};this._onbeforefinish=function(){if(!h.didBeforeFinish){h.didBeforeFinish=true;if(h._iO.onbeforefinish){h._iO.onbeforefinish.apply(h)}}};this._onjustbeforefinish=function(i){if(!h.didJustBeforeFinish){h.didJustBeforeFinish=true;if(h._iO.onjustbeforefinish){h._iO.onjustbeforefinish.apply(h)}}};this._onfinish=function(){if(h._iO.onbeforefinishcomplete){h._iO.onbeforefinishcomplete.apply(h)}h.didBeforeFinish=false;h.didJustBeforeFinish=false;if(h.instanceCount){h.instanceCount--;if(!h.instanceCount){h.playState=0;h.paused=false;h.instanceCount=0;h.instanceOptions={};if(h._iO.onfinish){h._iO.onfinish.apply(h)}}}else{}};this._onmetadata=function(i){if(!i.width&&!i.height){i.width=320;i.height=240}h.metadata=i;h.width=i.width;h.height=i.height;if(h._iO.onmetadata){h._iO.onmetadata.apply(h)}}};if(window.addEventListener){window.addEventListener("focus",e.handleFocus,false);window.addEventListener("load",e.beginDelayedInit,false);window.addEventListener("unload",e.destruct,false);if(e._tryInitOnFocus){window.addEventListener("mousemove",e.handleFocus,false)}}else{if(window.attachEvent){window.attachEvent("onfocus",e.handleFocus);window.attachEvent("onload",e.beginDelayedInit);window.attachEvent("unload",e.destruct)}else{e._debugTS("onload",false);soundManager.onerror();soundManager.disable()}}if(document.addEventListener){document.addEventListener("DOMContentLoaded",e.domContentLoaded,false)}}soundManager=new SoundManager();