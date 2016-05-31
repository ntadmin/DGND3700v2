//class: region words length

function class_region(btn_double, btn_triple, sub_double, sub_triple)
{
	var _this = this;	//save this to a private class variable to avoid some error may caused by event

	_this.adv_btn_double = btn_double;
	_this.adv_btn_triple = btn_triple;

	_this.sub_double = sub_double;
	_this.sub_triple = sub_triple;

	if(arguments.length == 6)
	{
		_this.white_double = arguments[4];
		_this.white_triple = arguments[5];
	}
	else
	{
		_this.white_double = _this.adv_btn_double;
		_this.white_triple = _this.adv_btn_triple;
	}
}

function initClass(region)
{
	var ret_class;
	switch(region)
	{
		//class_region(menu_double, menu_triple, sub_menu_double, sub_menu_triple, white_btns_double, white_btns_triple)
		case "Czech":
			ret_class = new class_region(20, 40, 22, 32);
			break;
		case "Danish":
			ret_class = new class_region(19, 40, 25, 40);
			break;
		case "Greek":
			ret_class = new class_region(20, 40, 20, 31);
			break;
		case "Finnish":
			ret_class = new class_region(22, 40, 23, 35);
			break;
		case "French":
			ret_class = new class_region(20, 40, 24, 40);
			break;
		case "Italian":
			ret_class = new class_region(22, 40, 22, 35);
			break;
		case "Korean":
			ret_class = new class_region(20, 40, 16, 35);
			break;
		case "Dutch":
			ret_class = new class_region(20, 40, 23, 32);
			break;
		case "Norwegian":
			ret_class = new class_region(23, 40, 24, 38, 22, 35);
			break;
		case "Polish":
			ret_class = new class_region(20, 40, 23, 35);
			break;
		case "Portuguese":
			ret_class = new class_region(18, 40, 22, 35, 17, 40);
			break;
		case "Russian":
			ret_class = new class_region(20, 40, 22, 30);
			break;
		case "Slovak":
			ret_class = new class_region(20, 40, 23, 34);
			break;
		case "Slovenian":
			ret_class = new class_region(19, 40, 22, 38);
			break;
		case "Spanish":
			ret_class = new class_region(18, 40, 22, 36);
			break;
		case "Swedish":
			ret_class = new class_region(20, 40, 24, 35);
			break;
		default:
			ret_class = new class_region(20, 40, 22, 35);
			break;
	}

	return ret_class;
}
