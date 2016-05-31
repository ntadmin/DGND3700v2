var debug = false;
var language = 'English';
var err_msg = [];
var tag_msg = [];
var lan_file;
var lang_tag;

getSystemData();
loadLangugaeFiles(language);

function getSystemData(){
	if(!debug) lan_file = 'setup.cgi?next_file=common/system.xml';
	else lan_file = '/common/system.xml';
	var temp = readFile(lan_file);
	var msgDoc = temp.responseXML.documentElement;
	var system_msg = msgDoc.getElementsByTagName("system_var");
	for(var i=0; i<system_msg.length; i++){
		var temp_system_msg = system_msg[i];
		if(temp_system_msg.getElementsByTagName("language")){
			if(!debug){
			language = temp_system_msg.getElementsByTagName("value")[0].firstChild.nodeValue;
			} else {
			language = temp_system_msg.getElementsByTagName("debug_value_2")[0].firstChild.nodeValue;
			}
			lang_tag = temp_system_msg.getElementsByTagName("tag_value")[0].firstChild.nodeValue;
		}
	}
}


function loadLangugaeFiles(in_lan){
	// now we retrive the err msg file
	var msg_file;
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/version\/([\d.]+)/)) //fix safari can not change GUI language
		msg_file = '/langs/'+in_lan+'/'+'msg.xml';
	else if(ua.match(/(msie\s|trident.*rv:)/))
		msg_file = '/langs/'+in_lan+'/'+'msg.xml';
	else
		msg_file = '/langs/'+in_lan+'/'+'msg.xml.gz';
	var temp = readFileCached(msg_file);
	var msgDoc = temp.responseXML.documentElement;
	var msgnodes;
	var msgItems = msgDoc.getElementsByTagName("message");
	err_msg = [];
	var iLen = msgItems.length;

	//workaround for IE11 from link below,
	//http://connect.microsoft.com/IE/feedback/details/788307/invalid-calling-object-nodelist-and-frames
	for (var i=0; i<iLen; i++)
	{
		err_msg.push(msgItems[i]);
	}	
	
	//alert('err_msg length: ' + err_msg.length);

	// now we load tag msg xml
	var tag_file;
	if (ua.match(/version\/([\d.]+)/)) //fix safari can not change GUI language
		tag_file = '/langs/'+in_lan+'/'+'ui.xml';
	else if(ua.match(/(msie\s|trident.*rv:)/))
		tag_file = '/langs/'+in_lan+'/'+'ui.xml';
	else
		tag_file = '/langs/'+in_lan+'/'+'ui.xml.gz';
	temp = readFileCached(tag_file);
	msgDoc = temp.responseXML.documentElement;
	msgnodes = msgDoc.getElementsByTagName("message");
	
	for(var i=0; i<msgnodes.length; i++){
		tag_msg[msgnodes[i].getElementsByTagName("tag_code")[0].firstChild.nodeValue] = msgnodes[i];
	}
	
	//alert('tag_msg length: ' + tag_msg.length);
	// now load the system info xml
}

function dw(message){
	document.write(message);
}

function readFile(url){
  var xmlhttp;
  if(window.ActiveXObject){
  	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
    try {
      xmlhttp = new XMLHttpRequest();
    } catch (e) {
      xmlhttp = false;
      alert('XHR error: ' + e);
    }
  }
  url += url.indexOf("?") >= 0 ? "&" : "?";
  url += 'timestamp=' + new Date().getTime();
  xmlhttp.open("GET",url,false);
  xmlhttp.send(null);
  return xmlhttp;
}

function readFileCached(url){
  var xmlhttp;
  if(window.ActiveXObject){
  	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
    try {
      xmlhttp = new XMLHttpRequest();
    } catch (e) {
      xmlhttp = false;
      alert('XHR error: ' + e);
    }
  }
  url += url.indexOf("?") >= 0 ? "&" : "?";
  url += 'lang_tag=' + lang_tag;
  xmlhttp.open("GET",url,false);
  xmlhttp.send(null);
  return xmlhttp;
}

function showText(number){
	return tekst_array[number];
}
function lookForTrans(e_name){
	dw(getTagMsgByVar(e_name));
}

function lookForTransStr(e_name){
	return getTagMsgByVar(e_name);
}

function getTagMsgByVar(e_name){
	//alert('in e_name: ' + e_name);
	for(i=0; i<tag_msg.length; i++){
		var temp_msg = tag_msg[i];
		// i hate IE
		var tag_var;
		if (window.ActiveXObject)	tag_var = temp_msg.getElementsByTagName("variable")[0].text;
		else tag_var = temp_msg.getElementsByTagName("variable")[0].firstChild.nodeValue;
		if (tag_var == e_name){
			if (window.ActiveXObject) return temp_msg.getElementsByTagName("translation")[0].text;
			else return temp_msg.getElementsByTagName("translation")[0].firstChild.nodeValue;
		}
	}
//	alert('Error: no translation of variable of: ' + e_name);
}

function getTagMsgByCode(code){
	/* Check by code as index at first */
	var index = parseInt(code, 10);
	var temp_msg = tag_msg[index];
	
	if(temp_msg)
	{
		var tag_var = temp_msg.getElementsByTagName("tag_code")[0].firstChild.nodeValue;
		if (tag_var == code){
			return temp_msg.getElementsByTagName("translation")[0].firstChild.nodeValue;
		}
	}

	/* If we can not find the match, try to search one by one */
	/*
	for(i=0; i<tag_msg.length; i++){
		temp_msg = tag_msg[i];
		tag_var = temp_msg.getElementsByTagName("tag_code")[0].firstChild.nodeValue;

		if (tag_var == code){
		  	return temp_msg.getElementsByTagName("translation")[0].firstChild.nodeValue;
		}
	}*/
//	alert('Error: no translation of variable of: ' + code);
}

function getErrorMsgByCode(code){
	for(i=0; i<err_msg.length; i++){
		var temp_msg = err_msg[i];
		var tag_var = temp_msg.getElementsByTagName("err_code")[0].firstChild.nodeValue;

		if (tag_var == code){
		  var return_str = temp_msg.getElementsByTagName("translation")[0].firstChild.nodeValue;
		  return_str = return_str.replace(/\[NEL\]/g, '\n');
		  return return_str;
		}

	}
//	alert('Error: no translation of code of: ' + code);
}

function getErrorMsgByVar(variable){
	for(i=0; i<err_msg.length; i++){
	  var temp_msg = err_msg[i];
		var tag_var = temp_msg.getElementsByTagName("variable")[0].firstChild.nodeValue;
		if (tag_var == variable) {
		    var return_str = temp_msg.getElementsByTagName("translation")[0].firstChild.nodeValue;
		    return_str = return_str.replace(/\[NEL\]/g, '\n');
		    return return_str;
		}
	}
//	alert('Error: no translation of variable of: ' + variable);
}

function setLanguage(obj){
    var in_language = obj.options[obj.selectedIndex].value;
    //alert(in_language);
    if(!debug)
	{
        var file_name = 'setup.cgi?system_language=' + in_language + '&todo=changeLang&next_file=index.htm&timestamp='+new Date().getTime();
    }
	else
	{
        var file_name = 'setup.cgi?system_language=' + in_language + '&todo=changeLang&next_file=index.htm&timestamp='+new Date().getTime();
		alert(file_name);
    }
	var http = getXMLRequest();
	http.open("GET", file_name, false);
	http.send(null);
	location.reload();
}
