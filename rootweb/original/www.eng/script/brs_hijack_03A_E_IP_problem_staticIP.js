function initPage()
{
	var head_tag  = document.getElementsByTagName("h1");
	
//	var connect_text = document.createTextNode(bh_no_internet_ip2);
//	head_tag[0].appendChild(connect_text);
//	
//	//radio text	
//	var choices =document.getElementsByTagName("input");
//	
//	var choices_text = document.createTextNode(bh_yes_correct);
//	insertAfter(choices_text, choices[0]);
//	
//	choices_text = document.createTextNode(bh_not_have_static_ip);
//	insertAfter(choices_text, choices[1]);
//	
//	choices_text = document.createTextNode(bh_do_not_know);
//	insertAfter(choices_text, choices[2]);
//	
	
	var btns_container_div = document.getElementById("btnsContainer_div");
	btns_container_div.onclick = function() 
	{
		return 	staticIPChoice();
	}
	
//	var btn = document.getElementById("btn_div");	
//	var btn_text = document.createTextNode(bh_next_mark);
//	btn.appendChild(btn_text);
//	
	//show firmware version
	showFirmVersion("");
}


function staticIPChoice()
{
	var choices =document.getElementsByTagName("input");
	var country =document.getElementsByName("h_country");
	if(choices[0].checked)
	{
		if(country[0].value == "nz")
		this.location.href = "BRS_03A_E_NZ_IP_problem_staticIP_A_inputIP.html";
		else
		this.location.href = "BRS_03A_E_IP_problem_staticIP_A_inputIP.html";
	}else if(choices[1].checked || choices[2].checked)
		this.location.href = "BRS_03A_E_IP_problem_staticIP_B_macClone.html";
	else
	{
		alert(getErrorMsgByVar("bh_select_an_option"));
		return false;
	}
}


addLoadEvent(initPage);
