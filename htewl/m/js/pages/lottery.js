$(document).ready(function(){
    var seconds = 60;
    function countdown(obj) {
        if (seconds == 0) {
            obj.removeClass("disabled");
            obj.text("重发效验码");
            seconds = 60;
        } else {
            obj.addClass("disabled");
            obj.text(seconds+"重新发送");
            seconds--;
            setTimeout(function() {
                countdown(obj);
            },1000);
        }
    }

    /**
     * 抽奖填写手机号码
     */
    var draw = {
        submit:function() {
            $('#participate-form').submit(function(){
                var mobilePhone = $.trim($('input[name=mobilePhone]').val());
                var captcha = $('input[name=captcha]').val();
                if (mobilePhone.length != 11 && (! validMobile(mobilePhone))) {
                    alertMessage('请输入正确的手机号码');
                    return false;
                }
                if (captcha.length != 6) {
                    alertMessage('请填写正确的手机校验码');
                    return false;
                }

                $.ajax({
                    type:'post',
                    async:true,
                    dataType: 'json',
                    url:hostUrl() + 'lottery/participatePost',
                    data:$('form').serialize(),
                    beforeSend:function(){
                        $('button[type=submit]').attr('disabled', true);
                    },
                    success:function(json) {
                        if( !json.status){
                            myalert(json.messages);
                        }else{
                            window.location.href = json.messages;
                        }
                    },
                    complete: function() {
                         $('button[type=submit]').removeAttr('disabled');
                    }
                });
                return false;
            });
        },
        sendSmsCaptcha : function(){
            $('#sms-captcha').click(function(){
                var obj = $(this);
                if( !obj.hasClass('disabled')){
                    var mobilePhone = $('input[name=mobilePhone]').val();
                    if (validMobile(mobilePhone)){
                        $.ajax({
                            type:'post',
                            async:true,
                            dataType:'json',
                            url:hostUrl() + 'validate/ajaxSendSms.html',
                            data:{mobilePhone:mobilePhone},
                            beforeSend:function(){
                                obj.addClass('disabled');
                            },
                            success:function(json){
                                if( !json.status){
                                    myalert(json.messages);
                                }else{
                                    countdown(obj);
                                }
                            }
                        });
                    } else {
                        if ( mobilePhone.length > 0) {
                            alertMessage('手机格式错误');
                        } else {
                            alertMessage('请填写手机号码');
                        }
                    }
                }
            });
        },
        winningList: function() { //中奖名单
            $.ajax({
                type:'get',
                async:true,
                dataType:'json',
                url:hostUrl() + 'lottery/ajaxWinningList.html',
                data:{},
                beforeSend:function(){},
                success:function(json){
                    $('#winningList').html(json.html);
                }
            });
        },
        init:function() {
            if ($('#participate-form').size() > 0) {
                draw.submit();
                draw.sendSmsCaptcha();
            }
            if ($('#participatetest-form').size() > 0) {
                draw.submit();
                draw.sendSmsCaptcha();
            }
            if ($('#winningList').size() > 0) { //转盘抽奖页面
                draw.winningList();
            }
        }
    }
    draw.init();

    /**
     * 领奖验证 填写地址验证
     * @type {{}}
     */
   var prize = {
        provincesChange:function(){
            $('select[name=province_id]').change(function(){
                var parentId = $(this).val();
                if ( parentId > 0 ) {
                    $('input[name=province_name]').val($(this).children('option:selected').text());
                    $.ajax({
                        type : 'post',
                        async:false,
                        dataType:'json',
                        data:{'parentId':parentId,'type':2},
                        url : hostUrl() + 'winners/ajaxRegion',
                        success:function(json){
                            if ( json.status ) {
                                $('select[name=city_id]').html(json.message);
                                $('input[name=city_name]').val(json.citiesName);
                                if ( json.district.length > 0 ) {
                                    $('select[name=district_id]').html(json.district);
                                    $('input[name=district_name]').val(json.districtName);
                                }
                            } else {
                                alertMessage(json.message);
                            }
                        }
                    });
                } else {
                    $('select[name=city_id]').html('<option value="0">城市</option>');
                    $('select[name=district_id]').html('<option value="0">区域</option>');
                }
            });
        },
        citiesChange:function(){
            $('select[name=city_id]').change(function(){
                var parentId = $(this).val();
                if ( parentId > 0 ) {
                    $('input[name=city_name]').val($(this).children('option:selected').text());
                    $.ajax({
                        type : 'post',
                        async:false,
                        dataType:'json',
                        data:{'parentId':parentId,'type':3},
                        url : hostUrl() + 'winners/ajaxRegion',
                        success:function(json){
                            if ( json.status ) {
                                $('select[name=district_id]').html(json.message);
                                $('input[name=district_name]').val(json.districtName);
                            } else {
                                alertMessage(json.message);
                            }
                        }
                    });
                } else {
                    $('select[name=district_id]').html('<option value="0">区域</option>');
                }
            });
        },
        districtChange:function(){
            $('select[name=district_id]').change(function(){
                $('input[name=district_name]').val($(this).children('option:selected').text());
            });
        },
        virtualPrizeSubmit:function(){
            $('#form-accept-virtual-prize').submit(function(){
                var receiver_name = $.trim($('input[name=receiver_name]').val());
                var tel = $.trim($('input[name=tel]').val());
                var sfz = $.trim($('input[name=sfz]').val());

                if ( receiver_name.length == 0 ) {
                    alertMessage('收货人姓名不能为空');
                    return false;
                }
                if ( receiver_name.length < 2 || receiver_name.length > 15 ) {
                    alertMessage('收货人姓名：2-15个字符限制');
                    return false;
                }
                if ( tel.lenght == 0 ) {
                    alertMessage('手机号码不能为空');
                    return false;
                }
                if ( !validMobile(tel) ) {
                    alertMessage('手机号码为11位数字');
                    return false;
                }
                if ( sfz.length == 0 ) {
                    alertMessage('身份证不能为空');
                    return false;
                }

                if (!checkcard(sfz)) {
                    alertMessage('身份证为18位有效的数字');
                    return false;
                }

                if ( province_id <= 0 || province_name.length == 0 ) {
                    alertMessage('省份不能为空');
                    return false;
                }
                $('button[type=submit]').attr('disabled', true);
                return true;
            });
        },
        init:function(){
            if ( $('#form-accept-prize').size() > 0 ) {
                prize.provincesChange();
                prize.citiesChange();
                prize.districtChange();
                prize.prizeSubmit();
            }
            if ( $('#form-accept-virtual-prize').size() > 0 ) {
                prize.virtualPrizeSubmit();
            }
        }
   }
   prize.init();
});