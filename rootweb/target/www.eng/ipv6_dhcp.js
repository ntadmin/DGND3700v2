function check_ipv6_dhcp(cf)
{
	cf.ipv6_hidden_con_type.value = "dhcp";
	for(i=0;i<cf.userClass.value.length;i++)
	{
		if(isValidChar(cf.userClass.value.charCodeAt(i))==false)
		{
			alert(getErrorMsgByVar("IPv6_account_invalid"));
			return false;
		}
	}

	for(i=0;i<cf.domainName.value.length;i++)
	{
		if(isValidDdnsHost(cf.domainName.value.charCodeAt(i))==false)
		{
			alert(getErrorMsgByVar("IPv6_domain_invalid"));
			return false;
		}
	}

	if( ipv6_save_common(cf) == false )
        {
                return false;
        }
	else
	{
        	return true;
	}
}
