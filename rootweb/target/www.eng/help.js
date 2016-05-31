var debug = false;
var language = 'English';
var err_msg;
var tag_msg;
var lan_file;
var lang_tag;

getSystemData();
loadLangugaeFiles(language);

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

function dw(message) { document.write(message); }

function loadLangugaeFiles(in_lan)
{
	var hlp_file;
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/version\/([\d.]+)/)) //fix safari can not change GUI language
        	hlp_file = "langs/"+in_lan+"/"+"hlp.js?lang_tag=" + lang_tag;// + new Date().getTime();
	else
        	hlp_file = "langs/"+in_lan+"/"+"hlp.js.gz?lang_tag=" + lang_tag;// + new Date().getTime();
        dw('<script language="javascript" type="text/javascript" src="'+hlp_file+'"></script>');
}

function hlp_inner(message) { document.getElementById("hlp_content").innerHTML = message; }
