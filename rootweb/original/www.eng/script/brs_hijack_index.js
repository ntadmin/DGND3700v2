
function loadValue()
{	
    if((dns_hijack == "1") && (this.location.hostname != lanip && this.location.hostname.indexOf("routerlogin.net") == -1 && this.location.hostname.indexOf("routerlogin.com") == -1))
        top.location.href="http://www.routerlogin.com/BRS_index.htm";
    else
    {
    	var content_frame = document.getElementById("content_frame");
    
    //	if( from_restore == "1" )
    //		content_frame.setAttribute("src", "./BRS_03B_haveBackupFile_ping.html&todo=brs_ping");
    //	else if( from_nowan == "1" ) // 
    //		content_frame.setAttribute("src", "./BRS_03A_A_noWan_check_net.html&todo=check_net");
    //	else //first run
    		content_frame.setAttribute("src", "./BRS_01_checkNet_ping.html&todo=brs_ping");
     }
	
	showFirmVersion("none");
}

