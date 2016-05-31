function initPage()
{
//	var head_tag = document.getElementsByTagName("h1");
//	var head_text = document.createTextNode(bh_pppoe_connection);
//	head_tag[0].appendChild(head_text);
//	
//	
//	var paragraph = document.getElementsByTagName("p");
//	var paragraph_text = document.createTextNode(bh_enter_info_below);
//	paragraph[0].appendChild(paragraph_text);
//	
//	
//	var login_name = document.getElementById("loginName");
//	var login_text = document.createTextNode(bh_pppoe_login_name + " :");
//	login_name.appendChild(login_text);
//
//	var passwd = document.getElementById("passwd");
//	var passwd_text = document.createTextNode(bh_ddns_passwd + " :");
//	passwd.appendChild(passwd_text);

	
	//set event action
	var identifier_input = document.getElementById("inputIdentifier");
	identifier_input.onkeypress = ssidKeyCode;
	var num_input = document.getElementById("inputNumber");
	num_input.onkeypress = ssidKeyCode;
	var suf_input = document.getElementById("inputSuffix");
	suf_input.onkeypress = ssidKeyCode;

	var passwd_input = document.getElementById("inputPasswd");
	passwd_input.onkeypress = ssidKeyCode;
	
	var btns_container_div = document.getElementById("btnsContainer_div");
	btns_container_div.onclick = function()
	{
		return checkPPPoE();
	}
	
//	var btn = document.getElementById("btn_text_div");
//	var btn_text = document.createTextNode(bh_next_mark);
//	btn.appendChild(btn_text);

	//show firmware version
        showFirmVersion("none");
}

function checkPPPoE()
{
	var forms = document.getElementsByTagName("form");
        var cf = forms[0];
	
	var pppoe_identifier = document.getElementById("inputIdentifier");
	var pppoe_number = document.getElementById("inputNumber");
	var pppoe_suffix = document.getElementById("inputSuffix");
	var pppoe_passwd = document.getElementById("inputPasswd");

	if(pppoe_identifier.value == "" && pppoe_number.value == "" && pppoe_suffix.value == "")
	{
		alert(getErrorMsgByVar("bh_login_name_null"));
		return false;
	}

	var i;
	
	for(i=0;i<pppoe_passwd.value.length;i++)
	{
		if(isValidChar(pppoe_passwd.value.charCodeAt(i))==false)
		{
			alert(getErrorMsgByVar("bh_password_error"));
			return false;
		}
	}

	cf.submit();
//	location.href="BRS_04_applySettings.html";

	return true;
}

addLoadEvent(initPage);
