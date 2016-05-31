var _category=0, _name=1, _src=2, _dst=3, _prio=4, _desc_name=5, _TCP=0, _UDP=1, _TCPUDP=2;       /* APP & GAME */
var _phy_port_num=2;                                                                /* PHY PORT   */
var _dev_name=3;                                                                    /* MAC        */
var TYPE_APP=1, TYPE_GAME=2, TYPE_PORT=3, TYPE_MAC=4, TYPE_NEW_APP=11, TYPE_NEW_GAME=21;
var SPRIO_TID=0, SPRIO_NAME=1, SPRIO_ENABLE=2, SPRIO_DFT_Q=3, SPRIO_WMODE=4, SPRIO_QVAL_MIN=5, SPRIO_QVAL_MAX=6, SPRIO_ITEM_COUNT=7;
var SPRIO_TABLE_TID=0, SPRIO_TABLE_ITEM=1;
var SPRIO_ITEM_QVAL=0, SPRIO_ITEM_QUE=1;
var QOS_IP_ENABLE=0, QOS_IP_SRC=1, QOS_IP_DST=2,QOS_IP_QUE=3;
var QOS_IP_RANGE_START=0, QOS_IP_RANGE_STOP=1;
var QOS_IP_ANY=1, QOS_IP_SINGLE=2, QOS_IP_RANGE=3;
var QOS_TYPE=0,QOS_NUM=1;
var CATEGORY_APP=0, CATEGORY_GAME=1, CATEGORY_PORT=2, CATEGORY_MAC=3;

function apply_mac_conflict(mac, exceptIdx){
    var i;
    var rule;
    var index=1

	for(i=0; i<apply_qos.length; i++) {
	    rule = apply_qos[i];
	    if(rule[_category] != CATEGORY_MAC) {
	        continue;
	    }

	    if (i != exceptIdx){ //do not compare with itself...common sense
			if (mac.toUpperCase() == rule[_src].toUpperCase()){
				alert(mac+"-"+getErrorMsgByVar("gsm_msg_qos_mac_conflicts"));
				return true;
			}
		}
		index++;
	}
	return false;
}

function mac_section_valid(){
 	var cf = document.forms[0];
	var new_rule="", name="",srcpart="",dstpart="",prio="";

	name = cf.name.value;
	srcpart  = cf.mac.value;
	dstpart = cf.dev_name.value;
	prio = cf.priority.selectedIndex;

    /*
	if( isInvalidStr(cf.dev_name, symbol, getErrorMsgByVar("gsm_msg_qos_device_name")))
		return false;
    */
	if(!checkMacStr(srcpart)){
		alert(getErrorMsgByVar("gsm_msg_qos_inv_mac_format"));
		cf.mac1.focus();
		return false;
	}

	if (doing_add_mac){
		doing_add_mac = false;
		if(apply_mac_conflict(srcpart, -1)) { //need to compare with itself
			return false;
		}
	}
	else{
		if(apply_mac_conflict(srcpart, selectIdx)) //don't need to compare with itself
			return false;
	}

	return true;
}

function parseOneMacRule(rule){
    if (validRule(rule)==false )
        return "err";

    rule = rule.split("\x02");
    if( isArray(rule)  ){
        if( rule.length == 5){ //must have 5 parts

        }else{
            alert("1 "+"rule must have 5 parts; mark -del on rule"+rule);
            rule[_name] = "-del"; //we leave a mark here and to be removed by ruleHygiene
            //we don't return because we still need to continue the parse
        }
    }else{
        alert("2 "+"rule must have 4 parts!It's not an array??");return "err";
    }
    return rule;
}

function ruleHygiene(rule){
    var n;
    for(n=0;n<rule.length;n++){
        if(rule[n][_name]=="-del"){ //this is marked by parsePortRule()
            rule.splice(n,1);
            n-=1;
        }
    }
}

/* Combine two @rule1 and @rule2 with '!' */
function addRule(rule1,rule2){
    if(validRule(rule2)) {
        if(rule1.length) {
            return (rule1+"\x01"+rule2);
        }
        else {
            return rule2;
        }
    }
    else
        return rule1;
}

/* Convert predefined rules in array format to string format, desc_name added */
function parts_arrayToString(parr){
    if(parr.length == 6)
        return (parr[_category]+"\x02"+parr[_name]+"\x02"+parr[_src]+"\x02"+parr[_dst]+"\x02"+parr[_prio]+"\x02"+parr[_desc_name]);
    else
        return (parr[_category]+"\x02"+parr[_name]+"\x02"+parr[_src]+"\x02"+parr[_dst]+"\x02"+parr[_prio]);
}

function delRule(rule, idx){
    var stringRule;
    if (validRule(rule)==false ){
        alert("delRule() err: del canceled");
        stringRule = rule;
    }
    else{
        rule = rule.split("\x01");

        rule.splice(idx,1);
        stringRule = rules_arrayToString(rule);
    }
    return stringRule;

}

/*
 * replace location @idx of @rule to of @newrule
 */
function replaceRule(rule, idx, newrule){
    var stringRule;

    if( validRule(rule) == false ){
        alert("insertRule() err: insert canceled");
        StringRule = rule;
    }
    else{
        rule = rule.split("\x01");
        rule.splice(idx, 1, newrule);
        stringRule = rules_arrayToString(rule);
    }
    return stringRule;
}

function rules_arrayToString(arr){
    var n=0;
    var rule ="";

    for(n=0;n<arr.length;n++){
        if(n == arr.length-1)
            rule += arr[n];
        else
            rule += (arr[n] + "\x01");
    }
    return rule;
}

//=================================================================================
/*
 * Parse application rules to apply_app[]
 * Return : 1 ==> rule is valid
 *          0 ==> rule is invalid
 */
function parse_apply_qos_rules(){
    if(validRule(apply_qos_rules)){
        apply_qos_rules_list = apply_qos_rules.split("\x01");
        apply_qos = apply_qos_rules.split("\x01");
        if(parseQoSRule(apply_qos) ){
            apply_qos_rules_count = apply_qos.length;
            return 1;
        }
        else{
            alert(getErrorMsgByVar("gsm_msg_qos_fail_parse_app"));
            return 0;
        }
    }else{
        apply_qos_rules_count =0;
        return 0;
    }
}

function parse_predef_qos_rules(){
	if(validRule(predef_qos_rules)){
		predef_qos = predef_qos_rules.split("\x01");
		predef_qos_rule_list = predef_qos_rules.split("\x01");
		if(parseQoSRule(predef_qos)){
			predef_qos_rules_count = predef_qos.length;
		}
		else{
			alert(getErrorMsgByVar("gsm_msg_qos_fail_parse_app"));
			return 0;
		}
	}else{
		predef_qos_rules_count =0;
		return 0;
	}
}

function parseAllPolicy(){
    parse_apply_qos_rules();
    parse_predef_qos_rules();
    return;
}

/* Jump to different QoS add page according to category */
function show_qos_apps()
{
    var cf = document.forms[0];
    var next_file;

    switch (cf.category.selectedIndex)
    {
        case CATEGORY_APP:
            next_file="QOS_add.htm";
            break;
        case CATEGORY_GAME:
            next_file="QOS_add_game.htm";
            break;
        case CATEGORY_PORT:
            next_file="QOS_add_phy.htm";
            break;
        case CATEGORY_MAC:
            next_file="QOS_add_mac.htm";
            break;
    }
    try{
    	/* for old version ie6, 
    	 * version:6.0.2900.5512.xpsp_sp3_gdr.091208-2036
    	 * version:6.0.2900.5512.xpsp_sp3_gdr.080413-2111
    	 */
    	cf.apps.onchange = ""; 
    }catch(e){/*ignore errors*/}
    
    if(cf.this_file.value != next_file) {
        window.location.href = next_file;
    }
    return true;
}

function show_customer() {
    var cf = document.forms[0];
    var index = cf.apps.options.selectedIndex;
    var next_file;

    if (index == cf.apps.options.length-1) {
        next_file=cf.category.value == "applications" ? "QOS_add_app_new.htm" : "QOS_add_game_new.htm";
    }
    else {
        next_file=cf.category.value == "applications" ? "QOS_add.htm" : "QOS_add_game.htm";
    }
    if(cf.this_file.value != next_file) {
        location.href = next_file;
    }
    return;
}

/* Jump to different QoS add page according to category */
function show_qos_apps_edit()
{
	var cf = document.forms[0];
    var next_file="";

    switch (cf.category.selectedIndex)
    {
        case CATEGORY_APP:
            if(is_predef_app(apply_qos[cf.qos_edit_idx.value][_name])) {
                next_file="QOS_edit.htm";
            }
            else {
                next_file="QOS_edit_app_new.htm";
            }
            break;
        case CATEGORY_GAME:
            if(is_predef_game(apply_qos[cf.qos_edit_idx.value][_name])) {
                next_file="QOS_edit_game.htm";
            }
            else {
                next_file="QOS_edit_game_new.htm";
            }
            break;
        case CATEGORY_PORT:
            next_file="QOS_edit_phy.htm";
            break;
        case CATEGORY_MAC:
            next_file="QOS_edit_mac.htm";
            break;
    }
    if(cf.this_file.value != next_file) {
        cf.todo.value="qos_edit";
        cf.next_file.value = next_file;
        cf.submit();
    }
    return;
}

function show_customer_edit() {
    var cf = document.forms[0];
    var index = cf.apps.options.selectedIndex;
    var next_file="";

    if (index == cf.apps.options.length-1) {
        next_file=cf.category.value == "applications" ? "QOS_edit_app_new.htm" : "QOS_edit_game_new.htm";
    }
    else {
        next_file=cf.category.value == "applications" ? "QOS_edit.htm" : "QOS_edit_game.htm";
    }
    if(cf.this_file.value != next_file) {
        cf.todo.value="qos_edit";
        cf.next_file.value = next_file;
        cf.submit();
    }
    return;
}

/* Show name according to apps selected index */
function setPolicyName()
{
    var cf = document.forms[0];

    if (cf.category.value == "applications" || cf.category.value == "game") {
        var index = cf.apps.options.selectedIndex;
        if (index != cf.apps.options.length-1) {
            cf.name.value = cf.apps[cf.apps.selectedIndex].text;
//            cf.name.disabled=true;
        }
        else {
            cf.name.value = "";
            cf.name.disabled=false;
        }
    }
    else if (cf.category.value == "port") {
        cf.name.value = "LAN Port " + cf.port_num.value;
    }
    else if (cf.category.value == "mac") {
        cf.name.value = "";
    }
}

/*
 * Check if this name is predefined app rules
 * Return:
 *      false ==> No, this name is NOT in predefined APP rules list
 *      true  ==> Yes.
 */
function is_predef_app(name) {
    var rule = get_predefined_rules(name);

    if(rule.length) {
        rule = rule.split("\x02");
        if(rule[_category] == CATEGORY_APP) {
            return true;
        }
    }
    return false;
}

/*
 * Check if this name is predefined GAME rules
 * Return:
 *      false ==> No, this name is NOT in predefined GAME rules list
 *      true  ==> Yes.
 */
function is_predef_game(name) {
    var rule = get_predefined_rules(name);

    if(rule.length) {
        rule = rule.split("\x02");
        if(rule[_category] == CATEGORY_GAME) {
            return true;
        }
    }
    return false;
}

/*
 * Get predefined rules according to @name
 */
function get_predefined_rules(name) {
    var i;

    for (i=0; i<predef_qos.length; i++){
        if(name == predef_qos[i][_name]) {
            return predef_qos_rule_list[i];
        }
    }
    return "";
}


/* show policy items value. */
function setPolicyItems() {
    var cf = document.forms[0];
    var i = cf.qos_edit_idx.value;

    cf.name.value = apply_qos[i][_name];
    cf.priority.selectedIndex = apply_qos[i][_prio];
    var category;
    if(cf.category.value == "applications")
        category="0";
    else if(cf.category.value == "game")
        category="1";
    else if(cf.category.value == "port")
        category="2";
    else 
        category="3";
    if(apply_qos[i][_category] != category) {
        /* If rules under edit is different category with current showing category, only show name and priority */
        return;
    }

    switch(parseInt(category,10)) {
    case CATEGORY_APP:
    case CATEGORY_GAME:
        var index=cf.apps.options.length-1;
        var n;

        for(n=0; n<cf.apps.options.length; n++) {
            if(apply_qos[i][apply_qos[i].length==5?_name:_desc_name] == cf.apps.options[n].text) {
                index = n;
                break;
            }
        }
        cf.apps.options.selectedIndex = index;

        if (index == cf.apps.options.length-1) {
            /* New APP or new GAME */
            var array_rule = parseOnePortRule(apply_qos_rules_list[i]);
            var tcpstr = array_rule[_dst][_TCP][0];
            var udpstr = array_rule[_dst][_UDP][0];
            var portstr;

            /* Set protocol */
            if(tcpstr.length > 0) {
                cf.protocol.value = "tcp";
                portstr = tcpstr;
            }
            if(udpstr.length > 0) {
                cf.protocol.value = "udp";
                portstr = udpstr;
            }
            if(tcpstr.length > 0 && udpstr.length > 0) {
                cf.protocol.value = "both";
            }

            /* Parse port string */
            var isRange = portstr.indexOf("-");

            if(isRange >= 0) {
                a = portstr.split("-");
                cf.port_start.value = parseInt(a[0], 10);
                cf.port_end.value = parseInt(a[1], 10);
            }
            else {
                cf.port_start.value = parseInt(portstr, 10);
                cf.port_end.value = parseInt(portstr, 10);
            }
        }
        break;
    case CATEGORY_MAC:
        cf.mac.value = apply_qos[i][_src];
        cf.dev_name.value = apply_qos[i][_dev_name];
        break;
    case CATEGORY_PORT:
        cf.port_num.value = apply_qos[i][_phy_port_num];
        break;
    }
}

/*
 * Check if QoS rule string is valid or not
 * QOS rules format:
 * APP/GAME: <category>;<name>;<src ports>;<dst ports>;<priority>
 * MAC     : <category>;<name>;<src mac>;<device name>;<priority>
 * PORT    : <category>;<name>;<PORT NUM>;<->;<priority>
 */
function validRule(in_rule){
    var rule = new String(in_rule);
    if(rule.length > 6 && rule != "" && rule.indexOf("\x02")!=-1){
        rule = rule.split("\x02");
        if(rule.length >= 5)
            return true;
    }

    return false;
}

/*
 * Parse one entry of port rule. From string format to two-dim array format
 * Rule format:             <category>;<name>;<Source Port>;<Destination Port>;<Priority>
 *  Source/Destination Port: <TCP Port>+<UDP Port>
 *  Port:                    [port],[sport-eport]
 * Rule example: MSN_Messenger;+;1863,6901,6891-6900+1863,5190,6901;2!Skype;+;80,443+;2
 * @rule will be array.
 */
function parseOnePortRule(rule){
    if (validRule(rule)==false ) {
        return "err";
    }

    rule = rule.split("\x02");

    //------------SOURCE     PORT-----------------------
    rule[_src] = rule[_src].split("+"); //tcp+udp
    if(isArray(rule[_src])){
        if(rule[_src].length == 2){
            rule[_src][_TCP] = rule[_src][_TCP].split(","); //TCP
            rule[_src][_UDP] = rule[_src][_UDP].split(","); //UDP
        }else{
            alert("1  "+"rule"+"#"+n+"srcport format error: should consists of TCP and UDP: using '+'");
        }
    }else{
            alert("2  "+"rule"+"#"+n+"srcport format error: should consists of TCP and UDP: using '+'; is not an array??");return "err";
    }
    //------------DESTINATION  PORT-----------------------
    rule[_dst] = rule[_dst].split("+"); //tcp+udp
    if(isArray(rule[_dst])){
        if(rule[_dst].length == 2){
            rule[_dst][_TCP] = rule[_dst][_TCP].split(","); //TCP
            rule[_dst][_UDP] = rule[_dst][_UDP].split(","); //UDP
        }else{
            alert("1  "+"rule"+"#"+n+"srcport format error: should consists of TCP and UDP: using '+'");return "err";
        }
    }else{
        alert("2  "+"rule"+"#"+n+"srcport format error: should consists of TCP and UDP: using '+'; is not an array??");return "err";
    }
    return rule;
}

/*
 * Parse one entry of LAN port(PHY) rule. From string format to single array format
 * Rule format:             <category>;<name>;<port number>;;<Priority>
 * @rule will be array.
 */
function parseOnePhyRule(rule) {
    if (validRule(rule)==false ) {
        return "err";
    }

    rule = rule.split("\x02");
    return rule;
}

/*
 * Parser QoS rules to array[][]
 */
function parseQoSRule(rule){
	var n;

	if(!isArray(rule)){
	    alert("Invalid rule rules!");return 0;
	}

    for (n=0; n<rule.length; n++){//loop for each rule
        rule[n] = rule[n].split("\x02"); //category;name;<data>;<data>;prio
        if( !isArray(rule[n])  ){
            alert("Invalid rule rules!");return 0;
        }
        if( rule[n].length != 5 && rule[n].length != 6){ //must have 5 parts, 6 for desc_name
            alert("1 "+"rule must have 4 parts; mark -del on rule"+rule[n]);
            rule[n][_name] = "-del"; //we leave a mark here and to be removed by ruleHygiene
            continue;
            //we don't return because we still need to continue the parse
        }
	}
	//ruleHygiene(rule);
    return 1;
}



/*
 * Check if port range is invalid
 * Return : 1 ==> port range is invalid
 *          0 ==> port range is valid
 */
function port_range_is_invalid(){
    var cf = document.forms[0];
    var start = parseInt(cf.port_start.value, 10);
    var stop = parseInt(cf.port_end.value, 10);

    if (start<= 0
            || start >= 65535
            || stop  <= 0
            || stop  >= 65535
            || start > stop) {
        return 1;
    }
    return 0;
}

/*
 * Check if @users is same as @s.
 * They are both single port.
 *
 * Return : 1 ==> Yes. They are same
 *          0 ==> No. They are different
 */
function conflictSingleSingle(users, s){
    var p1 = parseInt(users, 10);
    var p2 = parseInt(s, 10);

    return (p1!= 0 && p2 != 0 && p1==p2);
}

/*
 * Check if @users is same as @r.
 * @users is single port. @r is range port.
 *
 * Return : 1 ==> Yes. They are conflict
 *          0 ==> No. They are NOT conflict
 */
function conflictSingleRange(users, r){
    var p1 = parseInt(users, 10);
    var start, stop;

    r = r.split("-");
    start = parseInt(r[0], 10);
    stop = parseInt(r[1], 10);

    return (p1!= 0 && p1 >= start && p1<= stop);
}

/*
 * Check if @userr is same as @r.
 * They are both range port.
 *
 * Return : 1 ==> Yes. They are conflict
 *          0 ==> No. They are NOT conflict
 */
function conflictRangeRange(userr, r){
    var start1, stop1, start2,stop2;
    userr = userr.split("-");
    r = r.split("-");

    start1 = parseInt(userr[0], 10);
    stop1 = parseInt(userr[1], 10);
    start2 = parseInt(r[0], 10);
    stop2 = parseInt(r[1], 10);

    if (  ((start1 > stop2 && stop1 > stop2) || (start1< start2 && stop1< start2))   ){
        return false;
    }
    return true;
}
/*
 * Is @p is range format string?
 * 1 -- Yes
 * 0 -- No
 */
function isRange(p){
    if(p.indexOf("-")!= -1)
        return 1;
    else
        return 0;
}

/*
 * Check if @up is conflict with @ap
 *
 * Return : 1 ==> Yes. They are conflict
 *          0 ==> No. They are NOT conflict
 */
function portConflict(up, ap) {
    var conflict=0;

    if(ap.length != 0 && up.length !=0){
        if(isRange(up)){ //user port is a range
            if(isRange(ap)){//applied port is a range
                conflict = conflictRangeRange(up, ap);
            }
            else{
                conflict = conflictSingleRange(ap, up);
            }
        }
        else{ //user port is a port
            if(isRange(ap)){//applied port is a range
                conflict = conflictSingleRange(up, ap);
            }
            else{
                conflict = conflictSingleSingle(up, ap);
            }
        }
    }
    return conflict;
}

/*
 * Check if @rule1 and @rule2 are conflict on @site (src or dst) and @proto (tcp or udp)
 * Return : true  ==> Yes. They are conflict
 *          false ==> No. They are NOT conflict
 */
function userPortRuleConflictBySiteProto(rule1, rule2, site, proto){
    var conflict=false;
    var i,j;
    var up, ap;

    for(i=0; i<rule1[site][proto].length; i++){
        up = rule1[site][proto][i];

        for(j=0; j<rule2[site][proto].length; j++){
            ap = rule2[site][proto][j];
            conflict = portConflict(up, ap);
            if(conflict){
                if(proto == _TCP)
                    alert("Action Canceled.\nNew policy ["+rule1[_name]+"](with TCP port "+up +") conflicts with existing policy ["+rule2[_name]+"] (on port "+rule2[site][proto][j]+")\nYou must remove ["+rule2[_name]+"] policy before applying the new rule.");
                else
                    alert("Action Canceled.\nNew policy ["+rule1[_name]+"](with UDP port "+up +") conflicts with existing policy ["+rule2[_name]+"] (on port "+rule2[site][proto][j]+")\nYou must remove ["+rule2[_name]+"] policy before applying the new rule.");
                return true;//there is a conflict
            }
        }
    }
    return false; //no conflict
}

/*
 * Check if @rule is conflict with current exist rules
 * Return : true  ==> Yes. They are conflict
 *          false ==> No. They are NOT conflict. Message alerted
 *
 */
function ruleConflict(rule, ingore_idx){
    //make sure it's an object so that changes is permanent (JAVAscript does not support reference on non-obj)
    var result=false;
    var rule2;
    var i;

    if(rule.length != 5 && rule.length != 6){
        alert("len of u_rule != 5");
        return 0;
    }

    switch(parseInt(rule[_category], 10)) {
    case CATEGORY_APP:
    case CATEGORY_GAME:
        //this is complicated, because each port of the new QoS rule have many ports
        //each of these ports have to be tested with EACH of the applied ports
        //*ports can be srcport or dstport
        //*srcport can either be TCP or UDP and likewise for the dstport
        //overall, we got four combinations
        for(i=0; i<apply_qos.length; i++) {
            if(apply_qos[i][_category] != CATEGORY_APP && apply_qos[i][_category] != CATEGORY_GAME) {
                /* ONLY compare with APP and GAME */
                continue;
            }
            if(i==ingore_idx) {
                /* Do not compare with itself */
                continue;
            }

            rule2 = parseOnePortRule(apply_qos_rules_list[i]);
            if(userPortRuleConflictBySiteProto(rule, rule2, _src, _TCP))
                return true;
            if(userPortRuleConflictBySiteProto(rule, rule2, _src, _UDP))
                return true;
            if(userPortRuleConflictBySiteProto(rule, rule2, _dst, _TCP))
                return true;
            if(userPortRuleConflictBySiteProto(rule, rule2, _dst, _UDP))
                return true;
        }
        break;
    case CATEGORY_PORT:
        for(i=0; i<apply_qos.length; i++) {
            if(apply_qos[i][_category] != CATEGORY_PORT) {
                /* ONLY compare with CATEGORY_PORT */
                continue;
            }
            if(i==ingore_idx) {
                /* Do not compare with itself */
                continue;
            }
            if(apply_qos[i][_phy_port_num] == rule[_phy_port_num]) {
                alert("QoS rules for LAN port " + rule[_phy_port_num] + " already exist!");
                return true;
            }
        }
        break;
    case CATEGORY_MAC:
        selectIdx = ingore_idx;

        if(!mac_section_valid()) {
            return true;
        }
        break;
    }
    return false;
}

/* Set priority/desc_name value to rule string */
function set_str_rulePriority(str_rule, str_prio){
    var cf = document.forms[0];
    var ruleArr = str_rule.split("\x02");
    ruleArr[_prio] = str_prio;
    ruleArr.push(ruleArr[_name]);
    ruleArr[_name] = cf.name.value;
    return (parts_arrayToString(ruleArr));
}

/* Generate port string according to @startp, @stopp and @proto */
function makePortPart(startp, stopp, proto){
    var p1 = parseInt(startp, 10);
    var p2 = parseInt(stopp, 10);
    var tcpp="", udpp="", tcpudpp="";

    switch(proto){
        case "tcp": /* TCP */
            if(p1 == p2 || stopp == '')
                tcpp=p1;
            else
                tcpp = (startp+"-"+stopp);
            break;
        case "udp": /* UDP */
            if(p1 == p2 || stopp == '')
                udpp=p1;
            else
                udpp = (startp+"-"+stopp);
            break;
        case "both": /* TCP/UDP */
            if(p1 == p2 || stopp == ''){
                tcpp=p1;
                udpp=p1;
            }
            else{
                tcpp = (startp+"-"+stopp);
                udpp = (startp+"-"+stopp);
            }
            break;
    }

    return (tcpp+"+"+udpp);
}

/* Generate rule string from <category> <name> <Source Port> <Destination Port> and <Priority> */
function makeRule(p1,p2,p3,p4,p5){
    var d = "\x02";
    var rule = p1+d+p2+d+p3+d+p4+d+p5;

    return rule;
}

/*
 * Build string format qos_rules from double-dim array format rules
 */
function build_qos_rules() {
    var n;
    var str_new_rule="", result="";

    for (n=0; n<apply_qos.length; n++) {
        str_new_rule = parts_arrayToString(apply_qos[n]);
        /* Follow time order to save mac list to nv */
        result = addRule(result, str_new_rule);
    }
    return result;
}

/* Check if policy_name_is_predefined in predef_qos, except edit_index in apply_qos */
function policy_name_is_predefined() {
    var cf = document.forms[0];
    var i;

    if(cf.category.selectedIndex == CATEGORY_APP || cf.category.selectedIndex == CATEGORY_GAME) {
        if (cf.apps.options.selectedIndex != cf.apps.options.length-1
            && cf.name.value == cf.apps.options[cf.apps.selectedIndex].text) {
            /* User selected predefined rules no need to check */
            return false;
        }
    }

    for(i=0; i<predef_qos.length; i++) {
        if(cf.name.value == predef_qos[i][_name]) {
            return true;
        }
    }
    return false;
}
function policy_name_is_exist() {
    var cf = document.forms[0];
    var i;
		var qos_edit_idx = -1;

		if(ed_mode_flag) {
		    qos_edit_idx = cf.qos_edit_idx.value;
		}
    for(i=0; i<apply_qos.length; i++){
    	/* In edit mode, we should check the names in rule list except the one we choose. */
        if(i == qos_edit_idx)
            continue;
        if(cf.name.value == apply_qos[i][_name]) {
            return true;
        }
    }
    return false;
}

/* Root function to check when click apply button */
function click_apply(){
    var cf = document.forms[0];
    var result="";
    var n=0;
    var name="",srcpart="", dstpart="",prio="",proto="";
    var array_new_rule="", str_new_rule="";
    var currentChosenType = cf.category.selectedIndex+1;
    var predefined_rule_list;
    var qos_edit_idx;
    var dev_name;
    var mac;

    if(currentChosenType != TYPE_MAC || ed_mode_flag){
	if(cf.name.value.length< 1)
	{
		alert(getErrorMsgByVar("gsm_qos_blnk"));
		return false;
	}
    }

    if(ed_mode_flag) {
        qos_edit_idx=cf.qos_edit_idx.value;
    }
    else {
        qos_edit_idx = -1;
    }

    /* For APP and GAME, we need to check apps index */
    if(currentChosenType == TYPE_APP) {
        apps_index = cf.apps.selectedIndex;
        if(apps_index == cf.apps.options.length-1) {
            currentChosenType = TYPE_NEW_APP;
        }
    }
    if(currentChosenType == TYPE_GAME) {
        apps_index = cf.apps.selectedIndex;
        if(apps_index == cf.apps.options.length-1) {
            currentChosenType = TYPE_NEW_GAME;
        }
    }

    if(policy_name_is_predefined()){
        alert(getErrorMsgByVar("gsm_msg_qos_conflict_predef_name"));
        return false;
    }
    if(policy_name_is_exist()) {
        alert(getErrorMsgByVar("gsm_msg_qos_conflict_predef_name"));
        return false;
    }

    /*
       if(ed_mode==1)
       return checkEditData();
     */

    /* Build str_new_rule for app&game rules at first */
    switch(currentChosenType) {
        case TYPE_APP:
        case TYPE_GAME:
            str_new_rule = get_predefined_rules(cf.apps.options[cf.apps.selectedIndex].text); //copy from rule template
            if(!str_new_rule.length) {
                alert("Can not find " + cf.apps.options[cf.apps.selectedIndex].text + " in predefined rules!\n");
                return false;
            }
            str_new_rule = set_str_rulePriority(str_new_rule, cf.priority.selectedIndex);
            break;
        case TYPE_NEW_APP:
        case TYPE_NEW_GAME:
            /*
            if( isInvalidStr(cf.name, symbol, getErrorMsgByVar("gsm_msg_qos_policy_name"))) {
                return false;
            }
            */
            if (! isValidRangeField(cf.port_start,cf.port_end)) {
                return false;
            }

            proto = cf.protocol.value;
            name = cf.name.value;
            srcpart = "+"; //reserved
            dstpart = makePortPart(cf.port_start.value, cf.port_end.value, proto);
            prio = cf.priority.selectedIndex;
            str_new_rule = makeRule(currentChosenType == TYPE_NEW_APP ? CATEGORY_APP : CATEGORY_GAME, name, srcpart, dstpart, prio);
            break;
        default:
            break;
    }

    switch(currentChosenType){
        case TYPE_GAME:
        case TYPE_APP:
        case TYPE_NEW_GAME:
        case TYPE_NEW_APP:
            array_new_rule = parseOnePortRule(str_new_rule);
            if(array_new_rule!="err"){
                if (ruleConflict(array_new_rule, qos_edit_idx)) {
                    return false;
                }
                if(!ed_mode_flag){
                    result = addRule(apply_qos_rules, str_new_rule);//combine 2 strings
                }else{
                    result = replaceRule(apply_qos_rules, qos_edit_idx, str_new_rule);
                }
            }
            else{
                alert(getErrorMsgByVar("gsm_msg_qos_inv_user_policy"));
                return false;
            }
            break;
        case TYPE_MAC:
            if(ed_mode_flag) {
                name = cf.name.value;
                dev_name = cf.dev_name.value;
                mac = cf.mac.value;
                prio = cf.priority.selectedIndex;
                str_new_rule = makeRule(CATEGORY_MAC, name, mac, dev_name, prio);

                array_new_rule = parseOneMacRule(str_new_rule);
                if(array_new_rule!="err"){
                    /* We check conflit in qos_edit_mac.htm */
                    if (ruleConflict(array_new_rule, qos_edit_idx)) {
                        return false;
                    }
                    result = replaceRule(apply_qos_rules, qos_edit_idx, str_new_rule);
                }
                else{
                    alert(getErrorMsgByVar("gsm_msg_qos_inv_user_policy"));
                    return false;
                }
            }
            else {
                result = build_qos_rules();
            }
            break;
        case TYPE_PORT:
            name = cf.name.value;
            prio = cf.priority.selectedIndex;
            str_new_rule = makeRule(CATEGORY_PORT, name, cf.port_num.value, "-", prio);

            array_new_rule = parseOnePhyRule(str_new_rule);
            if(array_new_rule!="err"){
                if (ruleConflict(array_new_rule, qos_edit_idx)) {
                    return false;
                }
                if(!ed_mode_flag){
                    result = addRule(apply_qos_rules, str_new_rule);//combine 2 strings
                }else{
                    result = replaceRule(apply_qos_rules, qos_edit_idx, str_new_rule);
                }
            }
            else{
                alert(getErrorMsgByVar("gsm_msg_qos_inv_user_policy"));
                return false;
            }
            break;
    }
    cf.apply_qos_rules.value = result;
    //alert("cf.apply_qos_rules.value is " + cf.apply_qos_rules.value);
    return true;
}
