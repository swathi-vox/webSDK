'use strict';
var localMobileNumber, loginbtn, username, password, susername, spassword, signupbtn, activatebtn, activationcode, addContactTxb, addContactbtn, videoCallTo, remoteUser = "",
    createGroupBtn, msgTypeLog,
    fromUser = "",
    callAnswerBtn, callDeclineBtn, isVideoCall, isRecent = true,
    conferenceCallAnswerBtn, conferenceCallDeclineBtn,
    timerid, isCallAnswered = false,
    callId;
var chatHistory = {}; // 
var chatPending = {}; // 
var appContactsList = {}; //mobileNumber:{"name":name, "mobileNumber":number, "statusMessage":message, "isOnline":true/false}
var nonAppContactsList = []; //mobileNumber:{"name":name, "mobileNumber":number, "statusMessage":message, "isOnline":true/false}
var recentActivityListJS = {}; //mobileNumber:{"name":name, "mobileNumber":number, "recentMessageTime":time, "recentMessage":message, "isOnline":true/false, "profilepic":url}
var callId;
var groupDetailsJson = {};
var results = [];
var confParticipants;
var groupCallId;
var subscribedUsers = [];
window.CS.subscriberConnected = 0;
window.CS.call.conferenceAnswered = false;
window.CS.subscribeFlag = false;
window.CS.subscribeOfferArr = [];
$(document).ready(function() {
    var cookieUser = getCookie("user");
    var cookiePass = getCookie("passwd");

    let config = {
        appId: "pid_07282ff2_5891_4853_9a8f_54c8bdb0d66f"
            // appId: "iamlivedbnew"
    };
    CS.initialize(config, function(ret, resp) {
        if (ret == 200) {
            console.log("SDK initialized");
            var cookieUser = getCookie("user");
            var cookiePass = getCookie("passwd");
            if (cookieUser && cookiePass && cookieUser != "undefined" && cookiePass != "undefined") {
                login_internal(cookieUser, cookiePass);
            }
            $('#sdkversion').html(CS.version);
        }
    });

    loginbtn = document.getElementById("loginbtn");
    username = document.getElementById("usernametxb");
    password = document.getElementById("passwordtxb");
    susername = document.getElementById("susernametxb");
    spassword = document.getElementById("spasswordtxb");
    signupbtn = document.getElementById("signupbtn");
    activatebtn = document.getElementById("activatebtn");
    activationcode = document.getElementById("activationcodetxb");
    addContactTxb = document.getElementById("addContactTxb");
    addContactbtn = document.getElementById("addContactbtn");
    addContactbtn.onclick = add_new_contact;
    createGroupBtn = document.getElementById("createGroupBtn");

    createGroupBtn.onclick = add_new_group;
    callAnswerBtn = document.getElementById("callAnswerBtn");
    callDeclineBtn = document.getElementById("callDeclineBtn");
    // muteUnmute = document.getElementById("callDeclineBtn");
    // callDeclineBtn = document.getElementById("callDeclineBtn");
    conferenceCallAnswerBtn = document.getElementById("conferenceCallAnswerBtn");
    conferenceCallDeclineBtn = document.getElementById("conferenceCallDeclineBtn");
    callAnswerBtn.onclick = onCallAnswer;
    callDeclineBtn.onclick = onCallDecline;
    conferenceCallAnswerBtn.onclick = onConferenceCallAnswer;
    conferenceCallDeclineBtn.onclick = onConferenceCallDecline;
    loginbtn.onclick = login;
    //signupbtn.onclick = onSignup;
    activatebtn.onclick = onActivateAccount;
    CS.contacts.onMessage(handlePresenceFromIML);
    CS.chat.onMessage(handleChatFromIML);
    CS.call.onMessage(handleCallFromIML);
    CS.groupManagemt.onMessage(handleGroupManagemtFromIML);

    $("#mute").on("click", function() {
        if (!CS.call.isMuted) {
            CS.call.mute(callId, true, function(ret, resp) {});
            CS.call.isMuted = true;
            $("#mute").html("<img src='./images/dc-img/ic-audio-normal.png'>");
        } else {
            CS.call.mute(callId, false, function(ret, resp) {});
            CS.call.isMuted = false;
            $("#mute").html('<img src="./images/dc-img/ic-audio-hover.png">');
        }
    });
    $('#muteConference').on("click", function() {

        var muteElement = $("#muteConference").html();
        if (muteElement == '<img src="./images/dc-img/ic-audio-normal.png">' || muteElement == "") {

            $("#muteConference").html('<img src="./images/dc-img/ic-audio-hover.png">');
            CS.call.muteConference(callId, false, function(ret, resp) {});
        } else if (muteElement == '<img src="./images/dc-img/ic-audio-hover.png">') {
            $("#muteConference").html('<img src="./images/dc-img/ic-audio-normal.png">');
            CS.call.muteConference(callId, true, function(ret, resp) {});
        }
    });
    $("#callControls").on("click", "#callEnd", function() {
            $("#callWrapper").hide()

            $("#groupCallWrapper").hide()
            $("#wrapper").show();
            $('.righthead').show();
            $('.call-header, .call-footer').css("display", "none");

            $('#leftSection').show();
            stopTimer();
            CS.call.end(callId, "Bye", function(ret, resp) {

                console.log("call end returned " + ret);
            });
            CS.call.saveRecording(callId, "call_record.webm", function(ret, resp) {
                console.log("saving call record");
            });

            $("#chatDisplay").css('display', 'block');

            $("#chatDisplayBlock").css('display', 'flex');
        })
        // $("#conferenceCallControls").on("click", "#conferenceCallEnd", function() {

    //     var obj = window.CS.call;
    //     $("#callWrapper").hide()

    //     $("#groupCallWrapper").hide()
    //     $("#wrapper").show();
    //     $('.righthead').show();
    //     $('.call-header, .conference-call-footer').css("display", "none");

    //     $('#leftSection').show();
    //     stopTimer();
    //     CS.call.endConference("Bye", function(ret, resp) {

    //         var groupCallWrapper = document.getElementById('groupCallWrapper');
    //         while (groupCallWrapper.children.length > 1) {
    //             groupCallWrapper.removeChild(groupCallWrapper.lastChild);
    //         }
    //         if (!obj.conferenceInitiator) {

    //             $("#welcome").show();
    //         }
    //         window.CS.call.videoEleUiCount = 0;
    //         window.CS.call.conferenceAnswered = false;
    //         window.CS.call.subscribedUsers = [];
    //         window.CS.call.remoteUser = "";
    //         window.CS.call.conferenceInitiator = null;
    //         subscribedUsers = [];
    //         window.CS.call.super.remoteUser = "";
    //         window.CS.call.alertDetails = null;
    //         window.CS.call.remoteSDP = null;
    //         if (window.CS.subscribeOfferObj)
    //             window.CS.subscribeOfferObj = null;
    //         if (window.CS.subscribeOfferArr)
    //             window.CS.subscribeOfferArr = [];
    //         if (window.CS.subscriberConnected)
    //             window.CS.subscriberConnected = 0;
    //         callId = "";
    //         window.CS.call.activeCallId = "";
    //         var count = $("#muteConference");
    //         if (count.childElementCount > 0) {
    //             count.html() = '';
    //         }
    //     });

    //     $("#chatDisplay").show();

    // })

    function onConferenceCallDecline() {

        $('#conferenceCallModal').modal('hide')
        CS.call.endConference("Bye", function(ret, resp) {

            console.log("call end returned " + ret);
            window.CS.call.videoEleUiCount = 0;
            window.CS.call.conferenceAnswered = false;
            window.CS.call.subscribedUsers = [];
            window.CS.call.remoteUser = "";
            window.CS.call.conferenceInitiator = null;
            subscribedUsers = [];
            window.CS.call.super.remoteUser = "";
            window.CS.call.alertDetails = null;
            window.CS.call.remoteSDP = null;
            if (window.CS.subscribeOfferObj)
                window.CS.subscribeOfferObj = null;
            if (window.CS.subscribeOfferArr)
                window.CS.subscribeOfferArr = [];
            if (window.CS.subscriberConnected)
                window.CS.subscriberConnected = 0;
            callId = "";
            window.CS.call.activeCallId = "";

        });
    }
    $("#profileDiv").on("click", function() {
        $("#profileModal").modal('toggle')
    });
    $("#rightSection .remove-contact").on("click", function() {
        if (confirm("Do you really want to remove user from contact list?")) {
            CS.contacts.removeContact(remoteUser, function(err, resp) {
                if (err != 200) {
                    console.log("remove contacts failed with code " + err + " reason " + resp);
                } else {
                    //removeFromRecentActivityList(remoteUser);
                    var lis = getSortedRecentActivityList();
                    if (lis.length > 0) {
                        readyUserUI(lis[0][0], false);
                    } else {
                        $("#welcome").show();
                    }

                    showRecentActivityList();
                    updateContacts();
                }
            });
        }
    })

    $("#chatFileUpload").on("change", function() {
        var fi = document.getElementById('chatFileUpload'); // GET THE FILE INPUT AS VARIABLE.
        var totalFileSize = 0;
        // VALIDATE OR CHECK IF ANY FILE IS SELECTED.
        if (fi.files.length > 0) {
            //ACCESS THE SIZE PROPERTY OF THE ITEM OBJECT IN FILES COLLECTION. IN THIS WAY ALSO GET OTHER PROPERTIES LIKE FILENAME AND FILETYPE
            console.log(fi.files.item(0).size);
            console.log(fi.files.item(0).name);
            console.log(fi.files.item(0).type);

            var ct, type = fi.files.item(0).type.split('/')[0];
            if (type == 'image')
                ct = CS.chat.ChatFileType.IMAGE;
            else if (type == 'video')
                ct = CS.chat.ChatFileType.VIDEO;
            else
                ct = CS.chat.ChatFileType.DOCUMENT;

            var ret = CS.chat.sendFile(remoteUser, ct, fi.files.item(0).type, undefined, fi.files.item(0), 0, CS.appId, function(err, resp) {
                if (err != 200) {
                    console.log("send file in chat failed");
                } else {
                    console.log("send file in chat success");

                    if (!chatHistory[remoteUser])
                        chatHistory[remoteUser] = [];

                    updateRecentContactStatusMessage(remoteUser, fi.files.item(0).name, Math.floor(Date.now()));
                    chatHistory[remoteUser].push({ "id": ret.id, "time": ret.sentTime, "isLocal": true, "message": resp.url, "type": type, "status": "PENDING" });
                    showChatHistory();
                }
            });

        }
    });
    $("#groupCallWrapper").on("click", function(e) {

        var index = e.target.id;
        if ($('#groupCallWrapper .video-container').children('video.maximize-video').length > 0) {
            console.log("Found");
            $('#groupCallWrapper .video-container').find("video.maximize-video").removeClass("maximize-video");
        } else {
            $("#" + index).addClass("maximize-video")
        }

    });
    $('#serachBar').on("keyup", function(e) {
        results = [];
        var objects = Object.values(recentActivityListJS);

        var chat_History = chatHistory;
        var _inputValue = $('#serachBar').val();
        var inputValue = _inputValue.toLowerCase();



        if (_inputValue.length == 0) {

            $('#searchResultDiv').hide();
        } else {

            filterIt(objects, inputValue);
        }
        if (e.keyCode == 13) {
            $('#searchResultDiv').hide();
            objects.forEach(function(element, index) {
                if (element.name == _inputValue) {

                    updateSearchRecent(element.mobileNumber);
                }
            });
        }

    });


    function filterIt(arr, searchKey) {

        $('#searchResultDiv ul').html('');
        return arr.filter(function(obj) {

            return Object.keys(obj).some(function(key) {
                if (typeof(obj[key]) == "string") {
                    var objKey = obj[key].toLowerCase();
                    if (objKey.includes(searchKey) == true) {
                        var objRecMsg = (key == "recentMessage") ? obj.recentMessage : "";
                        var objName = (obj.name) ? obj.name : obj.mobileNumber;
                        var objMob = (key == "mobileNumber") ? obj.mobileNumber : "";
                        if (searchKey.length != 0) {

                            var searchListItem = '<li onclick="searchItem(event)"><div class="mediumFont searchResultInnerDiv">' + objName + '</div><div class="smallFont searchResultInnerDiv">' + objMob + '</div><div class="smallFont searchResultInnerDiv">' + objRecMsg + '</div></li>'
                            $('#searchResultDiv ul').append(searchListItem);

                            $('#searchResultDiv').show();
                            return results.push(obj);
                        }

                    } else {
                        return false;
                    }
                }

            })

        });
    }

    $("#rightSection .attachment").on("click", function() {
        $("#chatFileUpload").val('');
        $("#chatFileUpload").click();
    })

    $("#makePSTNCall .pstn-call").on("click", function() {
        CS.contacts.addContact(makePSTNCallTxb.value, function(err, resp) {
            if (err != 200 && err != 204) {
                console.log("add contact failed with response code " + err + " reason " + resp);
            } else {
                addToRecentActivityList(makePSTNCallTxb.value);
                readyUserUI(makePSTNCallTxb.value, false);

                showRecentActivityList();
                updateContacts();
                $('#makePSTNCallTxb').val('');
                $('#dragModal').modal('hide');
                // $('#makePSTNCallModel').modal('hide');
                // fromUser = makePSTNCallFromTxb.value;
                // $('#makePSTNCallFromTxb').val('');
                makePSTNCall();
                var data = { "id": "--", "time": Date.now(), "isLocal": true, "message": "Call", "type": "call-Video", "status": "Attempted" };

                if (!chatHistory[remoteUser])
                    chatHistory[remoteUser] = [];

                chatHistory[remoteUser].push(data);
                showChatHistory();
                $("#chatFileUpload").val('');
            }
        });
    })

    $("#rightSection .pstn-call").on("click", function() {
        makePSTNCall();
        var data = { "id": "--", "time": Date.now(), "isLocal": true, "message": "Call", "type": "call-Video", "status": "Attempted" };

        if (!chatHistory[remoteUser])
            chatHistory[remoteUser] = [];

        chatHistory[remoteUser].push(data);
        showChatHistory();
    })

    $("#rightSection .video-call").on("click", function() {
        $('#localVideo').css("display", "block");
        $('#remoteVideo').css("display", "block");



        makeVideoCall(true);
        var data = { "id": "--", "time": Date.now(), "isLocal": true, "message": "Call", "type": "call-Video", "status": "Attempted" };

        if (!chatHistory[remoteUser])
            chatHistory[remoteUser] = [];

        chatHistory[remoteUser].push(data);
        showChatHistory();
    })
    $('#ProfilePage').on("click", function() {
        var proFileName = "";
        proFileName = $('.profile-name').html();
        CS.contacts.getProfile(proFileName, function(err, resp) {
            if (err != 200) {
                alert("get profile " + err + " reason " + resp);
            } else {
                console.dir(resp);
                $('#chatDisplay').hide();
                $('#profile-page').show();
                $('.profile-page-profile-name').html(resp.displayName);
                $('#uName').val(resp.displayName);
                $('#uStatus').val(resp.Presence);
                $('.profileHead').show();
                $('.righthead').hide();

            }
        })
    })
    $("#setProfileBtn").on("click", function() {
        CS.contacts.setProfile($('#uName').val(), $('#uStatus').val(), "", function(ret, resp) {
            if (ret == "200") {
                alert("contact updated successfully");


                $('#ProfilePage').click();
            }
        });
    });
    // $("#rightSection .group-audio-call, #rightSection .group-attachment").on("click", function() {
    $("#rightSection .group-attachment").on("click", function() {
        // return alert("This feature will be relase in next version");

    })

    $("#rightSection .group-video-call").on("click", function() {
        // return alert("This feature will be relase in next version");
        //  $('#groupCallWrapper').empty();
        // var groupCall = (groupDetailsJson[remoteUser].groupcontacts.length) - 1;

        // for (var i = 0; i <= groupCall; i++) {

        //     var videoItem = '<video id="remoteVideo' + i + '" autoplay></video>';

        //     $('#groupCallWrapper').append(videoItem);

        // }
        makeGroupVideoCall(true);
        var data = { "id": "--", "time": Date.now(), "isLocal": true, "message": "call-Video", "type": "call-Video", "status": "Attempted" };

        if (!chatHistory[remoteUser])
            chatHistory[remoteUser] = [];

        chatHistory[remoteUser].push(data);
        showChatHistory();
    });
    $("#rightSection .audio-call").on("click", function() {
        $('#localVideo').hide();
        $('#remoteVideo').hide();
        makeVideoCall(false);
    })

    $("#chatBox").on("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) { // return key
            $("#sendChat").click();
        }
    });

    $('#shareButton').on('click', async() => {

        var screenShareArr = window.CS.call.screenShareArr;
        var image = document.getElementById('shareButton');
        var senders = window.CS.call.peerConnection.getSenders();
        if (image.src.match("ic-screen-share-on.png")) {
            image.src = "./images/ic-screen-share-off.png";
            // if (!displayMediaStream) {
            // var displayMediaStream = await navigator.mediaDevices.getDisplayMedia();
            // }
            navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
                const screenTrack = stream.getTracks()[0];
                senders.find(sender => sender.track.kind === 'video').replaceTrack(screenTrack);
                //show what you are showing in your "self-view" video.
                document.getElementById('remoteVideo0').srcObject.replaceTrack(screenTrack);

            })
        } else {
            image.src = "./images/ic-screen-share-on.png";
            // screenShareArr.find(sender => sender.track.kind === 'video').replaceTrack(userMediaStream.getTracks().find(track => track.kind === 'video'));
            senders.find(sender => sender.track.kind === "video").replaceTrack(window.CS.call.localStream.getTracks()[1]);
            document.getElementById('remoteVideo0').srcObject = window.CS.call.localStream;
            // document.getElementById('share-button').style.display = 'inline';
            // document.getElementById('stop-share-button').style.display = 'none';
        }

    });
    //loading dummy data
    $("#passwordtxb").on("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) { // return key
            $("#loginbtn").click();
        }
    });

    $(".add-new-contact").on("click", function() {
        $("#add-new-contact").modal('toggle');
    })

    $(".make-pstn-call").on("click", function() {
        // $("#makePSTNCallModel").modal('toggle');
        // $("#dragModal").modal('toggle');
        dragFunc();
    })

    $(".create-group-call").on("click", function() {
        $("#webGroupChat").modal('toggle');
    })

    $(".add-group-call.flip").on("click", function(e) {
        var target = $(this).attr("href");
        if (target == "#groupList") {

            $(target).show();
        }
        $("#contactsList").hide();

        $("#recentActivityList").hide();

        e.preventDefault();
    });
    $(".contacts-list.flip").on("click", function(e) {
        var target = $(this).attr("href");
        if (target == "#contactsList") {

            $(target).show();
        }
        $("#groupList").hide();

        $("#recentActivityList").hide();

        e.preventDefault();
    });
    $(".recent-contacts.flip").on("click", function(e) {

        var target = $(this).attr("href");
        if (target == "#recentActivityList") {

            $(target).show();
        }
        $("#contactsList").hide();

        $("#groupList").hide();

        e.preventDefault();
        showRecentActivityList();
        $('#serachBar').val('');
        $('#leftSection').show();
    });
    $('.all-call.flip').on("click", function(e) {
        var target = $(this).attr("href");
        if (target == "#allCall") {

            $(target).show();
        }
        $("#contactsList").hide();

        $("#groupList").hide();
        $("#contactsList").hide();


        e.preventDefault();
        if (!recentActivityListJS) return;
        var _items = Object.keys(recentActivityListJS).map(function(key) {

            return [key, recentActivityListJS[key].recentMessageTime, recentActivityListJS[key].recentMessage];



        });
        // var items = Object.keys(_items).filter(function(_items) {
        //     return _items[keys][2] == "Call";
        // });
        var items = [];
        for (var i = 0; i < _items.length; i++) {
            if (_items[i][2] == "Call") {
                var _xyz = _items[i][0];
                var xyz = [recentActivityListJS[_xyz].mobileNumber, recentActivityListJS[_xyz].recentMessageTime]
                items.push(xyz);
            }
        }


        items.sort(function(first, second) {
            return first[1] - second[1];
        });

        var sorted = items.slice(0);

        $("#recentActivityList").empty();

        for (var s in sorted)
            addDivToRecentActivityList(recentActivityListJS[sorted[s][0]]);


    })
    $('.all-chat.flip').on("click", function(e) {
        var target = $(this).attr("href");
        if (target == "#allChat") {

            $(target).show();
        }
        $("#contactsList").hide();

        $("#groupList").hide();
        $("#contactsList").hide();


        e.preventDefault();
        if (!recentActivityListJS) return;
        var _items = Object.keys(recentActivityListJS).map(function(key) {

            return [key, recentActivityListJS[key].recentMessageTime, recentActivityListJS[key].recentMessage];



        });
        // var items = Object.keys(_items).filter(function(_items) {
        //     return _items[keys][2] == "Call";
        // });
        var items = [];
        for (var i = 0; i < _items.length; i++) {
            if (_items[i][2] != "Call") {
                var _xyz = _items[i][0];
                var xyz = [recentActivityListJS[_xyz].mobileNumber, recentActivityListJS[_xyz].recentMessageTime]
                items.push(xyz);
            }
        }


        items.sort(function(first, second) {
            return first[1] - second[1];
        });

        var sorted = items.slice(0);

        $("#recentActivityList").empty();

        for (var s in sorted)
            addDivToRecentActivityList(recentActivityListJS[sorted[s][0]]);


    })



    $(".block-user").on("click", function() {

        var element = document.getElementById("blockUser");
        var blockUnblockNum = document.getElementsByClassName('group-info-contacts-block')[0].id
        if ($(".unblock")[0] != undefined) {
            // it exists
            CS.contacts.blockUser(blockUnblockNum, function(err, resp) {
                if (err != 200) {
                    console.log("unblocked  " + err + " reason " + resp);
                } else {
                    console.log("unblocked user succeeded ");
                    console.dir(resp);
                    element.classList.remove("unblock");
                }

            });
        } else {
            CS.contacts.unblockUser(blockUnblockNum, function(err, resp) {
                if (err != 200) {
                    console.log("blocked  " + err + " reason " + resp);
                } else {
                    console.log("blocked user succeeded ");
                    console.dir(resp);
                    element.classList.add("unblock");
                }
            });
        }
    });

    $(".logout").on("click", function() {
        toggleList();
        CS.logout();
        setCookie("user", "", 0);
        setCookie("passwd", "", 0);
        location.reload();
        document.getElementById('login-view').classList.remove("hide");
        document.getElementById('demo-view').classList.add("hide");
    });

    //Adding members from contaclist to history list
    $("#contactsList").on("click", ".con-list-mem", function() {
        var mobileNumber = $(this).prop("id");
        if (mobileNumber == "") {
            alert("No interactio possible as user hasn't signed up");
            return;
        }

        addToRecentActivityList(mobileNumber);
        readyUserUI(mobileNumber, false);

        updateHistory(mobileNumber);


        showRecentActivityList();
        toggleList()
    });
    //Adding members from group list to history list
    $("#groupList").on("click", ".con-list-mem", function() {
        var groupid = $(this).prop("id");
        if (groupid == "") {
            alert("No interactio possible as user hasn't signed up");
            return;
        }

        addToRecentActivityList(groupid);
        readyUserUI(groupid, false);
        updateHistory(groupid);

        loadOverlayDetails(groupid);

        showRecentActivityList();
    });

    //Chat histroy list item click
    $("#recentActivityList").on("click", ".ch-list-mem", function() {
        //update right side chat window header
        var cid = $(this).prop("id");
        showRecentActivityList();
        readyUserUI(cid, false);

        updateHistory(cid);


    });


    $('#chatBox').on('input', function(e) {
        CS.chat.sendIsTyping(remoteUser, "");
    });

    //Submiting chat message
    $("#sendChat").on("click", function() {
        var flag = (groupDetailsJson[remoteUser]) ? false : true;
        var msg = $("#chatBox").val();

        if (msg.length == 0)
            return;

        $("#chatBox").val("");
        if (msg != null) {
            var ret = CS.chat.sendMessage(remoteUser, msg, CS.chat.ChatType.TEXT_PLAIN, 0, function(err, resp) {
                if (err != 200) {
                    console.log("send chat failed with code " + err + " reason " + resp);
                } else {
                    console.log("send chat succeeded ");
                    console.dir(resp);
                    //chatHistory[currentChatDialogueName] +="<li class=\"chatelemself\">"+chatmsg.value+" <div class=\"tstamp\"> "+secondsToHms(Date.now())+"</div></li>";
                }
            }, flag);
            if (!chatHistory[remoteUser])
                chatHistory[remoteUser] = [];

            updateRecentContactStatusMessage(remoteUser, msg, Math.floor(Date.now()));
            chatHistory[remoteUser].push({ "id": ret.id, "time": ret.sentTime, "isLocal": true, "message": msg, "status": "PENDING", "type": "Text" });
            showChatHistory();
        }
    });

    $('#callModal').on('show.bs.modal', function(e) {

        console.log('modal show');
        var x = document.getElementById("ringtone");
        x.loop = true;
        x.play();
        isCallAnswered = false;
    });

    $('#callModal').on('hidden.bs.modal', function(e) {
        var x = document.getElementById("ringtone");
        x.pause();
        if (!isCallAnswered)
            CS.call.decline(callId, function(ret, resp) { console.log("ret " + ret); });
    });

    $('#conferenceCallModal').on('show.bs.modal', function(e) {
        console.log('conference modal show');
        var x = document.getElementById("conferenceRingtone");
        x.loop = true;
        x.play();
        isCallAnswered = false;
    });

    $('#conferenceCallModal').on('hidden.bs.modal', function(e) {
        var x = document.getElementById("conferenceRingtone");
        x.pause();
        if (!isCallAnswered)
            CS.call.decline(callId, function(ret, resp) { console.log("ret " + ret); });
    });

    $('.addParticipantsBtn').click(function(e) {

        // $("#addGroupParticipantsPopup").modal('toggle');
        var selected = $("#groupParticipantList option:selected");
        var groupUserList = [];
        var groupid = e.target.id;

        selected.each(function() {
            var _groupUserList = $(this).val();

            // {
            //    // "name": $(this).text(),
            //     "mobileNumber:": $(this).val()
            // };

            groupUserList.push(_groupUserList);
        });
        console.log("dfgh", groupUserList);

        var groupUserCount = groupUserList.length;
        if (groupUserList.length != null) {
            CS.chat.addUsersToGroup(groupid, groupUserList, groupUserCount, function(err, resp) {
                if (err != 200) {
                    alert("group user list failed with code " + err + " reason " + resp);
                } else {
                    alert("group user list successfully");
                    console.dir(resp);

                    // retGetGroupList();
                    retGetSpecificGroupDetails(groupid);


                }
            });

        }

    });


    var elmnt = document.getElementById("dragModal");
    elmnt.style.display = "none";
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    elmnt.style.top = '25%';
    elmnt.style.left = "30%";
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = ((elmnt.offsetTop - pos2) < 0) ? "0" : (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }

});

function dragFunc() {
    var x = document.getElementById("dragModal");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }

}

var callid = '',
    is_muted = false,
    is_started = false;

function clearDialer() {

    if (destnumbVal != undefined) {

        document.getElementById('inputOutput').value = destnumbVal;
        is_started = false;
        start(destnumbVal);
    } else {
        alert("Please enter a valid phone number ")
        return false;
    }

    // $("#output").html('');
}

function callStart() {
    var dialVal = document.getElementById('inputOutput').value;
    start(dialVal);
    console.log("dialVal", dialVal)
}
var backspaceVal

function backspace() {
    backspaceVal = document.getElementById('inputOutput').value;
    // count--;
    backspaceVal = backspaceVal.slice(0, -1)
        // console.log("gg", backspaceVal)

    document.getElementById('inputOutput').value = backspaceVal;

}

var destnumbVal;

function start(destnum) {
    document.getElementById('inputOutput').value = destnum;
    var varinputVal = document.getElementById('inputOutput').value;
    if (varinputVal.length < 11 || varinputVal.length > 13) {
        alert("Please enter a valid phone number ")
        return false;
    }
    var startId = document.getElementById("startbtn");
    console.log("destination no is:" + destnum);
    if (is_started == false) {
        is_started = true;
        callid = CS.call.startPSTNCall(destnum, "localVideo", "remoteVideo", function() {});
        destnumbVal = varinputVal;
        document.getElementById("startbtn").innerHTML = 'End';
        startId.classList.add("endDialer");
        document.getElementById("callEndSuccessfully").style.display = "none";
        document.getElementById("mobileDialerHeader").style.display = "none";
        document.getElementById("callInProgress").style.display = "block";
    } else {
        /* End ongoing call */
        is_started = false;
        CS.call.end(callid, "Bye", function(ret, resp) {
            if (ret == 200)
                console.log("call end successfully");
        });
        endCallFunction();
    }
}

function makeTimerZero() {
    $('#hours').html('00:');
    $('#mins').html('00:');
    $('#seconds').html('0');
    hours = 0;
    mins = 0;
    seconds = 0;

    startTimerDialer = null;


}
var hours = 0;
var mins = 0;
var seconds = 0;
var startTimerDialer = null;

startTimerDialer = setInterval(timex, 1000);

function timex() {
    seconds++;
    if (seconds > 59) {
        seconds = 0;
        mins++;
        if (mins > 59) {
            mins = 0;
            hours++;
            if (hours < 10) {
                $("#hours").text('0' + hours + ':')
            } else {
                $("#hours").text(hours + ':');
            }
        }

        if (mins < 10) {
            $("#mins").text('0' + mins + ':');
        } else {
            $("#mins").text(mins + ':');
        }
    }
    if (seconds < 10) {
        $("#seconds").text('0' + seconds);
    } else {
        $("#seconds").text(seconds);
    }
}

function muteUnmute() {
    if (!CS.call.callObj[callid].isMuted) {
        CS.call.mute(callid, true, CS.call.callObj[callid].isVideoMuted, function(ret, resp) {});
        document.getElementById("mute").innerHTML = '<i class="fa fa-microphone-slash" aria-hidden="true" style="color:red"></i>';
    } else if (CS.call.callObj[callid].isMuted) {
        CS.call.mute(callid, false, CS.call.callObj[callid].isVideoMuted, function(ret, resp) {});
        document.getElementById("mute").innerHTML = '<i class="fa fa-microphone" aria-hidden="true"></i>';
    }

}

function changeDial(e) {
    if (e.key == "Enter") {
        var varinputVal = document.getElementById('inputOutput').value;
        if (varinputVal.length < 11 || varinputVal.length > 13) {
            alert("Please enter a valid phone number ")
            return false;
        }
        start(varinputVal);
    }
}


function endCallFunction() {
    // document.getElementById('timerDialer').innerHTML;
    var varHour = $('#hours').html();
    var varMins = $('#mins').html();
    var varSec = $('#seconds').html();
    var stoppedTimer = varHour + varMins + varSec;
    document.getElementById('timerDialer').style.display = "none";
    document.getElementById("tempTimeDialer").style.display = "block";
    document.getElementById('tempTimeDialer').innerHTML = '';
    document.getElementById("incomingCallScreen").style.display = "none";
    document.getElementById("dialerScreen").style.display = "block";
    document.getElementById("startbtn").innerHTML = 'Call';
    var startId = document.getElementById("startbtn");
    startId.classList.remove("endDialer");
    document.getElementById("mobileDialerHeader").style.display = "none";
    document.getElementById("callInProgress").style.display = "none";
    document.getElementById('inputOutput').value = '';
    setTimeout(function() {

        // document.getElementById('timerDialer').innerHTML = stoppedTimer;
        document.getElementById("callEndSuccessfully").style.display = "none";
        document.getElementById("mobileDialerHeader").style.display = "block";
        document.getElementById("tempTimeDialer").style.display = "none";



        makeTimerZero();
    }, 2000);
    document.getElementById("callEndSuccessfully").style.display = "block";
    document.getElementById("mute").innerHTML = '<i class="fa fa-microphone" aria-hidden="true"></i>';
    clearInterval(startTimerDialer);
    var x = document.getElementById("ringtone");
    x.pause();
}


var oValue;

function dialClick(num) {
    var count = document.getElementById('inputOutput').value;
    // var num = ($(this).clone().children().remove().end().text());
    // $('#output').html(count);
    if (count.length < 14) {
        count = count + num;
        document.getElementById('inputOutput').value = count;


    }
};

function sortChatHistory() {
    if (!chatHistory[remoteUser]) return;

    var sorted = chatHistory[remoteUser].slice(0);
    sorted.sort(function(a, b) {
        return a.time - b.time;
    });

    updateRecentContactStatusMessage(remoteUser, sorted[sorted.length - 1].message, sorted[sorted.length - 1].time);
}

function updateHistory(mobileNumber) {
    if (!chatHistory[mobileNumber]) {
        CS.chat.getHistory(mobileNumber, 100, 1, function(ret, resp) {
            console.log("chat history:");
            for (var elem in resp.history) {
                var rem = resp.history[elem].src;
                if (resp.history[elem].src == localMobileNumber)
                    rem = resp.history[elem].dst;

                if (!chatHistory[rem])
                    chatHistory[rem] = [];

                var data = { "id": resp.history[elem].id, "time": resp.history[elem].sentTimestamp, "isLocal": resp.history[elem].dst == rem, "message": resp.history[elem].data, "type": resp.history[elem].chatType, "status": resp.history[elem].messageStatus };

                if (resp.history[elem].thumbnail)
                    data.thumbnail = resp.history[elem].thumbnail;

                chatHistory[rem].push(data);
            }

            CS.call.getHistory(mobileNumber, 100, 1, function(ret, resp) {
                for (var elem in resp.history) {
                    var rem = resp.history[elem].src;
                    if (resp.history[elem].src == localMobileNumber)
                        rem = resp.history[elem].dst;

                    if (!chatHistory[rem])
                        chatHistory[rem] = [];

                    var data = { "id": resp.history[elem].id, "time": resp.history[elem].startTime, "isLocal": resp.history[elem].dst == rem, "message": "Call", "type": "call-" + resp.history[elem].callType, "status": resp.history[elem].status };
                    chatHistory[rem].push(data);
                    //updateRecentContactStatusMessage(rem, "Call", resp.history[elem].startTime);
                }

                sortChatHistory();
                showChatHistory();
            });
        });
    }
}

function makePSTNCall() {
    callId = CS.call.startPSTNCall(remoteUser, "localVideo", "remoteVideo", function(code, phrase) {
        stopTimer();
        window.sectics = 0;
        $("#callTimer").html(SecondsTohhmmss(window.sectics));
        $("#callWrapper").hide()
        $("#wrapper").show();
        $("#callModal").modal('hide');
        $('#callControls').show();
        alert(phrase);
    }, false, fromUser);

    updateRecentContactStatusMessage(remoteUser, "Call", Math.floor(Date.now()));

    $("#callWrapper").show()
        // $("#wrapper").hide();
    $(".call-mem-name").text(videoCallTo);
    // $('#callControls').show();

    $('.call-header, .call-footer').css("display", "flex");
    // $(".call-mem-name").text(videoCallTo)
}



function makeVideoCall(isVideoCall) {
    //videoCallTo
    $('#chatDisplay').css('display', 'none');
    $('#chatDisplayBlock').css('display', 'none');
    callId = CS.call.startCall(remoteUser, "localVideo", "remoteVideo", isVideoCall, function(code, phrase) {
        stopTimer();
        window.sectics = 0;
        $("#callTimer").html(SecondsTohhmmss(window.sectics));
        $("#callWrapper").hide();
        $("#wrapper").show();
        $("#callModal").modal('hide');
        alert(phrase);
    }, true);

    updateRecentContactStatusMessage(remoteUser, "Call", Math.floor(Date.now()));

    $("#callWrapper").show()
        // $("#wrapper").hide();
    $('.righthead').hide();

    $('#leftSection').hide();

    $('.call-header, .call-footer').css("display", "flex");
    $(".call-mem-name").text(videoCallTo)
}

function onConferenceCallAnswer() {
    startTimer();
    //   var videoItem = '<video id="remoteVideo1" autoplay></video>';

    //    $('#groupCallWrapper').append(videoItem);

    CS.call.answerConference(callId, "remoteVideo0", isVideoCall, function(code, phrase) {


    })
    $("#groupCallWrapper").show()
    $('#conferenceCallModal').modal('hide')
        // $("#wrapper").hide();
    $('.righthead').hide();

    $("#welcome").hide();
    $('#leftSection').hide();

    $('.call-header, .conference-call-footer').css("display", "flex");
    $(".call-mem-name").text(videoCallTo);
}

function makeGroupVideoCall(isVideoCall) {
    //videoCallTo    
    var confTitle = groupDetailsJson[remoteUser].groupname;
    //conferenceParticipantDetails();
    var confParticipants = groupDetailsJson[remoteUser].groupcontacts;

    //var conferenceConfig = conferenceConf();

    var confStartTime = Math.floor(Date.now());
    var confAgenda = "simply";
    var confLocation = "hyderabad";
    var confEndTime = confStartTime + 2000;

    groupCallId = CS.call.createConference(confTitle, confParticipants, confStartTime, isVideoCall, confAgenda, confLocation, confEndTime, function(err, resp) {

        if (err != 200) {
            alert("create conference failed with code " + err + " reason " + resp);
        } else {
            alert("'" + confTitle + "' conference is created successfully");
            stopTimer();
            window.sectics = 0;
            $("#conferenceCallTimer").html(SecondsTohhmmss(window.sectics));
            setTimeout(function() {
                console.log("resp", resp)
                updateRecentContactStatusMessage(remoteUser, "Call", Math.floor(Date.now()));

                $("#groupCallWrapper").show()
                    // $("#wrapper").hide();
                $('.righthead').hide();

                $('#leftSection').hide();

                $('.call-header, .conference-call-footer').css("display", "flex");
                $(".call-mem-name").text(videoCallTo);
                alert("hi");
                //CS.call.joinConferenceAsPublisher()
            }, 1000);

        }


    });
}


function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) +
        ((exdays == null) ? "" : ("; expires=" + exdate.toUTCString()));
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function updatePresence(mobileNumber, status) {
    if (appContactsList[mobileNumber])
        appContactsList[mobileNumber].isOnline = status;

    for (var key in recentActivityListJS) {
        if (recentActivityListJS[key].mobileNumber == mobileNumber) {
            recentActivityListJS[key].isOnline = status;
        }
    }


    showRecentActivityList();
}

function updateProfile(dat) {
    if (recentActivityListJS[dat.mobilenumber]) {
        recentActivityListJS[dat.mobilenumber] = { "name": dat.name, "mobileNumber": dat.mobilenumber, "recentMessageTime": "", "recentMessage": dat.message, "profilepic": window.CS.chat.getMediaURLPrefix() + dat.profilePicUrl + "?" + new Date().getTime(), "isOnline": true };

        showRecentActivityList();

        if (dat.mobilenumber == remoteUser) {
            $("#rightSection .info").text(dat.name + " (" + dat.mobilenumber + ")");
        }
    }
}

function handlePresenceFromIML(ret, resp) {
    if (ret == "UserJoined") {
        //add user to contacts list
    } else if (ret == "PresenceUpdate") {

        updatePresence(resp.user, resp.isOnline);
    } else if (ret == "ProfileChanged") {
        updateProfile(resp);
    }
}

function searchId(id, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
            return arr[i];
        }
    }
}

function onCallDecline() {
    CS.call.decline(callId, function(ret, resp) {
        console.log("ret " + ret);
        console.dir("resp" + resp);
    });
    $("#callModal").modal('hide');
    $('#chatDisplayBlock').css('display', 'flex');
    $('#chatDisplay').css('display', 'block');

}

function onCallAnswer() {
    startTimer();
    CS.call.answer(callId, "localVideo", "remoteVideo", function(ret, resp) { console.log("ret " + ret); });
    $("#callModal").modal('hide');
    $("#callWrapper").show();
    isCallAnswered = true;
    $("#wrapper, #leftSection, .righthead").hide();
    $('.container-fluid, .call-header, .call-footer').css("display", "flex");
    $('.call-mem-name').html(videoCallTo);
    $('#chatDisplayBlock').css('display', 'none');
    $('#chatDisplay').css('display', 'none');
    $('#welcome').css('display', 'none');


}


function onConferenceCallDecline() {}
var SecondsTohhmmss = function(totalSeconds) {
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    // round seconds
    seconds = Math.round(seconds * 100) / 100

    var result = (hours < 10 ? "0" + hours : hours);
    result += ":" + (minutes < 10 ? "0" + minutes : minutes);
    result += ":" + (seconds < 10 ? "0" + seconds : seconds);
    return result;
}


function updateTimeVal() {

    $("#callTimer").html(SecondsTohhmmss(window.sectics));
    window.sectics = window.sectics + 1;
}

function startTimer() {

    window.sectics = 1;
    timerid = setInterval(updateTimeVal, 1000);
}

function stopTimer() {
    clearInterval(timerid);
}

function handleGroupManagemtFromIML(msgType, resp) {
    console.log("handle group", msgType);
    alert("handle group" + msgType);

}

function handleCallFromIML(msgType, resp) {

    console.log("call eventtttttttt" + msgType + " received");
    console.log("conferenceTypeeeeeee", resp.conferenceAlertType);
    if (resp.isVideoCall)
        $('#call-title').text("Incoming video call from " + resp.caller);
    else
        $('#call-title').text("Incoming audio call from " + resp.caller);
    callId = resp.callId;
    switch (msgType) {
        case "PSTN-OFFER":
            /* direct incoming audio video offer */
        case "OFFER":
            /* direct incoming audio video offer */
            if (resp.conferenceCaller == "conferenceCall") {
                callId = resp.callId;
                if (resp.conferenceAlertType == 1) {

                    if (!recentActivityListJS[resp.caller]) {
                        addToRecentActivityList(resp.caller);
                        readyUserUI(resp.caller, false);
                        updateHistory(resp.remoteUser);

                        showRecentActivityList();
                    }
                    isVideoCall = resp.isVideoCall;

                    updateRecentContactStatusMessage(resp.caller, "Call", Math.floor(Date.now()));

                    var statusMsg = "Missed";
                    if (resp.isCallActive && (Date.now() - resp.startTime < 50000)) { //time diference > 50 seconds
                        console.log("conference incoming call request");
                        remoteUser = resp.caller;
                        $("#conferenceCallModal").modal('show');
                        statusMsg = "Incoming";
                    }

                    var data = { "id": "--", "time": Date.now(), "isLocal": true, "message": "Call", "type": "call-Video", "status": statusMsg };

                    if (!chatHistory[remoteUser]) {
                        chatHistory[remoteUser] = [];
                    }

                    chatHistory[remoteUser].push(data);
                    showChatHistory();
                } else if (resp.conferenceAlertType == 5) {

                    // this.callObj[resp.callId].subscriberArr.push(resp.alertDetails.sImlId);


                    if (this.conferenceAnswered == true) {
                        var count = document.getElementById("groupCallWrapper").childElementCount;
                        // var count = (_count == 1) ? _count : _count + 1;
                        var videoItem = '<div class="video-container"><video id="remoteVideo' + count + '"  autoplay></video><span id="videoEelementName' + count + '"></span></div>';
                        $('#groupCallWrapper').append(videoItem);
                        CS.call.subscribePeers(callId, resp.alertDetails.sImlId, function(err, resp) {

                            if (err != 200) {
                                alert("subscribe peer failed with code " + err + " reason " + resp);
                            } else {
                                //     alert("subscribe is created successfully");
                            }
                        });
                    } else {

                        subscribedUsers.push(resp.alertDetails.sImlId);
                    }
                } else if (resp.conferenceAlertType == 9) {
                    alert("bye bye");
                    var groupCallWrapper = document.getElementById('groupCallWrapper');
                    while (groupCallWrapper.children.length > 1) {
                        groupCallWrapper.removeChild(groupCallWrapper.lastChild);
                    }
                }

            } else {

                callId = resp.callId;
                if (!recentActivityListJS[resp.caller]) {
                    addToRecentActivityList(resp.caller);
                    readyUserUI(resp.caller, false);
                    updateHistory(resp.remoteUser);

                    showRecentActivityList();
                }
                isVideoCall = resp.isVideoCall;

                updateRecentContactStatusMessage(resp.caller, "Call", Math.floor(Date.now()));

                var statusMsg = "Missed";
                if (resp.isCallActive && (Date.now() - resp.startTime < 50000)) { //time diference > 50 seconds
                    console.log("incoming call request");
                    remoteUser = resp.caller;
                    $("#callModal").modal('show');
                    statusMsg = "Incoming";
                }

                var data = { "id": "--", "time": Date.now(), "isLocal": true, "message": "Call", "type": "call-Video", "status": statusMsg };

                if (!chatHistory[remoteUser]) {
                    chatHistory[remoteUser] = [];
                }

                chatHistory[remoteUser].push(data);
                showChatHistory();
            }
            break;
        case "ANSWERED":
            /* direct audio video answer */
            document.getElementById("incomingCallScreen").style.display = "none";
            document.getElementById('timerDialer').style.display = "block";
            document.getElementById("startbtn").innerHTML = 'End';
            makeTimerZero();
            window.CS.call.videoEleUiCount = 0;
            this.conferenceAnswered = true;
            this.subscriberFlag = true;
            if (subscribedUsers != undefined) {

                window.CS.call.subscribedUsers = subscribedUsers;
                for (var i = 0; i < subscribedUsers.length; i++) {


                    // if (this.subscriberFlag == false) {
                    //     i--;
                    //     return;
                    // };
                    var count = document.getElementById("groupCallWrapper").childElementCount;
                    // var count = (_count == 1) ? _count : _count + 1;
                    var videoItem = '<div class="video-container"><video id="remoteVideo' + count + '"  autoplay></video><span id="videoEelementName' + count + '"></span></div>';
                    $('#groupCallWrapper').append(videoItem);
                    CS.call.subscribePeers(callId, subscribedUsers[i], function(err, resp) {

                        if (err != 200) {

                            alert("subscribe peer failed with code " + err + " reason " + resp);
                        } else {

                            // if (this.subscriberFlag == false) {

                            //     return;
                            // };
                            console.log("setTimeout start")
                                //  setTimeout(console.log("subscribe is created successfully", subscribedUsers[i]), 10000);


                        }
                    });

                }
            }

            console.log("incomin call answer");
            startTimer();
            $('#leftSection').hide();
            //document.getElementById('video-pane').classList.remove("hide");
            break;
        case "END":
            /* direct audio video end */
            console.log("incoming call end");
            //document.getElementById('video-pane').classList.add("hide");
            //remotehangup();
            stopTimer();
            window.sectics = 0;
            $("#callTimer").html(SecondsTohhmmss(window.sectics));
            $("#callWrapper").hide()
            $("#wrapper").show();
            $("#callModal").modal('hide');
            $("#leftSection").show();
            $('.righthead').css("display", "flex");
            $('.call-header, .call-footer').css("display", "none");
            $('.call-header, .conference-call-footer').css("display", "none");
            break;
        case "PSTN-END":
            /* direct audio video end */
            console.log("pstn incoming call end");
            //document.getElementById('video-pane').classList.add("hide");
            //remotehangup();
            stopTimer();
            window.sectics = 0;
            $("#callTimer").html(SecondsTohhmmss(window.sectics));
            $("#callWrapper").hide()
            $("#wrapper").show();
            $("#callModal").modal('hide');
            break;
        case "RINGING":
            /* Remote end ringing*/

            break;
    }
}


function handleChatFromIML(type, resp) {
    if (type == "NEW-MESSAGE") {
        if (!recentActivityListJS[resp.remoteUser]) {
            addToRecentActivityList(resp.remoteUser);
            readyUserUI(resp.remoteUser, false);
            updateHistory(resp.remoteUser);

            showRecentActivityList();
        }

        if (!chatHistory[resp.remoteUser])
            chatHistory[resp.remoteUser] = [];

        if (resp.remoteUser != remoteUser) {
            if (!chatPending[resp.remoteUser])
                chatPending[resp.remoteUser] = [];
            chatPending[resp.remoteUser].push({ "id": resp.id });

            showRecentActivityList();
        } else {

            var flag = (groupDetailsJson[resp.remoteUser]) ? false : true;
            if (flag == true) {

                CS.chat.sendReadReceipt(resp.remoteUser, resp.id, function(ret, resp) {}, flag, resp.chatInitiator);

            }
        }

        var data = { "id": resp.id, "time": resp.timestamp, "isLocal": false, "message": resp.data, "type": resp.chattype };
        if (resp.thumbnail)
            data.thumbnail = resp.thumbnail;

        chatHistory[resp.remoteUser].push(data);

        updateRecentContactStatusMessage(resp.remoteUser, resp.data, Math.floor(Date.now()));
    } else if (type == "IS-COMPOSING") {
        $("#rightSection .istyping").text(" is composing a message...");
        setTimeout(function() { $("#rightSection .istyping").text("") }, 3000);
    } else if (type == "SENT") {
        var elem = searchId(resp.id, chatHistory[resp.remoteUser]);
        elem.status = "SENT";
    } else if (type == "DELIVERED") {
        var elem = searchId(resp.id, chatHistory[resp.remoteUser]);
        if (elem.status != "READ")
            elem.status = "DELIVERED";
    } else if (type == "READ") {
        var elem = searchId(resp.id, chatHistory[resp.remoteUser]);
        elem.status = "READ";
    }
    showChatHistory();
}

function updateRecentContactStatusMessage(mobileNumber, message, time) {
    var msg = message;
    if (msg.length > 20) {
        msg = message.slice(0, 20) + "...";
    }

    recentActivityListJS[mobileNumber].recentMessage = msg;
    if (time) {
        recentActivityListJS[mobileNumber].recentMessageTime = time;
        $("#msg-time-" + mobileNumber).text(secondsToHms(time));
    }

    $("#msg-" + mobileNumber).text(msg);

    showRecentActivityList();
}

function showChatHistory() {
    $("#chatItems .chat-window-items").empty();
    if (!chatHistory[remoteUser]) return;

    var sorted = chatHistory[remoteUser].slice(0);
    sorted.sort(function(a, b) {
        return a.time - b.time;
    });

    for (var i = 0; i < sorted.length; i++) {
        var isSameDay = false;
        if ((sorted.length > 1) && (i > 0) && (i - 1 != sorted.length)) {
            var ith_time = new Date(sorted[i].time);
            var jth_time = new Date(sorted[i - 1].time);
            if ((ith_time.getYear() == jth_time.getYear()) && (ith_time.getMonth() == jth_time.getMonth()) && (ith_time.getDate() == jth_time.getDate())) {
                isSameDay = true;
            } else {
                isSameDay = false;
            }
        }

        showChatMessage(sorted[i], isSameDay);

        if (chatPending[remoteUser] && i < sorted.length) {
            if (chatPending[remoteUser].length + i + 1 == sorted.length) {
                $("#chatItems .chat-window-items").append("<div class=\"datebubble\"><span class=\"message\">Unread messages</span></div>");
            }
        }
    }

    if (chatPending[remoteUser]) {
        for (var i = 0; i < chatPending[remoteUser].length; i++) {

            var flag = (groupDetailsJson[remoteUser]) ? false : true;
            var cI = "";
            CS.chat.sendReadReceipt(remoteUser, chatPending[remoteUser][i].id, function(ret, resp) {
                if (ret != 200)
                    console.log("Failed to send read receipt for chat");
            }, flag, cI);
        }
        delete chatPending[remoteUser];
    }

    if (sorted.length > 0)

        updateRecentContactStatusMessage(remoteUser, sorted[sorted.length - 1].message, sorted[sorted.length - 1].lastMessageTime);

    updateScroll();
}

function updateScroll() {
    var element = document.getElementById("chat-window-scroll-id");
    element.scrollTop = element.scrollHeight;
}


function secondsToHms(d) {
    d = Number(d);

    var date = new Date(d);
    var minu = "0" + date.getMinutes();
    //var seco = "0" + date.getSeconds();
    //return date.getHours() + ":" + minu.substr(-2) +":"+ seco.substr(-2);
    return date.getHours() + ":" + minu.substr(-2);
}

function getpendingchat() {
    CS.chat.getPendingChat(function(err, resp) {
        if (err != 200 && err != 204) {
            console.log("get chat messages failed with response code " + err + " reason " + resp);
        }
    });
}

function caInitMap(mapid, uluru) {
    //var uluru = {lat: -25.363, lng: 131.044};
    var el = document.getElementById(mapid);
    //var el = document.getElementById("7B151EA1-3269-4EAC-AFAA-FB9F166D0BE4_map");
    var map = new google.maps.Map(el, {
        zoom: 4,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
}

function showChatMessage(msg, isSameDay) {
    var chatStatus = "";
    if (msg.status == "PENDING") {
        chatStatus = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15"><path fill="#859479" d="M9.75 7.713H8.244V5.359a.5.5 0 0 0-.5-.5H7.65a.5.5 0 0 0-.5.5v2.947a.5.5 0 0 0 .5.5h.094l.003-.001.003.002h2a.5.5 0 0 0 .5-.5v-.094a.5.5 0 0 0-.5-.5zm0-5.263h-3.5c-1.82 0-3.3 1.48-3.3 3.3v3.5c0 1.82 1.48 3.3 3.3 3.3h3.5c1.82 0 3.3-1.48 3.3-3.3v-3.5c0-1.82-1.48-3.3-3.3-3.3zm2 6.8a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-2-2v-3.5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2v3.5z"></path></svg>`
    } else if (msg.status == "SENT") {
        chatStatus = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15"><path fill="#92A58C" d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>`
    } else if (msg.status == "DELIVERED") {
        chatStatus = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15"><path fill="#92A58C" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>`
    } else if (msg.status == "READ") {
        chatStatus = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15"><path fill="orange" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path></svg>`
    }
    //if number is local/me add this used back ticks(es6 string iterpolation)

    var cbody, tmp = "";
    if (msg.type == "image") {
        // var url = window.CS.chat.getMediaURLPrefix() + msg.message;
        // if (msg.thumbnail) {
        //     url = window.CS.chat.getMediaURLPrefix() + msg.thumbnail;
        //     tmp = `<a href="${window.CS.chat.getMediaURLPrefix() + msg.message}" target="_blank"> Download full image </a>`;
        // }
        // cbody = `<img width="100%" height=calc(100% - 220px) onload=updateScroll() src="${url}" >` + tmp;

        window.CS.chat.getMediaURLPrefix(msg.message, CS.appId, function(ret, prefix) {
            var url = prefix;
            if (msg.thumbnail) {
                window.CS.chat.getMediaURLPrefix(msg.message, CS.appId, function(ret, prefix) {
                    url = prefix;
                    tmp = `<a href="${url}" target="_blank"> Download full image </a>`;
                    cbody = `<img width="100%" height=calc(100% - 220px) onload=updateScroll() src="${url}" >` + tmp;
                    showChatMessageCb(msg, isSameDay, chatStatus, cbody)
                })
            } else {
                cbody = `<img width="100%" height=calc(100% - 220px) onload=updateScroll() src="${url}" >` + tmp;
                showChatMessageCb(msg, isSameDay, chatStatus, cbody)
            }
        })


    }
    //      else if (msg.type == "call-Audio") {
    //         cbody = `<div class="iconSec"><img src="./images/phone.png" width="40px" height="40px" /></div> <div class="messageSec">Status '${msg.status}'</div>`;
    //     } else if (msg.type == "call-Video") {
    //         cbody = `<div class="iconSec"><img src="./images/phone.png" width="40px" height="40px" /></div> <div class="messageSec">Status '${msg.status}'</div>`;
    //     } else if (msg.type == "video") {
    //         cbody = `<video width="400px" height="300px" onloadeddata=updateScroll() onloadstart=updateScroll() controls> <source src="${window.CS.chat.getMediaURLPrefix() + msg.message}" > </video>`;
    //     } else if (msg.type == "location") {
    //         cbody = msg.message;
    //     } else if (msg.type == "contact") {
    //         cbody = msg.message;
    //     } else if (msg.type == "Text") {
    //         cbody = msg.message;
    //     } else {
    //         cbody = `<a href="${window.CS.chat.getMediaURLPrefix() + msg.message}" target="_blank" >Download ${msg.type}</a>`;
    //     }

    //     var localMsg = `
    //    <div class="bubble local" id="${msg.id}">
    //    <div class="message" >
    //    ${cbody}
    //    </div>
    //    <div class="tstamp">${secondsToHms(msg.time)}
    //      ${chatStatus}
    //    </div>
    //  </div>
    //    `
    //         //if number is remote/me add this
    //     var remoteMsg = `
    //    <div class="bubble remote" id="${msg.id}">
    //    <div class="message" > 
    //     ${cbody}
    //    </div>
    //    <div class="message-status"></div><div class="tstamp">${secondsToHms(msg.time)}</div>
    //    </div>    
    //    `;

    //     var seperator = "";
    //     if (!isSameDay) {
    //         var date = new Date(msg.time);

    //         seperator = date.toDateString();


    //         var dateSeperator = `
    //       <div class="datebubble">
    //          <span class="message" > 
    //             ${seperator}
    //          </span>
    //       </div>    
    //       `;
    //         $("#chatItems .chat-window-items").append(dateSeperator);
    //     }


    //     if (msg.isLocal) {
    //         $("#chatItems .chat-window-items").append(localMsg)
    //     } else {
    //         $("#chatItems .chat-window-items").append(remoteMsg)
    //     }
    else if (msg.type == "call-Audio") {
        cbody = `<div class="iconSec"><img src="./images/phone.png" width="40px" height="40px" /></div> <div class="messageSec">Status '${msg.status}'</div>`;
        showChatMessageCb(msg, isSameDay, chatStatus, cbody)
    } else if (msg.type == "call-Video") {
        cbody = `<div class="iconSec"><img src="./images/phone.png" width="40px" height="40px" /></div> <div class="messageSec">Status '${msg.status}'</div>`;
        showChatMessageCb(msg, isSameDay, chatStatus, cbody)
    } else if (msg.type == "video") {
        window.CS.chat.getMediaURLPrefix(msg.message, function(ret, prefix) {
            var url = prefix;
            cbody = `<video width="400px" height="300px" onloadeddata=updateScroll() onloadstart=updateScroll() controls> <source src="${url}" > </video>`;
            showChatMessageCb(msg, isSameDay, chatStatus, cbody)
        });
    } else if (msg.type == "location") {
        cbody = msg.message;
        showChatMessageCb(msg, isSameDay, chatStatus, cbody)
    } else if (msg.type == "contact") {
        cbody = msg.message;
        showChatMessageCb(msg, isSameDay, chatStatus, cbody)
    } else if (msg.type == "Text") {
        cbody = msg.message;
        showChatMessageCb(msg, isSameDay, chatStatus, cbody)
    } else {
        window.CS.chat.getMediaURLPrefix(msg.message, function(ret, prefix) {
            var url = prefix;
            cbody = `<a href="${url}" target="_blank" >Download ${msg.type}</a>`;
            showChatMessageCb(msg, isSameDay, chatStatus, cbody)
        });
    }
}

function showChatMessageCb(msg, isSameDay, cStatus, cBody) {
    var chatStatus = cStatus;
    var cbody = cBody;
    var localMsg = `
   <div class="bubble local" id="${msg.id}">
   <div class="arrow-down-btn"></div>
   <div class="message" >
   ${cbody}
   </div>
   <div class="tstamp">${secondsToHms(msg.time)}
     ${chatStatus}
   </div>
 </div>
   `
        //if number is remote/me add this
    var remoteMsg = `
   <div class="bubble remote" id="${msg.id}">
   <div class="arrow-down-btn"></div>
   <div class="message" > 
    ${cbody}
   </div>
   <div class="message-status"></div><div class="tstamp">${secondsToHms(msg.time)}</div>
   </div>    
   `;

    var seperator = "";
    if (!isSameDay) {
        var date = new Date(msg.time);
        seperator = date.toDateString();
        var dateSeperator = `
      <div class="datebubble">
         <span class="message" > 
            ${seperator}
         </span>
      </div>    
      `;
        $("#chatItems .chat-window-items").append(dateSeperator);
    }

    if (msg.isLocal) {
        $("#chatItems .chat-window-items").append(localMsg)
    } else {
        $("#chatItems .chat-window-items").append(remoteMsg)
    }

}

function removeFromRecentActivityList(user) {
    if (recentActivityListJS[user])
        delete recentActivityListJS[user];
}

function addToRecentActivityList(mobileNumber) {
    if (groupDetailsJson[mobileNumber]) {
        recentActivityListJS[mobileNumber] = { "name": groupDetailsJson[mobileNumber].groupname, "mobileNumber": mobileNumber, "groupcontacts": groupDetailsJson[mobileNumber].groupcontacts, "groupDesp": groupDetailsJson[mobileNumber].groupdescription, "recentMessageTime": "", "recentMessage": "" };
    } else {

        recentActivityListJS[mobileNumber] = { "name": mobileNumber, "mobileNumber": mobileNumber, "recentMessageTime": "", "recentMessage": "", "isOnline": false };

    }
    if (appContactsList[mobileNumber])
        recentActivityListJS[mobileNumber].name = appContactsList[mobileNumber].name;
    getPresence([mobileNumber]);
}


function getSortedRecentActivityList() {
    if (!recentActivityListJS) return;

    var items = Object.keys(recentActivityListJS).map(function(key) {
        return [key, recentActivityListJS[key].recentMessageTime];
    });

    items.sort(function(first, second) {
        return second[1] - first[1];
    });

    var sorted = items.slice(0);

    return sorted;
}

function showRecentActivityList() {
    if (!recentActivityListJS) return;

    var items = Object.keys(recentActivityListJS).map(function(key) {
        return [key, recentActivityListJS[key].recentMessageTime];
    });

    items.sort(function(first, second) {
        return first[1] - second[1];
    });

    var sorted = items.slice(0);

    $("#recentActivityList").empty();

    for (var s in sorted)
        addDivToRecentActivityList(recentActivityListJS[sorted[s][0]]);
}


function addDivToRecentActivityList(obj) {
    var curUsr = "";
    if (remoteUser == obj.mobileNumber) {
        curUsr = " ch-list-mem-active"
    }

    var status = "-offline";
    if (obj.isOnline) {
        status = "-online";
    }

    var pending = "";
    if (chatPending[obj.mobileNumber] && chatPending[obj.mobileNumber].length > 0) {
        pending = `<div class="unread"> ${chatPending[obj.mobileNumber].length} </div>`;
    }

    var mobid = obj.mobileNumber,
        name = mobid,
        recentMessage = "",
        recentMessageTime = "";
    if (obj.recentMessage)
        recentMessage = obj.recentMessage;
    if (obj.recentMessageTime)
        recentMessageTime = obj.recentMessageTime;

    if (recentMessage == "Call") {
        var recentMessageImg = `<img src="./images/dc-img/ic-outgoing-call-history.png">`;
    } else {
        var recentMessageImg = `<img src="./images/dc-img/ic-chat-im.png">`;

    }
    if (groupDetailsJson[mobid]) {

        name = groupDetailsJson[mobid].groupname;
        var pic = `<img src="./images/dc-img/ic-group-1.png">`;
    } else {
        var pic = `<img src="./images/dc-img/ic-contact-1.png">`;

        if (obj.name)
            name = obj.name;
    }

    if (obj.profilepic) {
        pic = `<img src="${obj.profilepic}" alt="" class="profilePic"/>`;
    }

    var chatHistoryItem = `<div class="ch-list-mem` + curUsr + `" id="${mobid}">
  <div class="mem-pic">
     ${pic} 
  </div>
  <div class="mem-name">
    <p>${name}</p>
    <div class="mem-status-message" id="msg-${mobid}">${recentMessageImg}&nbsp;&nbsp;${recentMessage}</div>
  </div>
  <div class="mem-status-time" id="msg-time-${mobid}">${secondsToHms(recentMessageTime)}</div>
  ${pending}
  <div class="mem-status${status}"></div>
  </div>`;

    $("#recentActivityList").prepend(chatHistoryItem);
}

function showContactsList() {
    $("#contactsList").empty();
    for (var curkey in appContactsList) {
        var name = curkey;
        if (appContactsList[curkey].name.length > 0) {
            name = appContactsList[curkey].name;
        }

        var contactItem = `<div class="con-list-mem" id="${curkey}">
      
      <div class="mem-pic">
          <i class="fa fa-user-circle" aria-hidden="true"></i>
          <!-- replace with below image after profile pic support
          <img src="" alt="user pic" class="hide"/>-->
      </div>
      <div class="mem-name">
        <p>${name}</p>
        <div class="mem-contact-status" id="${curkey}-status">${appContactsList[curkey].statusMessage}</div>
      </div>
      </div>`;

        $("#contactsList").append(contactItem);
    }

    for (var i = 0; i < nonAppContactsList.length; i++) {
        if (!i)
            $("#contactsList").append("----Non app users----");

        var contactItem = `<div class="con-list-mem">
        <div class="arrow-down-btn"></div>
      <div class="mem-pic">
          <i class="fa fa-user-circle" aria-hidden="true"></i>
          <!-- replace with below image after profile pic support
          <img src="" alt="user pic" class="hide"/>-->
      </div>
      <div class="mem-name">
        <p>${nonAppContactsList[i]}</p>
      </div>
      </div>`;

        $("#contactsList").append(contactItem);
    }
}

function onActivateAccount() {
    CS.activate(susername.value, activationcode.value, function(err, resp) {
        if (err != 200 && err != 202) {
            console.log("activation failed with response code " + err + " reason " + resp);
        } else {
            username.value = susername.value;
            password.value = spassword.value;
            $('.nav-tabs a:first').tab('show');
            document.getElementById('activate-view').classList.add("hide");
            document.getElementById('login-controls-view').classList.remove("hide");
            alert("Account successfully created for " + username.value + ". You can login with your new account.");
        }
    });
}

function add_new_contact() {
    $('#add-new-contact').modal('hide');
    CS.contacts.addContact(addContactTxb.value, function(err, resp) {
        if (err != 200 && err != 204) {
            console.log("add contact failed with response code " + err + " reason " + resp);
        } else {
            alert("'" + addContactTxb.value + "' added successfully.");
            addToRecentActivityList(addContactTxb.value);
            readyUserUI(addContactTxb.value, false);

            showRecentActivityList();
            updateContacts();
        }
    });
}

function add_new_group() {
    var groupName = $("#groupName").val();
    $('#webGroupChat').modal('hide');
    if (groupName.length == 0)
        return;
    $("#groupName").val("");
    var groupDesp = "";
    var groupPic = null;
    if (groupName != null) {
        CS.chat.createGroup(groupName, groupDesp, groupPic, function(err, resp) {
            if (err != 200) {
                alert("create group failed with code " + err + " reason " + resp);
            } else {
                alert("'" + groupName + "' group is created successfully");
                console.dir(resp);
                retGetGroupList(false);
            }
        });

    }
}


function retGetGroupList(flag) {
    CS.chat.pullMyGroupsList(function(err, resp) {
        if (err != 200) {
            console.log("pull my group list failed with code " + err + " reason " + resp);
        } else {
            console.log("jj", resp);

            retGetGroupDetailList(resp, flag);
        }
    });
}

function retGetGroupDetailList(_groupidS, flag) {

    for (var i = 0; i < _groupidS.length; i++) {
        var groupid = _groupidS[i];
        CS.chat.pullMyGroupDetails(groupid, function(err, resp) {
            if (err != 200) {
                console.log("getting group details failed with code " + err + " reason " + resp);
            } else {
                groupDetailsJson[resp.groupid] = resp;
                showGroupList();

                readyUserUI(groupid, flag);

                if (!flag) {

                    addToRecentActivityList(groupid);
                    showRecentActivityList();
                }
            }
        });
    }
    console.dir("getJson", groupDetailsJson);
    console.log(i);
}

function showGroupList() {
    $("#groupList").empty();
    for (var curkey in groupDetailsJson) {
        var groupname = curkey;

        if (groupDetailsJson[curkey].groupname.length > 0) {
            groupname = groupDetailsJson[curkey].groupname;
        }

        var groupItem = `<div class="con-list-mem" id="${curkey}">
    <div class="mem-pic">
        <i class="fa fa-user-circle" aria-hidden="true"></i>
        <!-- replace with below image after profile pic support
        <img src="" alt="user pic" class="hide"/>-->
    </div>
    <div class="mem-name">
      <p>${groupname}</p>
    </div>
    </div>`;

        $("#groupList").append(groupItem);
    }
}

function getPresence(mobileNumber) {
    CS.contacts.getPresence(mobileNumber, function(err, resp) {
        if (err != 200 && err != 204) {
            console.log("get presence failed with response code " + err + " reason " + resp);
        } else {
            for (var i = 0; i < resp.length; i++)

                updatePresence(resp[i].mobileNumber, resp[i].isOnline);
        }
    });
}

function getContactFromContactsList(mobileNumber) {
    return appContactsList[mobileNumber];
}

function removeUserFromNonAppContactsList(user) {
    const index = nonAppContactsList.indexOf(user);

    if (index !== -1) {
        nonAppContactsList.splice(index, 1);
    }
}

function updateContacts() {
    CS.contacts.getContacts(function(err, resp) {
        if (err != 200) {
            console.log("get contacts failed with code " + err + " reason " + resp);
        } else {
            nonAppContactsList = resp.contacts;
            $("#contactsList").empty();
            CS.contacts.isAppContacts(resp.contacts, function(ret, resp) {
                console.log("app contacts response");
                appContactsList = {};
                for (var i = 0; i < resp.length; i++) {
                    appContactsList[resp[i].mobileNumber] = { "name": resp[i].name, "mobileNumber": resp[i].mobileNumber, "statusMessage": resp[i].presenceMessage, "isOnline": false };
                    removeUserFromNonAppContactsList(resp[i].mobileNumber);
                }
                showContactsList();
            });
            getPresence(resp.contacts);
        }
    });
}

function login_internal(user, password) {
    CS.login(user, password, function(err, resp) {
        if (err != 200) {
            console.log("login failed with response code " + err + " reason " + resp);
            alert("Invalid username or password");
        } else {
            CS.call.RegisterPSTN(user, password, function(err, resp) {
                console.log('pstn registered err:' + err + ' resp:' + resp);
            });
            document.getElementById('login-view').classList.add("hide");
            document.getElementById('demo-view').classList.remove("hide");
            localMobileNumber = user;
            $(".profile-name").text(user);
            setCookie("user", user, 2);
            setCookie("passwd", password, 2);
            $('#wrapper').show();
            retGetGroupList(true);
            updateContacts();
            getRecentContacts(true);
            getpendingchat();
            CS.askPushNotificationPermission();
            showRecentActivityList();
            $('#groupParticipantList').multiselect({
                allSelectedText: 'All',
                maxHeight: 200,
                includeSelectAllOption: true
            });
            $('#presentGroupParticipantList').multiselect({
                allSelectedText: 'All',
                maxHeight: 200,
                includeSelectAllOption: true
            });


        }


    });

}


function login() {
    login_internal(username.value, password.value);
}


function getRecentContacts() {
    CS.contacts.getRecentContacts(20, 1, function(ret, resp) {
        console.dir(resp);
        var tmpList = [];

        for (var key = 0; key < resp.list.length; key++) {

            // if (resp.list[key].messageType == "GROUP-CHAT")
            //     continue;
            var obj, mNo;
            if (resp.list[key].chat)
                obj = resp.list[key].chat;
            else if (resp.list[key].call)
                obj = resp.list[key].call;

            if (obj.src == localMobileNumber) {
                mNo = obj.dst;
            } else {
                mNo = obj.src;
            }

            tmpList.push(mNo);
            recentActivityListJS[mNo] = { "name": "", "mobileNumber": mNo, "isOnline": false };

            if (resp.list[key].messageType == "CHAT" || resp.list[key].messageType == "GROUP-CHAT") {

                updateRecentContactStatusMessage(mNo, resp.list[key].chat.data, resp.list[key].chat.sentTimestamp);

            } else if (resp.list[key].messageType == "CALL")
                updateRecentContactStatusMessage(mNo, "Call", resp.list[key].call.startTime);
        }

        CS.contacts.isAppContacts(tmpList, function(ret, resp) {
            console.log("app contacts response", resp);

            for (var i = 0; i < resp.length; i++) {
                recentActivityListJS[resp[i].mobileNumber].name = resp[i].name;

                if (resp[i].profilePicId && resp[i].profilePicId != "")
                    recentActivityListJS[resp[i].mobileNumber].profilepic = window.CS.chat.getMediaURLPrefix() + resp[i].profilePicId;
                if (Object.keys(recentActivityListJS).length == 1) {
                    readyUserUI(resp[i].mobileNumber, false);
                }
                getPresence([resp[i].mobileNumber]);
                //updateHistory(resp[i].mobileNumber);
            }
            //showContactsList();

            showRecentActivityList();
        });

    });
}

function onSignup() {
    CS.signup(susername.value, spassword.value, function(err, resp) {
        if (err != 200 && err != 202 && err != 204) {
            console.log("signup failed with response code " + err + " reason " + resp);
            alert("signup failed with response code " + err + " reason " + resp);
        } else {
            console.log("Signup success");
            document.getElementById('activate-view').classList.remove("hide");
            document.getElementById('login-controls-view').classList.add("hide");
        }
    });
}



function toggleList() {
    $("#contactsList").slideToggle();
    $("#recentActivityList").slideToggle();

    isRecent = !isRecent;
}


function readyUserUI(cid, flag) {
    var contact = recentActivityListJS[cid];
    if (groupDetailsJson[cid]) {
        var pic = `<img src="./images/dc-img/ic-group-1.png">`;
        contact.name = groupDetailsJson[cid].groupname;
    } else {
        var pic = `<img src="./images/dc-img/ic-contact-1.png">`;

    }
    $("#rightSection .rphoto").html(pic);
    $("#rightSection .info").text(contact.name + " (" + cid + ")");
    $("#rightSection .info").text(contact.name + " (" + cid + ")");
    //updating video call id
    $("#rightSection .group-info-contacts-block").attr("id", cid);

    if (groupDetailsJson[cid]) {
        var groupInfo = groupDetailsJson[cid];
        var _groupcontactsDisplayItem = groupInfo.groupcontacts;

        var groupcontactsDisplayItem = [];
        for (var i = 0; i < _groupcontactsDisplayItem.length; i++) {
            if (appContactsList[_groupcontactsDisplayItem[i]] != undefined) {
                var participantsList = (appContactsList[_groupcontactsDisplayItem[i]].name != '') ? appContactsList[_groupcontactsDisplayItem[i]].name : appContactsList[_groupcontactsDisplayItem[i]].mobileNumber;
                groupcontactsDisplayItem.push(participantsList);

            } else {
                groupcontactsDisplayItem.push(_groupcontactsDisplayItem[i])
            }
        }

        $(".addParticipantsBtn").attr("id", groupInfo.groupid);
        $(".removeParticipantsBtn").attr("id", groupInfo.groupid);
        $(".parentPresentGroupParticipant").attr("id", groupInfo.groupid);
        $('#rightSection #groupContactList').html(groupcontactsDisplayItem.join(','));
        $("#callBlockGroup").css("display", "flex");
        $("#callBlock").css("display", "none");
    } else {
        $('#rightSection #groupContactList').html("");
        $("#callBlockGroup").css("display", "none");
        $("#callBlock").css("display", "flex");
    }
    videoCallTo = cid;
    if (!flag) {
        remoteUser = cid;

        $("#welcome").hide();
        $("#chatDisplay").css('display', 'block');
        $('.righthead').show();
        $("#chatDisplayBlock").css('display', 'flex');

        $('#leftSection').show();
    } else {

        $("#welcome").show();
    }
    $('#profile-page').hide();

    $('.profileHead').hide();
    $('.righthead').show();
    showChatHistory();

}


function loadOverlayDetails(groupid) {
    $('#addParticipants').remove();
    var initialOverlayDetails = groupDetailsJson[groupid];
    var _groupcontactsDisplayItem = initialOverlayDetails.groupcontacts;
    var groupcreator = initialOverlayDetails.groupcreator;
    var groupcontactsDisplayItem = [];

    for (var i = 0; i < _groupcontactsDisplayItem.length; i++) {
        if (appContactsList[_groupcontactsDisplayItem[i]] != undefined) {
            var participantsList = appContactsList[_groupcontactsDisplayItem[i]].name;
            groupcontactsDisplayItem.push(participantsList);
        } else {
            groupcontactsDisplayItem.push(_groupcontactsDisplayItem[i])
        }
    }
    $(".overlay-group-participants-list").html("");
    console.log("initialOverlayDetails", initialOverlayDetails);
    var initialOverlayDetailsList = { "name": initialOverlayDetails.groupname, "groupid": groupid, "groupAdmins": initialOverlayDetails.admins, "groupDescription": initialOverlayDetails.groupdescription, "groupPic": initialOverlayDetails.groupprofilepic, "groupcontacts": initialOverlayDetails.groupcontacts };
    console.log("initialOverlayDetailsList", initialOverlayDetailsList);
    $('.overlay-group-name').val(initialOverlayDetailsList.name);
    $('.overlay-group-name').attr("id", groupid);
    $('.overlay-description').val(initialOverlayDetailsList.groupDescription);
    $('.count-participants').html(_groupcontactsDisplayItem.length);
    $('.delete-group').attr("id", groupid);
    var overlayImagePath = (initialOverlayDetailsList.groupPic) ? `<img src=${overlayImagePath} >` : `<div class="mem-pic"><img src ="./images/dc-img/ic-contact-1.png"></div>`;
    var overlayMainImgPath = (initialOverlayDetailsList.groupPic) ? initialOverlayDetailsList.groupPic : "./images/phone.png";
    $('#inner-pic-block img').attr("src", overlayMainImgPath);
    var overlayParticipantsList;
    var currentProfile = $(".profile-name").text();

    inArray(currentProfile, initialOverlayDetailsList.groupAdmins);

    var isAnAdmin = checkinAdminArray(currentProfile, initialOverlayDetailsList.groupAdmins);
    for (var i = 0; i < initialOverlayDetailsList.groupcontacts.length; i++) {
        const findContact = initialOverlayDetailsList.groupAdmins.find(function(item) {
            return item === initialOverlayDetailsList.groupcontacts[i];
        });

        console.log("findContact", findContact)
        var overlayParticipantDismissAdminDropdown = `<div class="ovelayAdminDropdown-block" ><div class="show-admin-list">Group admin</div>
      <div class="dropdown">
      <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
      <i class="arrow down"></i></button>
      <ul class="dropdown-menu"  id="${initialOverlayDetailsList.groupcontacts[i]}">
        <li><a href="#" class="delete-participant" onclick="deleteParticipant(event)">Remove</a></li>
        <li><a href="#" class="add-as-admin" onclick="dismissAsAdmin(event)">Dismiss as Admin</a></li>
      </ul>
    </div>
      </div>`;
        var overlayParticipantAddAdminDropdown = `<div class="ovelayAdminDropdown-block">
      <div class="dropdown">
      <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
      <i class="arrow down"></i></button>
      <ul class="dropdown-menu"  id="${initialOverlayDetailsList.groupcontacts[i]}">
        <li><a href="#" class="delete-participant" onclick="deleteParticipant(event)">Remove</a></li>
        <li><a href="#" class="add-as-admin" onclick="addAsAdmin(event)">Add as Admin</a></li>
      </ul>
    </div>
      </div>`;

        var overlayGroupCreator = `<div class="ovelayAdminDropdown-block" ><div class="show-admin-list">Group admin</div></div>`;

        if (appContactsList[initialOverlayDetailsList.groupcontacts[i]]) {
            if (findContact) {
                if (appContactsList[initialOverlayDetailsList.groupcontacts[i]].mobileNumber == groupcreator) {
                    var controlAdmin = overlayGroupCreator;

                } else if (appContactsList[initialOverlayDetailsList.groupcontacts[i]].mobileNumber == findContact) {
                    if (currentProfile == groupcreator) {
                        var controlAdmin = overlayParticipantDismissAdminDropdown;
                    } else {
                        var controlAdmin = overlayGroupCreator;
                    }
                }
                overlayParticipantsList = ` <li><div class="overlay-participants-image">${overlayImagePath}</div>
      <div class="overlay-participants-name-block"><div class="overlay-participants-name">${appContactsList[initialOverlayDetailsList.groupcontacts[i]].name}</div>
      ${controlAdmin}
      </div>
      </li>`;
            } else {
                if (currentProfile == groupcreator || currentProfile == isAnAdmin) {
                    var controlAdmin = overlayParticipantAddAdminDropdown;
                } else {
                    var controlAdmin = '';
                }
                overlayParticipantsList = `<li><div class="overlay-participants-image">${overlayImagePath}</div>
      <div class="overlay-participants-name-block"><div class="overlay-participants-name">${appContactsList[initialOverlayDetailsList.groupcontacts[i]].name}</div>
     ${controlAdmin}       
      </div>
     </li>`;
            }
        } else {
            if (findContact) {
                if (initialOverlayDetailsList.groupcontacts[i] == groupcreator) {
                    var controlAdmin = overlayGroupCreator;

                } else if (initialOverlayDetailsList.groupcontacts[i] == findContact) {
                    if (currentProfile == groupcreator) {
                        var controlAdmin = overlayParticipantDismissAdminDropdown;
                    } else {
                        var controlAdmin = overlayGroupCreator;
                    }
                }
                overlayParticipantsList = `<li><div class="overlay-participants-image">${overlayImagePath}</div>
      <div class="overlay-participants-name-block"><div class="overlay-participants-name">${initialOverlayDetailsList.groupcontacts[i]}</div>  
      ${controlAdmin}
      </div>
      </li>`;
            } else {
                if (currentProfile == groupcreator || currentProfile == isAnAdmin) {
                    var controlAdmin = overlayParticipantAddAdminDropdown;
                } else {
                    var controlAdmin = '';
                }
                overlayParticipantsList = `<li><div class="overlay-participants-image">${overlayImagePath}</div>
      <div class="overlay-participants-name-block"><div class="overlay-participants-name" >${initialOverlayDetailsList.groupcontacts[i]}</div>
     ${controlAdmin}
      </div>
      </li>`;
            }
        }


        $('.overlay-group-participants-list').append(overlayParticipantsList);
    }




}

function closeOverlay() {

    $('#overlay').css("display", "none");

}

function overlayGroupNameEdit(e) {

    var editInput = e.target.parentElement.querySelector('.edit-input');
    editInput.removeAttribute("readonly");
    editInput.setAttribute('style', 'border-bottom:solid 1px #ccc !important; border-radius:0');
    editInput.focus();
    var groupProfileEdit = e.target.parentElement.querySelector('.group-edit');
    var groupProfileUpdate = e.target.parentElement.querySelector('.group-update');
    groupProfileEdit.style.display = "none";
    groupProfileUpdate.style.display = "block";
}

function overlayGroupUpdate(e) {

    var editInput = e.target.parentElement.querySelector('.edit-input');
    var groupProfileEdit = e.target.parentElement.querySelector('.group-edit');
    var groupProfileUpdate = e.target.parentElement.querySelector('.group-update');

    var groupName = $('.overlay-group-name').val();
    var groupid = $(".overlay-group-name").attr("id");
    var groupPic = "";
    var groupDesp = $('.overlay-description').val();
    if (groupName.length != 0) {
        groupProfileEdit.style.display = "block";
        groupProfileUpdate.style.display = "none";
        editInput.setAttribute('readonly', true);

        editInput.setAttribute('style', 'border-bottom:none');
        //  $('.overlay-group-name').css('border-bottom', 'none');

        CS.chat.updateGroupInfo(groupName, groupid, groupDesp, groupPic, function(err, resp) {
            if (err != 200) {
                alert("update group failed with code " + err + " reason " + resp);
            } else {
                alert("group is updated successfully");
                console.dir(resp);
                retGetGroupList(false);
            }
        });

    } else {
        return;
    }
}

function showOverlay() {

    var groupid = $('.group-info-contacts-block').attr("id");
    if (groupDetailsJson[groupid]) {
        $('#overlay').css("display", "block");
        loadOverlayDetails(groupid);
    } else {

        $('#overlay').css("display", "none");
    }
}

function inArray(currentProfile, adminArray) {
    var participantsAddingBtn = `<div class="action-btns addParticipants" id="addParticipants" onclick="addParticipantsFunc(event)"><i class="fa fa-plus" data-toggle="tooltip" title="Add Participants" aria-hidden="true"></i></div>`;

    var length = adminArray.length;
    for (var i = 0; i < length; i++) {
        if (adminArray[i] == currentProfile) {
            $('#callBlockGroup').append(participantsAddingBtn);
        }
    }
    return false;
}

function checkinAdminArray(currentProfile, adminArray) {

    var length = adminArray.length;
    for (var i = 0; i < length; i++) {
        if (adminArray[i] == currentProfile) {

            return adminArray[i];

        }
    }
    return false;
}

function addParticipantsFunc(e) {
    $("#addGroupParticipantsPopup").modal('toggle');
    var listOfContactsInApp = appContactsList;
    var groupContactItem = "";
    $("#groupParticipantList").empty();
    for (var curkey in listOfContactsInApp) {
        var name = curkey;

        if (listOfContactsInApp[curkey].name.length > 0) {
            name = listOfContactsInApp[curkey].name;
        }

        groupContactItem = `<option value="${listOfContactsInApp[curkey].mobileNumber}">${name}</option>`


        $("#groupParticipantList").append(groupContactItem);
    }
    $("#groupParticipantList").multiselect('rebuild');


}

function deleteParticipant(e) {
    var groupid = $(".overlay-group-name").attr("id");
    var participantMobilenumber = e.target.parentElement.parentElement.id;
    var retVal = confirm("Do you want to delete the participant ?");
    if (retVal == true) {
        CS.chat.delUsersToGroupReq(groupid, participantMobilenumber, function(err, resp) {
            if (err != 200) {
                alert("deleting participant failed with code " + err + " reason " + resp);
            } else {
                alert("participant is deleted successfully");
                console.dir(resp);

                retGetSpecificGroupDetails(groupid);


            }
        });
        return true;
    } else {
        return false;
    }
}

function retGetSpecificGroupDetails(groupid) {
    CS.chat.pullMyGroupDetails(groupid, function(err, resp) {
        if (err != 200) {
            console.log("getting group details failed with code " + err + " reason " + resp);
        } else {

            groupDetailsJson[groupid] = resp;

            //$('#rightSection #groupContactList').html(groupcontactsDisplayItem.join(','));
            // addGroupToRecentActivityList(groupid);
            addToRecentActivityList(groupid);
            readyUserUI(groupid, false);
            loadOverlayDetails(groupid);
            updateHistory(groupid);


            showRecentActivityList();


        }
    });


}






/********Delete group */
function delGroup() {
    var groupid = $(".group-info-contacts-block").attr("id");
    var retVal = confirm("Do you want to delete the group ?");
    if (retVal == true) {
        CS.chat.deleteGroup(groupid, function(err, resp) {
            if (err != 200) {
                alert("delete group failed with code " + err + " reason " + resp);
            } else {
                alert("group is deleted successfully");
                console.dir(resp);

                var lis = getSortedRecentActivityList();
                if (lis.length > 0) {
                    readyUserUI(lis[0][0], false);
                } else {
                    $("#welcome").show();
                }

                showRecentActivityList();
                updateContacts();
                retGetGroupList(false);

                $("#chatDisplay").css('display', 'none');
                $("#chatDisplayBlock").css('display', 'none');
                $('#overlay').css("display", "none");
            }
        });
        return true;
    } else {
        return false;
    }
}

function exitGroup(e) {
    var groupid = $(".overlay-group-name").attr("id");
    var mobilenumber = $(".profile-name").text();
    var retVal = confirm("Do you want to exit the group ?");
    if (retVal == true) {
        CS.chat.exitFromGroup(groupid, mobilenumber, function(err, resp) {
            if (err != 200) {
                alert("exit from group failed with code " + err + " reason " + resp);
            } else {
                alert("exiting from the group is successfully");
                console.dir(resp);

                retGetSpecificGroupDetails(groupid);
                $("#welcome").show();

                $("#chatDisplay").css('display', 'none');
                $("#chatDisplayBlock").css('display', 'none');
                $('#overlay').css("display", "none");
            }
        });
        return true;
    } else {
        return false;
    }
}

function blockGroup(e) {
    var groupid = $(".overlay-group-name").attr("id");
    var mobilenumber = $(".profile-name").text();
    var retVal = confirm("Do you want to block the group ?");
    if (retVal == true) {
        CS.chat.blockGroup(groupid, mobilenumber, function(err, resp) {
            if (err != 200) {
                alert("block group failed with code " + err + " reason " + resp);
            } else {
                alert("block the group is successfully");
                console.dir(resp);

                retGetSpecificGroupDetails(groupid);
                $("#welcome").show();

                $("#chatDisplay").css('display', 'none');
                $("#chatDisplayBlock").css('display', 'none');
                $('#overlay').css("display", "none");
            }
        });
        return true;
    } else {
        return false;
    }
}

function addAsAdmin(e) {
    var groupid = $(".overlay-group-name").attr("id");
    var mobilenumber = [];
    mobilenumber.push(e.target.parentElement.parentElement.id);
    CS.chat.addAdminsToGroup(groupid, mobilenumber, function(err, resp) {
        if (err != 200) {
            alert("Particitant failed to add as admin  with code " + err + " reason " + resp);
        } else {
            alert("Particitant add as admin successfully");
            console.dir(resp);

            retGetSpecificGroupDetails(groupid);

        }
    });
}

function dismissAsAdmin(e) {
    var groupid = $(".overlay-group-name").attr("id");
    var mobilenumber = e.target.parentElement.parentElement.id;
    var retVal = confirm("Do you want to dismiss participant as admin ?");
    if (retVal == true) {
        CS.chat.delAdminsToGroup(groupid, mobilenumber, function(err, resp) {
            if (err != 200) {
                alert("dismiss participant as admin failed with code " + err + " reason " + resp);
            } else {
                alert("dismiss participant as admin is successfully");
                console.dir(resp);

                retGetSpecificGroupDetails(groupid);

            }
        });
        return true;
    } else {
        return false;
    }
}

// function smallfont(e) {
//     e.stopPropagation();
// }

// function mediumfont(e) {
//     e.stopPropagation();
// }

// function smallfont1(e) {
//     e.stopPropagation();
// }

function searchItem(e) {
    e.stopPropagation();
    e.preventDefault();

    var _resultObj = $('#serachBar').val();

    var resultObj = e.currentTarget.querySelector('.mediumFont').innerHTML;

    $('#serachBar').val(resultObj);
    $('#serachBar').focus();

    var objects = Object.values(recentActivityListJS);
    objects.forEach(function(element, index) {
        if (element.name == resultObj) {

            updateSearchRecent(element.mobileNumber);
            $('#searchResultDiv').css("display", "none");
        }
    });


}

function updateSearchRecent() {

    // readyUserUI(cid, false);

    // updateHistory(cid);
    if (!results) return;

    var items = Object.keys(results).map(function(key) {
        return [key, results[key].recentMessageTime];
    });

    items.sort(function(first, second) {
        return first[1] - second[1];
    });

    var sorted = items.slice(0);

    $("#recentActivityList").empty();

    for (var s in sorted)
        addDivToRecentActivityList(results[sorted[s][0]]);
}