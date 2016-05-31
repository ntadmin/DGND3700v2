replaceLanguage();

function replaceLanguage(){
    var all_tag = document.getElementsByTagName("*");

    for(var i=0; i<all_tag.length; i++){
        var tempElement = all_tag[i];
        var tagName = tempElement.tagName;
        tagName = tagName.toLowerCase();
//        if(tagName == 'input') continue;
        var tempLanAtt = tempElement.getAttribute("languageCode");
        if(tempLanAtt){
            var msg = getTagMsgByCode(tempLanAtt);
            if(msg != null && msg != ""){
                if(tagName == 'input')
                    tempElement.setAttribute("value", msg);
                else if(tagName == 'u')
                    tempElement.setAttribute("title", msg);
                else
            	    tempElement.innerHTML = msg;
            	/*
                var childrenNode;
                for(var j=0; j<tempElement.childNodes.length; j++){
                    childrenNode = tempElement.childNodes[j];
                    if((childrenNode.nodeType == 3) && (childrenNode.nodeValue.replace(/^\s+|\s+$/g,"") != "")){
                        var newTextNode = document.createTextNode(msg);
                        tempElement.replaceChild(newTextNode, childrenNode);
                        break;
                    }
                }*/
                //tempElement.appendChild(document.createTextNode(msg));
                //tempElement.innerHTML = msg;
            }
        }
    }

//    var all_tag = document.getElementsByTagName("input");
//    for(var i=0; i<all_tag.length; i++){
//        var tempElement = all_tag[i];
//        var tempLanAtt = tempElement.getAttribute("languageCode");
//        if(tempLanAtt){
//            var msg = getTagMsgByCode(tempLanAtt);
//            if(msg != null && msg != ""){
//                tempElement.setAttribute("value", msg);
//            }
//        }
//    }

    // set the default language selection
    var element = document.getElementById('lang_sel');
    if(element){
        var options = element.getElementsByTagName('option');
        var valueArray = new Array();
        //var languageCodeArray = new Array();
        for(i=0; i<options.length; i++){
            var tempOption = options[i];
            valueArray[i] = tempOption.getAttribute("value");
            //languageCodeArray[i] = tempOption.getAttribute("languagecode");
            if(valueArray[i] == language){
                tempOption.setAttribute('selected', 'selected');
            }
        }
        /*
        while(element.hasChildNodes()){
            element.removeChild(element.firstChild);
        }

		for(i=0; i<valueArray.length; i++){
            var optionElement = document.createElement('option');
            optionElement.setAttribute('value', valueArray[i]);
            optionElement.setAttribute('languagecode', languageCodeArray[i]);
            optionElement.appendChild(document.createTextNode(getTagMsgByCode(languageCodeArray[i])));
            if(valueArray[i] == language){
                optionElement.setAttribute('selected', 'selected');
            }
            element.appendChild(optionElement);
        }
		*/
    }
	//document.getElementById("dbdy").style.display = "block";
}

function getXMLRequest(){
    var xmlhttp;
    if(window.ActiveXObject){
    	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
      try {
        xmlhttp = new XMLHttpRequest();
      } catch (e) {
        xmlhttp = false;
      }
    }
    return xmlhttp;
}

// this method create a cross browser XMLDocument object
function newXMLDocument(){
    //return new ActiveXObject("MSXML2.DOMDocument");
    if (document.implementation && document.implementation.createDocument) {
        return document.implementation.createDocument("", "", null);
    } else if (window.ActiveXObject) {
        try {
            var prefix = ["MSXML2", "Microsoft", "MSXML", "MSXML3"];
            for (var i = 0; i < prefix.length; i++){
                return new ActiveXObject(prefix[i] + ".DomDocument");
            }
        } catch (e){
            alert("XMLDoc create fail, please check your browser version");
        }
    } else {
        alert("XMLDoc create fail, please check your browser version");
    }
}

function getXMLData(url){
    var http = getXMLRequest();
    http.open("GET", url, false);
    http.send(null);

    var xmlStr = http.responseText;
    //alert(xmlStr);

    var xmlDom = newXMLDocument();
    try{
        xmlDom.loadXML(xmlStr);
    }catch(e){
        var myParser=new DOMParser();
        xmlDom=myParser.parseFromString(xmlStr,"text/xml");
    }
    return xmlDom;
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
