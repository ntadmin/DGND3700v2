function initPage()
{
	//head text
//	var head_tag = document.getElementsByTagName("h1");
//	var head_text = document.createTextNode(bh_apply_connection);
//	head_tag[0].appendChild(head_text);
//	
//	//paragraph
//	var paragraph = document.getElementsByTagName("p");
//	
//	var paragraph_text = document.createTextNode(bh_plz_waite_apply_connection);
//	paragraph[0].appendChild(paragraph_text);

	//show Fireware Version
	showFirmVersion("none");

	loadValue();
}

function loadValue()
{
	if(select_basic == "0" && select_type == "0")//pppoe
	{
		if(ping_result == "failed")
			this.location.href = "BRS_03A_B_pppoe_reenter.html";
		else if(ping_result == "success")
			this.location.href = "BRS_04_applySettings_wget.html";
	}
	else if(select_basic == "0" && select_type == "1")//pptp
	{
		if(ping_result == "failed")
			this.location.href = "BRS_03A_C_pptp_reenter.html";
		else if(ping_result == "success")
			this.location.href = "BRS_04_applySettings_wget.html";
	}
	else if(select_basic == "0" && select_type == "4")//l2tp
	{
		if(ping_result == "failed")
			this.location.href = "BRS_03A_F_l2tp_reenter.html";
		else if(ping_result == "success")
			this.location.href = "BRS_04_applySettings_wget.html";
	}
	else
	{
		if(ping_result == "success")
			this.location.href = "BRS_success.html";
		else if(ping_result == "failed")
			this.location.href = "BRS_05_networkIssue.html";
	}
}

addLoadEvent(initPage);
