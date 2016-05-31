function manuallyConfig()
{
        var forms = document.getElementsByTagName("form");
        var cf = forms[0];

	cf.action = "/apply.cgi?/welcomeok.htm timestamp=" + ts;
	cf.submit_flag.value = "hijack_toBasic";
	cf.submit();

        return true;
}


function initPage()
{
	//head
//	var head_tag  = document.getElementsByTagName("h1");
//	
//	var connect_text = document.createTextNode(bh_no_internet_ip);
//	head_tag[0].appendChild(connect_text);
//	
//	
//	//input radio choices
//	var choices_div = document.getElementById("choices_div");
//	var choices = choices_div.getElementsByTagName("input");
//	
//	var choices_text = document.createTextNode(bh_select_no_IP_option1);
//	insertAfter(choices_text, choices[0]);
//	
//	choices_text = document.createTextNode(bh_select_no_IP_option2);
//	insertAfter(choices_text, choices[1]);
//	
//	choices_text = document.createTextNode(bh_select_no_IP_option3);
//	insertAfter(choices_text, choices[2]);

	
	//buttons
	/*var btns_div1 = document.getElementById("btnsContainer_div1");
	btns_div1.onclick = function()
	{
		return manuallyConfig();
	}
	

        var btn = btns_div1.getElementsByTagName("div");
        var btn_text = document.createTextNode(bh_manual_config_connection);
        btn[0].appendChild(btn_text);*/

        var btns_div2 = document.getElementById("btnsContainer_div2");
        btns_div2.onclick = function()
        {
                return  modemCycleChoice();
        }

//        btn = btns_div2.getElementsByTagName("div");
//        btn_text = document.createTextNode(bh_next_mark);
//        btn[0].appendChild(btn_text);

	
	//show firmware version
	showFirmVersion("");
}


function modemCycleChoice()
{
	var forms = document.getElementsByTagName("form");
        var cf = forms[0];

	var choices_div = document.getElementById("choices_div");
	var choices = choices_div.getElementsByTagName("input");

	if(choices[0].checked || choices[1].checked)
//		cf.submit();
		this.location.href = "BRS_03A_detcInetType.html";
	else if(choices[2].checked)
		this.location.href = "BRS_03A_E_IP_problem_staticIP.html";
	else
	{
		alert(getErrorMsgByVar("bh_select_an_option"));
		return false;
	}

	return true;
}


addLoadEvent(initPage);
