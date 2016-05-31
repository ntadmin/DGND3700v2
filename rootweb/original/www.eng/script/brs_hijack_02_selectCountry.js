
function initPage()
{

	var btns_container_div = document.getElementById("btnsContainer_div");
	btns_container_div.onclick = function()
	{
		return checkPPPoE();
	}

	//show firmware version
        showFirmVersion("none");
}

function checkPPPoE()
{
	var forms = document.getElementsByTagName("form");
        var cf = forms[0];
	
	var pppoe_name = document.getElementById("pppoe_username");
	var pppoe_passwd = document.getElementById("pppoe_passwd");

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
