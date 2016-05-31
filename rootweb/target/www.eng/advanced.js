
function close_all_sub(click_name)/* fold all menus, except the menu which user click */
{
	var sub_list = "setup,usb,security,admin,advanced";
	var sub_array = sub_list.split(',');
	for ( i=0; i< sub_array.length; i++)
	{
		var button_name = sub_array[i]+"_bt";
		var sub_name = sub_array[i]+"_sub";
		if( sub_name != click_name )
		{
			var div_name = top.document.getElementById(button_name);
			var content_length = div_name.getElementsByTagName("span")[0].innerHTML.length;
			if( button_name == "usb_bt" && (top.enabled_modem == 1 || top.enabled_wds == 1))
				settingClass(div_name, content_length, "advanced_grey_button");
			else
				settingClass(div_name, content_length, "advanced_white_close_button", top.region_class.white_triple, top.region_class.white_double);

			top.document.getElementById(sub_name).style.display="none";
		}
	}
}

function open_or_close_sub(name)
{
	/* to fix bug 23268, when user want to unfold one menus, fold the other menus. */
	var button_name= name+"_bt";
	var sub_name= name+"_sub";
	var open_flag= top.document.getElementById(sub_name).style.display;
	
	close_all_sub(sub_name);/* fold all menus first, except the menu which user click*/

	var button_div = top.document.getElementById(button_name);
	var content_length = button_div.getElementsByTagName("span")[0].innerHTML.length;
	
	if( button_name == "usb_bt" && (top.enabled_modem == 1 || top.enabled_wds == 1))
		settingClass(button_div, content_length, "advanced_grey_button");
	else if( open_flag == "none")
	{
		settingClass(button_div, content_length, "advanced_white_open_button", top.region_class.white_triple, top.region_class.white_double);
		top.document.getElementById(sub_name).style.display="";
	}
	else
	{
		settingClass(button_div, content_length, "advanced_white_close_button", top.region_class.white_triple, top.region_class.white_double);
		top.document.getElementById(sub_name).style.display="none";
	}
	change_menu_height();
}

/* change the min-height of the fromframe if unfold "Advanced Setup" */
function change_menu_height()
{
	var footer_div = document.getElementById("footer");
	var is_double = (footer_div.className == "footer_double");
	var menu_height = document.getElementById("menu").clientHeight > 410 ? document.getElementById("menu").clientHeight : 410;
	if(isIE_or_Opera())
	{
		var height = is_double ? document.documentElement.clientHeight - 190 : document.documentElement.clientHeight - 147;
		menu_height = height > menu_height ? height : menu_height;
		document.getElementById("container").style.height = is_double ? menu_height+93 : menu_height+ 50;
		document.getElementById("middle").style.height = is_double ?  menu_height+87+20+"px" : menu_height+ 45+20+"px";
		document.getElementById("formframe_div").style.height = menu_height;
	}
	else
		document.getElementById("middle").style.minHeight = is_double ? (menu_height + 87)+"px" : (menu_height+ 45)+"px";
}

function change_size()
{
	setFooterClass();
	var footer_div = document.getElementById("footer");
	var is_double = (footer_div.className == "footer_double");

	if(isIE_or_Opera())
	{
		/* to calculate the width */
		var width = document.documentElement.clientWidth - 40;
		document.getElementById("top").style.width = width > 820 ? width : "820px" ;
		document.getElementById("container").style.width = width > 820 ? width : "820px" ;
		document.getElementById("formframe_div").style.width = width > 820 ? width - 195 : "625px";
	}
	document.getElementById("formframe_div").style.bottom = is_double ? "88px" : "45px";

	change_menu_height();
}

/* according to the content length in a div,  change the div class type 
   parameter: div name, div content length, class name to set, minimum length for triple class, .. 
*/
function settingClass(obj, len, class_name)
{
	var triple_len, double_len;
	switch(arguments.length)
	{
		case 4://four parameter, take the last on as double_len 
			triple_len = 9999;
			double_len = arguments[3];
			break;
		case 5:
			triple_len = arguments[3];
			double_len = arguments[4];
			break;
		default:
			triple_len = top.region_class.adv_btn_triple;
			double_len = top.region_class.adv_btn_double;
			break;
	}

	if(len >= triple_len)
		obj.className = class_name + "_triple";
	else if(len >= double_len)
		obj.className = class_name + "_double";
	else
		obj.className = class_name;
}

function subItemsClass(argv)
{
	var sub_menu;
	var items;
	var words_length;
	var i, num;

	for(num=0; num<arguments.length; num++)
	{
		sub_menu = top.document.getElementById(arguments[num]);
		items = sub_menu.getElementsByTagName("dt");

		for(i=0; i<items.length; i++)
		{
			words_length = items[i].getElementsByTagName("span")[0].innerHTML.length;
			if(words_length >= 20)
				items[i].className = "long_name";
			else
				items[i].className = "sub_back";
		}
	}
}

var array_name = ["wds_items", "ap_items","modem_items"];
//var array_name = ["wds_items"];
var enable_flags = ["enabled_wds", "enable_ap_flag","enabled_modem"];
var wds_items = ["internet", "guest", "wan", "qos", "block_site", "firewall_rules", "schedule","email", "log", "forwarding_triggering", "dns", "static", "remote", "upnp", "traffic", "adsl", "mode", "usb", "ipv6", "parental", "media", "usb_basic", "usb_adv", "vpn_ply", "vpn_sta"];     /* ,block_services" */
var ap_items = ["lan", "wan", "internet", "block_site", "firewall_rules", "schedule", "wds", "forwarding_triggering", "dns", "static", "remote", "traffic", "email", "mode", "upnp", "ipv6", "vpn_ply",     "vpn_sta"];   /* , "block_services" */
var modem_items = ["lan", "wan", "internet", "block_site", "firewall_rules", "schedule", "wds", "forwarding_triggering", "dns", "static", "remote", "traffic", "wireless", "wladv", "guest", "usb_basic", "usb_adv", "media", "usb", "qos", "parental", "upnp", "ipv6", "email", "vpn_ply", "vpn_sta"];   /* , "block_services" */
function enabledItemsClass()
{
	var i=0, j;
	var double_length = 25;
	var enable_flag1=eval("top." + enable_flags[0]);
	var enable_flag2=eval("top." + enable_flags[1]);
	var enable_flag3=eval("top." + enable_flags[2]);
		
	if(enable_flag3==1)
		i=2;
	else if(enable_flag2==1)
		i=1;
	else if(enable_flag1==1)
		i=0;

	if(enable_flag3==1 || enable_flag1==1 || enable_flag2==1)
//	for(i=0; i<array_name.length; i++)
	{
		var item_group, enable_flag;

		item_group = eval(array_name[i]);
		enable_flag = eval("top." + enable_flags[i]);
		for(j=0; j<item_group.length; j++)
		{
			var cur_div, content_length;

			cur_div = top.document.getElementById(item_group[j]);
			if (cur_div == null)
				continue;
			content_length = cur_div.getElementsByTagName("span")[0].innerHTML.length;
			if(enable_flag == 1)
			{
				if(content_length > double_length)
					cur_div.className = "long_grey";
				else
					cur_div.className = "sub_grey";
			}
			else
			{
				if(content_length > double_length)
					cur_div.className = "long_name";
				else
					cur_div.className = "sub_back";
			}
		}
	}
}

function menu_class_default()
{
	var menu_div;
	var content_length;

	menu_div = top.document.getElementById("home");
	content_length = menu_div.getElementsByTagName("span")[0].innerHTML.length;
	settingClass(menu_div, content_length, "advanced_black_button");

	menu_div = top.document.getElementById("setup_wizard");
	content_length = menu_div.getElementsByTagName("span")[0].innerHTML.length;
	if( top.enabled_wds == 1 || top.enable_ap_flag == 1 || top.enabled_modem == 1)
		settingClass(menu_div, content_length, "advanced_grey_button");
	else
		settingClass(menu_div, content_length, "advanced_black_button");

	menu_div = top.document.getElementById("wps");
	if(menu_div != null)
	{
		content_length = menu_div.getElementsByTagName("span")[0].innerHTML.length;
		if( top.enabled_wps == 1 && top.enabled_wds == 0 && top.wps_mode != "disabled" && top.enabled_modem != 1)
			settingClass(menu_div, content_length, "advanced_black_button");
		else
			settingClass(menu_div, content_length, "advanced_grey_button");
	}
	
	menu_div = top.document.getElementById("vpn_wiz");
	if(menu_div != null)
	{
		content_length = menu_div.getElementsByTagName("span")[0].innerHTML.length;
    	if( top.enabled_wds == 1 || top.enable_ap_flag == 1 || top.enabled_modem == 1)
			settingClass(menu_div, content_length, "advanced_grey_button");
		else
			settingClass(menu_div, content_length, "advanced_black_button");
	}
    var extensible_items = ["setup_bt", "usb_bt", "security_bt", "admin_bt", "advanced_bt"];
	var i;
	for(i=0; i<extensible_items.length; i++)
	{
		menu_div = top.document.getElementById(extensible_items[i]);
		content_length = menu_div.getElementsByTagName("span")[0].innerHTML.length;
		if(i == 1 && (top.enabled_modem == 1||top.enabled_wds == 1))//usb in modem mode or repeater mode
			settingClass(menu_div, content_length, "advanced_grey_button");
		else
			settingClass(menu_div, content_length, "advanced_white_close_button", top.region_class.white_triple, top.region_class.white_double);
	}

	subItemsClass("setup_sub", "usb_sub", "security_sub", "admin_sub", "advanced_sub");

	enabledItemsClass();
}

function menu_color_change( change_id )
{
	if(top.cf_load_menu == 0)
		menu_class_default();

	var current_div = top.document.getElementById(change_id);
	var content_length = current_div.getElementsByTagName("span")[0].innerHTML.length;
	
	if( change_id == "home" ||  change_id == "setup_wizard" || change_id == "wps" || change_id=="vpn_wiz" )
	{
		if(change_id == "wps" && top.cf_load_menu == 1)
		{
			if(top.wps_mode == "disabled")
				settingClass(current_div, content_length, "advanced_grey_button");
			else
				settingClass(current_div, content_length, "advanced_black_button");
		}
		else
			settingClass(current_div, content_length, "advanced_purple_button");
	}
	else
	{
		//the parent button class should be kept
		var parent_id = top.document.getElementById(change_id).parentNode.parentNode.id;
		var btn_id = parent_id.replace('sub', 'bt');
		var btn_div = top.document.getElementById(btn_id);
		var words_len = btn_div.getElementsByTagName("span")[0].innerHTML.length;
		settingClass(btn_div, words_len, "advanced_white_open_button", top.region_class.white_triple, top.region_class.white_double);

		content_length = current_div.getElementsByTagName("span")[0].innerHTML.length;
		settingClass(current_div, content_length, "sub_back_purple", top.region_class.sub_triple, top.region_class.sub_double);
	}
}

function click_adv_action(id)
{
        if( enable_action == 1 )
        {
                if( id == "home" )
                {
                        menu_color_change('home');
                        goto_formframe('RST_status.htm&todo=cfg_init');
                }
                else if( id == "setup_wizard" && top.enabled_wds == 0 && top.enable_ap_flag != 1 && top.enabled_modem != 1)
                {
                        goto_formframe('BRS_WIZ_sel.htm&todo=cfg_init');
                        menu_color_change('setup_wizard');
                }
                else if( id == "wps" && top.enabled_wps == 1 && top.enabled_wds == 0 && top.wps_mode != "disabled" && top.enabled_modem != 1)
                {
                        goto_formframe('setup.cgi?next_file=Add_WPS_Client.htm');
                        menu_color_change('wps');
                }
                else if( id == "internet" && top.enabled_wds == 0 && top.enable_ap_flag != 1  && top.enabled_modem != 1)
                {
                        goto_formframe("BAS_basic.htm&todo=cfg_init");
                        menu_color_change('internet');
                }
                else if( id == "adsl" && top.enabled_wds == 0)
                {
                        goto_formframe("adsl_setting.htm&todo=cfg_init");
                        menu_color_change('adsl');
                }
                else if( id == "dongle_3g" )
                {
                        goto_formframe("3g_cfg.htm&todo=cfg_init");
                        menu_color_change('dongle_3g');
                }
                else if( id == "dongle_upgrade" )
                {
                        goto_formframe("upgrade3g.htm&todo=cfg_init");
                        menu_color_change('dongle_upgrade');
                }
				else if( id == "wireless" && top.enabled_modem != 1)
                {
                        goto_formframe("WLG_wireless_2.htm&todo=cfg_init");
                        menu_color_change('wireless');
                }
				else if( id == "guest" && top.enabled_wds == 0 && top.enabled_modem != 1)
                {
                        goto_formframe("WLG_wireless_2_guest.htm&todo=cfg_init");
                        menu_color_change('guest');
                }
				/*
				else if( id == "guest_a" && top.enabled_wds == 0 )
                {
                        goto_formframe("WLG_wireless_guestA1.htm");
                        menu_color_change('guest_a');
                }
				*/
                else if( id == "wan" && top.enabled_wds == 0 && top.enable_ap_flag != 1  && top.enabled_modem != 1)
                {
                        goto_formframe("WAN_wan.htm&todo=cfg_init");
                        menu_color_change('wan');
                }
                else if( id == "lan" && top.enable_ap_flag != 1  && top.enabled_modem != 1)
                {
                        goto_formframe("LAN_lan.htm&todo=cfg_init");
                        menu_color_change('lan');
                }
                else if( id == "qos" && top.enabled_wds == 0 && top.enabled_modem != 1)
                {
                        goto_formframe("QOS_main.htm&todo=cfg_init");
                        menu_color_change('qos');
                }
                else if( id == "usb_basic" && top.enabled_modem != 1 && top.enabled_wds == 0)
                {
                        goto_formframe("usb_basic.htm&todo=cfg_init");
                        menu_color_change('usb_basic');
                }
                else if( id == "usb_adv" && top.enabled_modem != 1 && top.enabled_wds == 0)
                {
                        goto_formframe("usb_adv.htm&todo=cfg_init");
                        menu_color_change('usb_adv');
                }
                else if( id == "media" && top.enabled_modem != 1 && top.enabled_wds == 0)
                {
                        goto_formframe("USB_media.htm&todo=cfg_init");
                        menu_color_change('media');
                }
                else if( id == "parental" && top.enabled_modem != 1 && top.enabled_wds == 0)
                {
                       // open_window('http://www.netgear.com/lpc');
			if(parental_ctrl_flag != 0 && ParentalControl == "1")				          
				open_window('http://netgear.opendns.com');
			else			             	
				open_window('http://www.netgear.com/lpc');
                }
                else if( id == "block_site" && top.enabled_wds == 0 && top.enable_ap_flag != 1  && top.enabled_modem != 1)
                {
                        goto_formframe("BKS_keyword.htm&todo=cfg_init");
                        menu_color_change('block_site');
                }
                else if( id == "firewall_rules" && top.enabled_wds == 0 && top.enable_ap_flag != 1  && top.enabled_modem != 1)
                {
                        goto_formframe("fw_rules.htm&todo=cfg_init");
                        menu_color_change('firewall_rules');
                }
                /*
				else if( id == "block_services" && top.enabled_wds == 0 && top.enable_ap_flag != 1  && top.enabled_modem != 1)
                {
                        goto_formframe("fw_rules.htm&todo=cfg_init");   /* ? BKS_service.htm //
                        menu_color_change('block_services');
                }
				*/
                else if( id == "schedule" && top.enabled_wds == 0 && top.enable_ap_flag != 1  && top.enabled_modem != 1)
                {
                        goto_formframe("FW_schedule.htm&todo=cfg_init");
                        menu_color_change('schedule');
                }
                else if( id == "email" && top.enabled_wds == 0 && top.enable_ap_flag != 1 && top.enabled_modem != 1)
                {
                        goto_formframe("FW_email.htm&todo=cfg_init");
                        menu_color_change('email');
                }
                else if( id == "status" )
                {
                        goto_formframe("RST_status.htm&todo=cfg_init");
                        menu_color_change('status');
                }
                else if( id == "log" && top.enabled_wds == 0 )
                {
                        goto_formframe("FW_log.htm&todo=cfg_init");
                        menu_color_change('log');
                }
                else if( id == "attached" )
                {
                        goto_formframe("setup.cgi?todo=nbtscan&next_file=DEV_devices.htm");
                        menu_color_change('attached');
                }
                else if( id == "bak_set" )
                {
                        goto_formframe("BAK_backup.htm&todo=cfg_init");
                        menu_color_change('bak_set');
                }
                else if( id == "passwd" )
                {
                        goto_formframe("PWD_password.htm&todo=cfg_init");
                        menu_color_change('passwd');
                }
                else if( id == "diag" )
                {
                        goto_formframe("diag.htm&todo=cfg_init");
                        menu_color_change('diag');
                }
                else if( id == "upgrade" )
                {
                        goto_formframe("UPG_upgrade.htm&todo=cfg_init");
                        menu_color_change('upgrade');
                }
                /*
				else if( id == "plc" )
                {
                        goto_formframe("PLC_wait_scan.htm");
                        menu_color_change('plc');
                }
				*/
                else if( id == "wladv" && top.enabled_modem != 1)
                {
                        goto_formframe("WLG_adv.htm&todo=cfg_init");
                        menu_color_change('wladv');
                }
                else if( id == "wds" && top.enable_ap_flag != 1 && top.enabled_modem != 1)
                {
                        goto_formframe("setup.cgi?next_file=WLG_wds.htm&todo=cfg_init");
                        menu_color_change('wds');
                }
                else if( id == "forwarding_triggering" && top.enabled_wds == 0 && top.enable_ap_flag != 1  && top.enabled_modem != 1)
                {
                        goto_formframe("FW_forward.htm&todo=cfg_init");
                        menu_color_change('forwarding_triggering');
                }
                else if( id == "dns" && top.enabled_wds == 0 && top.enable_ap_flag != 1  && top.enabled_modem != 1)
                {
                        goto_formframe("DNS_ddns.htm&todo=cfg_init");
                        menu_color_change('dns');
                }
		else if( id == "static" && top.enabled_wds == 0 && top.enable_ap_flag != 1  && top.enabled_modem != 1)
		{
                        goto_formframe("STR_routes.htm&todo=cfg_init");
                        menu_color_change('static');
		}
		else if( id == "remote" && top.enabled_wds == 0 && top.enable_ap_flag != 1 && top.enabled_modem != 1)
		{
                        goto_formframe("FW_remote.htm&todo=cfg_init");
                        menu_color_change('remote');
		}
		else if( id == "usb" && top.enabled_modem != 1 && top.enabled_wds == 0)
		{
                        goto_formframe("usb_settings.htm&todo=cfg_init");
                        menu_color_change('usb');
		}
		else if( id == "upnp" && top.enabled_wds == 0 && top.enable_ap_flag != 1 && top.enabled_modem != 1)
		{
                        goto_formframe("UPNP_upnp.htm&todo=cfg_init");
                        menu_color_change('upnp');
		}
		else if( id == "ipv6" && top.enable_ap_flag != 1 && top.enabled_wds == 0 && top.enabled_modem != 1)
		{
                        goto_formframe("IPv6_index.htm&todo=cfg_init");
                        menu_color_change('ipv6');
		}
		/*
		else if( id == "tr069" )
		{
                        goto_formframe("tr069.htm");
                        menu_color_change('tr069');
		}
		*/
		else if( id == "traffic" && top.enabled_wds == 0 && top.enabled_modem != 1 && top.enable_ap_flag != 1)
		{
                        goto_formframe("traffic_meter.htm&todo=cfg_init");
                        menu_color_change('traffic');
		}
		else if( id == "mode" && top.enable_ap_flag != 1 && top.enabled_wds == 0)
		{
                        goto_formframe("mode.htm&todo=cfg_init");
                        menu_color_change('mode');
		}
		else if( id == "vpn_wiz" )
		{
                        goto_formframe("vpn_wizard.htm&todo=cfg_init");
                        menu_color_change('vpn_wiz');
		}
		else if( id == "vpn_ply" && top.enabled_wds == 0 && top.enabled_modem != 1 && top.enable_ap_flag != 1)
		{
                        goto_formframe("vpn_list.htm&todo=cfg_init");
                        menu_color_change('vpn_ply');
		}
		else if( id == "vpn_sta" && top.enabled_wds == 0 && top.enabled_modem != 1 && top.enable_ap_flag != 1)
		{
                        goto_formframe("vpn_log.htm&todo=cfg_init");
                        menu_color_change('vpn_sta');
		}
        }
	change_menu_height();
}

