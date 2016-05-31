function initPage()
{
	//head text
//	var head_tag = document.getElementsByTagName("h1");
//	var head_text = document.createTextNode(bh_fix_ip_setting);
//	head_tag[0].appendChild(head_text);
//	
//	var paragraph = document.getElementsByTagName("p");
//	//var paragraph_text = document.createTextNode(bh_enter_ip_setting);
//	//paragraph[0].appendChild(paragraph_text);
//	
//	
//	//main content items
//	var IP_addr_div = document.getElementById("IP_addr");
//	var IP_addr_text = document.createTextNode(bh_info_mark_ip);
//	IP_addr_div.appendChild(IP_addr_text);
//	
//	var Sub_mask_div = document.getElementById("Sub_mask");
//	var Sub_mask_text = document.createTextNode(bh_info_mark_mask);
//	Sub_mask_div.appendChild(Sub_mask_text);
//	
//	var Gateway_div = document.getElementById("Gateway")
//	var Gateway_text = document.createTextNode(bh_constatus_defgtw);
//	Gateway_div.appendChild(Gateway_text);
//	
//	var preDNS_div = document.getElementById("preDNS")
//	var preDNS_text = document.createTextNode(bh_preferred_dns);
//	preDNS_div.appendChild(preDNS_text);
//	
//	var alteDNS_div = document.getElementById("alteDNS")
//	var alteDNS_text = document.createTextNode(bh_alternate_dns);
//	alteDNS_div.appendChild(alteDNS_text);


	//set input event action
	var IP_addr_input = document.getElementById("inputIPaddr");
	IP_addr_input.onkeypress = ipaddrKeyCode;

	var sub_mask_input = document.getElementById("inputSubMask");
	sub_mask_input.onkeypress = ipaddrKeyCode;

	var gateway_input = document.getElementById("inputGateway");
	gateway_input.onkeypress = ipaddrKeyCode;

	var pre_dns_input = document.getElementById("inputPreDns");
	pre_dns_input.onkeypress = ipaddrKeyCode;

	var sec_dns_input = document.getElementById("inputSecDns");
	sec_dns_input.onkeypress = ipaddrKeyCode;
	
	var vpi_input = document.getElementById("inputVPI");
	vpi_input.onkeypress = numKeyCode;
	
	var vci_input = document.getElementById("inputVCI");
	vci_input.onkeypress = numKeyCode;


	//buttons 
	var btns_container_div = document.getElementById("btnsContainer_div");
	btns_container_div.onclick = function()
	{
		return checkStaticIP();
	}
	
//	var btn = document.getElementById("btn_text_div");
//	var btn_text = document.createTextNode(bh_next_mark);
//	btn.appendChild(btn_text);

	//show firmware version
        showFirmVersion("none");
}

function checkStaticIP()
{
	var forms = document.getElementsByTagName("form");
	var cf = forms[0];
	if(check_vpi_vci()==false)
		return false;
	if(check_static_ip_mask_gtw()==false)
		return false;
	if(check_ether_samesubnet()==false)
		return false;
	if(check_static_dns(true)==false)
		return false;

	cf.submit();
//	location.href="BRS_04_applySettings.html";

	return true;
}
function check_vpi_vci()
{
	var msg = "";
	var st_vpi = document.getElementById("inputVPI");
	var st_vci = document.getElementById("inputVCI");
	if(checkInt(st_vpi,"VPI",0,255,true).length > 0)
		msg += getErrorMsgByVar("gsm_msg_vpi_out_of_range")+"\n";
	if(checkInt(st_vci,"VCI",32,65535,true).length > 0)
		msg += getErrorMsgByVar("gsm_msg_vci_out_of_range")+"\n";
	if(msg.length > 1)
	{
		alert(msg);
		return false;
	}
	return true;
}

function check_static_ip_mask_gtw()
{
	var ether_ipaddr = document.getElementById("inputIPaddr");
	var ether_subnet = document.getElementById("inputSubMask");
	var ether_gateway = document.getElementById("inputGateway");

	if(checkipaddr(ether_ipaddr.value)==false || is_sub_or_broad(ether_ipaddr.value, ether_ipaddr.value, ether_subnet.value) == false)
	{
		alert(getErrorMsgByVar("bh_invalid_ip"));
		return false;
	}
	if(checksubnet(ether_subnet.value)==false)
	{
		alert(getErrorMsgByVar("bh_invalid_mask"));
		return false;
	}
	if(checkgateway(ether_gateway.value)==false)
	{
		alert(getErrorMsgByVar("bh_invalid_gateway"));
		return false;
	}
	if(isGateway(ether_ipaddr.value,ether_subnet.value,ether_gateway.value)==false)
	{
		alert(getErrorMsgByVar("bh_invalid_gateway"));
		return false;
	}
	if(isSameIp(ether_ipaddr.value, ether_gateway.value) == true)
	{
		alert(getErrorMsgByVar("bh_invalid_gateway"));
		return false;
	}
	if(isSameSubNet(ether_ipaddr.value,ether_subnet.value,ether_gateway.value,ether_subnet.value) == false)
	{
		alert(getErrorMsgByVar("bh_same_subnet_ip_gtw"));
		return false;
	}

	return true;
}

function check_ether_samesubnet()
{
	var ether_ipaddr = document.getElementById("inputIPaddr");
	var ether_subnet = document.getElementById("inputSubMask");
	var ether_gateway = document.getElementById("inputGateway");
	
	if(isSameSubNet(ether_ipaddr.value,ether_subnet.value,lan_ip,lan_subnet) == true)
	{
		alert(getErrorMsgByVar("bh_same_lan_wan_subnet"));
		return false;
	}
	if(isSameSubNet(ether_ipaddr.value,lan_subnet,lan_ip,lan_subnet) == true)
	{
		alert(getErrorMsgByVar("bh_same_lan_wan_subnet"));
		return false;
	}
	if(isSameSubNet(ether_ipaddr.value,ether_subnet.value,lan_ip,ether_subnet.value) == true)
	{
		alert(getErrorMsgByVar("bh_same_lan_wan_subnet"));
		return false;
	}
	if(isSameIp(ether_ipaddr.value,lan_ip) == true)
	{
		alert(getErrorMsgByVar("bh_same_lan_wan_subnet"));
		return false;
	}
	
	return true;
}

function check_static_dns(wan_assign)
{
	var ether_ipaddr = document.getElementById("inputIPaddr");
	var ether_dnsaddr1 = document.getElementById("inputPreDns");
	var ether_dnsaddr2 = document.getElementById("inputSecDns");

	if( check_DNS(ether_dnsaddr1.value,ether_dnsaddr2.value,wan_assign,ether_ipaddr.value))
		return true;
	else
		return false;
}

addLoadEvent(initPage);



