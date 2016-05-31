function initPage()
{
	//head text
//	var head_tag = document.getElementsByTagName("h1");
//	var head_text = document.createTextNode(bh_plz_wait_moment);
//	head_tag[0].appendChild(head_text);

	var image = document.getElementById("waiting_img");
        image.setAttribute("src", "image/wait30.gif");

	//setTimeout("formSubmit()", 50000);
	setTimeout("formSubmit()", 2000);

	//hide the firmware version
	showFirmVersion("none");
}

function formSubmit()
{
	var forms = document.getElementsByTagName("form");
	var cf = forms[0];
	//cf.submit();
	location.href="BRS_03A_detcInetType.html";
}

addLoadEvent(initPage);
