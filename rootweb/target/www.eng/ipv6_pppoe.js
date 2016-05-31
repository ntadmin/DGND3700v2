function change_ipv6_pppoe_password(obj)
{
        if( obj.type == "password" )
        {
                if( get_browser() == "Firefox" )
                {
                        obj.value = "";
                        obj.type = "text";
                }
                else
                {
                        obj.outerHTML = '<input type="text" name="ipv6_pppoe_passwd" maxlength="64" size="18" onFocus="this.select();" onKeyPress="return getkey(\'ssid\', event)" value="">';
                        document.forms[0].ipv6_pppoe_passwd.focus();
                        document.forms[0].ipv6_pppoe_passwd.focus();
                }
        }
}

function check_ipv6_pppoe(cf)
{
	cf.ipv6_hidden_con_type.value = "pppoe";
	ipv6_save_common(cf);

	if(cf.ipv6_pppoe_username.value == "")
	{
		alert(getErrorMsgByVar("IPv6_name_blank"));
		return false;
	}
        for(i=0;i<cf.ipv6_pppoe_username.value.length;i++)
        {
                if(isValidChar(cf.ipv6_pppoe_username.value.charCodeAt(i))==false)
                {
                        alert(getErrorMsgByVar("IPv6_name_invalid"));
                        return false;
                }
        }
		
	
	if(cf.ipv6_pppoe_passwd.value == "")
	{
		alert(getErrorMsgByVar("IPv6_pwd_blank"));
		return false;
	}
        for(i=0;i<cf.ipv6_pppoe_passwd.value.length;i++)
        {
                if(isValidChar(cf.ipv6_pppoe_passwd.value.charCodeAt(i))==false)
                {
                        alert(getErrorMsgByVar("IPv6_pwd_invalid"));
                        return false;
                }
        }

        for(i=0;i<cf.ipv6_pppoe_servername.value.length;i++)
        {
                if(isValidChar(cf.ipv6_pppoe_servername.value.charCodeAt(i))==false)
                {
                        alert(getErrorMsgByVar("IPv6_service_name_blank"));
                        return false;
                }
        }

	return true;
}
