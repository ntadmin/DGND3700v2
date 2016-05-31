function setRemote()
{
	var cf = document.forms[0];
	var i;
	for( i=0; i<cf.Romte_IP.length; i++)
	{
		if( cf.remote[0].checked == true )
		{
			cf.Romte_IP[i].disabled = true;
		}
		else if( cf.remote[1].checked == true )
		{
			cf.Romte_IP[i].disabled = false;
		}
	}
}	

function check_ipv6_6to4(cf)
{
	var i;
	
	cf.ipv6_hidden_con_type.value = "6to4";	
	if((cf.ipv6_hidden_dod_disable.value == "0") || (cf.ipv6_hidden_dod_disable.value == ""))	
	{
		if(confirm(getErrorMsgByVar("IPv6_6to4")) == false)
		{
			return false;
		}	
	}
	
	/*Use this Remote 6to4 Relay Router*/
	if(cf.remote[0].checked == true)
	{
		cf.ipv6_hidden_6to4_relay_type.value = "0";
	}
	else
	{
		cf.ipv6_hidden_6to4_relay_type.value = "1";
	}	
	
	/* Remote 6to4 Relay Router */
	if(cf.remote[1].checked == true)
	{
		cf.ipv6_hidden_6to4_relay.value = "";
		for( i=0; i<cf.Romte_IP.length; i++)
		{
			if( i < (cf.Romte_IP.length-1) )
			{
				cf.ipv6_hidden_6to4_relay.value = cf.ipv6_hidden_6to4_relay.value + cf.Romte_IP[i].value + ".";
			}
			else if( i == (cf.Romte_IP.length-1) )
			{
				cf.ipv6_hidden_6to4_relay.value = cf.ipv6_hidden_6to4_relay.value + cf.Romte_IP[i].value;
			}
		}
		if( checkipaddr(cf.ipv6_hidden_6to4_relay.value) == false )
		{
			alert(getErrorMsgByVar("IPv6_ip_invalid"));
			return false;
		}
	}
	//else
		//cf.ipv6_hidden_6to4_relay.value = ipv6_6to4_relay_ip;
	
	if( ipv6_save_common(cf) == false )
	{
		return false;
	}
	return true;
}

