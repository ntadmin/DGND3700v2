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
var ValidStr_ddns = 'abcdefghijklmnopqrstuvwxyz-1234567890.';
var hex_str = "ABCDEFabcdef0123456789";
var invalidMSNameStr = "\"/\\[<]>.:;,|=+*?";
var symbol = invalidMSNameStr + "#!@$%^&()";

var N_5G_Chan_A =  new Array(36,40,44,48);
var N_5G_Chan_B =  new Array(52,56,60,64);  //DFS
var N_5G_Chan_C =  new Array(100,104,108,112,116,120,124,128,132,136,140);//DFS
var N_5G_Chan_D =  new Array(149,153,157,161);
var N_5G_Chan_E =  165;

//return 1:IE 2:Firefox 3:safari 4:others
function WhichBrowser()
{
	if(navigator.appName.charAt(0)=="N"){
		if(navigator.userAgent.indexOf("Netscape")==-1){
			if(navigator.userAgent.indexOf("Safari")!=-1){
				return 3;
			}else{
				if(navigator.userAgent.indexOf("Firefox")!=-1){
					return 2;
				}else
					return 4;
			}
		}
	}
	if(navigator.appName.charAt(0)=="M" && navigator.userAgent.indexOf("Opera")==-1)
	{
		if(navigator.userAgent.indexOf("Opera")!=-1)
			return 4;
		else
			return 1;
	}

	return 4;
}

function print_N_Channel(country, dulmode)
{
	var cf=document.forms[0];

	switch(country){
		case 1:
		case 5:
		case 6:
		case 7:
		case 10://africa,europe,israel,japan,middleEast
			cf.w_channel1.options.length=N_5G_Chan_A.length;
			for(var i=0; i<N_5G_Chan_A.length; i++){
				cf.w_channel1.options[i].value=N_5G_Chan_A[i];
				cf.w_channel1.options[i].text=N_5G_Chan_A[i];
			}
			break;
		case 2://asia
			if(dulmode=="130_5G")
				cf.w_channel1.options.length=N_5G_Chan_D.length+1;
			else
				cf.w_channel1.options.length=N_5G_Chan_D.length;
			for(var i=0; i<N_5G_Chan_D.length; i++){
				cf.w_channel1.options[i].value=N_5G_Chan_D[i];
				cf.w_channel1.options[i].text=N_5G_Chan_D[i];
			}
			if(dulmode=="130_5G"){
				cf.w_channel1.options[i].value=N_5G_Chan_E;
				cf.w_channel1.options[i].text=N_5G_Chan_E;
			}
			break;
		case 3:
		case 4:
		case 8:
		case 9:
		case 11:
		case 12://australia canada korea mexico SouthAmer U.S.
			//var channel=new Array(36,40,44,48,149,153,157,161);
			var tmp=N_5G_Chan_A+","+N_5G_Chan_D;
			var channel = tmp.split(",");

			if(dulmode=="130_5G")
				cf.w_channel1.options.length=channel.length+1;
			else
				cf.w_channel1.options.length=channel.length;
			for(var i=0; i<channel.length; i++){
				cf.w_channel1.options[i].value=channel[i];
				cf.w_channel1.options[i].text=channel[i];
			}
			if(dulmode=="130_5G"){
				cf.w_channel1.options[i].value=N_5G_Chan_E;
				cf.w_channel1.options[i].text=N_5G_Chan_E;
			}
			break;
	}
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

function loadWirelessHelp(fname,anchname)
{
		parent.help_iframe.location.href=fname+"_h.htm#"+anchname;
}

function loadhelp(fname,anchname)
{
	help_iframe.location.replace(document.getElementById('helpframe').src+"#"+ anchname);
}


function checkBlank(fieldObj, fname)
{
	var msg = "";
	if (fieldObj.value.length< 1){
		msg = addstr("%s "+ getErrorMsgByVar("gsm_msg_blank") + "\n",fname);
        }
	return msg;
}

function checkNoBlanks(fObj, fname)
{
	var space = " ";
 	if (fObj.value.indexOf(space) >= 0 )
			return addstr(getErrorMsgByVar("gsm_msg_space") + " %s\n",fname);
	else return "";
}

function checkValid(text_input_field, field_name, Valid_Str, max_size, mustFill)
{
	var error_msg= "";
	var size = text_input_field.value.length;
	var str = text_input_field.value;

	if ((mustFill) && (size != max_size) )
		error_msg = addstr(getErrorMsgByVar("gsm_msg_blank_in") + "%s\n",field_name);
 	for (var i=0; i< size; i++)
  	{
    	if (!(Valid_Str.indexOf(str.charAt(i)) >= 0))
    	{
			error_msg = addstr(getErrorMsgByVar("gsm_msg_invalid") + "%s\n",field_name,Valid_Str);
			break;
    	}
  	}
  	return error_msg;
}

function isValidStr(inputStr,validChars,len)  // returns true or false, no msg
{
	if (len<= 0) // no set length
		;
	else if (inputStr.length != len)
		return false;
    for(i=0; i< inputStr.length; i++)
	{
        var c = inputStr.charAt(i);
		if (validChars.indexOf(c) == -1 )
			return false;
    }
    return true;
}

/*
 * Netgear spec. for field, such as keyword and name, they must consist of printable
 * ASCII characters(ASCII 0x20 ~ 0x7e).
 */
function printable_ch_chk(str)
{
	var i=0;
	var msg="";

	for(i=0; i<str.length; i++)
	{
		if(str.charCodeAt(i) < 0x20 || str.charCodeAt(i) > 0x7e){
			msg += getErrorMsgByVar("gsm_msg_not_printable");
			break;
		}
	}
	return msg;
}

function checkPrintableStr(str)
{
	var msg="";
	var error_msg="";
	msg += printable_ch_chk(str);
	if(msg.length > 1){
		error_msg = addstr(getErrorMsgByVar("gsm_msg_invalid") + "%s\n",str);
	}
	return error_msg;
}

function isValidMAC(inputStr,validChars,len)  // returns true or false, no msg
{
        var illegal = 0;
        var illegal_char = 0;
        if (len<= 0) // no set length
                ;
        else if (inputStr.length != len)
                return false;
//alert("inputStr="+inputStr);
    for(i=0; i< inputStr.length; i++)
    {
        var c = inputStr.charAt(i);
//        if (i == 0 && c != '0')
  //              return false;
	if (i == 1 && (c == '1' || c == '3' || c == '5' || c == '7' || c == '9'
			|| c == 'B' || c == 'b' || c == 'D' || c == 'd'
			|| c == 'F' || c == 'f'))
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
			error_msg = addstr("%s " + getErrorMsgByVar("gsm_msg_blank") + "\n",field_name);
	}
	else // not blank, check contents
	{
		for (var i=0; i< str.length; i++)
		{
			if ((str.charAt(i)< '0') || (str.charAt(i) > '9'))
				error_msg = addstr("%s " + getErrorMsgByVar("gsm_msg_check_invalid"),field_name);
		}
		if (error_msg.length< 2) // don't parse if invalid
		{
			var int_value = parseInt(str, 10);
			if (int_value< min_value || int_value > max_value)
				error_msg = addstr(getErrorMsgByVar("gsm_msg_outofrange"),field_name,min_value,max_value);
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
		if(str_location< 0)
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
    browser.version = parseInt(navigator.appVersion, 10);
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
function inet_aton(ip)
{
	var valip = 0;
	var val = ip.split(".");
	for(var i=0;i<val.length;i++)
	{
		valip = valip * 256 + parseInt(val[i]);
	}
	return valip;
}
function isIntStr(str) {
    var i;
    for(i = 0; i<str.length; i++) {
        var c = str.substring(i, i+1);
        if("0" <= c && c <= "9") {
            continue;
        }
        return false;
    }
    return true;
}
function checkIntStr(str,minval,maxval)
{
	if(!(isIntStr(str)))
		return false;	
	var ival = parseInt(str);
	if(ival < minval || ival > maxval)
		return false;
	else return true;
}	
function isIpStr(addrStr) 
{
    var i;
    var a = addrStr.split(".");
    if(a.length != 4) 
        return false;
    if(!checkIntStr(a[0],1,254))
		return false;
    if(!checkIntStr(a[1],0,255))
		return false;
    if(!checkIntStr(a[2],0,255))
		return false;
    if(!checkIntStr(a[3],1,254))
		return false;
    return true;
}
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
        if(("0"<= c && c<= "9") || ("a"<= c && c<= "f") || ("A"<= c && c<= "F")) {
            continue;
        }
        return false;
    }
    return true;
}

function checkMacStr(macField)
{
	if (typeof(macField) == "string") {
		var MacStrOrg = macField;
	} else { /* object */
		if (macField.value.length == 0) {
			return false;
		}
		var MacStrOrg = macField.value;
	}

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
	for ( i = 0; i< macArray.length; i++)
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
        if(ip.disabled == false) {
            setTimeout('ip.focus()',1000);
        }
        return true;
    }
}

function badLANIP(ip1, ip2, ip3, ip4,max) {
    if(parseInt(ip1.value, 10)==127) return true;
    if(checkIPMain(ip1,223)) return true;
    if(checkIPMain(ip2,255)) return true;
    if(checkIPMain(ip3,255)) return true;
    if(checkIPMain(ip4,max)) return true;

	if((parseInt(ip1.value,10)==0)||(parseInt(ip4.value,10)==0)
	||(parseInt(ip1.value,10)==0)&&(parseInt(ip2.value,0)==0)
	&&(parseInt(ip3.value,10)==0)&&(parseInt(ip4.value,10)==0))
    	return true;
    //convert 001=>1
    ip1.value = parseInt(ip1.value,10);
    ip2.value = parseInt(ip2.value,10);
    ip3.value = parseInt(ip3.value,10);
    ip4.value = parseInt(ip4.value,10);
    return false;
}

function badSubLANIP(ip1, ip2, ip3, ip4,max) {
    if(parseInt(ip1.value, 10)==127) return true;
    if(checkIPMain(ip1,223)) return true;
    if(checkIPMain(ip2,255)) return true;
    if(checkIPMain(ip3,255)) return true;
    if(checkIPMain(ip4,max)) return true;
    if((parseInt(ip1.value, 10)==0)||(parseInt(ip1.value, 10)==0)&&(parseInt(ip2.value, 10)==0)&&(parseInt(ip3.value, 10)==0)&&(parseInt(ip4.value, 10)==0))
    	return true;
    return false;
}
function isMulticast(ip1)
{
    if(parseInt(ip1.value, 10)==224) return true;
    if(parseInt(ip1.value, 10)==225) return true;
    if(parseInt(ip1.value, 10)==226) return true;
    if(parseInt(ip1.value, 10)==227) return true;
    if(parseInt(ip1.value, 10)==228) return true;
    if(parseInt(ip1.value, 10)==229) return true;
    if(parseInt(ip1.value, 10)==230) return true;
    if(parseInt(ip1.value, 10)==231) return true;
    if(parseInt(ip1.value, 10)==232) return true;
    if(parseInt(ip1.value, 10)==233) return true;
    if(parseInt(ip1.value, 10)==234) return true;
    if(parseInt(ip1.value, 10)==235) return true;
    if(parseInt(ip1.value, 10)==236) return true;
    if(parseInt(ip1.value, 10)==237) return true;
    if(parseInt(ip1.value, 10)==238) return true;
    if(parseInt(ip1.value, 10)==239) return true;
}
/* for more strictly check ip address*/
function badIP2(ip1, ip2, ip3, ip4,max) {
    if (ip1.value.indexOf("0")==0)
	{
		return true;
	}

    if(parseInt(ip1.value, 10)==127)
	return true;
    if(parseInt(ip4.value, 10)==0)
	return true;
    if(isMulticast(ip1))
	return true;
    if(checkIPMain(ip1,223)) return true;
    if(checkIPMain(ip2,255)) return true;
    if(checkIPMain(ip3,255)) return true;
    if(checkIPMain(ip4,max)) return true;
    if((parseInt(ip1.value, 10)==0) || (parseInt(ip4.value, 10)==0)
    ||(parseInt(ip1.value, 10)==0) && (parseInt(ip2.value, 10)==0)
    && (parseInt(ip3.value, 10)==0) && (parseInt(ip4.value, 10)==0))
    	return true;
    return false;
}

function badIP(ip1, ip2, ip3, ip4,max) {
    if(parseInt(ip1.value, 10)==127) return true;
    if(parseInt(ip1.value, 10)==224) return true;
    if(checkIPMain(ip1,255)) return true;
    if(checkIPMain(ip2,255)) return true;
    if(checkIPMain(ip3,255)) return true;
    if(checkIPMain(ip4,max)) return true;
    if((parseInt(ip1.value, 10)==0) ||(parseInt(ip1.value, 10)==0) && (parseInt(ip2.value, 10)==0) && (parseInt(ip3.value, 10)==0) && (parseInt(ip4.value, 10)==0))
    	return true;
    return false;
}

function badMASK(mask1,mask2,mask3,mask4)
{
    var i;
    var tmp;
    var offcnt=255;
	var off;

	/* check whether mask field has blank value */
	if (mask1.value.length == 0 || mask2.value.length == 0
	|| mask3.value.length == 0 || mask4.value.length == 0) {
		return true;
	}

	/* mask should not all 0 */
	if(parseInt(mask1.value, 10)==0 && parseInt(mask2.value, 10)==0
	   && parseInt(mask3.value, 10)==0 && parseInt(mask4.value, 10)==0)
		return true;

    for(i=1;i<5;i++){
        tmp = "mask" + i;
        if (eval(tmp).value != 255)
          break;
    }

    //0.0.0.0
    if((parseInt(mask1.value, 10)==0)&&(parseInt(mask2.value, 10)==0)&&(parseInt(mask3.value, 10)==0)&&(parseInt(mask4.value, 10)==0))
        return true;

    if(i==5)	return true;

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

function badSubMASK(mask1,mask2,mask3,mask4)
{
    var i;
    var tmp;
    var offcnt=255;
		var off;

	/* check whether mask field has blank value */
	if (mask1.value.length == 0 || mask2.value.length == 0
	|| mask3.value.length == 0 || mask4.value.length == 0) {
		return true;
	}

    for(i=1;i<5;i++){
        tmp = "mask" + i;
        if (eval(tmp).value != 255)
          break;
    }

    //0.0.0.0
    if((parseInt(mask1.value, 10)==0)&&(parseInt(mask2.value, 10)==0)&&(parseInt(mask3.value, 10)==0)&&(parseInt(mask4.value, 10)==0))
        return true;

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

/* ip string to integer, eg. "255.255.255.255" --> 4294967295 */
function ip_str_2_int(ip_str)
{
	var ipArr = ip_str.split(".");
	var ip;
	var ip1, ip2, ip3;

	ip1 = ( parseInt(ipArr[0], 10) );
	ip2 = ( parseInt(ipArr[1], 10) );
	ip3 = ( parseInt(ipArr[2], 10) );

	/* singed>>>0 => unsigned */
	ip = ((ip1<<24)>>>0) + ((ip2<<16)>>>0) + ((ip3<<8)>>>0) + ( parseInt(ipArr[3], 10) );

	return ip;
}

/*
 * return: true --- valid; false --- invalid;
 * gw:    +------------------+-------+
 *        |       XXX        |  YYY  |
 *        +------------------+-------+
 *
 * mask:  +------------------+-------+
 *        |       111        |  000  |
 *        +------------------+-------+
 *
 * tmp_a: +------------------+-------+
 *        |       000        |  YYY  |
 *        +------------------+-------+
 */
function IsGatewayValid(ip, mask, gw)
{
    var wip = ip_str_2_int(ip);
    var nip = ip_str_2_int(mask);
	var gip = ip_str_2_int(gw);
	var tmp_a, tmp_b;

	/* check Gateway IP's validate */
	tmp_a = gip & (~nip);

	/* all of the unmask bits are 0 */
	/*netgear spec ,gateway could be x.x.x.0*/
	/*
	if(tmp_a == 0) {
		alert("1");
		return false;
	}
	*/
	/* all of the unmask bits are 1 */
	tmp_b = (nip | tmp_a)>>>0;
	if(tmp_b == ip_str_2_int("255.255.255.255")) {
		return false;
	}

	/* check whether in the same subnet */
	if((wip & nip) != (gip & nip)) {
		return false;
	} else {
		return true;
	}
}

/*
 * check whether a LAN IP is a valid IP, it simply means can access router.
 * return: true -- valid; false -- invalid.
 */
function IsLanIpValid(dev_ip, dev_mask, ip)
{
	return IsGatewayValid(dev_ip, dev_mask, ip);
}

/* Check Numeric*/
function isNumeric(str, max) {
    if(str.value.length == 0 || str.value == null || str.value == "") {
        if(str.disabled == false) {
            setTimeout('str.focus()',1000);
        }
        return true;
    }

    var i = parseInt(str.value, 10);
    if(i>max) {
	    if(str.disabled == false) {
            str.focus();
        }
        return true;
    }
    for(i=0; i<str.value.length; i++) {
        var c = str.value.substring(i, i+1);
        if("0"<= c && c<= "9") {
            continue;
        }
        if(str.disabled == false) {
            str.focus();
        }
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
        if (c>= "0" && c<= "9")
            continue;
        if ( c == '-' && i !=0 && i != (str.value.length-1) )
            continue;
        if ( c == ',' ) continue;
        if (c == ' ') continue;
        if (c>= 'A' && c<= 'Z') continue;
        if (c>= 'a' && c<= 'z') continue;
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
    answer = confirm(getErrorMsgByVar("gsm_msg_pub_cfm_save"));
    if (answer !=0) {
        return true;
    } else return false;
}

function alertPassword(formObj) {
    alert(getErrorMsgByVar("gsm_msg_pub_re_cfm_pw"));
    formObj.focus();
}

function isEqual(cp1,cp2)
{
	if(parseInt(cp1.value, 10) == parseInt(cp2.value, 10))
	{
		cp2.focus();
		return true;
	}
	else return false;
}

function isEqual_notfocus(cp1,cp2)
{
	if(parseInt(cp1.value, 10) == parseInt(cp2.value, 10))
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
	for (var i = 1; i< setDisabled.arguments.length; i++)
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

function complete_blankIP(f1,f2,f3,f4) // true only when blank
{
	if( containStr(f1,"") && containStr(f2,"") && containStr(f3,"") && containStr(f4,"") )
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
        for ( i = 0; i< macArray.length; i++)
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
		if(("0"<= c && c<= "9") || ("a"<= c && c<= "f") || ("A"<= c && c<= "F")) {
			continue;
		}
		return false;
	}
	return true;
}


function link_page(page)
{
	self.location.href=page;
}

function top_page(page)
{
	if (!confirm(getErrorMsgByVar("gsm_msg_adv"))) return;
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


var showit = "block";
var hideit = "none";

function show_hide(el,shownow)  // IE & NS6; shownow = true, false
{
//	alert("el = " + el);
	if (document.all)
		document.all(el).style.display = (shownow) ? showit : hideit ;
	else if (document.getElementById)
		document.getElementById(el).style.display = (shownow) ? showit : hideit ;
}

function isArray() {
        if (typeof arguments[0] == 'object') {
                var criterion = arguments[0].constructor.toString().match(/array/i);
                 return (criterion != null);
        }
         return false;
}

function trimWhiteSpace(string) {
	var newString  = '';
	var substring  = '';
	beginningFound = false;

	// copy characters over to a new string
	// retain whitespace characters if they are between other characters
	for (var i = 0; i< string.length; i++) {

		// copy non-whitespace characters
		if (string.charAt(i) != ' ' && string.charCodeAt(i) != 9) {

			// if the temporary string contains some whitespace characters, copy them first
			if (substring != '') {
				newString += substring;
				substring = '';
			}
			newString += string.charAt(i);
			if (beginningFound == false) beginningFound = true;
		}

		// hold whitespace characters in a temporary string if they follow a non-whitespace character
		else if (beginningFound == true) substring += string.charAt(i);
	}
	return newString;
}
function isInvalidStr(fobj,invalidChars,fname)  // returns true or false, no msg
{
    var error_msg = addstr(getErrorMsgByVar("gsm_msg_invalid2") + " %s\n",fname);

    var inputStr = fobj.value;
    if(inputStr.length==0){
		fobj.focus();
		alert(error_msg);
		return true;
    }
    for(i=0; i< inputStr.length; i++)
	{
        var c = inputStr.charAt(i);
		if (invalidChars.indexOf(c) >=0 ){
			fobj.focus();
			alert(error_msg);
			return true;
		}
    }
    return false;
}
function checkMac(macstr)
{
	var MacStrOrg = macstr;
	var MacStrNoSep = MacStrOrg;
	var macArray; var c; var i;

	if(MacStrOrg.indexOf(":") > -1)
		c = ":";
	else if(MacStrOrg.indexOf("-") > -1)
		c = "-";
	else
		return isValidStr(MacStrOrg,hex_str,12);
	macArray = MacStrOrg.split(c);
	if(macArray.length != 6)
		return false;
	for ( i = 0; i< macArray.length; i++)
	{
		if (macArray[i].length != 2 )
			return false;
	}
	MacStrNoSep =  MacStrNoSep.replace(/:/g,"");
	MacStrNoSep =  MacStrNoSep.replace(/-/g,"");
	return isValidStr(MacStrNoSep,hex_str,12);
}

function isValidRangeField(startobj,stopobj){
	var str_start = startobj.value;
	var str_stop = stopobj.value;
	var start, stop;
	var msg = "";
	if (checkInt(startobj, "", 1, 65535, true).length > 0 || checkInt(stopobj, "", 1, 65535, true).length > 0)
	{
		msg += getErrorMsgByVar("gsm_msg_inv_port_set");
	}
	if (msg.length > 1)	{
		alert(msg);
		startobj.focus();
		return false;
	}

	start = parseInt(str_start, 10);
	stop = parseInt(str_stop, 10);
	if(str_stop != ""){
		if(start< 0 || start > stop || start > 65535){
			alert(getErrorMsgByVar("gsm_msg_pub_port_range")+" "+getErrorMsgByVar("gsm_appe02"));
			return false;
		}
	}
	else{//end point is either empty or invalid
		return true;
	}

	return true;
}

// for usb pages.
function isDigitAlpha( str )
{
	var i;
	var c;
	for ( i = 0; i< str.length; i++ ) {
		c = str.charAt(i);
		if ( !(( c >= '0' && c<= '9' )
		|| ( c >= 'a' && c<= 'z' )
		|| ( c >= 'A' && c<= 'Z' )) ) {
			return false;
		}
	}
	return true;
}

function checkIInt(text_input_field, field_name, min_value, max_value, required)
{
	var str = text_input_field.value;
	var error_msg= "";

	if (text_input_field.value.length==0)
	{
		if (required)
			error_msg = addstr("%s " + getErrorMsgByVar("gsm_msg_blank") + "\n",field_name);
	}
	else
	{
		for (var i=0; i< str.length; i++)
		{
			if ((str.charAt(i)< '0') || (str.charAt(i) > '9'))
				error_msg = addstr("%s " + getErrorMsgByVar("gsm_msg_check_invalid"),field_name);
		}
		if (error_msg.length< 2)
		{
			var int_value = parseInt(str, 10);
			if (int_value< min_value || int_value > max_value)
				error_msg = addstr(getErrorMsgByVar("gsm_msg_outofrange"),field_name,min_value,max_value);
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

   if ( port< 1 || port > 65535)
       return false;

   return true;
}

function isValidPortFW(port) {
   if ( isNaN(port) )
       return false;

   if ( port< 1 || port > 65534)
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
        && compareChar.charCodeAt(0)< 123 )
      return false; // found no unsafe chars, return false
   else
      return true;
}

function convert(val)
{
	return ("%" + val.charCodeAt(0).toString(0x10));
}

function encodeUrl(val)
{
   var len     = val.length;
   var i       = 0;
   var newStr  = "";
   var original = val;

   urlError = 0;

   for ( i = 0; i< len; i++ ) {
      if ( val.substring(i,i+1).charCodeAt(0)< 255 ) {
         // hack to eliminate the rest of unicode from this
         if (isUnsafe(val.substring(i,i+1)) == false)
            newStr = newStr + val.substring(i,i+1);
         else
            newStr = newStr + convert(val.substring(i,i+1));
      } else {
         // woopsie! restore.
         //alert ("Found a non-ISO-8859-1 character at position: " + (i+1) + ",\nPlease eliminate before continuing.");
         //newStr = original;
         // short-circuit the loop and exit
         //i = len;
         //urlError = 1;

         // support utf8
         newStr = newStr + val.substring(i,i+1);
      }
   }

   return newStr;
}
/*copied from Internet: get text from clipboard*/
function getClipboard() {
    if (window.clipboardData) {
        return(window.clipboardData.getData('Text'));
    }
    else if (window.netscape) {
        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
        var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
        if (!clip) return;
        var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
        if (!trans) return;
        trans.addDataFlavor('text/unicode');
        clip.getData(trans,clip.kGlobalClipboard);
        var str = new Object();
        var len = new Object();
        try {
        trans.getTransferData('text/unicode',str,len);
    }
    catch(error) {
        return null;
    }
    if (str) {
        if (Components.interfaces.nsISupportsWString) str=str.value.QueryInterface(Components.interfaces.nsISupportsWString);
        else if (Components.interfaces.nsISupportsString) str=str.value.QueryInterface(Components.interfaces.nsISupportsString);
        else str = null;
    }
    if (str) {
        return(str.data.substring(0,len.value / 2));
    }
    }
    return null;
}

/*
 * Check if primary and Secondary DNS valid or not.
 * Valid   ==> return NULL message
 * Invalid ==> return error message
 */
function checkDNSValid(dns11, dns12, dns13, dns14, dns21, dns22, dns23, dns24) {
	var msg="";
	var prime_empty = 0, sec_empty = 0;

	if (dns11.value.length > 0 || dns12.value.length > 0
	|| dns13.value.length > 0 || dns14.value.length > 0) {
		if (badLANIP(dns11, dns12, dns13, dns14, 254)) {
			msg+= getErrorMsgByVar("gsm_msg_eth_inv_prime_dns");
		}
	}
	else {
		prime_empty = 1;
	}
	if (dns21.value.length > 0 || dns22.value.length > 0
	|| dns23.value.length > 0 || dns24.value.length > 0) {
		if (badLANIP(dns21, dns22, dns23, dns24, 254)) {
			msg+= getErrorMsgByVar("gsm_msg_eth_inv_sec_dns");
		}
		if (dns11.value == dns21.value && dns12.value == dns22.value
		&& dns13.value == dns23.value && dns14.value == dns24.value) {
			msg+= getErrorMsgByVar("gsm_msg_two_fix_dns_same_err");
		}
	}
	else {
		sec_empty = 1;
	}
	if (prime_empty == 1 && sec_empty == 1)
		msg+= getErrorMsgByVar("gsm_msg_eth_inv_prime_dns");
	return msg;
}


/*
 * Refresh time functions
 * Caller should define some values and call fresh_time() in onLoad
 * var delaytime = 1000;
 * var date_str = "@rt_now_datetime#";
 * var year, mon, day, hour, min, sec;
 */

function fresh_time()
{
    var tmp1, tmp2;

    tmp1 = date_str.indexOf(':');
    year = parseInt(date_str.substring(0, tmp1), 10);
    tmp2 = date_str.indexOf(':', tmp1 + 1);
    mon = parseInt(date_str.substring(tmp1 + 1, tmp2), 10);
    tmp1 = date_str.indexOf(':', tmp2 + 1);
    day = parseInt(date_str.substring(tmp2 + 1, tmp1), 10);
    tmp2 = date_str.indexOf(':', tmp1 + 1);
    hour = parseInt(date_str.substring(tmp1 + 1, tmp2), 10);
    tmp1 = date_str.indexOf(':', tmp2 + 1);
    min = parseInt(date_str.substring(tmp2 + 1, tmp1), 10);
    sec = parseInt(date_str.substring(tmp1 + 1), 10);

	clock_time();
}

function to_string(val) {
    var ret="";

    if (val <= 9) {
        ret += "0";
    }
    ret += val;

    return ret;
}

function show_time()
{
    var week_db = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var month_db = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var tmp = "";
    var currentDate = new Date(year, mon - 1, day, hour, min, sec, 0);
    var weekDay = currentDate.getDay(); /* 0 ~ 6. Sunday ~ Saturday */


    tmp += week_db[weekDay];
    tmp += ", ";
    tmp += to_string(day);
    tmp += " ";
    tmp += month_db[mon];
    tmp += " ";
    tmp += year;
    tmp += " ";
    tmp += to_string(hour);
    tmp += ":";
    tmp += to_string(min);
    tmp += ":";
    tmp += to_string(sec);

    return tmp;
}

function clock_time()
{
    var cf = document.forms[0];
    sec++;
    if (sec > 59) {
        sec = 0;
        min++;

        if (min == 60) {
            hour++;
            min = 0;
        }
    }
    if (hour == 24) {
        location.href = cf.this_file.value;
    }
	document.getElementById("timer").innerHTML = show_time();
	setTimeout("clock_time();", delaytime);
}
function disableForm(form_obj, flag)
{
	var form_size = form_obj.elements.length;

	if (!flag)
		return ;
	
	for (var i = 0; i < form_size; i++)
	{
		if (form_obj.elements[i].type == "button" ||
			form_obj.elements[i].type == "submit" ||
			form_obj.elements[i].type == "reset"
		)
		{
			form_obj.elements[i].disabled = flag;
		}
	}
}

function disableForms(flag)
{
	var i;

	if (flag) {
		for (i = 0; i < document.forms.length; i++ )
		{
			disableForm(document.forms[i], flag);
		}
	}
}
function get_browser_type()
{
	var browser;
	var ua = navigator.userAgent.toLowerCase();
	
	if (ua.match(/msie ([\d.]+)/))
	    browser = "ie";
	else if (ua.match(/firefox\/([\d.]+)/))
		 browser = "firefox";
	else if (ua.match(/chrome\/([\d.]+)/))
	    browser = "chrome";
	else if (ua.match(/opera.([\d.]+)/))
	    browser = "opera";
	else if (ua.match(/version\/([\d.]+)/))
	    browser = "safari";
	else
		browser = "other";

	return browser;
}

//For DLNA
var invalid_folder_char="\" \\ : * ? < > | ' `";
var invalid_media_name_char="\" \\ | , '";
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

/*
 * trim function
 */
function ignoreSpaces(str)
{
	return str.replace(/^\s+|\s+$/g,"");
}

// =====  end  utility.js
