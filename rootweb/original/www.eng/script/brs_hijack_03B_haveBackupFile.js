function initPage()
{
//	//head text
//	var head_tag = document.getElementsByTagName("h1");
//	var head_text = document.createTextNode(bh_settings_restoration);
//	head_tag[0].appendChild(head_text);
//	
//	//paragrah
//	var paragraph = document.getElementsByTagName("p");
	//var paragraph_text = document.createTextNode(bh_browser_file);
	//paragraph[0].appendChild(paragraph_text);
	
	
	//buttons left
	var btns_div1 = document.getElementById("btnsContainer_div1");
	btns_div1.onclick = function()
	{
		return goBack();
	}
	
//	var btn = btns_div1.getElementsByTagName("div");
//	var btn_text = document.createTextNode(bh_back_mark);
//	btn[0].appendChild(btn_text);
	
	
	//buttons right
	var btns_div2 = document.getElementById("btnsContainer_div2");
	btns_div2.onclick = function()
	{
		return retoreSettings();
	}
	
//	btn = btns_div2.getElementsByTagName("div");
//	btn_text = document.createTextNode(bh_next_mark);
//	btn[0].appendChild(btn_text);
	
	//change the file brows style for safari
	change_style_for_safari();
}

function goBack()
{
	this.location.href = "BRS_02_genieHelp.html";

	return true;
}

function retoreSettings()
{
	var forms = document.getElementsByTagName("form");
	var cf = forms[0];

	var file_upgrade = document.getElementById("file_upgrade");
	var filestr = file_upgrade.value;

	if(filestr.length == 0)
	{
		alert(getErrorMsgByVar("bh_filename_null"));
		return false;
	}
	var file_format = filestr.substr(filestr.lastIndexOf(".") + 1);
	if(file_format != "cfg")
	{
		alert(getErrorMsgByVar("bh_not_correct_file")+"cfg");
		return false;
	}

	if(confirm(getErrorMsgByVar("bh_ask_for_restore")))
	{
//		cf.action="/setup.cgi";
		cf.submit();
	}
	else
		return false;
}

function change_style_for_safari()
{
	if(get_browser() == "Safari")
		document.getElementById("file_upgrade").className = "file_input_style_safari";
}

addLoadEvent(initPage);
