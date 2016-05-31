function initPage()
{

	var btns_container_div = document.getElementById("btnsContainer_div");
	btns_container_div.onclick = function() 
	{
		return genieHelpChecking();
	}

	//show firmware version
        showFirmVersion("none");
}


function genieHelpChecking()
{
	var choices_div = document.getElementById("choices_div");
	var choices = choices_div.getElementsByTagName("input");

	var forms = document.getElementsByTagName("form");
	var cf = forms[0];

	if(choices[0].checked)
	{
		this.location.href = "BRS_03A_detcInetType.html";
	//	cf.submit();
	}
	else if(choices[1].checked)
	{
		if(confirm(getErrorMsgByVar("bh_no_genie_help_confirm")) == false)
			return false;

	    top.location.href="BRS_start.htm";
	}
	else if(choices[2].checked)
	{
		this.location.href = "BRS_03B_haveBackupFile.html";
	}
	else
	{
		alert(getErrorMsgByVar("bh_select_an_option"));
		return false;
	}

	return true;
}


addLoadEvent(initPage);
