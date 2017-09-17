/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ZH (Chinese, 中文 (Zhōngwén), 汉语, 漢語)
 */
(function ($) {
	$.extend($.validator.messages, {
		required: "必选字段",
		remote: "请修正该字段",
		email: "请输入正确格式的电子邮件",
		url: "请输入合法的网址",
		date: "请输入合法的日期",
		dateISO: "请输入合法的日期 (ISO).",
		number: "请输入合法的数字",
		digits: "只能输入整数",
		creditcard: "请输入合法的信用卡号",
		equalTo: "请再次输入相同的值",
		accept: "请输入拥有合法后缀名的字符串",
		maxlength: $.validator.format("请输入一个长度最多是 {0} 的字符串"),
		minlength: $.validator.format("请输入一个长度最少是 {0} 的字符串"),
		rangelength: $.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
		range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
		max: $.validator.format("请输入一个最大为 {0} 的值"),
		min: $.validator.format("请输入一个最小为 {0} 的值")
	});
}(jQuery));

/*
*jquery.validate验证方法扩展
*@name jquery.validate.add_method
*@author tesiontian <tntzd@yahoo.com.cn>
*@date 2011-05-13
*/
jQuery.validator.addMethod("mobile", function(value, element) {
    var length = value.length;
    var mobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "手机号码格式错误");

// 电话号码验证
jQuery.validator.addMethod("phone", function(value, element) {
    var tel = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
    return this.optional(element) || (tel.test(value));
}, "电话号码格式错误");


// 邮政编码验证
jQuery.validator.addMethod("zipCode", function(value, element) {
    var tel = /^[0-9]{6}$/;
    return this.optional(element) || (tel.test(value));
}, "邮政编码格式错误");

// QQ号码验证
jQuery.validator.addMethod("qq", function(value, element) {
    var tel = /^[1-9]\d{4,9}$/;
     return this.optional(element) || (tel.test(value));
}, "qq号码格式错误");

// IP地址验证
jQuery.validator.addMethod("ip", function(value, element) {
    var ip = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return this.optional(element) || (ip.test(value) && (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256));
}, "Ip地址格式错误");

// 字母和数字的验证
jQuery.validator.addMethod("chrnum", function(value, element) {
    var chrnum = /^([a-zA-Z0-9]+)$/;
    return this.optional(element) || (chrnum.test(value));
}, "只能输入数字和字母(字符A-Z, a-z, 0-9)");

// 中文的验证
jQuery.validator.addMethod("chinese", function(value, element) {
    var chinese = /^[\u4e00-\u9fa5·•]+$/;
    return this.optional(element) || (chinese.test(value));
}, "只能输入中文");

// 下拉框验证
$.validator.addMethod("selectNone", function(value, element) {
    return value == "请选择";
}, "必须选择一项");

//身份证验证2
jQuery.validator.addMethod("checkcard2", function(value, element) { 
    var length=value.length; 
    var chrnum = /^([0-9]+)$/;
    return this.optional(element) || checkcard(value)|| (length==6 && (chrnum.test(value)));     
}, "请正确输入您的身份证号码");


//身份证验证
jQuery.validator.addMethod("checkcard", function(value, element) {     
    return this.optional(element) || validateIdCard(value);     
}, "请正确输入您的身份证号码");
 
var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}

function validateIdCard(obj)
{
    var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙 江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖 北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西 藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
    var iSum = 0;
    //var info = "";
    var strIDno = obj;
    var idCardLength = strIDno.length;
    if (!/^\d{17}(\d|x)$/i.test(strIDno)&&!/^\d{15}$/i.test(strIDno)) return false; //非法身份证号
    if(aCity[parseInt(strIDno.substr(0,2))]==null) return false;// 非法地区
    // 15位身份证转换为18位
    if (idCardLength==15) {
        sBirthday = "19" + strIDno.substr(6,2) + "-" + Number(strIDno.substr(8,2)) + "-" + Number(strIDno.substr(10,2));
        var d = new Date(sBirthday.replace(/-/g,"/"))
        var dd = d.getFullYear().toString() + "-" + (d.getMonth()+1) + "-" + d.getDate();
        if (sBirthday != dd) return false; //非法生日
        strIDno=strIDno.substring(0,6)+"19"+strIDno.substring(6,15);
        strIDno=strIDno+GetVerifyBit(strIDno);
    }
    // 判断是否大于2078年，小于1900年
    var year =strIDno.substring(6,10);
    if (year<1900 || year>2078) return false;//非法生日

    //18位身份证处理

    //在后面的运算中x相当于数字10,所以转换成a
    strIDno = strIDno.replace(/x$/i,"a");

    sBirthday=strIDno.substr(6,4)+"-"+Number(strIDno.substr(10,2))+"-"+Number(strIDno.substr(12,2));
    var d = new Date(sBirthday.replace(/-/g,"/"))
    if (sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate())) return false; //非法生日
    // 身份证编码规范验证
    for (var i = 17;i>=0;i --) {
        iSum += (Math.pow(2,i) % 11) * parseInt(strIDno.charAt(17 - i),11);
    }
    if (iSum%11!=1) return false;// 非法身份证号

    // 判断是否屏蔽身份证
    var words = new Array();
    words = new Array("11111119111111111","12121219121212121");

    for(var k=0;k<words.length;k++){
        if (strIDno.indexOf(words[k])!=-1){
            return false;
        }
    }
    return true;
};

function checkcard(pId)
{
    var arrVerifyCode = [1,0,"X",9,8,7,6,5,4,3,2];
    var Wi = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1];
    var Checker = [1,9,8,7,6,5,4,3,2,1,1];

    if(pId.length != 15 && pId.length != 18)    return false;

    var Ai=pId.length==18 ?  pId.substring(0,17)   :   pId.slice(0,6)+"19"+pId.slice(6,16);

    if (!/^\d+$/.test(Ai))  return false;

    var yyyy=Ai.slice(6,10) ,  mm=Ai.slice(10,12)-1  ,  dd=Ai.slice(12,14);

    var d=new Date(yyyy,mm,dd) ,  now=new Date();
     var year=d.getFullYear() ,  mon=d.getMonth() , day=d.getDate();

    if (year!=yyyy || mon!=mm || day!=dd || d>now || year<1940) return false;

    for(var i=0,ret=0;i<17;i++)  ret+=Ai.charAt(i)*Wi[i];    
    Ai+=arrVerifyCode[ret %=11];     

    return pId.length ==18 && pId != Ai?false:true;        
};

//邮箱验证
jQuery.validator.addMethod("chkemail", function(value, element) { 
    var chkemail = /^([a-z0-9\+_\-]+)(\.[a-z0-9\+_\-]+)*@([a-z0-9\-]+\.)+[a-z]{2,6}$/;    
    return this.optional(element) || (chkemail.test(value));     
}, "邮箱错误"); 

//
//数字类型必须为正整数
jQuery.validator.addMethod('intNumber', function(value, element) {
    var isInt = /^\d+$/;
    return this.optional(element) || (isInt.test(value));
}, '必须为正整数');

jQuery.validator.addMethod('notEqualTo', function(value, element) {
    var notEqual = true;
    $('input.notEqualTo').not(element).each(function(){
        if (value == $(this).val()) {
            notEqual = false;
        }
    });
    return this.optional(element) || notEqual;
}, '请输入不同的值');

/**
 * 验证手机号码
 * @param tel
 * @returns {boolean}
 */
function validMobile(tel){
    var reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    return reg.test(tel);
}

/**
 * 验证手机号码或者座机
 */
function validPhone(tel){
    var reg = /^((\d{3,4}-)?\d{7,8})|1[34578]\d{9}$/;
    return reg.test(tel);
}

/**
 * 验证邮政编码
 * @param code
 * @returns {boolean}
 */
function validCode(code)
{
    var reg = /^[1-9][0-9]{5}$/;
    return reg.test(code);
}

/**
 * 匹配金额 金额为2位有效点
 */
function validAmount(amount)
{
    var reg = /^\d+(\.\d{1,2})?$/;
    return reg.test(amount);
} 

/**
 * 验证银行卡号
 */
function validBankCard(bankno){
    if (bankno.length < 16 || bankno.length > 19) {
        //$("#banknoInfo").html("银行卡号长度必须在16到19之间");
        return false;
    }
    var num = /^\d*$/;  //全数字
    if (!num.exec(bankno)) {
        //$("#banknoInfo").html("银行卡号必须全为数字");
        return false;
    }
    //开头6位
    var strBin="10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";    
    if (strBin.indexOf(bankno.substring(0, 2))== -1) {
        //$("#banknoInfo").html("银行卡号开头6位不符合规范");
        return false;
    }
    var lastNum=bankno.substr(bankno.length-1,1);//取出最后一位（与luhm进行比较）

    var first15Num=bankno.substr(0,bankno.length-1);//前15或18位
    var newArr=new Array();
    for(var i=first15Num.length-1;i>-1;i--){    //前15或18位倒序存进数组
        newArr.push(first15Num.substr(i,1));
    }
    var arrJiShu=new Array();  //奇数位*2的积 <9
    var arrJiShu2=new Array(); //奇数位*2的积 >9
    
    var arrOuShu=new Array();  //偶数位数组
    for(var j=0;j<newArr.length;j++){
        if((j+1)%2==1){//奇数位
            if(parseInt(newArr[j])*2<9)
            arrJiShu.push(parseInt(newArr[j])*2);
            else
            arrJiShu2.push(parseInt(newArr[j])*2);
        }
        else //偶数位
        arrOuShu.push(newArr[j]);
    }
    
    var jishu_child1=new Array();//奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2=new Array();//奇数位*2 >9 的分割之后的数组十位数
    for(var h=0;h<arrJiShu2.length;h++){
        jishu_child1.push(parseInt(arrJiShu2[h])%10);
        jishu_child2.push(parseInt(arrJiShu2[h])/10);
    }        
    
    var sumJiShu=0; //奇数位*2 < 9 的数组之和
    var sumOuShu=0; //偶数位数组之和
    var sumJiShuChild1=0; //奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2=0; //奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal=0;
    for(var m=0;m<arrJiShu.length;m++){
        sumJiShu=sumJiShu+parseInt(arrJiShu[m]);
    }
    
    for(var n=0;n<arrOuShu.length;n++){
        sumOuShu=sumOuShu+parseInt(arrOuShu[n]);
    }
    
    for(var p=0;p<jishu_child1.length;p++){
        sumJiShuChild1=sumJiShuChild1+parseInt(jishu_child1[p]);
        sumJiShuChild2=sumJiShuChild2+parseInt(jishu_child2[p]);
    }
    //计算总和
    sumTotal=parseInt(sumJiShu)+parseInt(sumOuShu)+parseInt(sumJiShuChild1)+parseInt(sumJiShuChild2);
    
    //计算Luhm值
    var k= parseInt(sumTotal)%10==0?10:parseInt(sumTotal)%10;        
    var luhm= 10-k;
    
    if(lastNum==luhm){
        // $("#banknoInfo").html("Luhm验证通过");
        return true;
    }
    else{
        // $("#banknoInfo").html("银行卡号必须符合Luhm校验");
        return false;
    }
}
