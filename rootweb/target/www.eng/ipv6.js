/*function ipv6_write_ip(ipv6_ip_addr)
{
	if(ipv6_ip_addr != "")
		ipv6_ip_addr = remove_space(ipv6_ip_addr);

	if(ipv6_ip_addr == "")
	{
		document.write("<TR><TD nowrap><img src=/spacer.gif width=20 height=12 border=0>"+"Not Available</TD></TR>");
	}
	else
	{
		var each_ip = ipv6_ip_addr.split(' ');
		var i;

		for(i=0; i<each_ip.length; i++)
		{
			document.write("<TR><TD nowrap><img src=/spacer.gif width=20 height=12 border=0>"+each_ip[i]+"</TD></TR>");
		}
	} 
}*/

function ipv6_load_common(cf)
{
	/* IP Address Assignment */
        if( cf.ipv6_hidden_ip_assign.value == "1" )
        {
                cf.ipv6_lan_ip_assign[0].checked = true;
        }
        else if( cf.ipv6_hidden_ip_assign.value == "0" )
        {
                cf.ipv6_lan_ip_assign[1].checked = true;
        }

        /* Use This Interface ID  */
        if(cf.ipv6_hidden_enable_interface.value == "enable")
        {
                cf.enable_interface.checked = true;
        }
        else
        {
                cf.enable_interface.checked = false;
        }
        set_interface();
        var interface_id_array = cf.ipv6_hidden_interface_id.value.split(':');
        var i;
        for( i=0; i<interface_id_array.length; i++ )
        {
                cf.IP_interface[i].value = interface_id_array[i];
        }

	/* IPv6 Filtering */
	if(cf.ipv6_hidden_filtering.value == "0")
	{
		cf.IPv6Filtering[0].checked = true;
	}
	else if(cf.ipv6_hidden_filtering.value == "1")
	{
		cf.IPv6Filtering[1].checked = true;
	}
}

function ipv6_save_common(cf)
{
	var i;
        cf.ipv6_hidden_interface_id.value = "";
	if(cf.con_type.options[1].selected == true)
	{
		cf.ipv6_hidden_con_type.value = "autoDetect";
	}
	/* Use This Interface ID */
        if( cf.enable_interface.checked == true )
        {
                cf.ipv6_hidden_enable_interface.value = "enable";
        }
        else
        {
                cf.ipv6_hidden_enable_interface.value = "disable";
        }
	/*Use this IP Assignment*/
	if(cf.ipv6_lan_ip_assign[0].checked == true)
	{
		cf.ipv6_hidden_ip_assign.value = "1";
	}
	else
	{
		cf.ipv6_hidden_ip_assign.value = "0";
	}

        for( i=0; i<cf.IP_interface.length; i++ )
        {
                if( check_ipv6_IP_address(cf.IP_interface[i].value) == false )
                {
                        alert(getErrorMsgByVar("IPv6_if_id_invalid"));
                        return false;
                }
                if( cf.IP_interface[i].value == "" )
                {
                        cf.IP_interface[i].value = "0";
                }
                if( i < (cf.IP_interface.length-1) )
                {
                        cf.ipv6_hidden_interface_id.value = cf.ipv6_hidden_interface_id.value + cf.IP_interface[i].value + ":";
                }
                else if( i == (cf.IP_interface.length-1) )
                {
                        cf.ipv6_hidden_interface_id.value = cf.ipv6_hidden_interface_id.value + cf.IP_interface[i].value;
                }
        }

	/* save IPv6 Filtering */
	if(cf.IPv6Filtering[0].checked == true)
	{
		cf.ipv6_hidden_filtering.value = "0";
		 
	}
	else if(cf.IPv6Filtering[1].checked == true)
	{
		cf.ipv6_hidden_filtering.value = "1";
	}
	return true;
}

function set_interface()
{
        var cf = document.forms[0];
        var i;
	for( i=0; i<cf.IP_interface.length; i++)
	{
		if( cf.enable_interface.checked == true )
        	{
                	cf.IP_interface[i].disabled = false;
        	}
       	 	else if( cf.enable_interface.checked == false )
        	{	
                	cf.IP_interface[i].disabled = true;
        	}
	}
}

function check_ipv6_IP_address(ipv6_ip_value)
{
	var i;

	if(ipv6_ip_value != "")
	{
		for(i=0; i<ipv6_ip_value.length;)
		{
			if((ipv6_ip_value.charAt(i)>="0" && ipv6_ip_value.charAt(i)<="9") || (ipv6_ip_value.charAt(i)>="a" && ipv6_ip_value.charAt(i)<="f") || (ipv6_ip_value.charAt(i)>="A" && ipv6_ip_value.charAt(i)<="F"))
			{
				i++;
			}
			else
			{
				return false;
			}
		}
	}
	else//bug 23597:the address can't blank
		return false;

	return true;	
}
