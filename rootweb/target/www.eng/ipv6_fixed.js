function check_ipv6_fixed(cf)
{
	var i;
	var ip_trans_array = new Array("","","","","");//save IP address, if the IP input value is blank, change it to 0
	cf.ipv6_wan_ip_fixed.value = "";
	cf.ipv6_wan_gw_fixed.value = "";
	cf.ipv6_primary_dns_fixed.value = "";
	cf.ipv6_second_dns_fixed.value = "";
	cf.ipv6_lan_ip_fixed.value = "";
	cf.ipv6_hidden_con_type.value = "fixed";

	/****************************check the IP legality***************************************/	
	for( i=0; i<cf.IPv6_wan.length; i++ )
	{
		/*---------------------------WAN IP---------------------------------*/
		if(check_ipv6_IP_address(cf.IPv6_wan[i].value) == false)
		{
			alert(getErrorMsgByVar("IPv6_wan_ip_invalid"));
                        return false;
		}

		if(cf.IPv6_wan[i].value != "")			//00xx  ------>   xx
			cf.IPv6_wan[i].value = parseInt(cf.IPv6_wan[i].value, 16).toString(16);

		if(cf.IPv6_wan[i].value == "")
		{
			ip_trans_array[0] = ip_trans_array[0] + "0" + ":";
			cf.ipv6_wan_ip_fixed.value = cf.ipv6_wan_ip_fixed.value + "0" + ":";/* to fix bug 24430 */
		}
		else
		{
			ip_trans_array[0] = ip_trans_array[0] + cf.IPv6_wan[i].value + ":"; 
			cf.ipv6_wan_ip_fixed.value = cf.ipv6_wan_ip_fixed.value + cf.IPv6_wan[i].value + ":";
		}


		/*----------------------------Gateway-------------------------------------*/
		if(check_ipv6_IP_address(cf.IPv6_gw[i].value) == false)
		{
			alert(getErrorMsgByVar("IPv6_gw_ip_invalid"));
			return false;
		}

		if(cf.IPv6_gw[i].value != "")
			cf.IPv6_gw[i].value = parseInt(cf.IPv6_gw[i].value, 16).toString(16);

		if(cf.IPv6_gw[i].value == "")
		{
			ip_trans_array[1] = ip_trans_array[1] + "0" + ":";
			cf.ipv6_wan_gw_fixed.value = cf.ipv6_wan_gw_fixed.value +"0" + ":";/* to fix bug 24430 */
		}
		else
		{
			ip_trans_array[1] = ip_trans_array[1] + cf.IPv6_gw[i].value + ":";
			cf.ipv6_wan_gw_fixed.value = cf.ipv6_wan_gw_fixed.value + cf.IPv6_gw[i].value + ":";
		}


		/*----------------------------Primary DNS------------------------------------*/	
		if(check_ipv6_IP_address(cf.IPv6_Pri_DNS[i].value) == false)
		{
			alert(getErrorMsgByVar("IPv6_dns_ip_invalid"));
			return false;
		}

		if(cf.IPv6_Pri_DNS[i].value != "")
			cf.IPv6_Pri_DNS[i].value = parseInt(cf.IPv6_Pri_DNS[i].value, 16).toString(16);

		if(cf.IPv6_Pri_DNS[i].value == "")
		{
			ip_trans_array[2] = ip_trans_array[2] + "0" + ":";
			cf.ipv6_primary_dns_fixed.value = cf.ipv6_primary_dns_fixed.value + "0" + ":";/* to fix bug 24430 */
		}
		else
		{
			ip_trans_array[2] = ip_trans_array[2] + cf.IPv6_Pri_DNS[i].value + ":";
			cf.ipv6_primary_dns_fixed.value = cf.ipv6_primary_dns_fixed.value + cf.IPv6_Pri_DNS[i].value + ":";	
		}


		/*------------------------------Second DNS------------------------------------*/
		if(check_ipv6_IP_address(cf.IPv6_Sec_DNS[i].value) == false)
		{
			alert(getErrorMsgByVar("IPv6_dns2_ip_invalid"));	
			return false;	
		}

		if(cf.IPv6_Sec_DNS[i].value != "")
			cf.IPv6_Sec_DNS[i].value = parseInt(cf.IPv6_Sec_DNS[i].value, 16).toString(16);

		if(cf.IPv6_Sec_DNS[i].value == "")
		{
			ip_trans_array[3] = ip_trans_array[3] + "0" + ":";
			cf.ipv6_second_dns_fixed.value = cf.ipv6_second_dns_fixed.value + "0" + ":";/* to fix bug 24430 */
		}
		else
		{
			ip_trans_array[3] = ip_trans_array[3] + cf.IPv6_Sec_DNS[i].value + ":";
			cf.ipv6_second_dns_fixed.value = cf.ipv6_second_dns_fixed.value + cf.IPv6_Sec_DNS[i].value + ":";
		}


		/*---------------------------------LAN----------------------------------------*/
		if(check_ipv6_IP_address(cf.IPv6_lan[i].value) == false)
		{
			alert(getErrorMsgByVar("IPv6_lan_ip_invalid"));
			return false;
		}
	
		if(cf.IPv6_lan[i].value != "")
			cf.IPv6_lan[i].value = parseInt(cf.IPv6_lan[i].value, 16).toString(16);

		if(cf.IPv6_lan[i].value == "")
		{
			ip_trans_array[4] = ip_trans_array[4] + "0" + ":";
			cf.ipv6_lan_ip_fixed.value = cf.ipv6_lan_ip_fixed.value + "0" + ":";/* to fix bug 24430 */
		}
		else
		{
			ip_trans_array[4] = ip_trans_array[4] + cf.IPv6_lan[i].value + ":";
			cf.ipv6_lan_ip_fixed.value = cf.ipv6_lan_ip_fixed.value + cf.IPv6_lan[i].value + ":";
		}
	}

        if(check_ipv6_IP_address(cf.IPv6_wan_prefix.value) == false)
        {
                alert(getErrorMsgByVar("IPv6_wan_prefix_invalid"));
                return false;
        }
        if(check_ipv6_IP_address(cf.IPv6_lan_prefix.value) == false)
        {
                alert(getErrorMsgByVar("IPv6_lan_prefix_invalid"));
                return false;
        }
	/****************************************************************************************************/

	/*------------------------------WAN-------------------------------------*/
	var str = cf.ipv6_wan_ip_fixed.value;
	cf.ipv6_wan_ip_fixed.value = str.substring(0, str.length-1);

	if(cf.ipv6_wan_ip_fixed.value == ":::::::")
	{
		cf.ipv6_wan_ip_fixed.value = "";
	}
	else if(cf.ipv6_wan_ip_fixed.value == "0:0:0:0:0:0:0:0")
	{
		alert(getErrorMsgByVar("IPv6_wan_invalid"));
		return false;
	}
	else if(ip_trans_array[0] == "0:0:0:0:0:0:0:0:")
	{
		alert(getErrorMsgByVar("IPv6_wan_invalid"));
		return false;
	}

	cf.ipv6_wan_fixed_prefix.value = cf.IPv6_wan_prefix.value;
	if(cf.ipv6_wan_ip_fixed.value == "")
	{
		alert(getErrorMsgByVar("IPv6_wan_invalid"));
		return false;
	}
	if(cf.ipv6_wan_fixed_prefix.value == "" || parseInt(cf.ipv6_wan_fixed_prefix.value, 10) > 128 || parseInt(cf.ipv6_wan_fixed_prefix.value, 10) < 1)
	{
		alert(getErrorMsgByVar("IPv6_wan_prefix_invalid"));
		return false;
	}
	//for bug 20078, and special checking temply
	if(check_addr_legality(cf.ipv6_wan_ip_fixed.value) == false)
	{
		alert(getErrorMsgByVar("IPv6_wan_invalid"));
		return false;
	}

	/*-----------------------------gateway----------------------------------*/
	str = cf.ipv6_wan_gw_fixed.value;
	cf.ipv6_wan_gw_fixed.value = str.substring(0, str.length-1);

	if(cf.ipv6_wan_gw_fixed.value == ":::::::")
	{
		cf.ipv6_wan_gw_fixed.value = "";
	}
	else if(cf.ipv6_wan_gw_fixed.value == "0:0:0:0:0:0:0:0")
	{
		alert(getErrorMsgByVar("IPv6_gateway_invalid"));
		return false;
	}
	else if(ip_trans_array[1] == "0:0:0:0:0:0:0:0:")
	{
		alert(getErrorMsgByVar("IPv6_gateway_invalid"));
		return false;
	}
	//for bug 20078, and special checking temply
	if(cf.ipv6_wan_gw_fixed.value != "")
	{
		if(check_addr_legality(cf.ipv6_wan_gw_fixed.value) == false)
		{
			alert(getErrorMsgByVar("IPv6_gateway_invalid"));
			return false;
		}
	}

	/*-----------------------------primary DNS----------------------------------*/
	str = cf.ipv6_primary_dns_fixed.value;
	cf.ipv6_primary_dns_fixed.value = str.substring(0, str.length-1);
	
	if(cf.ipv6_primary_dns_fixed.value == ":::::::")
	{
		cf.ipv6_primary_dns_fixed.value = "";
	}
	else if(cf.ipv6_primary_dns_fixed.value == "0:0:0:0:0:0:0:0")
	{
		alert(getErrorMsgByVar("IPv6_dns_invalid"));
		return false;
	}
	else if(ip_trans_array[2] == "0:0:0:0:0:0:0:0:")
        {
		alert(getErrorMsgByVar("IPv6_dns_invalid"));
                return false;
        }
	//for bug 20078, and special checking temply
	if(cf.ipv6_primary_dns_fixed.value != "")
	{
		if(check_addr_legality(cf.ipv6_primary_dns_fixed.value) == false
		|| cf.ipv6_primary_dns_fixed.value == cf.ipv6_wan_ip_fixed.value )/* to fix bug 26445 */
		{
			alert(getErrorMsgByVar("IPv6_dns_invalid"));
			return false;
		}
	}

	/*-----------------------------second DNS-------------------------------------*/
	str = cf.ipv6_second_dns_fixed.value;
	cf.ipv6_second_dns_fixed.value = str.substring(0, str.length-1);

	if(cf.ipv6_second_dns_fixed.value == ":::::::")
	{
		cf.ipv6_second_dns_fixed.value = "";
	}
	else if(cf.ipv6_second_dns_fixed.value == "0:0:0:0:0:0:0:0")
	{
		alert(getErrorMsgByVar("IPv6_dns2_invalid"));
		return false;
	}
	else if(ip_trans_array[3] == "0:0:0:0:0:0:0:0:")
	{
		alert(getErrorMsgByVar("IPv6_dns2_invalid"));
		return false;
	}
	//for bug 20078, and special checking temply
	if(cf.ipv6_second_dns_fixed.value != "")
	{
		if(check_addr_legality(cf.ipv6_second_dns_fixed.value) == false
		|| cf.ipv6_second_dns_fixed.value == cf.ipv6_wan_ip_fixed.value
		|| cf.ipv6_primary_dns_fixed.value == cf.ipv6_second_dns_fixed.value )/* to fix bug 26445 */
		{
			alert(getErrorMsgByVar("IPv6_dns2_invalid"));
			return false;
		}
	}

	/*-------------------------------LAN--------------------------------------*/
	str = cf.ipv6_lan_ip_fixed.value;
	cf.ipv6_lan_ip_fixed.value = str.substring(0, str.length-1);

	if(cf.ipv6_lan_ip_fixed.value == ":::::::")
	{
		cf.ipv6_lan_ip_fixed.value = "";
	}
	else if(cf.ipv6_lan_ip_fixed.value == "0:0:0:0:0:0:0:0")
	{
		alert(getErrorMsgByVar("IPv6_lan_invalid"));
		return false;
	}
	else if(ip_trans_array[4] == "0:0:0:0:0:0:0:0:")
	{
		alert(getErrorMsgByVar("IPv6_lan_invalid"));
		return false;
	}

	cf.ipv6_lan_fixed_prefix.value = cf.IPv6_lan_prefix.value;
	if(cf.ipv6_lan_ip_fixed.value == "")
	{
		alert(getErrorMsgByVar("IPv6_lan_invalid"));
		return false;
	}
	if(cf.IPv6_lan_prefix.value == "" || parseInt(cf.IPv6_lan_prefix.value, 10) > 128 || parseInt(cf.IPv6_lan_prefix.value, 10) < 64)
	{
		alert(getErrorMsgByVar("IPv6_lan_prefix_invalid"));
		return false;
	}
	//for bug 20078, and special checking temply
	if(check_addr_legality(cf.ipv6_lan_ip_fixed.value) == false)
	{
		alert(getErrorMsgByVar("IPv6_lan_invalid"));
		return false;
	}

	/*************check IP confilict****************/
	var wan_ip = ip_trans_array[0];
	var gate_way = ip_trans_array[1];
	var primary_dns = ip_trans_array[2];
	var second_dns = ip_trans_array[3];
	var lan_ip = ip_trans_array[4];
	if(wan_ip!="" && (wan_ip.toUpperCase()==lan_ip.toUpperCase()))
	{
		alert(getErrorMsgByVar("IPv6_lan_wan_conflict"));
		return false;
	}
	if(wan_ip!="" && (wan_ip==primary_dns||wan_ip==second_dns))
	{
		alert(getErrorMsgByVar("IPv6_wan_dns_invalid"));
		return false;
	}
	if(lan_ip!="" && (lan_ip==primary_dns||lan_ip==second_dns))
	{
		alert(getErrorMsgByVar("IPv6_lan_dns_invalid"));
		return false;
	}
	/***********************************************/


	/* save IPv6 Filtering */
        if(cf.IPv6Filtering[0].checked == true)
        {
                cf.ipv6_hidden_filtering.value = "0";
        }
        else if(cf.IPv6Filtering[1].checked == true)
        {
                cf.ipv6_hidden_filtering.value = "1";
        }

	
	/*save IP Address Assignment*/
	if(cf.ipv6_lan_ip_assign[0].checked == true)
	{
		cf.ipv6_hidden_ip_assign.value = "1";
	}
	else
	{
		cf.ipv6_hidden_ip_assign.value = "0";
	}
	return true;
} 


function check_addr_legality(value)
{
	//for bug 20078, and special checking temply

	//multicase IP address
	if(value.charAt(0).toLowerCase()=="f" && value.charAt(1).toLowerCase()=="f")
		return false;

	//loopback address
	if(value==":::::::1" || value=="0:0:0:0:0:0:0:1")
		return false;

	//The IP address' scope type must be global, so just can start with 2xxx or 3xxx

	//bug 25367, the checking is not needed
	/*
	var each_info = value.split(":");
	if(each_info[0].length != 4)
		return false;
	else if(each_info[0].charAt(0)!="2" && each_info[0].charAt(0)!="3")
		return false;
	*/

	return true;
}
