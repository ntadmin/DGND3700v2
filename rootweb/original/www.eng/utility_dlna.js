var HelpOptionsVar = "width=480,height=420,scrollbars,toolbar,resizable,dependent=yes";
var GlossOptionsVar = "width=420,height=180,scrollbars,toolbar,resizable,dependent=yes";
var bigsub   = "width=540,height=440,scrollbars,menubar,resizable,status,dependent=yes";
var usbFLDsub =  "height=400,width=650,top=200,left=200,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no";
var smallsub = "width=440,height=320,scrollbars,resizable,dependent=yes";
var sersub   = "width=500,height=380,scrollbars,resizable,status,dependent=yes";
var memsub   = "width=630,height=320,scrollbars,menubar,resizable,status,dependent=yes";
var helpWinVar = null;
var glossWinVar = null;
var datSubWinVar = null;
var ValidStr = 'abcdefghijklmnopqrstuvwxyz-';
var ValidStr_ddns = 'abcdefghijklmnopqrstuvwxyz-1234567890';
var hex_str = "ABCDEFabcdef0123456789";
var invalidMSNameStr = "\"/\\[<]>.:;,|=+*?";
var symbol = invalidMSNameStr + "#!@$%^&()";

var msg_invalid = "\nInvalid character or characters in %s\nValid characters are: \n%s\n\n";
var msg_invalid2 = "\nInvalid character or characters in %s\n";
// "--",Africa,Asia,Australia,Canada,Europe,France,Israel,Japan,Mexico,New Zealand,South America,USA
//					 
var GlobalStartChannel =  	new Array( 1, 1, 1, 1, 1, 1,10, 5, 1,11, 1, 1, 1);
var GlobalFinishChannel = 	new Array(11,13,13,13,11,13,13, 7,14,11,13,13,11);
var GlobalFinishChannel_N = 	new Array( 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7);
var GlobalFinishChannel_UNLIMIT=new Array(11,13,11,13,11,11,13, 7,11,11,13,13,11);

//For DLNA
var invalid_folder_char="\" \\ : * ? < > | ' `";
var invalid_media_name_char="\" \\ : | , '";

function checkInvalidChars(inStr, InvalidStr) // check no chars of "InvalidStr" in "inStr"
{
 for (var i=0; i < InvalidStr.length; i++)
    if (inStr.indexOf(InvalidStr.charAt(i)) >= 0)
                        return false;
  return true;
}

function strlen_utf8(str)
{
        var len=0;
        var i=0;
     
        for (i=0;i<str.length;i++){
                if(str.charCodeAt(i)>65536){
                        len+=3;
                }
                else if (str.charCodeAt(i)>255){
                        len+=2;
                }     
                else{
                        len++;
                }
        }
        return len;
}


function showMsg()
{
	var msgVar=document.forms[0].message.value;
	if (msgVar.length > 1) 
		alert(msgVar);
}

function closeWin(win_var)
{
	if(document.layers)
		return;
	if ( ((win_var != null) && (win_var.close)) || ((win_var != null) && (win_var.closed==false)) )
		win_var.close();
}

function openHelpWin(file_name)
{
   helpWinVar = window.open(file_name,'help_win',HelpOptionsVar);
   if (helpWinVar.focus)
		setTimeout('helpWinVar.focus()',200);
}

function openGlossWin()
{
	glossWinVar = window.open('','gloss_win',GlossOptionsVar);
	if (glossWinVar.focus)
		setTimeout('glossWinVar.focus()',200);
}

function openDataSubWin(filename,win_type)
{
	closeWin(datSubWinVar);
	datSubWinVar = window.open(filename,'datasub_win',win_type);
	if (datSubWinVar.focus)
		setTimeout('datSubWinVar.focus()',200); 
}

function closeSubWins()
{
	closeWin(helpWinVar);
	closeWin(glossWinVar);
	closeWin(datSubWinVar);
}

function loadhelp(fname,anchname) {
if(top.frames.length > 0)
  {
	if ((loadhelp.arguments.length == 1 ) || (anchname == "" ))
		top.helpframe.location.href="h"+fname+".htm";
	else
		top.helpframe.location.href="h"+fname+".htm#" + anchname;
  }
}


function checkATpoint(fieldObj, fname)
{
	var msg = "";
	var msg_ATpoint = "%s is not complete, a valid domain is required e.g. username@domain\n"
        if(fieldObj.indexOf("@") <=1 )
		msg = addstr(msg_ATpoint,fname);
	return msg;
}

function checkBlank(fieldObj, fname)
{
	var msg = "";	
	if (fieldObj.value.length < 1){	
		msg = addstr(msg_blank,fname);
        }
	return msg;
}

function checkNoBlanks(fObj, fname)
{
	var space = " ";
 	if (fObj.value.indexOf(space) >= 0 )
			return msg_space;
	else return "";
}

function checkValid(text_input_field, field_name, Valid_Str, max_size, mustFill)
{
	var error_msg= "";
	var size = text_input_field.value.length;
	var str = text_input_field.value;

	if ((mustFill) && (size != max_size) )
		error_msg = addstr(msg_blank_in,field_name);
 	for (var i=0; i < size; i++)
  	{
    	if (!(Valid_Str.indexOf(str.charAt(i)) >= 0))
    	{
			error_msg = addstr(msg_invalid,field_name,Valid_Str);
			break;
    	}
  	}
  	return error_msg;
}

function isValidStr(inputStr,validChars,len)  // returns true or false, no msg
{
	if (len <= 0) // no set length
		;
	else if (inputStr.length != len)
		return false;
    for(i=0; i < inputStr.length; i++) 
	{
        var c = inputStr.charAt(i);
		if (validChars.indexOf(c) == -1 )
			return false;
    }
    return true;
}
function isValidMAC(inputStr,validChars,len)  // returns true or false, no msg
{
        var illegal = 0;
        var illegal_char = 0;
        if (len <= 0) // no set length
                ;
        else if (inputStr.length != len)
                return false;
//alert("inputStr="+inputStr);
    for(i=0; i < inputStr.length; i++)
    {
        var c = inputStr.charAt(i);
        if (i == 0 && c != '0')
                return false;
        if (i == 1 && c != '0')
                return false;
        if(i == 0 && ( c == '0' || c == 'f' || c == 'F')){
                illegal_char = c;
        }
        if((illegal_char == c)
                || (illegal_char == 'f' && c=='F')
                || (illegal_char == 'F' && c=='f'))
                illegal++;
        else
                illegal = 0;

        if (validChars.indexOf(c) == -1 )
                return false;
    }
    if(illegal == len)
                return false;
    return true;
}
function checkInt(text_input_field, field_name, min_value, max_value, required)
// NOTE: Doesn't allow negative numbers, required is true/false
{
	var str = text_input_field.value;
	var error_msg= "";
	
	if (text_input_field.value.length==0) // blank
	{
		if (required)
			error_msg = addstr(msg_blank,field_name);
	}
	else // not blank, check contents
	{
		for (var i=0; i < str.length; i++)
		{
			if ((str.charAt(i) < '0') || (str.charAt(i) > '9'))
				error_msg = addstr(msg_check_invalid,field_name);
		}
		if (error_msg.length < 2) // don't parse if invalid
		{
			var int_value = parseInt(str);
			if (int_value < min_value || int_value > max_value)
				error_msg = addstr(msg_outofrange,field_name,min_value,max_value);
		}
	}
	if (error_msg.length > 1)
		error_msg = error_msg + "\n";
	return(error_msg);
}


function sumvalue(F)
{    
	alert("Called sumvalue(), but should not.\nUse badMacField instead");

}
function MACAddressBlur(address)
{
	alert("Called MACAddressBlur(), but should not.\nUse badMacField instead");
}

// =============================   msg.js
//public message
var msg_blank = "%s can not be blank.\n";
var msg_space = "Blanks or spaces are not allowed in %s\n";
var msg_blank_in = "Blanks are not allowed in %s\n";
var msg_invalid = "\nInvalid character or characters in %s\nValid characters are: \n%s\n\n";
var msg_check_invalid = "%s contains an invalid number.";
var msg_greater = "%s must be greater than %s";
var msg_less = "%s must be less than %s";
var msg_outofrange = "%s is out of range [%s ~ %s]";

var msg_first = "First";
var msg_second = "Second";
var msg_third = "Third";
var msg_fourth = "Fourth";

function addstr(input_msg)
{
	var last_msg = "";
	var str_location;
	var temp_str_1 = "";
	var temp_str_2 = "";
	var str_num = 0;
	temp_str_1 = addstr.arguments[0];
	while(1)
	{
		str_location = temp_str_1.indexOf("%s");
		if(str_location >= 0)
		{
			str_num++;
			temp_str_2 = temp_str_1.substring(0,str_location);
			last_msg += temp_str_2 + addstr.arguments[str_num];
			temp_str_1 = temp_str_1.substring(str_location+2,temp_str_1.length);
			continue;
		}
		if(str_location < 0)
		{
			last_msg += temp_str_1;
			break;
		}
	}
	return last_msg;
}

// =============================   browser.js

function isIE(){
    var browser = new Object();
    browser.version = parseInt(navigator.appVersion);
    browser.isNs = false;
    browser.isIe = false;
    if(navigator.appName.indexOf("Netscape") != -1)
        browser.isNs = true;
    else if(navigator.appName.indexOf("Microsoft") != -1)
        browser.isIe = true;
    if(browser.isNs) return false;
    else if (browser.isIe) return true;
}

function add(out,in1,in2,in3,in4) {
    var Total;
    Total=in1.value+"."+in2.value+"."+in3.value+"."+in4.value;
    out.value=Total; 
}

function load4(Mydata,ip1,ip2,ip3,ip4) {
    var len; var ad; var temp;
    var Myall;
    Myall=Mydata.value;    //ip1 
    len=Myall.length;
    temp=Myall.indexOf(".");
    ad=Myall.substring(0,temp); 
    ip1.value=ad;
    //ip2 
    Myall=Myall.substring(temp+1,len);
    len=Myall.length;
    temp=Myall.indexOf(".");
    ad=Myall.substring(0,temp);
    ip2.value=ad;
    //ip3 
    Myall=Myall.substring(temp+1,len);
    len=Myall.length;
    temp=Myall.indexOf(".");
    ad=Myall.substring(0,temp);
    ip3.value=ad;
    //ip4 
    Myall=Myall.substring(temp+1,len);
    ad=Myall; ip4.value=ad;
} 

// =============================   utility.js
var msg_invalid_ip = "Invalid IP, please enter again!\n";
function isIPaddr(addr) {
    var i;
    var a;
    if(addr.split) {	
        a = addr.split(".");
    }else {	
        a = cdisplit(addr,".");
    }
    if(a.length != 4) {
        return false;
    }
    for(i = 0; i<a.length; i++) {
        var x = a[i];
        if( x == null || x == "" || !isNumeric(x) || x<0 || x>255 ) {
            return false;
        }
    }
    return true;
}

function isHex(str) {
    var i;
    for(i = 0; i<str.length; i++) {
        var c = str.substring(i, i+1);
        if(("0" <= c && c <= "9") || ("a" <= c && c <= "f") || ("A" <= c && c <= "F")) {
            continue;
        }
        return false;
    }
    return true;
}

function checkMacStr(macField) 
{
	var MacStrOrg = macField.value;
	var MacStrNoSep = MacStrOrg;
	var macArray; var c; var i;

	if(MacStrOrg.indexOf(":") > -1)
		c = ":";
	else if(MacStrOrg.indexOf("-") > -1)
		c = "-";
	else
	    return isValidMAC(MacStrOrg,hex_str,12);

	macArray = MacStrOrg.split(c);
	if(macArray.length != 6)
		return false;	
	for ( i = 0; i < macArray.length; i++)
	{
	    if (macArray[i].length != 2 )
		return false;
	    //alert(macArray[i]);
	}
	MacStrNoSep =  MacStrNoSep.replace(/:/g,"");
	MacStrNoSep =  MacStrNoSep.replace(/-/g,"");
	return isValidMAC(MacStrNoSep,hex_str,12);
}

/* Check IP Address Format*/
function checkIPMain(ip,max) {
    if( isNumeric(ip, max) ) {
        ip.focus();
        return true;
    }
}

function badLANIP(ip1, ip2, ip3, ip4,max) {
    if(parseInt(ip1.value)==127) return true;
    if(checkIPMain(ip1,223)) return true;  
    if(checkIPMain(ip2,255)) return true;
    if(checkIPMain(ip3,255)) return true;
    if(checkIPMain(ip4,max)) return true;
    if((parseInt(ip1.value)==0)||(parseInt(ip1.value)==0)&&(parseInt(ip2.value)==0)&&(parseInt(ip3.value)==0)&&(parseInt(ip4.value)==0))
    	return true;
    return false;
}
/* for more strictly check ip address*/
function badIP2(ip1, ip2, ip3, ip4,max) {
    if(parseInt(ip1.value)==127) return true;
    if(parseInt(ip1.value)==224) return true;
    if(checkIPMain(ip1,223)) return true;  
    if(checkIPMain(ip2,255)) return true;
    if(checkIPMain(ip3,255)) return true;
    if(checkIPMain(ip4,max)) return true;
    if((parseInt(ip1.value)==0)||(parseInt(ip1.value)==0)&&(parseInt(ip2.value)==0)&&(parseInt(ip3.value)==0)&&(parseInt(ip4.value)==0))
    	return true;
    return false;
}

function badIP(ip1, ip2, ip3, ip4,max) {
    if(checkIPMain(ip1,255)) return true; 
    if(checkIPMain(ip2,255)) return true;
    if(checkIPMain(ip3,255)) return true;
    if(checkIPMain(ip4,max)) return true;
    if((parseInt(ip1.value)==0)||(parseInt(ip1.value)==0)&&(parseInt(ip2.value)==0)&&(parseInt(ip3.value)==0)&&(parseInt(ip4.value)==0))
    	return true;
    return false;
}

function badMASK(mask1,mask2,mask3,mask4)
{
    var i;
    var tmp;
    var offcnt=255;
		var off;
		
    for(i=1;i<5;i++){
        tmp = "mask" + i;
        if (eval(tmp).value != 255)
          break;
    }
    
    if(i==5)	return false;
    
    while(i<4){        
    	  i++;
        if(eval("mask"+i).value != 0)
          return true;
    }
        
    for(i=0, off=1;i<8;i++, off*=2){
        if(eval(tmp).value == (offcnt -= off))
          return false;
    }

    return true;
}

/* Check Numeric*/
function isNumeric(str, max) {
    if(str.value.length == 0 || str.value == null || str.value == "") {
        str.focus();
        return true;
    }
    
    var i = parseInt(str.value);
    if(i>max) {
        str.focus();
        return true;
    }
    for(i=0; i<str.value.length; i++) {
        var c = str.value.substring(i, i+1);
        if("0" <= c && c <= "9") {
            continue;
        }
        str.focus();
        return true;
    }
    return false;
}

/* Check Blank*/
function isBlank(str) {
    if(str.value == "") {
        str.focus();
        return true;
    } else 
        return false;
}

/* Check Phone Number*/
function isPhonenum(str) {
    var i;
    if(str.value.length == 0) {
        str.focus();
        return true;
    }
    for (i = 0; i<str.value.length; i++) {
        var c = str.value.substring(i, i+1);
        if (c>= "0" && c <= "9")
            continue;
        if ( c == '-' && i !=0 && i != (str.value.length-1) )
            continue;
        if ( c == ',' ) continue;
        if (c == ' ') continue;
        if (c>= 'A' && c <= 'Z') continue;
        if (c>= 'a' && c <= 'z') continue;
        str.focus();
        return true;
    }
    return false;
}

/* 0:close 1:open*/
function openHelpWindow(filename) {
    helpWindow = window.open(filename,"thewindow","width=300,height=400,scrollbars=yes,resizable=yes,menubar=no");
}

function checkSave() {
    answer = confirm("Did you save this page?");
    if (answer !=0) {
        return true;
    } else return false;
}

function alertPassword(formObj) {
    alert("Re-Confirm the password!");
    formObj.focus();
}

function isEqual(cp1,cp2)
{
	if(parseInt(cp1.value) == parseInt(cp2.value))
	{
		cp2.focus();
		return true;
	}	
	else return false;
}

function isEqual_notfocus(cp1,cp2)
{
	if(parseInt(cp1.value) == parseInt(cp2.value))
		return true;
	else
		return false;
}

function chknewip(ip1_ip1, ip1_ip2, ip1_ip3, ip1_ip4, ip2_ip1, ip2_ip2, ip2_ip3, ip2_ip4)
{
	if(blankIP(ip1_ip1, ip1_ip2, ip1_ip3, ip1_ip4) == true)
		return true;
	if(blankIP(ip2_ip1, ip2_ip2, ip2_ip3, ip2_ip4) == true)
		return true;
	if((isEqual_notfocus(ip1_ip1, ip2_ip1) && isEqual_notfocus(ip1_ip2, ip2_ip2) &&
			isEqual_notfocus(ip1_ip3, ip2_ip3) && isEqual_notfocus(ip1_ip4, ip2_ip4)) == true)
		return false;
	return true;
}

function setDisabled(OnOffFlag,formFields)
{
	for (var i = 1; i < setDisabled.arguments.length; i++)
		setDisabled.arguments[i].disabled = OnOffFlag;
}

function cp_ip(from1,from2,from3,from4,to1,to2,to3,to4)
//true invalid from and to ip;  false valid from and to ip;
{
    var total1 = 0;
    var total2 = 0;
    
    total1 += parseInt(from4.value,10);
    total1 += parseInt(from3.value,10)*256;
    total1 += parseInt(from2.value,10)*256*256;
    total1 += parseInt(from1.value,10)*256*256*256;
    
    total2 += parseInt(to4.value,10);
    total2 += parseInt(to3.value,10)*256;
    total2 += parseInt(to2.value,10)*256*256;
    total2 += parseInt(to1.value,10)*256*256*256;
    if(total1 > total2)
        return true;
    return false;
}

function pi(val)
{
    return parseInt(val,10);
}    
function alertR(str)    
{
    alert(str);
    return false;
}    



function blankIP(f1,f2,f3,f4) // true if 0 or blank
{
	if( containStr(f1,"") && containStr(f2,"") && containStr(f3,"") && containStr(f4,"") )
		return true;
	if( containStr(f1,"0") && containStr(f2,"0") && containStr(f3,"0") && containStr(f4,"0") )
		return true;
	return false;
}


function containStr(fn,str) 
{
	return  (fn.value == str);
}
/* check mac */
function checkmac6to1(mac1,mac2,mac3,mac4,mac5,mac6)
{
        var macaddr;
        if (mac1.value.length>0)
        { macaddr = mac1.value+":"+mac2.value+":"+mac3.value+":"+mac4.value+":"+mac5.value+":"+mac6.value; }         else
        { macaddr=""; }

        var MacStrOrg = macaddr;
        var MacStrNoSep = MacStrOrg;
        var macArray; var c; var i;

        if(MacStrOrg.indexOf(":") > -1)
        c = ":";
        else
        return isValidStr(MacStrOrg,hex_str,12);
        macArray = MacStrOrg.split(c);

        if(macArray.length != 6)
                return false;
        for ( i = 0; i < macArray.length; i++)
        {

                if (macArray[i].length != 2 )
                        return false;
        }
        MacStrNoSep =  MacStrNoSep.replace(/:/g,"");
        return isValidStr(MacStrNoSep,hex_str,12);
}

function mac6in1(mac1,mac2,mac3,mac4,mac5,mac6)
{
        var macaddr;
        if (mac1.value.length>0)
        { macaddr = mac1.value+":"+mac2.value+":"+mac3.value+":"+mac4.value+":"+mac5.value+":"+mac6.value; }
        else
        { macaddr=""; }
}

function isHexStr(str) {
	var i;
	for(i = 0; i<str.length; i++) {
		var c = str.substring(i, i+1);
		if(("0" <= c && c <= "9") || ("a" <= c && c <= "f") || ("A" <= c && c <= "F")) {
			continue;
		}
		return false;
	}
	return true;
}
// for tr069
var msg_cwmp_pinterval="Periodic Inform Interval";
var msg_cwmp_cpeport="CPE Port for ACS Access";
var msg_cwmp_acsurl="Invalid ACS URL (Must use 'http://' or 'https://' as prefix).\n";
var msg_cwmp_ptime_year="Periodic Inform Time (Year)";
var msg_cwmp_ptime_month="Periodic Inform Time (Month)";
var msg_cwmp_ptime_day="Periodic Inform Time (Day)";
var msg_cwmp_ptime_hour="Periodic Inform Time (Hour)";
var msg_cwmp_ptime_minute="Periodic Inform Time (Minute)";
var msg_cwmp_ptime_second="Periodic Inform Time (Second)";

// =====  end  utility.js
/* QS */
//var msg_adv = "You are going into the advanced GUI and do so at your own risk.";
var msg_adv = "WARNING: For Advanced Users";
var msg_un = "Username";
var msg_pw = "Password";
var msg_ssid = "Wireless Network Name (SSID)";
var msg_wlpw = "Wireless Network Password";

function link_page(page)
{
	self.location.href=page;
}
function link_top_page(page)
{
	top.location.href=page;
}

function top_page(page)
{
	if (!confirm(msg_adv)) return;
	top.location.href=page;
}

function int_stat()
{
	if (III == "rr") {document.getElementById("int").className = "bb_rr";}
	else if (III == "yy") {document.getElementById("int").className = "bb_yy";}
	else if (III == "gg") {document.getElementById("int").className = "bb_gg";}
	else if (III == "ee") {document.getElementById("int").className = "bb_ee";}
	else {document.getElementById("int").className = "bb_ee";}
}

function dsl_stat()
{
	if (DDD == "rr") {document.getElementById("dsl").className = "bb_rr";}
	else if (DDD == "yy") {document.getElementById("dsl").className = "bb_yy";}
	else if (DDD == "gg") {document.getElementById("dsl").className = "bb_gg";}
	else if (DDD == "ee") {document.getElementById("dsl").className = "bb_ee";}
	else {document.getElementById("dsl").className = "bb_ee";}
}
function wil_stat()
{
	if (WWW == "rr") {document.getElementById("wil").className = "bb_rr";}
	else if (WWW == "yy") {document.getElementById("wil").className = "bb_yy";}
	else if (WWW == "gg") {document.getElementById("wil").className = "bb_gg";}
	else if (WWW == "ee") {document.getElementById("wil").className = "bb_ee";}
	else {document.getElementById("wil").className = "bb_ee";}
}

// for usb pages.
function isDigitAlpha( str )
{
	var i;
	var c;
	for ( i = 0; i < str.length; i++ ) {
		c = str.charAt(i);
		if ( !(( c >= '0' && c <= '9' ) 
		|| ( c >= 'a' && c <= 'z' ) 
		|| ( c >= 'A' && c <= 'Z' )) ) {
			return false;
		}
	}
	return true;
}

// for usb pages.
var msg_username_blank = "user name is blank!";
var msg_password_blank ="password is blank!";
var msg_username_only_letterornumber = "user name can only be letter or number!";
var msg_passwd_only_letterornumber = "password can only be letter or number!";
var msg_user_exist = "user exist!";
var msg_nomatch_pwd = "password is not match!";
var msg_groupname_only_letterornumber = "group name can only be letter or number!";
var msg_group_exist = "group exist!";
var msg_group_blank = "group name is blank!";


var msg_network_name = "Network/Device Name";
var msg_workgroup = "Workgroup";
var msg_shr_fld_port = "Access Port";

var msg_share_folder = "Share Folder";
var msg_share_name = "Share Name";


function checkIInt(text_input_field, field_name, min_value, max_value, required)
{
	var str = text_input_field.value;
	var error_msg= "";
	
	if (text_input_field.value.length==0)
	{
		if (required)
			error_msg = addstr(msg_blank,field_name);
	}
	else
	{
		for (var i=0; i < str.length; i++)
		{
			if ((str.charAt(i) < '0') || (str.charAt(i) > '9'))
				error_msg = addstr(msg_check_invalid,field_name);
		}
		if (error_msg.length < 2)
		{
			var int_value = parseInt(str);
			if (int_value < min_value || int_value > max_value)
				error_msg = addstr(msg_outofrange,field_name,min_value,max_value);
		}
	}
	if (error_msg.length > 1)
	{
		error_msg = error_msg + "\n";
		alert(error_msg);
		return false;
	}
}
function isValidPort(port) {
   if ( isNaN(port) )        return false;

   if ( port < 1 || port > 65535)
       return false;

   return true;
}

function isValidPortFW(port) {
   if ( isNaN(port) )
       return false;
   
   if ( port < 1 || port > 65534)
       return false;
   
   return true;
}

function RCKAll(theElement, FieldName)
{
	var theForm = theElement.form, z = 0;
	for(z=0; z<theForm.length;z++)
	{
		if(theForm[z].type == 'checkbox' && theForm[z].name != FieldName)
		{
			if(theElement.checked)
			{
				theForm[z].checked = false;
				theForm[z].disabled = true;
			}
			else
			{
				theForm[z].disabled = false;
			}
		}
	}
}

var unsafeString = "\"<>%\\^[]`\+\$\,'#&";
// deleted these chars from the include list ";", "/", "?", ":", "@", "=", "&" and #
// so that we could analyze actual URLs

function isUnsafe(compareChar)
// this function checks to see if a char is URL unsafe.
// Returns bool result. True = unsafe, False = safe
{
   if ( unsafeString.indexOf(compareChar) == -1 && compareChar.charCodeAt(0) > 32
        && compareChar.charCodeAt(0) < 123 )
      return false; // found no unsafe chars, return false
   else
      return true;
}

function encodeUrl(val)
{
   var len     = val.length;
   var i       = 0;
   var newStr  = "";
   var original = val;
   
   urlError = 0;
   	
   for ( i = 0; i < len; i++ ) {
      if ( val.substring(i,i+1).charCodeAt(0) < 255 ) {
         // hack to eliminate the rest of unicode from this
         if (isUnsafe(val.substring(i,i+1)) == false)
            newStr = newStr + val.substring(i,i+1);
         else
            newStr = newStr + convert(val.substring(i,i+1));
      } else {
         // woopsie! restore.
         alert ("Found a non-ISO-8859-1 character at position: " + (i+1) + ",\nPlease eliminate before continuing.");
         newStr = original;
         // short-circuit the loop and exit
         i = len;
         urlError = 1;
      }
   }

   return newStr;
}

// =====  end  utility.js
