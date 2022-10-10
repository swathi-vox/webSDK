var callee;
var icount = 0;
var rcount = 0;

var remdesc = false;
var oncall = false;
var icelist = [];
var callType = "";
var remotesdp = "";
var ismuted = false;
var chatId = 0;
var contactsList = [];
var chatHistory = {};
var currentChatDialogueName = "";

var localVideo;
var remoteVideo;
var remoteAudio;

var hangupButton;
var muteButton;
var loginbtn;
var signupbtn;
var activatebtn;
var addContactbtn;
var sendChatBtn;

var username;
var password;
var activationcode;
var addContactTxb;



function logout(){
  CA.logout();
  location.reload();
  document.getElementById('login-view').classList.remove("hide");
  document.getElementById('demo-view').classList.add("hide");
}


function deleteUserContact(name){
  CA.contacts.removeContact(name, function(err, resp){
    if (err != 200) {
      console.log("remove contacts failed with code "+err+" reason "+resp);
    } else {
      var delem = document.getElementById('divelem_'+name); 
      delem.outerHTML = "";
      delete delem;
    }
  });
}


function add_contact_button(name) {
  var container = document.getElementById('contacts'); 
  container.innerHTML += "<div id=divelem_"+name+" class=\"chead\"><div  onclick='makecallto(\""+name+"\");' ><img src=\"/images/call.png\" class=\"iconDetails\" /></div> <div  onclick='start_chat_with(\""+name+"\");'><img src=\"/images/chat.png\" class=\"iconDetails\" /></div> <div onclick='deleteUserContact(\""+name+"\");'><img class=\"iconDetails\" src=\"/images/delete.png\"></img> </div><div><img src=\"/images/offline.png\" id=\"icon_"+name+"\" class=\"presenceicon\"></div>"+name+"</div>";
}


function mutefunc() {
  if(ismuted) {
    document.getElementById("muteButton").src = "/images/Mute.png";
    CA.call.unmute(function(ret, resp){});
    ismuted = false;
  } else {
    document.getElementById("muteButton").src = "/images/unmute.png";
    CA.call.mute(function(ret, resp){});
    ismuted = true; 
  }
}

function trace(text) {
  console.log((performance.now() / 1000).toFixed(3) + ": " + text);
}


function start_chat_with(b_party) {
  callee = b_party;
  $("#chatModal").modal()	
  var container = document.getElementById('chat_title'); 
  container.innerHTML = b_party;
  currentChatDialogueName = b_party;
  chatdialogue = document.getElementById('chatDialogue');
  chatdialogue.innerHTML = chatHistory[currentChatDialogueName];
}


function makecallto(calledparty) {
  callee = calledparty;
  CA.call.call(callee, localVideo, remoteVideo, function(){});
  hangupButton.disabled = false;
}


function populateContacts(contacts) {
  console.log(icount);
  icount++;
  for (var i=0; i<contacts.length; i++) {
    chatHistory[contacts[i]] = "";
    add_contact_button(contacts[i]);
  } 
}

function pollPresence() {
  getPresence(contactsList);
  setTimeout(pollPresence, 4000);
}

function getcontactslist() {
  CA.contacts.getContacts(function(err, resp){
    if (err != 200) {
      console.log("get contacts failed with code "+err+" reason "+resp);
    } else {
        contactsList = resp;
        populateContacts(resp);
        //setTimeout(pollPresence, 2000);
        getPresence(resp);
    }
  });
}


function onSendChat() {
  chatmsg = document.getElementById('chatMessageTxb');
  chatdialogue = document.getElementById('chatDialogue');

  chatId += 1;

  CA.chat.sendTo(callee, decodeURI(chatmsg.value), chatId, CA.chat.ChatType.TEXT_PLAIN, 0, function(err, resp) {
    if (err != 200) {
      console.log("get contacts failed with code "+err+" reason "+resp);
    } else {
      chatHistory[currentChatDialogueName] +="<li class=\"chatelemself\">"+chatmsg.value+" <div class=\"tstamp\"> "+secondsToHms(Date.now())+"</div></li>";
      
      chatdialogue.innerHTML = chatHistory[currentChatDialogueName];
      chatdialogue.scrollTop = chatdialogue.scrollHeight;
      chatmsg.value = "";
    }
  });
}


function onActivateAccount() {
  CA.activate(username.value, activationcode.value, function(err, resp){
    if (err != 200 && err != 202) {
      console.log("activateion failed with response code "+err+" reason "+resp);
    } else {
      document.getElementById('activate-view').classList.add("hide");
      document.getElementById('login-controls-view').classList.remove("hide");
      alert("Account successfully created for "+username.value+". You can login with your new account.");
    }
  });
}


function add_new_contact() {
  CA.contacts.addContact(addContactTxb.value, function(err, resp){
    if (err != 200 && err != 204) {
      console.log("add contact failed with response code "+err+" reason "+resp);
    } else {
      add_contact_button(addContactTxb.value);
      alert("'"+addContactTxb.value+"' added successfully.");
    }
  });
}


function onSignup() {
  CA.signup(username.value, password.value, function(err, resp){
    if (err != 200 && err != 202 && err != 204) {
      console.log("signup failed with response code "+err+" reason "+resp);
    } else {
      console.log("Signup success");
      document.getElementById('activate-view').classList.remove("hide");
      document.getElementById('login-controls-view').classList.add("hide");
    }
  });
}


function getPresence(user) {
  CA.contacts.getPresence(user, function(err, resp){
    if (err != 200 && err != 204) {
      console.log("get presence failed with response code "+err+" reason "+resp);
    } else {
      for (i=0; i < resp.length; i++) {
        var img = document.getElementById("icon_"+resp[i]["sPhoneNum"]);
        if (resp[i]["sStatus"] == "ONLINE") {
          img.src = "/images/online.png";
        } else {
          img.src = "/images/offline.png";
        }
      }
    }
  });
}


function getpendingchat() {
  CA.chat.getPendingChat(function(err, resp){
    if (err != 200 && err != 204) {
      console.log("get chat messages failed with response code "+err+" reason "+resp);
    }
  });
}


function login() {
  //loginbtn.disabled = true;
  CA.login(username.value, password.value, "", function(err, resp){
    if (err != 200) {
      console.log("login failed with response code "+err+" reason "+resp);
    } else {
      document.getElementById('login-view').classList.add("hide");
      document.getElementById('demo-view').classList.remove("hide");
      getcontactslist();
      //getpendingchat();
      setTimeout(getpendingchat, 1000);
    }
  });
}


function remotehangup() {
  trace("Ending call");
  hangupButton.disabled = true;
  document.getElementById('video-pane').classList.add("hide");
}


function hangup() {
  trace("Ending call");
  hangupButton.disabled = true;
  document.getElementById('video-pane').classList.add("hide");
  CA.call.end("Bye", function(ret, resp) {
    console.log("call end returned "+ret);
  });
  console.log("end call");
}


function secondsToHms(d) {
  d = Number(d);

  var date = new Date(d);
  var minu = "0" + date.getMinutes();
  return date.getHours() + ":" + minu.substr(-2);
}

function handleError(){}


function handleCallRequest(msgType, resp) {
  console.log("call event "+msgType+" received");

  switch(msgType) {
    case 1:  /* direct incoming audio video offer */
      console.log("incoming call request");
      callee = resp.caller;
      $("#callModal").modal()	
    break;
    case 2:  /* direct audio video answer */
      console.log("incomin call answer");
      document.getElementById('video-pane').classList.remove("hide");
    break;
    case 3:  /* direct audio video end */
      console.log("incoming call end");
      document.getElementById('video-pane').classList.add("hide");
      remotehangup();
    break;
  }
}

function onCallAnswer() {
  CA.call.answer(function(ret, resp){console.log("ret "+ret);});
  $("#callModal").modal('toggle')	
  hangupButton.disabled = false;
  document.getElementById('video-pane').classList.remove("hide");
}


function onCallDecline() {
  CA.call.decline(function(ret, resp){console.log("ret "+ret);});
  $("#callModal").modal('toggle')	
}

function handlePresenceRequest(ret, resp) {
  console.log("presence update : " + ret + " response ");
  console.dir(resp);
}

function handleChatRequest(resp) {
  console.log("chat request received :"+resp);
  callee = resp.remoteUser;
  currentChatDialogueName = callee;
  chatdialogue = document.getElementById('chatDialogue');
  var rcvtime = resp.timestamp;
  chatHistory[currentChatDialogueName] += "<li class=\"chatelemremote\">"+decodeURI(resp.data)+" <div class=\"tstamp\">"+secondsToHms(Number(rcvtime))+"</div></li>";

  chatdialogue.innerHTML = chatHistory[currentChatDialogueName];
  chatdialogue.scrollTop = chatdialogue.scrollHeight;
  $("#chatModal").modal()	

  var container = document.getElementById('chat_title'); 
  container.innerHTML = callee;
  //sendChatResponse(resp.stChatReq);
}




$(document).ready(function() {

  CA.init(function(err, resp){
    console.log("SDK initialized, response: "+err);
    if (err == 200) {
      //CA.login("prasun", "tok", function(err, resp){console.log("login status"+err);}); 

      CA.contacts.onMessage(handlePresenceRequest);
      CA.chat.onMessage(handleChatRequest);
      CA.call.onMessage(handleCallRequest);

      localVideo = document.getElementById("localVideo");
      remoteVideo = document.getElementById("remoteVideo");
      remoteAudio = document.getElementById("remoteAudio");
      
      hangupButton = document.getElementById("hangupButton");
      muteButton = document.getElementById("muteButton");
      loginbtn = document.getElementById("loginbtn");
      signupbtn = document.getElementById("signupbtn");
      activatebtn = document.getElementById("activatebtn");
      addContactbtn = document.getElementById("addContactbtn");
      sendChatBtn = document.getElementById("sendChatBtn");

      callAnswerBtn = document.getElementById("callAnswerBtn");
      callDeclineBtn = document.getElementById("callDeclineBtn");
      
      username= document.getElementById("usernametxb");
      password= document.getElementById("passwordtxb");
      activationcode = document.getElementById("activationcodetxb");
      addContactTxb = document.getElementById("addContactTxb");
      
      hangupButton.disabled = true;
      loginbtn.onclick = login;
      signupbtn.onclick = onSignup;
      hangupButton.onclick = hangup;
      muteButton.onclick = mutefunc;
      addContactbtn.onclick = add_new_contact;
      activatebtn.onclick = onActivateAccount; 
      sendChatBtn.onclick = onSendChat; 
      callAnswerBtn.onclick = onCallAnswer;
      callDeclineBtn.onclick = onCallDecline;

      document.getElementById("chatMessageTxb").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) { // return key
            document.getElementById("sendChatBtn").click();
        }
      });

      document.getElementById("logoutBtn").onclick = logout;
        } else {
          console.log("SDK initialization failed");
        }
      }); 
});
