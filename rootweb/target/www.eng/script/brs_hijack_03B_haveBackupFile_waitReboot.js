function initPage()
{
	//head text
//	var head_tag = document.getElementsByTagName("h1");
//	var head_text = document.createTextNode(bh_settings_restoring);
//	head_tag[0].appendChild(head_text);
//	
//	//paragrah
//	var paragraph = document.getElementsByTagName("p");
//	var paragraph_text = document.createTextNode(bh_plz_waite_restore);
//	paragraph[0].appendChild(paragraph_text);
	
	setTimeout("pageRedirect()", 180000);
}

function pageRedirect(stat)
{
	if( location.href.indexOf("www.routerlogin.net") == -1 )
		top.location.href = "http://www.routerlogin.net/BRS_index.htm";
	else
		top.location.href = "http://www.routerlogin.com/BRS_index.htm";
}


addLoadEvent(initPage);
