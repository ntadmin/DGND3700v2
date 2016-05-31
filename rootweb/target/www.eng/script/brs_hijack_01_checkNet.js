function initPage()
{
//	var head_tag  = document.getElementsByTagName("h1");
//	var connect_text = document.createTextNode(bh_internet_checking);
//	head_tag[0].appendChild(connect_text);
	
	loadValue();
}

function loadValue()
{
	var forms = document.getElementsByTagName("form");
	var cf = forms[0];

	if(checking_result == "failed")	//failed
		this.location.href = "BRS_02_genieHelp.html";
	else if(checking_result == "success") //success
	{
		if(hijack_process == 2)
			cf.submit();
		else
			this.location.href = "BRS_success.html";
	}
}

addLoadEvent(initPage);
