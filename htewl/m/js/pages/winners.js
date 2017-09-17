/**
 * 领奖  虚拟物品  实物
 */
var winners = function() {

    var _state = true; //jquery validate 验证状态位

    var valiMeg = function(msg) {
        if (_state) { //验证时  一次只弹出一个窗口
            _state = false;
            myalert(msg);
            setTimeout(function(){ //一秒后重新点击
                _state = true;
            }, 1000);
        }
    }

    /**
     * 实物表单提交
     */
    var acceptPrizeSubmit = function() {
        $('#accept-prize-modal form').submit(function(e) {
            e.preventDefault();
        }).validate({
            onclick:false,
            onfocusout:false,
            onkeyup:false,
            focusInvalid:false,
            rules: {
                receiver_name: {
                    required : true,
                    rangelength : [2,15]
                },
                tel : {
                    required : true,
                    mobile : true
                },
                district_id : {
                    required :true,
                    digits : true,
                    min : 1
                },
                detailed : {
                    required : true,
                    rangelength : [5,20]
                }
            },
            messages: {
                receiver_name : {
                    required : '收货人姓名不能为空',
                    rangelength : '收货人姓名：2-15个字符限制'
                },
                tel : {
                    required : '手机号码不能为空',
                    mobile : '手机号码为11位数字'
                },
                district_id : {
                    required :'请选择所在区域',
                    digits : '请选择所在区域',
                    min : '请选择所在区域'
                },
                detailed : {
                    required : '详细地址不能为空',
                    rangelength : '详细地址字数必须在5至20之间'
                }
            },
            errorPlacement: function(e, el) {
                valiMeg(e.text());
            },
            submitHandler: function(f) {
                $.ajax({
                    type:'post',
                    async:false,
                    url:hostUrl() + 'winners/acceptPrizePost.html',
                    data:$('#accept-prize-modal form').serialize(),
                    dataType:'json',
                    beforeSend : function (evt, request, settings) {
                        $('#accept-prize-modal form button[type=submit]').attr('disabled', true);
                    },
                    success:function(json){
                        if(json.status){
                            myalert('操作成功');
                            window.location.reload();
                        } else {
                            $('#accept-prize-modal form button[type=submit]').removeAttr('disabled');
                            myalert(json.messages);
                        }
                    }
                });
                return true;
            }
        });
    }

    /**
     * 虚拟奖品提交验证
     */
    var acceptVirtualPrizeSubmit = function() {
        $('#accept-virtual-prize-modal form').submit(function(e) {
            e.preventDefault();
        }).validate({
            onclick:false,
            onfocusout:false,
            onkeyup:false,
            focusInvalid:false,
            rules: {
                receiver_name: {
                    required : true,
                    rangelength : [2,15]
                },
                tel : {
                    required : true,
                    mobile : true
                },
                sfz : {
                    required :true,
                    checkcard : true
                }
            },
            messages: {
                receiver_name : {
                    required : '收货人姓名不能为空',
                    rangelength : '收货人姓名：2-15个字符限制'
                },
                tel : {
                    required : '手机号码不能为空',
                    mobile : '手机号码为11位数字'
                },
                sfz : {
                    required :'身份证号码不能为空',
                    checkcard : '身份证为18位有效的数字'
                }
            },
            debug:true,
            errorPlacement: function(e, el) {
                valiMeg(e.text());
            },
            submitHandler: function(f) {
                $.ajax({
                    type:'post',
                    async:false,
                    url:hostUrl() + 'winners/acceptVirtualPrizePost.html',
                    data:$('#accept-virtual-prize-modal form').serialize(),
                    dataType:'json',
                    beforeSend : function (evt, request, settings) {
                        $('#form-accept-virtual-prize button[type=submit]').attr('disabled', true);
                    },
                    success:function(json){
                        if(json.status){
                            myalert('操作成功');
                            window.location.reload();
                        } else {
                            $('#accept-virtual-prize-modal form button[type=submit]').removeAttr('disabled');
                            myalert(json.messages);
                        }
                    }
                });
                return true;
            }
        });
    }

    /**
     * 弹窗
     * 点击 .accept-prize Class 弹出 实物 #accept-prize-modal  窗口
     * 点击 .accept-prize Class 弹出 虚拟物品 #accept-virtual-prize-modal 窗口
     */
    var fillForm = function(_this) {
        var img = _this.attr('data-img');
        var name = _this.attr('data-name');
        var link = _this.attr('data-link');
        var id = _this.attr('data-id');
        var _modal = false;
        if (_this.hasClass('accept-prize')) {
            _modal = $('#accept-prize-modal'); //实物窗口
        } else if(_this.hasClass('accept-virtual-prize')) {
            _modal = $('#accept-virtual-prize-modal'); //虚拟窗口
        }

        _modal.find('img.prize-image').attr('src', img);
        _modal.find('div.new-text p:nth-child(2)').text(name);
        _modal.find('.new-zanzhushang a').attr('href', link);
        _modal.find('input[name=id]').val(id);
        _modal.modal({'closeViaDimmer':false});
    };

    var refresh = function() {
        $.ajax({
            type:'get',
            async:true,
            dataType:'json',
            url:hostUrl() + 'winners/ajaxWinners.html',
            data:{},
            beforeSend:function(){},
            success:function(json){
                $('#winners-grid').html(json.html);
            }
        });
    }


    return {
        init : function(){
            //点击实物  虚拟物品
            $('#winners-grid').on('click', '.accept-prize,.accept-virtual-prize', function(){
                fillForm($(this));
            });

            /**
             * 实物表单提交
             */
            acceptPrizeSubmit();

            //虚拟物品提交
            acceptVirtualPrizeSubmit();

            $('#winners-grid').on('click', '.bz-currency', function(event) {
                var _id = $(this).attr('data-id');
                var _this = $(this);
                $.ajax({
                    type:'get',
                    async:true,
                    dataType:'json',
                    url:hostUrl() + 'winners/bzCurrency.html',
                    data:{id:_id},
                    beforeSend:function(){},
                    success:function(json){
                        if (json.status) {
                            sessionStorage.winnerLinks = hostUrl() + 'winners/detail/' + _id + '.html';
                            window.location.reload();
                        }
                    }
                });
                return false;
            });

            /**
             * 刷新
             */
            // refresh();

            //现场领奖 领取贝竹金币
            $('#winners-grid').on('click', 'a.special-prize', function(){
                var img = $(this).attr('data-img');
                var name = $(this).attr('data-name');
                var link = $(this).attr('data-link');
                var id = $(this).attr('data-id');
                var status = $(this).attr('data-status');
                var state = $(this).attr('data-state');
                $('#winners-detail-modal .am-modal-hd a.linkto').attr('href', link);
                $('#winners-detail-modal .lottery-pic img').attr('src', img);
                $('#winners-detail-modal .am-modal-bd p:nth-child(2)').text(name);
                $('#winners-detail-modal .am-modal-fd p:nth-child(1)').text(status);
                $('#winners-detail-modal .winners-detail-close').attr('data-id', id);
                $('#winners-detail-modal .winners-detail-close').attr('data-state', state);
                $('#winners-detail-modal').modal({closeViaDimmer: 0});
                return false;
            });

            //确认领奖
            $('#winners-detail-modal .winners-detail-close').on('click', function() {
                var _id = $(this).attr('data-id');
                var _status = $(this).attr('data-state');
                var _this = $(this);
                if ( !_this.hasClass('disabled') && _status == 1) {
                    _this.addClass('disabled');
                    $.ajax({
                        type:'get',
                        async:true,
                        url:hostUrl() + 'winners/ajaxAwards.html',
                        data:{id: _id},
                        dataType:'json',
                        beforeSend : function (evt, request, settings) {},
                        success:function(json){
                            if(json.status){
                                myalert(json.messages);
                                window.location.reload();
                            } else {
                                _this.removeClass('disabled');
                                myalert(json.messages);
                            }
                        }
                    });
                }
                $('#winners-detail-modal').modal('close');
                return false;
            });

            /**
             * 添加历史记录 跳转
             */
            setTimeout(function() {
                if (sessionStorage.winnerLinks) {
                    history.pushState({}, "", window.location.href);
                    var _url = sessionStorage.winnerLinks;
                    sessionStorage.removeItem("winnerLinks");
                    window.location.replace(_url);
                }
            }, 500);
        }
    };
}();

jQuery(function(){ winners.init(); });