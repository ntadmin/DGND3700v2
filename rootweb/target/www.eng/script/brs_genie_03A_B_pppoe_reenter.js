function initPage()
{
//	var head_tag = document.getElementsByTagName("h1");
//	var head_text = document.createTextNode(bh_ISP_namePasswd_error);
//	head_tag[0].appendChild(head_text);
//	
//	
//	var paragraph = document.getElementsByTagName("p");
//	var paragraph_text = document.createTextNode(bh_enter_info_again);
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
	var name_input = document.getElementById("inputName");
	name_input.onkeypress = ssidKeyCode;

	var passwd_input = document.getElementById("inputPasswd");
	passwd_input.onkeypress = ssidKeyCode;
	
	var btns_div1 = document.getElementById("btnsContainer_div1");
	btns_div1.onclick = function()
	{
		return manuallyConfig();
	}
	
//	var btn = btns_div1.getElementsByTagName("div");
//	var btn_text = document.createTextNode(bh_manual_config_connection);
//	btn[0].appendChild(btn_text);

	var btns_div2 = document.getElementById("btnsContainer_div2");
	btns_div2.onclick = function()
	{
		return checkPPPoE();
	}
	
//	btn = btns_div2.getElementsByTagName("div");
//	btn_text = document.createTextNode(bh_try_again);
//	btn[0].appendChild(btn_text);


	//show firmware version
        showFirmVersion("");
}

function manuallyConfig()
{
	if(confirm(getErrorMsgByVar("bh_no_genie_help_confirm")) == false)
		return false;

	var forms = document.getElementsByTagName("form");
	var cf = forms[0];

	if( hijack_process == "1")
	{
	    top.location.href="BRS_start.htm";
	}
	else
		location.href = "BAS_basic.htm";

	return true;
}

function checkPPPoE()
{
	var forms = document.getElementsByTagName("form");
        var cf = forms[0];
	
	var pppoe_name = document.getElementById("inputName");
	var pppoe_passwd = document.getElementById("inputPasswd");

	if(pppoe_name.value == "")
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
