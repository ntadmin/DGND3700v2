function initPage()
{
	setTimeout("loadValue()", 3000);
}

function loadValue()
{
	var forms = document.getElementsByTagName("form");
	var cf = forms[0];

	if(checking_result == "failed")	//failed
		cf.submit();
	else if(checking_result == "success") //success
		this.location.href = "BRS_success.html";
}

addLoadEvent(initPage);
