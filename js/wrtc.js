var recorder_g, is_recording_g = !1,
    localStream_g = null,
    callId_g, is_video_call_g = !1,
    blob_g, mediaStreamChunks_g = [];

function invokeSaveAsDialog(file, fileName) {
    if (!file) {
        throw 'Blob object is required.';
    }

    if (!file.type) {
        try {
            file.type = 'video/webm';
        } catch (e) {}
    }

    var fileExtension = (file.type || 'video/webm').split('/')[1];

    if (fileName && fileName.indexOf('.') !== -1) {
        var splitted = fileName.split('.');
        fileName = splitted[0];
        fileExtension = splitted[1];
    }

    var fileFullName = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + '.' + fileExtension;

    if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
        return navigator.msSaveOrOpenBlob(file, fileFullName);
    } else if (typeof navigator.msSaveBlob !== 'undefined') {
        return navigator.msSaveBlob(file, fileFullName);
    }

    var hyperlink = document.createElement('a');
    hyperlink.href = URL.createObjectURL(file);
    hyperlink.download = fileFullName;

    hyperlink.style = 'display:none;opacity:0;color:transparent;';
    (document.body || document.documentElement).appendChild(hyperlink);

    if (typeof hyperlink.click === 'function') {
        hyperlink.click();
    } else {
        hyperlink.target = '_blank';
        hyperlink.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
    }

    (window.URL || window.webkitURL).revokeObjectURL(hyperlink.href);
}
wr_save_recording = function(callId, fileName) {
    invokeSaveAsDialog(blob_g, fileName);
};

wr_delete_recording = function(callId) {
    blob_g = null
};

var stopCallRecording = function() {
    is_recording_g && (recorder_g.stopRecording(function() {
            blob_g = recorder_g.getBlob();
            recorder_g = localStream_g = callId_g = null
        }),
        is_recording_g = !1)
}


navigator.sayswho = (function() {
    var ua = navigator.userAgent,
        tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

function mozVidFreezeModSdp(sdp) {
    try {
        console.log(sdp);
        var m = sdp.match(/m=video.*/g);
        if (!m) {
            return sdp;
        }
        console.log("sdp match");
        console.log(m);
        m = m[0];
        // get all video payload type numbers
        nums = m.match(/[0-9 ]*$/)[0].trim().split(' ');

        for (var nu in nums) {
            // get rtp maps with video pts
            var sstr = "a=rtpmap:" + nums[nu] + " VP8/90000";
            var vpln = sdp.search(sstr);
            if (vpln == -1) {
                sstr = "a=rtpmap:" + nums[nu] + " VP9/90000";
                vpln = sdp.search("a=rtpmap:" + nums[nu] + " VP9/90000");
            }
            if (vpln == -1)
                continue; // skip pts that doesnt belong to vp8 or vp9

            var regex = new RegExp("a=fmtp:" + nums[nu] + ".*");
            var st = sdp.match(regex);
            if (st) {
                var st = st[0];
                console.log(st);
                if (st) {
                    if (st.search("max-fs") == -1) {
                        var rep = st.replace('a=fmtp:' + nums[nu] + ' ', 'a=fmtp:' + nums[nu] + ' max-fs=12288;');
                        sdp = sdp.replace(st, rep);
                    }
                }
            } else {
                console.log("src:" + sstr);
                console.log("dst:" + sstr + "\r\na=fmtp:" + nums[nu] + " max-fs=12288");
                sdp = sdp.replace(sstr, sstr + "\r\na=fmtp:" + nums[nu] + " max-fs=12288");
            }
        }
        console.log(sdp);
    } catch (err) { console.log("Err " + err); }
    return sdp;
}

var wr_recv_rem_offer = function(callId, localUiElem, isVideoCall, remoteUiElem, rqt) {
    var obj = window.CS.call;
    obj.localUiElem = document.getElementById(localUiElem);
    obj.remoteUiElem = document.getElementById(remoteUiElem);
    if (navigator.sayswho == "Firefox 56" || navigator.sayswho == "Firefox 57")
        obj.remoteSDP = mozVidFreezeModSdp(rqt.sSdp);
    else
        obj.remoteSDP = rqt.sSdp;
    console.log("wr_recv_rem_offer");

    navigator.mediaDevices.getUserMedia({ audio: true, video: isVideoCall }).then(function(localStream) { wr_get_local_stream_to_answer(localStream, callId); }).catch(getUserMediaFailed);
};

function wr_recv_rem_offer_conference(callId, localUser, isVideoCall, remoteUser, imlId, sSdp) {

    var obj = window.CS.call;
    obj.localUiElem = localUser;
    // obj.remoteUiElem = remoteUser;
    let remoteSDP;
    let remoteUiElem = remoteUser;
    if (navigator.sayswho == "Firefox 56" || navigator.sayswho == "Firefox 57")
    // obj.remoteSDP = mozVidFreezeModSdp(sSdp);
        remoteSDP = mozVidFreezeModSdp(sSdp);
    else
    // obj.remoteSDP = sSdp;
        remoteSDP = sSdp;
    console.log("wr_recv_rem_offer_conference");

    // navigator.mediaDevices.getUserMedia({ audio: false, video: isVideoCall }).then(localStream => { wr_get_local_stream_to_answer_conference(localStream, callId); }).catch(getUserMediaFailed);
    wr_get_local_stream_to_answer_conference(obj.localStream, callId, remoteUiElem, remoteSDP, imlId);

};
async function wr_recv_rem_offer_conference1(callId, localUser, isVideoCall, remoteUser, imlId, sSdp) {

    var obj = window.CS.call;
    obj.localUiElem = localUser;
    obj.remoteUiElem = remoteUser;
    obj.remoteUser = imlId;

    window.CS.subscribeFlag = false;
    if (navigator.sayswho == "Firefox 56" || navigator.sayswho == "Firefox 57")
        obj.remoteSDP = mozVidFreezeModSdp(sSdp);
    else
        obj.remoteSDP = sSdp;
    console.log("wr_recv_rem_offer_conference");
    // navigator.mediaDevices.getUserMedia({ audio: false, video: isVideoCall }).then(
    //     async(localStream) => {

    //         await
    await wr_get_local_stream_to_answer_conference1(obj.localStream, callId);
    //   }).catch(getUserMediaFailed);


};

var getUserMediaFailed = function(error) {
    console.log("Get User Media Failed: ", error);
    //alert("Unable to get media! Check if another application locked audio/video driver?");
    //window.CS.call.callToCb(503, "Unable to get user media! Check if another application locked the audio/video driver");
};

var wr_on_error = function(error) {
    console.log("error: ", error);
};

var wr_recv_rem_end = function() {
    var obj = window.CS.call;
    if (obj.peerConnection) {
        obj.localStream.getTracks().forEach(function(track) { track.stop(); });
        obj.peerConnection.close();
        obj.peerConnection = null;
    }

    if (obj.localUiElem)
        obj.localUiElem.srcObject = undefined;
    if (obj.remoteUiElem)
        obj.remoteUiElem.srcObject = undefined;

    stopCallRecording();
};

var wr_recv_rem_ice = function(resp, callId) {
    console.log("received remote ice ");
    if (resp.sJsonIceCandidates.length == 0) {
        return;
    }
    var obj = window.CS.call;
    for (var i = 0; i < resp.sJsonIceCandidates.length; i++) {
        var tmp = JSON.parse(resp.sJsonIceCandidates[i]).ice;
        console.log("received remote ice " + tmp);
        if (obj.peerConnection) {
            obj.peerConnection.addIceCandidate(new RTCIceCandidate(tmp));
        } else {
            console.log("ice candidate before peer connection creation");
            obj.callObj[callId].iceCandidates.push(tmp);
        }
    }
};

var wr_recv_rem_ice_conference = function(resp, callId) {

    console.log("conference received remote ice ", resp.sJsonIceCandidates);
    if (resp.sJsonIceCandidates.length == 0) {
        return;
    }
    var obj = window.CS.call;
    for (var i = 0; i < resp.sJsonIceCandidates.length; i++) {
        var tmp = JSON.parse(resp.sJsonIceCandidates[i]).ice;
        console.log("received remote ice " + tmp);
        if (obj.peerConnection) {
            obj.peerConnection.addIceCandidate(new RTCIceCandidate(tmp));
        } else {
            console.log("ice candidate before peer connection creation");
            obj.callObj[callId].iceCandidates.push(tmp);
        }
    }
};


var wr_recv_rem_answer_conference = function(sdp, callId, type) {
    //sdp = sdp.replace(/172.31.36.89/ig, '52.26.193.237');

    var obj = window.CS.call;
    if (obj.peerConnection) {
        console.log(" received answer sdp as received modification " + sdp);
        if (navigator.sayswho == "Firefox 56" || navigator.sayswho == "Firefox 57") {
            sdp = mozVidFreezeModSdp(sdp);
            console.log(" received answer sdp after modification " + sdp);
        }
        obj.peerConnection.setRemoteDescription(new RTCSessionDescription({ "type": type, "sdp": sdp }));

        var icelen = obj.callObj[callId].iceCandidates.length;
        for (var i = 0; i < icelen; i++) {
            var candidate = obj.callObj[callId].iceCandidates.pop();
            obj.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }
    if (type == "pranswer") {
        for (i in localice) {

            obj.sendIceConference(localice[i].remoteUser, localice[i].candidate, localice[i].tmp, localice[i].callId, function(ret, resp) {
                console.log("response from sendicetoserver " + ret);
            });
        }
    }
}

var wr_recv_rem_answer = function(sdp, callId, type) {
    //sdp = sdp.replace(/172.31.36.89/ig, '52.26.193.237');
    var obj = window.CS.call;
    if (obj.peerConnection) {
        console.log(" received answer sdp as received modification " + sdp);
        if (navigator.sayswho == "Firefox 56" || navigator.sayswho == "Firefox 57") {
            sdp = mozVidFreezeModSdp(sdp);
            console.log(" received answer sdp after modification " + sdp);
        }
        obj.peerConnection.setRemoteDescription(new RTCSessionDescription({ "type": type, "sdp": sdp }));

        var icelen = obj.callObj[callId].iceCandidates.length;
        for (var i = 0; i < icelen; i++) {
            var candidate = obj.callObj[callId].iceCandidates.pop();
            obj.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
    }
    if (type == "pranswer") {
        for (i in localice) {
            obj.sendIce(localice[i].remoteUser, localice[i].candidate, localice[i].tmp, localice[i].callId, function(ret, resp) {
                console.log("response from sendicetoserver " + ret);
            });
        }
    }
}

var wr_handleError = function(event) {
    console.log("conf err");
};

var wr_gotRemoteStream = function(event, callId) {
    callId_g = callId;
    var obj = window.CS.call;
    if (obj.remoteUiElem.srcObject !== event.stream) {
        obj.remoteUiElem.srcObject = event.stream;
        console.log("Received remote stream");
        if (callId && window.CS.call.callObj[callId].is_record_callTrue) {
            console.log(event.stream.getAudioTracks());
            config = {};
            config = obj.callObj[callId].isVideoCall ? {
                type: "video",
                mimeType: "video/webm"
            } : {
                type: "audio",
                mimeType: "audio/webm"
            };
            if (window.CS.call.callObj[callId].type == "PSTN" && window.CS.call.callObj[callId].state == 5) {
                config = {
                    type: "audio",
                    mimeType: window.CS.call.callObj[callId].mimeType,
                    bitsPerSecond: 64 * 8 * 1024,
                    checkForInactiveTracks: true,
                    timeSlice: window.CS.call.callObj[callId].timeSlice,
                    ondataavailable: wr_get_media_stream
                };
                if (window.CS.call.callObj[callId].mimeType == 'audio/wav')
                    config.recorderType = RecordRTC.StereoAudioRecorder
                if (window.CS.call.callObj[callId].requestedStream == 'localstream')
                    recorder_g = RecordRTC(obj.localStream, config);
                else if (window.CS.call.callObj[callId].requestedStream == 'remotestream')
                    recorder_g = RecordRTC(event.stream, config);
            } else
                recorder_g = RecordRTC([event.stream, obj.localStream], config);

            is_recording_g = true;
            if (recorder_g)
                recorder_g.startRecording();
        }
    }

};
async function wr_gotRemoteStreamAnswerConf1(event, callId) {

    callId_g = callId;
    console.log("remote stream");
    var obj = window.CS.call;

    window.CS.subscribeFlag = false;
    if (obj.remoteUiElem.srcObject !== event.streams[0]) {
        obj.remoteUiElem.srcObject = event.streams[0];
        // obj.remoteStream = event.stream;
        console.log("Received remote stream");
        if (callId && window.CS.call.callObj[callId].is_record_callTrue) {
            console.log(event.stream.getAudioTracks());
            config = {};
            config = obj.callObj[callId].isVideoCall ? {
                type: "video",
                mimeType: "video/webm"
            } : {
                type: "audio",
                mimeType: "audio/webm"
            };
            if (window.CS.call.callObj[callId].type == "PSTN" && window.CS.call.callObj[callId].state == 5) {
                config = {
                    type: "audio",
                    mimeType: window.CS.call.callObj[callId].mimeType,
                    bitsPerSecond: 64 * 8 * 1024,
                    checkForInactiveTracks: true,
                    timeSlice: window.CS.call.callObj[callId].timeSlice,
                    ondataavailable: wr_get_media_stream
                };
                if (window.CS.call.callObj[callId].mimeType == 'audio/wav')
                    config.recorderType = RecordRTC.StereoAudioRecorder
                if (window.CS.call.callObj[callId].requestedStream == 'localstream')
                    recorder_g = RecordRTC(obj.localStream, config);
                else if (window.CS.call.callObj[callId].requestedStream == 'remotestream')
                    recorder_g = RecordRTC(event.stream, config);
            } else
                recorder_g = RecordRTC([event.stream, obj.localStream], config);

            is_recording_g = true;
            if (recorder_g)
                recorder_g.startRecording();
        }
    }

};
var wr_gotRemoteStreamAnswerConf = function(event, callId) {

    callId_g = callId;
    console.log("remote stream");
    var obj = window.CS.call;

    if (obj.remoteUiElem.srcObject != event.streams[0]) {
        obj.remoteUiElem.srcObject = event.streams[0];
        // obj.remoteStream = event.stream;
        console.log("Received remote stream");
        if (callId && window.CS.call.callObj[callId].is_record_callTrue) {
            console.log(event.stream.getAudioTracks());
            config = {};
            config = obj.callObj[callId].isVideoCall ? {
                type: "video",
                mimeType: "video/webm"
            } : {
                type: "audio",
                mimeType: "audio/webm"
            };
            if (window.CS.call.callObj[callId].type == "PSTN" && window.CS.call.callObj[callId].state == 5) {
                config = {
                    type: "audio",
                    mimeType: window.CS.call.callObj[callId].mimeType,
                    bitsPerSecond: 64 * 8 * 1024,
                    checkForInactiveTracks: true,
                    timeSlice: window.CS.call.callObj[callId].timeSlice,
                    ondataavailable: wr_get_media_stream
                };
                if (window.CS.call.callObj[callId].mimeType == 'audio/wav')
                    config.recorderType = RecordRTC.StereoAudioRecorder
                if (window.CS.call.callObj[callId].requestedStream == 'localstream')
                    recorder_g = RecordRTC(obj.localStream, config);
                else if (window.CS.call.callObj[callId].requestedStream == 'remotestream')
                    recorder_g = RecordRTC(event.stream, config);
            } else
                recorder_g = RecordRTC([event.stream, obj.localStream], config);

            is_recording_g = true;
            if (recorder_g)
                recorder_g.startRecording();
        }
    }


};
var wr_get_media_stream = function(blob) {
    window.CS.call.callObj[callId_g].mediaStreamBlob.push(blob);
    //console.log(blob);
};

var wr_get_local_sdp = function(description, callId) {

    var obj = window.CS.call;
    console.log(" local sdp " + description.sdp);
    obj.peerConnection.setLocalDescription(description).then(function() { sendLocalSDPOffer(callId); }).catch(wr_on_error);
};
var wr_get_local_sdp_conference = function(description, callId) {

    var obj = window.CS.call;
    console.log(" local offer sdp " + description.sdp);
    obj.peerConnection.setLocalDescription(description).then(function() { sendLocalSDPOfferConference(callId); }).catch(wr_on_error);
};

function randNum() {
    return Math.ceil(Math.random() * 1000000000);
};

var sendLocalSDPOfferConference = function(callId) {
    var obj = window.CS.call;
    var tmpid = randNum();
    obj.callObj[callId].publisherId = obj.super.localUser;
    var payload = {
        uVersion: obj.super.protoVersion,
        stJoinConferencePublisherReq: {
            stHdrs: { sMobNu: obj.super.localUser, sClientId: obj.super.clientId, ullTransId: tmpid },
            sConferenceId: callId,
            eConferenceType: obj.super.proto_conferenceType.values.E_CONFERENCE_TYPE_VIDEO,
            sSdp: obj.peerConnection.localDescription.sdp,
            ullPin: 1234
        }
    };
    // console.log("offerSDP from User",obj.peerConnection.localDescription.sdp);
    if (!obj.isVideoCall)
        payload.stJoinConferencePublisherReq.eConferenceType = obj.super.proto_conferenceType.values.E_CONFERENCE_TYPE_AUDIO;
    window.CS.send_msg(obj.super, false, obj.super.proto_conferenceExtensionMsgType.values.E_JOIN_CONFERENCE_PUBLISHER_RQT, payload, true);
};
var sendLocalSDPOffer = function(callId) {
    var obj = window.CS.call;
    var tmpid = randNum();
    if (obj.callObj[callId].type == "IP") {
        var payload = { uVersion: obj.super.protoVersion, stDirectAudioVideoCallStartReq: { stHdrs: { sMobNu: obj.super.localUser, sClientId: obj.super.clientId, ullTransId: tmpid }, sDstMobNu: obj.remoteUser, stCallType: obj.super.proto_callType.values.E_VIDEOCALL, sCallId: callId, sSdp: obj.peerConnection.localDescription.sdp, sCallActive: true, sStartTime: Math.floor(Date.now()) } };
        if (!obj.isVideoCall)
            payload.stDirectAudioVideoCallStartReq.stCallType = obj.super.proto_callType.values.E_VOICECALL;
        window.CS.send_msg(obj.super, false, obj.super.proto_msgType.values.E_DIRECT_AUDIO_VIDEO_CALL_START_RQT, payload);
    } else if (obj.callObj[callId].type == "PSTN") {
        var payload = { uVersion: obj.super.protoVersion, stCallStartReq: { stHdrs: { sMobNu: obj.super.localUser, sClientId: obj.super.clientId, ullTransId: tmpid }, sDstMobNu: obj.remoteUser, stCallType: obj.super.proto_callType.values.E_VOICECALL, sCallId: callId, sSdp: obj.peerConnection.localDescription.sdp, sFromNumber: obj.fromUser ? obj.fromUser : undefined } };
        window.CS.send_msg(obj.super, false, obj.super.proto_msgType.values.E_CALL_START_RQT, payload);
    }
};

var wr_send_remote_answer = function(description, callId) {

    var obj = window.CS.call;
    obj.peerConnection.setLocalDescription(description).then(function() { sendAnswerSDP(callId); }).catch(wr_on_error);

    var icelen = obj.callObj[callId].iceCandidates.length;

    console.log("send_remote_answer iceCandidates len " + icelen);
    for (var i = 0; i < icelen; i++) {
        var candidate = obj.callObj[callId].iceCandidates.pop();
        obj.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("callee adding ice " + i);
    }
};
async function wr_send_remote_answer_conference(description, callId, imlId) {

    var obj = window.CS.call;
    obj.peerConnectionB.setLocalDescription(description).then(async() => { await sendAnswerSDPB(callId, imlId) }).catch(wr_on_error);

    var icelen = obj.callObj[callId].iceCandidates.length;

    console.log("send_remote_answer iceCandidates len " + icelen);
    for (var i = 0; i < icelen; i++) {
        var candidate = obj.callObj[callId].iceCandidates.pop();
        obj.peerConnectionB.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("callee adding ice " + i);
    }
};
async function wr_send_remote_answer_conference1(description, callId) {

    var obj = window.CS.call;
    obj.peerConnectionC.setLocalDescription(description).then(async() => { await sendAnswerSDPC(callId); }).catch(wr_on_error);

    var icelen = obj.callObj[callId].iceCandidates.length;

    console.log("send_remote_answer iceCandidates len " + icelen);
    for (var i = 0; i < icelen; i++) {
        var candidate = obj.callObj[callId].iceCandidates.pop();
        obj.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("callee adding ice " + i);
    }
};

async function sendAnswerSDPB(callId, imlId) {

    var obj = window.CS.call;

    console.log("Answer SDP from local", obj.peerConnectionB.localDescription.sdp);
    obj.sendAnswerConference(callId, obj.peerConnectionB.localDescription.sdp, imlId, function(err, resp) {
        console.log("remoteUserBBBBBBBBBBB", imlId, resp);
        console.log("answer sent " + err);
    });
};
async function sendAnswerSDPC(callId) {

    var obj = window.CS.call;

    console.log("Answer SDP from local", obj.peerConnectionC.localDescription.sdp);
    await obj.sendAnswerConference1(callId, obj.peerConnectionC.localDescription.sdp, obj.remoteUser, function(err, resp) {
        console.log("remoteUserCCCCCCCCCC", obj.remoteUser, resp);
        console.log("answer sent " + err);
    });
};
var sendAnswerSDP = function(callId) {

    var obj = window.CS.call;
    obj.sendAnswer(callId, obj.peerConnection.localDescription.sdp, function(err, resp) {
        console.log("answer sent " + err);
    });
};

var wr_send_rem_call_end = function() {
    var obj = window.CS.call;

    if (obj.localStream)
        obj.localStream.getTracks().forEach(function(track) { track.stop(); });

    stopCallRecording();

    if (obj.peerConnection) {
        obj.peerConnection.close();
        obj.peerConnection = null;
        obj.localUiElem.srcObject = undefined;
        obj.remoteUiElem.srcObject = undefined;
    }
};
var wr_send_rem_call_end_conference = function() {
    var obj = window.CS.call;

    if (obj.localStream)
        obj.localStream.getTracks().forEach(async(track) => { track.stop(); });

    //stopCallRecording();

    if (obj.peerConnection) {


        obj.localUiElem.srcObject = undefined;
        // obj.remoteUiElem.srcObject = undefined;
        obj.localUiElem = undefined;
        // obj.localStream = undefined;
        obj.remoteUiElem = undefined;
        // obj.peerConnection.ontrack = null;
        // obj.peerConnection.onicecandidate = null
        obj.peerConnection.close();
        obj.peerConnection = null;
    }
    if (obj.peerConnectionB) {
        // obj.localUiElem.srcObject = undefined;

        // obj.peerConnectionB.ontrack = null;
        obj.peerConnectionB.remoteUiElem = undefined;

        obj.peerConnectionB.close();
        obj.peerConnectionB = null;
    }
    if (obj.peerConnectionC) {

        // obj.peerConnectionC.ontrack = null;
        // obj.localUiElem.srcObject = undefined;
        obj.peerConnectionC.remoteUiElem = undefined;

        obj.peerConnectionC.close();
        obj.peerConnectionC = null;
    }
};


window.CS.servers = {
    'iceServers': [
        { 'urls': window.CS.stun },
        {
            'urls': window.CS.turn,
            'username': window.CS.turnUser,
            'credential': window.CS.turnPassword
        },
    ]
};

var wr_get_local_stream_to_answer = function(localStream, callId) {

    var obj = window.CS.call;
    obj.localUiElem.srcObject = localStream;
    obj.localStream = localStream;
    console.log("wr_get_local_stream_to_answer");

    obj.peerConnection = new RTCPeerConnection(window.CS.servers);
    obj.peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            var tmp = JSON.stringify({ 'ice': event.candidate });
            console.log("local ice candidate " + tmp);
            obj.sendIce(obj.remoteUser, event.candidate.candidate, tmp, callId, function(ret, resp) {});
        }
    };

    obj.peerConnection.onaddstream = function(event) { wr_gotRemoteStream(event, callId); };
    //obj.peerConnection.ontrack = wr_gotRemoteStream;
    obj.peerConnection.onsignalingstatechange = function(event) {
        //console.log("---------------->>>  Call state changed to ");
        //console.dir(event);
        //var state = obj.peerConnection.iceConnectionState;
        //console.log(state);
    };
    obj.peerConnection.addStream(localStream);
    obj.peerConnection.setRemoteDescription(new RTCSessionDescription({ "type": "offer", "sdp": obj.remoteSDP }));
    //localStream.getTracks().forEach(
    //  function(track) {
    //    obj.peerConnection.addTrack(track, localStream);
    //  }
    //);
    obj.peerConnection.createAnswer().then(function(description) { wr_send_remote_answer(description, callId); }).catch(wr_handleError);
};
async function wr_get_local_stream_to_answer_conference(localStream, callId, remoteUiElem, remoteSDP, imlId) {

    console.log("conference B local stream action");
    var obj = window.CS.call;
    // obj.localUiElem.srcObject = localStream;
    // obj.localStream = localStream;
    console.log("wr_get_local_stream_to_answer_conference");



    obj.peerConnectionB = new RTCPeerConnection(window.CS.servers);

    obj.peerConnectionB.addStream(localStream);
    obj.peerConnectionB.onicecandidate = function(event) {

        if (event.candidate) {

            var iceCandidates = [event.candidate.candidate]
            var tmp = [JSON.stringify({ 'ice': event.candidate })];
            console.log("conference answer local ice " + tmp);

            obj.sendIceConference(obj, iceCandidates, tmp, callId, function(ret, resp) {
                console.log("response from sendicetoserver " + ret);
            });
        }
    };
    // obj.peerConnectionB.onaddstream = function(event) { wr_gotRemoteStreamAnswerConf(event, callId); };
    obj.peerConnectionB.setRemoteDescription(new RTCSessionDescription({ "type": "offer", "sdp": remoteSDP }));
    obj.peerConnectionB.ontrack = function(event) {

        console.log("remoteUiElem", remoteUiElem);
        remoteUiElem.srcObject = event.streams[0];
        // obj.remoteStream = event.stream;
        console.log("Received remote stream");
    };
    obj.peerConnectionB.onsignalingstatechange = function(event) {
        //console.log("---------------->>>  Call state changed to ");
        //console.dir(event);
        //var state = obj.peerConnection.iceConnectionState;
        //console.log(state);
    };
    // obj.localStream.getTracks().forEach(
    //     function(track) {
    //         obj.screenShareArrB.push(obj.peerConnectionB.addTrack(track, localStream));
    //     }
    // );
    obj.peerConnectionB.createAnswer().then((description) => { wr_send_remote_answer_conference(description, callId, imlId) }).catch(wr_handleError);
};
async function wr_get_local_stream_to_answer_conference1(localStream, callId) {

    console.log("conference C local stream action");
    var obj = window.CS.call;
    // obj.localUiElem.srcObject = localStream;
    // obj.localStream = localStream;

    window.CS.subscribeFlag = false;
    console.log("wr_get_local_stream_to_answer_conference1");
    var subscribedUsersArr = window.CS.call.subscribedUsers;
    // if (subscribedUsersArr.length < 1) {
    //     var obj = window.CS.call;
    //     var _lastChar = obj.remoteUiElem
    //     var lastChar = _lastChar.charAt(_lastChar.length - 1);
    //     if (lastChar == 1) {
    //         obj.remoteUiElem = "video#remoteVideo2";

    //     }

    //     if (obj.remoteUser == "+919912939939") {
    //         obj.remoteUser = "+919912348488"
    //     } else if (obj.remoteUser == "+919912348488") {
    //         obj.remoteUser = "+919912939939"
    //     }
    // }
    obj.peerConnectionC = new RTCPeerConnection(window.CS.servers);
    obj.peerConnectionC.addStream(localStream);
    obj.peerConnectionC.onicecandidate = async(event) => {

        if (event.candidate) {

            var iceCandidates = [event.candidate.candidate]
            var tmp = [JSON.stringify({ 'ice': event.candidate })];
            console.log("conference answer local ice " + tmp);

            obj.sendIceConference(obj, iceCandidates, tmp, callId, function(ret, resp) {
                console.log("response from sendicetoserver " + ret);
            });
        }
    };
    obj.peerConnectionC.setRemoteDescription(new RTCSessionDescription({ "type": "offer", "sdp": obj.remoteSDP }));
    // obj.peerConnectionC.onaddstream = function(event) { wr_gotRemoteStreamAnswerConf1(event, callId); };
    obj.peerConnectionC.ontrack = async(event) => {
        await wr_gotRemoteStreamAnswerConf1(event, callId);
    };
    obj.peerConnectionC.onsignalingstatechange = function(event) {
        //console.log("---------------->>>  Call state changed to ");
        //console.dir(event);
        //var state = obj.peerConnection.iceConnectionState;
        //console.log(state);
    };
    // obj.localStream.getTracks().forEach(
    //     function(track) {
    //         obj.screenShareArrC.push(obj.peerConnectionC.addTrack(track, localStream));
    //     }
    // );
    obj.peerConnectionC.createAnswer().then(
        async(description) => {
            await wr_send_remote_answer_conference1(description, callId);
        }).catch(wr_handleError);
};

var localice = [];
var wr_create_local_stream_to_offer = function(localStream, callId) {
    var obj = window.CS.call;
    obj.localUiElem.srcObject = localStream;
    obj.localStream = localStream;

    obj.peerConnection = new RTCPeerConnection(window.CS.servers);
    console.log("created peer connection");
    obj.peerConnection.onicecandidate = function(event) {
        if (event.candidate) {
            var tmp = JSON.stringify({ 'ice': event.candidate });
            console.log("local ice " + tmp);
            if (obj.callObj[callId].type == "IP") {
                obj.sendIce(obj.remoteUser, event.candidate.candidate, tmp, callId, function(ret, resp) {
                    console.log("response from sendicetoserver " + ret);
                });
            } else if (obj.callObj[callId].type == "PSTN") {
                obj.sendIce(obj.remoteUser, event.candidate.candidate, tmp, callId, function(ret, resp) {
                    console.log("response from sendicetoserver " + ret);
                });
            } else {
                localice.push({ remoteUser: obj.remoteUser, candidate: event.candidate.candidate, tmp: tmp, callId: callId });
            }
        }
    };

    obj.peerConnection.onaddstream = function(event) { wr_gotRemoteStream(event, callId); };
    // obj.peerConnection.ontrack = function(event) { wr_gotRemoteStream(event, callId); };
    obj.peerConnection.onsignalingstatechange = function(event) {
        //console.log("---------------->>>  Call state changed to ");
        //console.dir(event);
        //var state = obj.peerConnection.iceConnectionState;
        //console.log(state);
    };
    obj.peerConnection.addStream(localStream);
    //localStream.getTracks().forEach(
    //  function(track) {
    //    obj.peerConnection.addTrack(track, localStream);
    //  }
    //);
    //obj.peerConnection.createOffer(wr_get_local_sdp, wr_handleError);
    obj.peerConnection.createOffer().then(function(description) { wr_get_local_sdp(description, callId); }).catch(wr_handleError);
};

var wr_send_rem_call = function(obj, callId, isVideoCall, localUiElem, remoteUiElem) {
    obj.localUiElem = document.getElementById(localUiElem);
    obj.remoteUiElem = document.getElementById(remoteUiElem);
    navigator.mediaDevices.getUserMedia({ audio: true, video: isVideoCall }).then(function(localStream) { wr_create_local_stream_to_offer(localStream, callId); }).catch(getUserMediaFailed);
};

// var wr_send_rem_call_conference = async function(obj, conferenceId, isVideoCall, localUser, flag) {
var wr_send_rem_call_conference = async(obj, conferenceId, isVideoCall, localUser) => {
    obj.localUiElem = document.getElementById(localUser);
    // if (flag == false) {

    navigator.mediaDevices.getUserMedia({ audio: true, video: isVideoCall }).then(function(localStream) {
        wr_create_local_stream_to_offer_conference(localStream, conferenceId);
    }).catch(getUserMediaFailed);

}
var wr_create_local_stream_to_offer_conference = function(localStream, callId) {

    console.log("conference A local stream action");
    var obj = window.CS.call;
    obj.screenShareArr = [];


    obj.localUiElem.srcObject = localStream;
    obj.localStream = localStream;

    obj.peerConnection = new RTCPeerConnection(window.CS.servers);
    console.log("created peer connection");
    obj.peerConnection.onicecandidate = function(event) {

        if (event.candidate) {
            var iceCandidates = [event.candidate.candidate]
            var tmp = [JSON.stringify({ 'ice': event.candidate })];
            console.log("local ice " + tmp);

            obj.sendIceConference(obj, iceCandidates, tmp, callId, function(ret, resp) {
                console.log("response from sendicetoserver " + ret);
            });

        }

    };

    // obj.peerConnection.onaddstream = function(event) { wr_gotRemoteStreamAnswerConf(event, callId); };
    //obj.peerConnection.ontrack = wr_gotRemoteStream;

    obj.peerConnection.ontrack = function(event) { wr_gotRemoteStreamAnswerConf(event, callId); };
    obj.peerConnection.onsignalingstatechange = function(event) {
        //console.log("---------------->>>  Call state changed to ");
        //console.dir(event);
        //var state = obj.peerConnection.iceConnectionState;
        //console.log(state);
    };
    obj.peerConnection.addStream(localStream);
    // obj.localStream.getTracks().forEach((track) => {
    //     obj.screenShareArr.push(obj.peerConnection.addTrack(track, localStream));
    //     obj.localUiElem.srcObject = localStream;
    // });
    //obj.peerConnection.createOffer(wr_get_local_sdp, wr_handleError);
    obj.peerConnection.createOffer().then(function(description) { wr_get_local_sdp_conference(description, callId); }).catch(wr_handleError);
}
var wr_set_local_mute = function(obj, callId, cb) {
    var senders = obj.peerConnection.getSenders();
    senders.forEach(function(element) {
        if (element.track.kind == "audio")
            element.track.enabled = false;
    });
    cb(100, "Ok");
};

var wr_set_local_unmute = function(obj, callId, cb) {
    debugger
    var senders = obj.peerConnection.getSenders();
    senders.forEach(function(element) {
        if (element.track.kind == "audio")
            element.track.enabled = true;
    });
    // var senders1 = obj.peerConnectionB.getSenders();
    // senders1.forEach(function(element) {
    //     if (element.track.kind == "audio")
    //         element.track.enabled = true;
    // });
    cb(100, "Ok");
};
var wr_set_local_mute_conference = function(obj, callId, cb) {
    debugger
    var senders = obj.peerConnection.getSenders();
    senders.forEach(function(element) {
        if (element.track.kind == "audio")
            element.track.enabled = false;
    });

    // var senders1 = obj.peerConnectionB.getSenders();
    // senders1.forEach(function(element) {
    //     if (element.track.kind == "audio")
    //         element.track.enabled = true;
    // });
    cb(100, "Ok");
};

var wr_set_local_unmute_conference = function(obj, callId, cb) {
    var senders = obj.peerConnection.getSenders();
    senders.forEach(function(element) {
        if (element.track.kind == "audio")
            element.track.enabled = true;
    });
    cb(100, "Ok");
};