/**
 * 获取host域名
 * @returns
 */
function hostUrl() {
    return location.protocol + '//' + location.host + '/home/';
}

function alertMessage(msg) {
    if ($('#timing-msg').size() == 0) {
        var tag = '<div class="am-modal am-modal-no-btn pahod-alert am-modal-active" tabindex="-1" id="timing-msg">' + msg + '</div>';
        $('body').append(tag);
    }
    setTimeout(function () {
        $('#timing-msg').remove();
    }, 2000);
}

function myalert(msg) {
    $('#my-alert').remove();
    var confirm = arguments[1] ? arguments[1] : '知道了';
    var tag = '<div class="alert-explain am-modal" tabindex="-1" id="my-alert"><p>' + msg + '</p><div class="am-modal-footer"><span class="am-modal-btn">' + confirm + '</span></div></div>';
    $('body').append(tag);
    $('#my-alert').modal({'closeViaDimmer': false});
}

/**
 * 返回历史记录上一页，如果没有则指定返回页面
 * @param redirect 指定返回页面
 */
function goHistoryBack(redirect) {
    if (history.length > 1) {
        javascript:history.go(-1);
    } else {
        if (!redirect) {
            redirect = hostUrl() + 'ucenter/index.html';
        }
        window.location.href = redirect;
    }
}

$(document).ready(function () {
    //lazyload
    $('img.lazy').lazyload({skip_invisible: false});

    $('#recomment-share').on('click', '.promote-praise', function (event) {
        var $this = $(this);
        var id = $this.attr('data-id');
        var qty = parseInt($this.find('span').text());
        if (!$(this).hasClass('active') && id) {
            $.ajax({
                type: 'post',
                async: true,
                dataType: 'json',
                url: hostUrl() + 'promote/ajaxPraise',
                data: {id: id, qty: qty},
                success: function (data) {
                    if (data.status) {
                        $this.addClass('active').find('span').text(data.messages);
                    } else {
                        alert(data.messages);
                    }
                }
            });
        }
        event.preventDefault();
    });


    //地址定位
    function geolocationCity(hands) {
        var geolocation = new jQuery.AMUI.Geolocation({
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 60000
        });

        geolocation.get().then(function (position) {
            var coords = position.coords.latitude + ',' + position.coords.longitude;
            if (coords) {
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    url: hostUrl() + 'home/ajaxCurrentCity',
                    data: {
                        location: coords, //经度，纬度，例如：39.983424,116.322987
                        coordtype: 'wgs84ll',
                        output: 'json',
                        pois: 0
                    },
                    success: function (json) {
                        if (hands) {//手动定位
                            $('#position-city').text(json.messages);
                            if ($('.freeTravalCity').size() > 0) {
                                $('.city-page').hide();
                                $('.main-page').show();
                                $('.Head-cont-center span').text(json.messages);
                                $('.freeTravel-page .city').attr('data-city-name', json.messages);
                                $('.freeTravel-nav li.am-active').trigger('click');
                            }
                        } else {
                            if (json.messages) {
                                if (confirm('当前定位城市为：' + json.messages + '，是否切换？')) {
                                    window.location.href = window.location.href;
                                }
                            }
                        }
                    }
                });

                if (geolocation.watchID) {
                    geolocation.clearWatch();
                }
            }
        }, function (error) {
            $('#position-city').text('定位失败');
            console.log(error);
        });
    }

    //地址定位
    var cookie = $.AMUI.utils.cookie;
    if (!cookie.get('city')) {
        geolocationCity();
    }
    //手动定位
    $('#goto-position').click(function (e) {
        $('#position-city').text('定位中...');
        var city = geolocationCity(true);
        e.stopPropagation();
    });

    $('#recomment-share').on('click', '.share-left', function (e) {
        $('.recom-alert').modal();
        var link = $(this).attr('data-link');
        var name = $(this).attr('data-name');
        var img = $(this).attr('data-img');
        $('.am-modal-actions li a').attr('href', link).attr('data-name', name).attr('data-img', img);
    });

    $('.am-modal-actions').on('click', '.qq', function (event) {
        var _width = 320;
        var _height = 640;
        var _top = 10;
        var _left = 10;
        var _shareUrl = 'http://connect.qq.com/widget/shareqq/index.html?';
        _shareUrl += 'url=' + encodeURIComponent($(this).attr('href'));
        _shareUrl += '&title=' + encodeURIComponent($(this).attr('data-name'));
        _shareUrl += '&desc=' + encodeURIComponent('分享的描述');
        window.open(_shareUrl, '_blank', 'width=' + _width + ',height=' + _height + ',top=' + _top + ',left=' + _left + ',toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0');
        event.preventDefault();
    });

    $('.am-modal-actions').on('click', '.weibo', function (event) {
        var _shareUrl = '';
        var _width = 320;
        var _height = 640;
        _shareUrl += 'http://v.t.sina.com.cn/share/share.php?&appkey=895033136';     //真实的appkey ，必选参数
        _shareUrl += '&url=' + encodeURIComponent($(this).attr('href'));     //参数url设置分享的内容链接|默认当前页location，可选参数
        _shareUrl += '&title=' + encodeURIComponent($(this).attr('data-name'));    //参数title设置分享的标题|默认当前页标题，可选参数
        _shareUrl += '&source=' + encodeURIComponent('');
        _shareUrl += '&sourceUrl=' + encodeURIComponent('');
        _shareUrl += '&content=' + 'utf-8';   //参数content设置页面编码gb2312|utf-8，可选参数
        _shareUrl += '&pic=' + encodeURIComponent($(this).attr('data-img'));  //参数pic设置图片链接|默认为空，可选参数
        window.open(_shareUrl, '_blank', 'toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0,' + 'width=' + _width + ',height=' + _height + ',top=' + (screen.height - _height) / 2 + ',left=' + (screen.width - _width) / 2);
        event.preventDefault();
    });

    $('.am-modal-actions').on('click', '.tecent-weibo', function (event) {
        event.preventDefault();
        var _width = 320;
        var _height = 640;
        var _top = 10;
        var _left = 10;
        var _shareUrl = 'http://v.t.qq.com/share/share.php?';
        _shareUrl += 'title=' + encodeURIComponent($(this).attr('data-name'));    //分享的标题
        _shareUrl += '&url=' + encodeURIComponent($(this).attr('href'));    //分享的链接
        _shareUrl += '&appkey=5bd32d6f1dff4725ba40338b233ff155';    //在腾迅微博平台创建应用获取微博AppKey
        _shareUrl += '&site=' + encodeURIComponent('');   //分享来源
        _shareUrl += '&pic=' + encodeURIComponent($(this).attr('data-img'));    //分享的图片，如果是多张图片，则定义var _pic='图片url1|图片url2|图片url3....'
        window.open(_shareUrl, '_blank', 'width=' + _width + ',height=' + _height + ',left=' + _left + ',top=' + _top + ',toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0');
        event.preventDefault();
    });

    $('.am-modal-actions').on('click', '.qq-zone', function (event) {
        event.preventDefault();
        var _width = 320;
        var _height = 640;
        var _top = 10;
        var _left = 10;
        var _shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?';
        _shareUrl += 'url=' + encodeURIComponent($(this).attr('href'));   //参数url设置分享的内容链接|默认当前页location
        _shareUrl += '&showcount=' + 0;      //参数showcount是否显示分享总数,显示：'1'，不显示：'0'，默认不显示
        _shareUrl += '&desc=' + encodeURIComponent('分享的描述');    //参数desc设置分享的描述，可选参数
        _shareUrl += '&summary=' + encodeURIComponent('分享摘要');    //参数summary设置分享摘要，可选参数
        _shareUrl += '&title=' + encodeURIComponent($(this).attr('data-name'));    //参数title设置分享标题，可选参数
        _shareUrl += '&site=' + encodeURIComponent('');   //参数site设置分享来源，可选参数
        _shareUrl += '&pics=' + encodeURIComponent($(this).attr('data-img'));   //参数pics设置分享图片的路径，多张图片以＂|＂隔开，可选参数
        window.open(_shareUrl, '_blank', 'width=' + _width + ',height=' + _height + ',top=' + _top + ',left=' + _left + ',toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0');
        event.preventDefault();
    });

    /**
     * 投票活动
     * @type {{optionChange: Function, submit: Function, init: Function}}
     */
    var vote = {
        singleSelection: function () {
            $('.vote-label').on('click', '.vote-single-selection', function (event) {
                if ($(this).children('.vote-frame').hasClass('active')) {
                    $(this).children('.vote-frame').removeClass('active');
                } else {
                    $(this).parents('dd').siblings().find('.vote-frame').removeClass('active');
                    $(this).children('.vote-frame').addClass('active');
                }
                event.stopPropagation();
            });
        },
        multiSelect: function () {
            $('.vote-label').on('click', '.vote-multi-select', function (event) {
                if ($(this).children('.vote-frame').hasClass('active')) {
                    $(this).children('.vote-frame').removeClass('active');
                } else {
                    $(this).children('.vote-frame').addClass('active');
                }
                event.stopPropagation();
            });
        },
        submit: function () {
            $('#vote-form').submit(function () {
                var state = true;
                var option_id = '';
                $('.vote-label').each(function () {
                    if (!$(this).find('.vote-frame').hasClass('active')) {
                        state = false;
                    }
                });
                $('.vote-frame.active').each(function () {
                    option_id += $(this).children('input[type=checkbox]').val() + ',';
                });

                if (!state) {
                    alertMessage('每个分类必须选一个');
                    return false;
                }
                $('input[name=option_id]').val(option_id);
                $('button[type=submit]').attr('disabled', true);
                return true;
            });
        },
        init: function () {
            if ($('#vote-form').size() > 0) {
                vote.singleSelection();
                vote.multiSelect();
                vote.submit();
            }
        }
    }
    vote.init();

    /**
     * 用户基本信息
     */
    var baseInfo = {
        modifyAlias: function () {
            $('#alias-save').click(function () {
                var name = $('input[name=alias_name]').val();
                if (name.length < 2 || name.length > 20) {
                    alertMessage('请输入呢称,呢称字数为2到20位');
                    return false;
                }
                $(this).attr('disabled');
                $.ajax({
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    data: {alias: name},
                    url: hostUrl() + 'ucenter/modifyAliasPost',
                    success: function (data) {
                        alertMessage(data.messages);
                        if (data.status) {
                            window.location.href = hostUrl() + 'ucenter/baseInfoSet.html';
                        } else {
                            $(this).removeAttr('disabled');
                        }
                    }
                });
            });
        },
        init: function () {
            if ($('#modify-alias-form').size() > 0) {
                baseInfo.modifyAlias();
            }
        }
    }
    baseInfo.init();

    /**
     * 常用联系人
     */
    var passenger = {
        submit: function () {
            $('form').submit(function () {
                var name = $.trim($('input[name=visitor_name]').val());
                var sfz = $.trim($('input[name=pin]').val());
                var mobilePhone = $('input[name=mobile_phone]').val();
                var type = $('input[name=type]').val();
                var sex = $('input[name=sex]').val();

                if (name.length < 2) {
                    myalert('请与证件姓名一致');
                    return false;
                }
                console.log(sex);
                console.log(parseInt(sex));
                if (isNaN(sex) || parseInt(sex) <= 0) {
                    myalert('请选择性别');
                    return false;
                }

                if (isNaN(type) || parseInt(type) <= 0) {
                    myalert('证件类型');
                    return false;
                }

                var chinese = /^[\u4e00-\u9fa5]{2,5}$/;
                if (!chinese.test(name)) {
                    myalert('请填写正确的中文姓名');
                    return false;
                }

                if (!validateIdCard(sfz)) {
                    myalert('请输入正确的身份证号码');
                    return false;
                }

                if (!validMobile(mobilePhone)) {
                    myalert('请输入正确的手机号码');
                    return false;
                }
                $('submit').attr('disabled');
                return true;
            });
        },
        deletePassenger: function () {
            $('#passenger-remove').click(function () {
                var id = $(this).attr('data-id');
                $('#my-confirm').modal({
                    relatedTarget: this,
                    onConfirm: function (options) {
                        $('#passenger-remove').attr('disabled');
                        window.location.href = hostUrl() + 'passenger/passengerInfoDelete/' + id;
                    },
                    onCancel: function () {
                        //取消
                    }
                });
            });
        },
        selectType: function () {
            $('#passenger-sex').on('click', '.sex-ul li', function (event) {
                var text = $(this).text();
                $('#sex').text(text);
                $('#passenger-sex').modal('close');
                $('input[name=sex]').val($(this).attr('data-type'));
                event.stopPropagation();
            });
            $('#passenger-type').on('click', '.sex-ul li', function (event) {
                var text = $(this).text();
                $('#pin-type').text(text);
                $('#passenger-type').modal('close');
                $('input[name=type]').val($(this).attr('data-type'));
                event.stopPropagation();
            });
        },
        init: function () {
            if ($('#form-passenger').size() > 0) {
                passenger.submit();
            }

            if ($('#passenger-remove').size() > 0) {
                passenger.deletePassenger();
            }
            if ($('#passenger-sex').size() > 0) {
                passenger.selectType();
            }
        }
    }
    passenger.init();

    /**
     * 常用地址
     */
    var address = {
        submit: function () {
            $('#address-form').submit(function () {
                var receiver_name = $.trim($('input[name=receiver_name]').val());
                var mobilePhone = $('input[name=tel]').val();
                var code = $('input[name=code]').val();
                var detailed = $.trim($('textarea[name=detailed]').val());
                var districtId = $('input[name=district_id]').val();
                if (receiver_name.length == 0) {
                    myalert('请填写收件人姓名');
                    return false;
                }

                if (receiver_name.length < 2) {
                    myalert('收件人姓名不可少于2个汉字');
                    return false;
                }

                if (mobilePhone.length == 0) {
                    myalert('请填写手机号码');
                    return false;
                }

                if (!validMobile(mobilePhone)) {
                    myalert('请填写正确的手机号码');
                    return false;
                }

                if (code.length == 5) {
                    myalert('请填写邮政编码');
                    return false;
                }

                if (!validCode(code)) {
                    myalert('请填写正确的邮政编码');
                    return false;
                }

                if (isNaN(districtId) || districtId <= 0) {
                    myalert('请选择所在区域');
                    return false;
                }

                if (detailed.length == 0) {
                    myalert('详细地址不能为空');
                    return false;
                }

                if (5 > detailed.length || 60 < detailed.length) {
                    myalert('详细地址字数必须在5至60之间');
                    return false;
                }
                $('submit').attr('disabled');
                return true;
            })
        },
        deleteAddress: function () {
            $('#delete-address').click(function () {
                var id = $(this).attr('data-id');
                $('#my-confirm').modal({
                    relatedTarget: this,
                    onConfirm: function (options) {
                        $('#delete-address').attr('disabled');
                        window.location.href = hostUrl() + 'address/addressInfoDelete/' + id;
                    },
                    onCancel: function () {
                        //取消
                    }
                });
            });
        },
        init: function () {
            if ($('#address-form').size() > 0) {
                address.submit();
                address.deleteAddress();
            }
        }
    }
    address.init();

    /**
     * 充值
     */
    var deposit = {
        page: 1,
        type: 0,
        ajaxRecord: function () {
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: true,
                data: {page: deposit.page, type: deposit.type},
                url: hostUrl() + 'account/ajaxRecord',
                success: function (data) {
                    if (data.possess) {
                        if (!$('#page-empty').hasClass('am-hide')) {
                            $('#page-empty').addClass('am-hide');
                        }

                        if ($('#deposit-record-list').hasClass('am-hide')) {
                            $('#deposit-record-list').removeClass('am-hide');
                        }

                        if (data.status) {
                            $('#load-more').removeClass('am-hide');
                            $('.no-more').addClass('am-hide');
                        } else {
                            $('#load-more').addClass('am-hide');
                            $('.no-more').removeClass('am-hide');
                        }
                        deposit.page++;
                        if (deposit.page == 1) {
                            $('#deposit-record-list').html(data.html);
                        } else {
                            $('#deposit-record-list').append(data.html);
                        }
                    } else {
                        $('#page-empty').removeClass('am-hide');
                        $('#deposit-record-list').addClass('am-hide');
                        $('#load-more').addClass('am-hide');
                        $('.no-more').addClass('am-hide');
                    }

                }
            });
        },
        recordList: function () {
            /* if ( $('.down-pull').size() > 0 ) {
             var IScroll = $.AMUI.iScroll;
             var myScroll = new IScroll('#wrapper', { mouseWheel: true });
             } */
            $('.down-iscoll').on('click', 'ul li', function () {
                if (!$(this).hasClass('active')) {
                    deposit.page = 0;
                    deposit.type = $(this).attr('data-type');
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    $('#amount-type').modal('close');
                    deposit.ajaxRecord();
                }
            });
            $('#load-more').scrollspy({
                animation: 'fade',
                delay: 500
            });
            $('#load-more').on('inview.scrollspy.amui', function () {
                deposit.ajaxRecord();
            });
        },
        selectDeposit: function () {
            $('.bank-choose ul li').click(function () {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                $('#bank-list').modal('close');
                $('#bank-img').attr('src', $(this).children('img').attr('src'));
                $('#bank-name').text($(this).children('p').text());
                $('input[name=pay_bank]').val($(this).attr('data-deposit-method'));
            });
        },
        submit: function () {
            $('#form-deposit').submit(function () {
                var amount = $.trim($('input[name=amount]').val());
                var bank_id = $.trim($('input[name=pay_bank]').val());
                if (isNaN(amount) || amount <= 0 || !validAmount(amount)) {
                    myalert('输入金额错误,金额只能有2位小数的有效数字');
                    return false;
                }

                if (parseFloat(amount) >= 1000000) {
                    myalert('充值金额超出规定范围');
                    return false;
                }

                if (isNaN(bank_id) || bank_id <= 0) {
                    myalert('请选择支付方式');
                    return false;
                }
                $('submit').attr('disabled');
                return true;
            });
        },
        init: function () {
            if ($('#form-deposit').size() > 0) {
                deposit.submit();
                if ($('#bank-list').size() > 0) {
                    deposit.selectDeposit();//选择充值方式
                }
            }
            if ($('#amount-type').size() > 0) {
                deposit.recordList();
            }
        }
    }
    deposit.init();

    /**
     * 提现
     */
    var withdraw = {
        page: 1,
        validateAmount: function () {
            $('#withdraw-button').click(function () {
                var amount = $.trim($('input[name=amount]').val());
                var quote = $('#amount-quote').text();
                if (isNaN(amount) || amount <= 0 || !validAmount(amount)) {
                    myalert('输入金额错误,金额只能有2位小数的有效数字');
                    return false;
                }

                if (amount > parseFloat(quote)) {
                    myalert('提现金额超出限额');
                    return false;
                }

                $('input[name=payment_password]').val('');
                $('#payment-password').modal('open');
            });
        },
        selectBnakCard: function () {
            $('.bank-choose ul li').click(function () {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                $('#bank-list').modal('close');
                $('#bank-img').attr('src', $(this).children('img').attr('src'));
                $('#bank-name').text($(this).attr('data-bank-name'));
                $('#tail-number').text($(this).attr('data-bank-number'));
                $('input[name=user_bank_id]').val($(this).attr('data-bank-id'));
            });
        },
        validatePaymentPassword: function () {
            $('#payment-password-button').click(function () {
                $('#payment-password').modal('close');
                var paymentPassword = $('input[name=payment_password]').val();
                if (paymentPassword) {
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        async: false,
                        data: $('form').serialize(),
                        url: hostUrl() + 'account/ajaxWithdrawPost',
                        befordSend: function () {
                        },
                        success: function (json) {
                            if (json.status) {
                                alertMessage('提现申请成功');
                                window.location.href = json.messages;
                            } else {
                                myalert(json.messages);
                            }
                        }
                    });
                } else {
                    myalert('请输入支付密码');
                }
            });
        },
        withdrawRecord: function () {
            $('#load-more').scrollspy({
                animation: 'fade',
                delay: 500
            });
            $('#load-more').on('inview.scrollspy.amui', function () {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    async: true,
                    data: {page: withdraw.page},
                    url: hostUrl() + 'account/ajaxWithdrawRecord',
                    success: function (data) {
                        if (data.status) {
                            withdraw.page++;
                        } else {
                            $('#load-more').remove();
                            $('.widthMax').append('<div class="no-more">没有更多了</div>');
                        }
                        $('#withdraw-record-list').append(data.html);
                    }
                });
            });
        },
        init: function () {

            if ($('#withdraw-form').size() > 0) {
                withdraw.validateAmount();
                withdraw.validatePaymentPassword();
                withdraw.selectBnakCard();
            }

            if ($('#withdraw-record-list').size() > 0) {
                withdraw.withdrawRecord();
            }
        }
    }
    withdraw.init();


    /**
     * 退款
     */
    var refund = {
        page: 1,
        state: 1, //1,退款。2，换货
        common: function () {
            $('#load-more').scrollspy({
                animation: 'fade',
                delay: 500
            });
        },
        sceneryRefundList: function () {
            $('#load-more').on('inview.scrollspy.amui', function () {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    async: true,
                    data: {page: refund.page},
                    url: hostUrl() + 'refund/ajaxSceneryRefundList',
                    success: function (data) {
                        $('#scenery-refund-list').append(data.html);
                        if (data.status) {
                            refund.page++;
                        } else {
                            $('#load-more').remove();
                            $('.lert-title').append('<div class="no-more">没有更多了</div>');
                        }
                    }
                });
            });
        },
        lineRefundList: function () {
            $('#load-more').on('inview.scrollspy.amui', function () {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    async: true,
                    data: {page: refund.page},
                    url: hostUrl() + 'refund/ajaxLineRefundList',
                    success: function (data) {
                        $('#line-refund-list').append(data.html);
                        if (data.status) {
                            refund.page++;
                        } else {
                            $('#load-more').remove();
                            $('.lert-title').append('<div class="no-more">没有更多了</div>');
                        }
                    }
                });
            });
        },
        ajaxTourism: function () {
            var url = refund.state == 1 ? 'refund/ajaxTourismRefund' : 'refund/ajaxTourismBarter';
            $.ajax({
                type: 'post',
                dataType: 'json',
                async: false,
                data: {page: refund.page},
                url: hostUrl() + url,
                success: function (data) {
                    $('#tourism-refund-list').append(data.html);
                    if (data.status) {
                        refund.page++;
                    } else {
                        $('#load-more').hide();
                        $('.no-more').show();
                    }
                }
            });
        },
        tourismRefundList: function () {
            $('#load-more').on('inview.scrollspy.amui', function () {
                refund.ajaxTourism();
            });

            /**
             * 退 换货切换
             */
            $('#return-switch').click(function () {
                var url = refund.state == 1 ? 'refund/ajaxTourismBarter' : 'refund/ajaxTourismRefund';
                var obj = $(this).children('img');
                refund.page = 0;
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    data: {page: 0},
                    url: hostUrl() + url,
                    success: function (data) {
                        if (data.possess) {
                            if (!$('#page-empty').hasClass('am-hide')) {
                                $('#page-empty').addClass('am-hide');
                            }
                            $('#tourism-refund-list').removeClass('am-hide');
                            $('#tourism-refund-list').html(data.html);
                            if (data.status) {
                                $('#load-more').removeClass('am-hide');
                                $('.no-more').addClass('am-hide');
                            } else {
                                $('#load-more').addClass('am-hide');
                                $('.no-more').removeClass('am-hide');
                            }
                        } else {
                            $('#page-empty').removeClass('am-hide');
                            $('#tourism-refund-list').addClass('am-hide');
                            $('#load-more').addClass('am-hide');
                            $('.no-more').addClass('am-hide');
                        }
                        refund.state = (refund.state == 1) ? 2 : 1;
                        var img = (refund.state == 1) ? '/wap/home/images/refund.png' : '/wap/home/images/barter.png';
                        obj.attr('src', img);
                        refund.page++;
                    }
                });
            });
        },
        init: function () {
            /**
             * 景区退款 商品退款
             */
            if ($('#scenery-refund-list').size() > 0) {
                refund.common();
                refund.sceneryRefundList();
            } else if ($('#return-switch').size() > 0) {
                refund.common();
                refund.tourismRefundList();
            } else if ($('#line-refund-list').size() > 0) {
                refund.common();
                refund.lineRefundList();
            }
        }
    }
    refund.init();

    /**
     * 收藏夹
     */
    var collection = {
        page: 1,
        common: function () {
            $('#load-more').scrollspy({
                animation: 'fade',
                delay: 500
            });
            /**
             * 编辑 完成
             */
            $('.add-submit').on('click', '.lert-submit', function (event) {
                $(this).hide().siblings().css("display", "block");
                $('.lert-ul').next().addClass('active');
                $('.lert-delete').show();
                event.stopPropagation();
            });
            $('.add-submit').on('click', '.lert-ok', function (event) {
                $(this).hide().siblings().css("display", "block");
                $('.lert-ul').next().removeClass('active');
                $('.lert-delete').hide();
                $('.lert-play dd').removeClass('active');
                event.stopPropagation();
            });
            $('.lert-title').on('click', '.lert-play dd,.hotelList-list li', function (event) {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                } else {
                    $(this).addClass('active');
                }
                event.stopPropagation();
            });
        },
        sceneryCollectionList: function () {
            $('#load-more').on('inview.scrollspy.amui', function () {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    async: true,
                    data: {page: collection.page},
                    url: hostUrl() + 'collection/ajaxSceneryCollection',
                    success: function (data) {
                        if (data.status) {
                            collection.page++;
                        } else {
                            $('#load-more').remove();
                            $('.lert-title').append('<div class="no-more">没有更多了</div>');
                        }
                        $('#scenery-collection-list').append(data.html);
                    }
                });
            });
        },
        sceneryDelete: function () {//删除景区收藏夹
            $('body').on('click', '.lert-delete', function (event) {
                var ids = '';
                $('#scenery-collection-list dd').each(function (i) {
                    if ($(this).hasClass('active')) {
                        ids += $(this).attr('data-id') + ',';
                    }
                });
                if (ids) {
                    $('#my-confirm').modal({
                        relatedTarget: this,
                        onConfirm: function (options) {
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                async: true,
                                data: {id: ids},
                                url: hostUrl() + 'collection/ajaxSceneryDelete',
                                success: function (data) {
                                    if (data.status) {
                                        window.location.href = data.url;
                                    } else {
                                        myalert('删除失败,请刷新从新访问！');
                                    }
                                }
                            });
                        },
                        onCancel: function () {
                            //取消
                        }
                    });
                }
                event.stopPropagation();
            });
        },
        tourismCollectionList: function () {
            $('#load-more').on('inview.scrollspy.amui', function () {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    async: true,
                    data: {page: collection.page},
                    url: hostUrl() + 'collection/ajaxTourismCollection',
                    success: function (data) {
                        if (data.status) {
                            collection.page++;
                        } else {
                            $('#load-more').remove();
                            $('.lert-title').append('<div class="no-more">没有更多了</div>');
                        }
                        $('#tourism-collection-list').append(data.html);
                    }
                });
            });
        },
        tourismDelete: function () {//删除商品收藏夹
            $('body').on('click', '.lert-delete', function (event) {
                var ids = '';
                $('#tourism-collection-list dd').each(function (i) {
                    if ($(this).hasClass('active')) {
                        ids += $(this).attr('data-id') + ',';
                    }
                });
                if (ids) {
                    $('#my-confirm').modal({
                        relatedTarget: this,
                        onConfirm: function (options) {
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                async: true,
                                data: {id: ids},
                                url: hostUrl() + 'collection/ajaxTourismDelete',
                                success: function (data) {
                                    if (data.status) {
                                        window.location.href = data.url;
                                    } else {
                                        myalert('删除失败,请刷新从新访问！');
                                    }
                                }
                            });
                        },
                        onCancel: function () {
                            //取消
                        }
                    });
                }
                event.stopPropagation();
            });
        },
        // 酒店收藏分页
        hotelCollectionList: function () {
            $('#load-more').on('inview.scrollspy.amui', function () {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    async: true,
                    data: {page: collection.page},
                    url: hostUrl() + 'collection/ajaxHotelCollection',
                    success: function (data) {
                        if (data.status) {
                            collection.page++;
                        } else {
                            $('#load-more').remove();
                            $('.lert-title').append('<div class="no-more">没有更多了</div>');
                        }
                        $('#hotel-collection-list').append(data.html);
                    }
                });
            });
        },
        'hotelDelete': function () {
            var hotel_ids = '';
            $('body').on('click', '.lert-delete', function (event) {
                var ids = '';
                $('#hotel-collection-list li').each(function (i) {
                    if ($(this).hasClass('active')) {
                        ids += $(this).attr('data-id') + ',';
                    }
                });
                hotel_ids = ids;
                if (hotel_ids) {
                    $('#my-confirm').modal({
                        relatedTarget: this,
                        onConfirm: function (options) {
                            $.ajax({
                                type: 'post',
                                dataType: 'json',
                                async: true,
                                data: {id: hotel_ids},
                                url: hostUrl() + 'collection/ajaxHotelDelete',
                                success: function (data) {
                                    if (data.status) {
                                        window.location.href = data.url;
                                    } else {
                                        myalert('删除失败,请刷新从新访问！');
                                    }
                                }
                            });
                        },
                        onCancel: function () {
                            //取消
                        }
                    });
                }
                event.stopPropagation();
            });
        },
        init: function () {
            if ($('#scenery-collection-list').size() > 0) {
                collection.common();
                collection.sceneryCollectionList();
                collection.sceneryDelete();
            }
            if ($('#tourism-collection-list').size() > 0) {
                collection.common();
                collection.tourismCollectionList();
                collection.tourismDelete();
            }
            if ($('#hotel-collection-list').size() > 0) {
                collection.common();
                collection.hotelCollectionList();
                collection.hotelDelete();
            }
        }
    }
    collection.init();

    /**
     * 绑定银行卡
     */
    var bankCard = {
        common: function () {
            $('.bank-choose').on('click', 'ul li', function () {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active');
                    $(this).siblings().removeClass('active');
                    $('#bank-img').attr('src', $(this).children('img').attr('src'));
                    $('#bank-name').text($(this).attr('data-bank-name'));
                    $('input[name=bank_id]').val($(this).attr('data-bank-id'));
                    $('#bank-list').modal('close');
                }
            });
        },
        bindBank: function () {
            $('#bind-bank-card-form').on('click', '#submit', function () {
                var bankId = $('input[name=bank_id]').val();
                var bankCard = $('input[name=bank_card]').val();
                var cardholder = $('input[name=cardholder]').val();
                var pin = $('input[name=pin]').val();
                var mobile_phone = $('input[name=mobile_phone]').val();
                var captcha = $('input[name=captcha]').val();
                if (bankId < 0) {
                    myalert('请选择银行卡类型');
                    return false;
                }

                if (!validBankCard(bankCard)) {
                    myalert('请填写正确的银行卡号');
                    return false;
                }

                if (cardholder.length < 2) {
                    myalert('请与持卡人姓名一致');
                    return false;
                }

                var chinese = /^[\u4e00-\u9fa5]{2,5}$/;
                if (!chinese.test(cardholder)) {
                    myalert('请填写正确的持卡人姓名，2个以上汉字');
                    return false;
                }

                if (!validateIdCard(pin)) {
                    myalert('请输入正确的身份证号码');
                    return false;
                }

                if (!validMobile(mobile_phone)) {
                    myalert('请输入正确的手机号码');
                    return false;
                }

                if (captcha.length != 6) {
                    myalert('请输入6位数的短信效验码');
                    return false;
                }
                $.ajax({
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    url: hostUrl() + 'card/bindBankCardPost',
                    data: $('form').serialize(),
                    beforeSend: function () {
                    },
                    success: function (json) {
                        if (json.status) {
                            myalert(json.messages);
                            window.location.href = hostUrl() + 'card/bankCard.html';
                        } else {
                            myalert(json.messages);
                        }
                    }
                });
            });
        },
        sendSmsCaptcha: function () {
            $('#sms-captcha').click(function () {
                var obj = $(this);
                if (!obj.hasClass('disabled')) {
                    var mobilePhone = $('input[name=mobile_phone]').val();
                    if (validMobile(mobilePhone)) {
                        $.ajax({
                            type: 'post',
                            async: false,
                            dataType: 'json',
                            url: hostUrl() + 'card/ajaxSendSms.html',
                            data: {mobilePhone: mobilePhone},
                            beforeSend: function () {
                            },
                            success: function (json) {
                                if (!json.status) {
                                    myalert(json.messages);
                                } else {
                                    safetycenter.setTime(obj);
                                }
                            }
                        });
                    } else {
                        if (mobilePhone.length > 0) {
                            myalert('手机格式错误');
                        } else {
                            myalert('请填写手机号码');
                        }
                    }
                }
            });
        },
        setTime: function (obj) {
            if (safetycenter.timespan == 0) {
                obj.removeClass("disabled");
                obj.text("重发效验码");
                safetycenter.timespan = 60;
            } else {
                obj.addClass("disabled");
                obj.text(safetycenter.timespan + "重新发送");
                safetycenter.timespan--;
                setTimeout(function () {
                    safetycenter.setTime(obj);
                }, 1000);
            }
        },
        deleteCard: function () {
            $('#bank-remove').click(function () {
                var id = $(this).attr('data-id');
                $('#my-confirm').modal({
                    relatedTarget: this,
                    onConfirm: function (options) {
                        window.location.href = hostUrl() + 'card/deleteBankCard/' + id;
                    },
                    onCancel: function () {
                        //取消
                    }
                });
            });
        },
        init: function () {
            if ($('#bind-bank-card-form').size() > 0) {
                bankCard.common();
                bankCard.bindBank();
                bankCard.sendSmsCaptcha();
            }

            if ($('#my-confirm').size() > 0) {
                bankCard.deleteCard();
            }
        }
    }
    bankCard.init();

    /**
     * 支付密码
     */
    var safetycenter = {
        timespan: 60,
        modifyPaymentPass: function () { //ajax提交密码
            $('#modify-payment-pass-form').on('click', '#submit', function () {
                var password = $('input[name=password]').val();
                var confirmPassword = $('input[name=confirmPassword]').val();
                var obj = $(this);
                if (password.length < 6 || password.length > 20) {
                    alertMessage('支付密码字数必须在6至20之间！');
                    return false;
                }
                if (password != confirmPassword) {
                    alertMessage('2次输入的密码不一致！');
                    return false;
                }
                obj.attr('disabled', true);
                $.ajax({
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    url: hostUrl() + 'safetycenter/modifyPaymentPassPost',
                    data: {password: password, confirmPassword: confirmPassword},
                    beforeSend: function () {
                    },
                    success: function (json) {
                        if (json.status) {
                            if (json.messages) {
                                alertMessage('支付密码修改成功');
                            } else {
                                alertMessage('修改失败');
                            }
                            window.location.href = hostUrl() + 'account/index';
                        } else {
                            alertMessage(json.messages);
                            obj.removeAttre('disabled');
                        }
                    }
                });
            });
        },
        smsCaptchaSubmit: function () {
            $('.sms-form').submit(function () {
                var captcha = $('input[name=captcha]').val();
                if (captcha.length != 6) {
                    alertMessage('请输入6位数的短信效验码');
                    return false;
                }
                $('submit').attr('disabled', true);
                return true;
            });
        },
        oldPassSubmit: function () {
            $('.remember-pass-form').submit(function () {
                var password = $('input[name=oldPassword]').val();
                if (password.length < 6) {
                    alertMessage('请输入正确的密码');
                    return false;
                }
                $('submit').attr('disabled', true);
                return true;
            });
        },
        modifyLoginPass: function () {
            $('#modify-login-pass-form').on('click', '#button-submit', function () {
                var password = $('input[name=password]').val();
                var confirmPassword = $('input[name=confirmPassword]').val();
                var obj = $(this);
                if (password.length < 6 || password.length > 20) {
                    alertMessage('支付密码字数必须在6至20之间！');
                    return false;
                }
                if (password != confirmPassword) {
                    alertMessage('2次输入的密码不一致！');
                    return false;
                }
                obj.attr('disabled', true);
                $.ajax({
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    url: hostUrl() + 'safetycenter/modifyLoginPassPost',
                    data: {password: password, confirmPassword: confirmPassword},
                    beforeSend: function () {
                    },
                    success: function (json) {
                        if (json.status) {
                            if (json.messages) {
                                alertMessage('密码修改成功');
                            } else {
                                alertMessage('修改失败');
                            }
                            window.location.href = hostUrl() + 'ucenter/baseInfoSet';
                        } else {
                            alertMessage(json.messages);
                            obj.removeAttre('disabled');
                        }
                    }
                });
            });
        },
        sendSmsCaptcha: function () {
            $('#safety-sms-captcha').click('click', function () {
                var obj = $(this);
                if (!obj.hasClass('disabled')) {
                    var mobilePhone = $('input[name=mobile_phone]').val();
                    if (validMobile(mobilePhone)) {
                        $.ajax({
                            type: 'post',
                            async: false,
                            dataType: 'json',
                            url: hostUrl() + 'safetycenter/ajaxSendSms',
                            data: {mobilePhone: mobilePhone},
                            beforeSend: function () {
                            },
                            success: function (json) {
                                if (!json.status) {
                                    alertMessage(json.messages);
                                } else {
                                    safetycenter.setTime(obj);
                                }
                            }
                        });
                    } else {
                        alertMessage('手机号码格式错误');
                    }
                }
            });
        },
        setTime: function (obj) {
            if (safetycenter.timespan == 0) {
                obj.removeClass("disabled");
                obj.text("重发效验码");
                safetycenter.timespan = 60;
            } else {
                obj.addClass("disabled");
                obj.text(safetycenter.timespan + "重新发送");
                safetycenter.timespan--;
                setTimeout(function () {
                    safetycenter.setTime(obj);
                }, 1000);
            }
        },
        init: function () {
            if ($('#modify-payment-pass-form').size() > 0) { //支付密码修改提交
                safetycenter.modifyPaymentPass();
            }
            if ($('.sms-form').size() > 0) {   //发送短信表单提交
                safetycenter.smsCaptchaSubmit();
            }
            if ($('.remember-pass-form').size() > 0) {    //原密码提交 验证
                safetycenter.oldPassSubmit();
            }
            if ($('#safety-sms-captcha').size() > 0) { //发送短信
                safetycenter.sendSmsCaptcha();
            }
            if ($('#modify-login-pass-form').size() > 0) { //登录密码修改提交
                safetycenter.modifyLoginPass();
            }
        }
    }
    safetycenter.init();

    /**
     * 选择区域
     */
    var region = {
        selectRegion: function (id, type, flag) {
            $.ajax({
                type: 'post',
                async: false,
                dataType: 'json',
                url: hostUrl() + 'region/selectChildren',
                data: {id: id, type: type},
                beforeSend: function () {
                },
                success: function (json) {
                    var obj = '';
                    var len = 0;
                    if (json.type == 1) {
                        obj = document.getElementById('select-province');
                        obj.options.length = 0;
                        obj.options[0] = new Option('省份', 0);
                        len = 1;
                    } else if (json.type == 2) {
                        obj = document.getElementById('select-city');
                        obj.options.length = 0;
                    } else if (json.type == 3) {
                        obj = document.getElementById('select-area');
                        obj.options.length = 0;
                    }

                    for (var i = 0; i < json.result.length; i++) {
                        obj.options[len] = new Option(json.result[i].region_name, json.result[i].region_id);
                        len += 1;
                    }
                    if (flag) {
                        if (json.type == 1) {
                            region.selectRegion($('#select-province').val(), 2, true);
                        } else if (json.type == 2) {
                            region.selectRegion($('#select-city').val(), 3, true);
                        }
                    }
                }
            });
        },
        regionChange: function () {
            //省份改变,更新城市
            $('#select-province').change(function () {
                var provinceId = $(this).val();
                if (provinceId > 0) {
                    region.selectRegion(provinceId, 2, true);
                }
            });

            //城市改变  更新县区
            $('#select-city').change(function () {
                region.selectRegion($(this).val(), 3, true);
            });
        },
        init: function () {
            if ($('#select-region').size() > 0) {
                region.selectRegion(0, 1, false);
                region.regionChange();
            }
        }
    }
    region.init();

    /**
     * 申请 我要供应 我要分销 我要开店 我要抽奖
     * @type {Object}
     */
    var apply = {
        submit: function () {
            $('input[name=submit]').click(function () {
                var area = $('select[name=areaid]').val();
                var contacts = $('input[name=contacts]').val();
                var sfz = $('input[name=sfz]').val();
                var phone = $('input[name=phone]').val();
                var category = $('input[name=category]').val();
                if (category.length == 0 || category < 0) {
                    myalert('选择申请类型');
                    return false;
                }

                if (area.length == 0 || parseInt(area) <= 0) {
                    myalert('请选择所在地');
                    return false;
                }

                if (contacts.length == 0) {
                    myalert('请填写联系人姓名');
                    return false;
                }

                if (contacts.length < 2) {
                    myalert('联系人姓名不可少于2个汉字');
                    return false;
                }

                if (phone.length == 0) {
                    myalert('请填写手机号码');
                    return false;
                }

                if (!validPhone(phone)) {
                    myalert('请填写正确的手机号码');
                    return false;
                }
                if (category == 1 || category == 3) {
                    var company = $('input[name=company]').val();
                    if (company.length == 0) {
                        myalert('请填写公司名称');
                        return false;
                    }
                }

                if (category == 1) {
                    var product = $('input[name=product]').val();
                    if (product.length == 0) {
                        myalert('请填写产品类型');
                        return false;
                    }
                } else if (category == 2) {
                    var sfz = $('input[name=sfz]').val();
                    if (sfz.length > 0 && ( !checkcard(sfz))) {
                        myalert('请输入正确的身份证');
                        return false;
                    }
                } else if (category == 3) {
                    var business = $('input[name=business]').val();
                    if (business.length == 0) {
                        myalert('请填写经营范围');
                        return false;
                    }
                }

                $.ajax({
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    url: hostUrl() + 'apply/applySubmit',
                    data: $('form').serialize(),
                    beforeSend: function () {
                        $('input[name=submit]').attr('disabled', true);
                        $('input[name=submit]').val('正在提交...');
                    },
                    success: function (json) {
                        if (json.status) {
                            $('.success').removeClass('am-hide');
                            setTimeout(function () {
                                window.history.go(-1);
                            }, 3000)
                        } else {
                            myalert(json.messages);
                            $('input[name=submit]').removeAttr('disabled');
                        }
                    },
                    complete: function () {
                        $('input[name=submit]').val('立即申请');
                    }
                });
                return false;
            });

            /**
             * 我要创建抽奖
             */
            $('.weixin').on('click', 'label', function (event) {
                if ($(this).children('div').is('.chose-radio')) {
                    $(this).children('div').addClass('radio-checked').removeClass('chose-radio');
                    $(this).siblings('label').find('div').removeClass('radio-checked').addClass('chose-radio');
                    $(this).find('input[type=checkbox]').attr('checked', true);
                } else {
                    $(this).children('div').addClass('chose-radio').removeClass('radio-checked');
                    $(this).siblings('label').find('div').removeClass('radio-checked').addClass('chose-radio');
                    $(this).find('input[type=checkbox]').removeAttr('checked');
                }
                event.preventDefault();
            });
        },
        init: function () {
            if ($('#apply-form').size() > 0) {
                apply.submit();
            }
        }
    }
    apply.init();

    /**
     * 退款
     */
    var review = {
        page: 1,
        common: function () {
            $('#load-more').scrollspy({
                animation: 'fade',
                delay: 500
            });
        },
        sceneryReviewList: function () {
            $('#load-more').on('inview.scrollspy.amui', function () {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    async: true,
                    data: {page: review.page},
                    url: hostUrl() + 'reviews/ajaxSceneryReview',
                    success: function (data) {
                        $('#scenery-revierw-list').append(data.html);
                        if (data.status) {
                            review.page++;
                        } else {
                            $('#load-more').remove();
                            $('.com-tion').append('<div class="no-more">没有更多了</div>');
                        }
                    }
                });
            });
        },
        lineReviewList: function () {
            $('#load-more').on('inview.scrollspy.amui', function () {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    async: true,
                    data: {page: review.page},
                    url: hostUrl() + 'reviews/ajaxLineReview',
                    success: function (data) {
                        $('#line-revierw-list').append(data.html);
                        if (data.status) {
                            review.page++;
                        } else {
                            $('#load-more').remove();
                            $('.com-tion').append('<div class="no-more">没有更多了</div>');
                        }
                    }
                });
            });
        },
        tourismReviewList: function () {
            $('#load-more').on('inview.scrollspy.amui', function () {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    async: true,
                    data: {page: review.page},
                    url: hostUrl() + 'reviews/ajaxTourismReview',
                    success: function (data) {
                        $('#tourism-revierw-list').append(data.html);
                        if (data.status) {
                            review.page++;
                        } else {
                            $('#load-more').remove();
                            $('.com-tion').append('<div class="no-more">没有更多了</div>');
                        }
                    }
                });
            });
        },
        init: function () {
            if ($('#scenery-revierw-list').size() > 0) {
                review.common();
                review.sceneryReviewList();
            } else if ($('#line-revierw-list').size() > 0) {
                review.common();
                review.lineReviewList();
            } else if ($('#tourism-revierw-list').size() > 0) {
                review.common();
                review.tourismReviewList();
            }
        }
    }
    review.init();
    /**
     * 游币商城
     */
    if ($('#youbi-shop').size() > 0) {
        //异步加载景区商品
        $.ajax({
            type: 'get',
            dataType: 'json',
            async: true,
            url: hostUrl() + 'discountMall/ajaxList',
            success: function (data) {
                $('#chuyou').html(data.scenery);
                $('#renxinggou').html(data.tourism);
            }
        });

        $('.youbi-tabs li').on('click', function () {
            $(this).siblings().removeClass('am-active');
            $(this).addClass('am-active');
            var tagId = $(this).attr('tag-id');
            if ($('#' + tagId).size() > 0) {
                var height = $('#' + tagId).offset().top - $('.youbi-tabs ul').height();
                $('html, body').animate({scrollTop: height}, '500');
            }
        });
    }

    /*移动端分润*/
    var profit = {
        /*初始化*/
        profit_init: function () {
            if ($('#profit-form').size() > 0) {
                profit.profit_ajax_list();
            }
        },
        /*分润类型点击 景区 商品 度假 酒店*/
        profit_type: function () {
            $('#profit-form ').on('click', '.fenrun-nav ul li a', function (e) {
                e.preventDefault();
                var _this = $(this);
                $('input[name=ajax_url]').val(_this.attr('data-ajax-url') + '/');
                _this.parents().parents('.list-nav').find('a').removeClass('active');
                _this.addClass('active');
                profit.profit_ajax_list();
            })
        },
        /*筛选*/
        profit_screen: function () {
            $('.fenrui-head').on('click', '.more i', function () {
                var h = $(window).height();
                $('.fenrun-time').css('height', h);
                $('.fenrun-time').removeClass('timehidden').addClass('timeshow');
            });
        },
        /*时间筛选*/
        profit_time: function () {
            $('.fenrun-time').on('click', '.timerange ul li a', function (event) {
                $('.fenrun-time').removeClass('timeshow').addClass('timehidden');
                if (!$(this).hasClass('active')) {
                    var month = parseInt($(this).attr('data-month'));
                    $('.timerange').find('a').removeClass('active');
                    $(this).addClass('active');
                    var now = new Date();
                    tbody = now.getFullYear() + '-' + parseInt(now.getMonth() + 1) + '-' + now.getDate();
                    $('input[name=endTime]').val(tbody);
                    var year1 = parseInt(now.getFullYear());
                    var month2 = parseInt(now.getMonth()) + 1;
                    if (month2 <= month) {
                        year1 = year1 - 1;
                        month2 = (month2 == month) ? 12 : parseInt(month2 + 12 - month);
                    } else {
                        month2 = parseInt(month2 - month);
                    }
                    startTime = year1 + '-' + month2 + '-' + now.getDate();
                    $('input[name=startTime]').val(startTime);
                }
                profit.profit_ajax_list();
            });
        },
        /*到账状态*/
        profit_status: function () {
            $('.state-choose').on('click', 'label', function () {
                if (!$(this).hasClass('active')) {
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    var _this = $(this);
                    $('input[name=status]').val(_this.children('span').attr('value'));
                    var status = $('input[name=status]').val();
                    $('.fenrun-time').removeClass('timeshow').addClass('timehidden');
                    profit.profit_ajax_list();
                }
            });
        },
        /*日历自定义事件*/
        profit_calendar: function () {
            $('.startTime,.endTime').datepicker().on('changeDate.datepicker.amui', function (event) {
                $('.fenrun-time').removeClass('timeshow').addClass('timehidden');
                profit.profit_ajax_list();
            });
        },
        /*筛选返回*/
        profit_return: function () {
            $('#profit-form .fenrun-time').on('click', '.head i', function () {
                $('.fenrun-time').removeClass('timeshow').addClass('timehidden');
            })
        },
        /*ajax*/
        profit_ajax_list: function () {
            if ('paging' === arguments[0]) {
                $(window).scrollTop($('#firstAnchor').offset().top);
            }
            var ajax_url = $('input[name=ajax_url]').val();
            var status = $('input[name=status]').val();
            $.ajax({
                'type': 'get',
                'async': true,
                'dataType': 'json',
                'data': $('form').serialize(),
                'url': hostUrl() + 'memberprofit/' + ajax_url + $('input[name=page]').val(),
                beforeSend: function () {
                    $('.fenrun-list').html('<div class="load-logo"><img src="/ucenter/images/tert.gif"></div>');
                },
                'success': function (data) {
                    if (data.status) {
                        $('.fenrun-list').html(data.html);
                        if (status == 'NOT_ACCOUNT') {
                            $('#profit-form .fenrun-income .area-income span').html('￥0.00');
                        }
                        if (status == 'ACCOUNT') {
                            $('#profit-form .fenrun-income .income span').html('￥0.00');
                        }
                    } else {
                        $('.fenrun-list').html(data.html);
                    }
                }
            })
        },
        /*下级会员分页*/
        profit_member: function () {
            if ($('.members-list').size() > 0) {
                var pg = 2;
                profit.profit_pageInitial('member-profit-more');
                $('.member-profit-more').on('inview.scrollspy.amui', function () {
                    $.ajax({
                        'type': 'get',
                        'dataType': 'json',
                        'async': false,
                        'url': hostUrl() + 'memberprofit/ajaxJuinorMember',
                        'data': {'pg': pg},
                        'success': function (data) {
                            if (data.status) {
                                pg++;
                                $('.member-profit-list').append(data.html);
                                profit.profit_imageInitial();
                            } else {
                                $('.member-profit-more').addClass('am-hide');
                                $('.no-more').removeClass('am-hide');
                            }
                        }
                    })
                })
            }
        },
        profit_search: function () {
            /*下级会员搜索*/
            if ($('.members').size() > 0) {
                $('.search .search-box').on('click', 'i', function () {
                    var search = $('input[name=search]').val();
                    $("#profitSearchForm").submit();
                })
            }
            /*下级会员搜索  清空*/
            if ($('.members').size() > 0) {
                $('.members').on('click', '.more', function () {
                    $('input[name=search]').val("");
                    $("#profitSearchForm").submit();
                })
            }
        },
        /*返回顶部*/
        profit_return_top: function () {
            $(".retunTop").hide();
            if ($('.fenrun, .members').size() > 0) {
                $(window).scroll(function () {
                    if ($(window).scrollTop() > 100) {
                        $(".retunTop").fadeIn(500);
                    } else {
                        $(".retunTop").fadeOut(500);
                    }
                });
                $(".retunTop").click(function () {
                    $('body,html').animate({scrollTop: 0}, 100);
                    return false;
                });
            }
        },
        /*图片延时加载*/
        profit_imageInitial: function () {
            $('img.lazy').lazyload({skip_invisible: false});
        },
        /*分页*/
        profit_pageInitial: function (pageParemater) {
            $('.' + pageParemater).scrollspy({
                animation: 'fade',
                delay: 500
            });
        },
        init: function () {
            profit.profit_init();
            profit.profit_type();
            profit.profit_screen();
            profit.profit_time();
            profit.profit_status();
            profit.profit_calendar();
            profit.profit_return();
            profit.profit_member();
            profit.profit_search();
            profit.profit_return_top();
        }
    }
    profit.init();


    /*移动端大首页*/
    var indexHome = {
        /*搜索*/
        search_init: function () {
            if ($('.search').size() > 0) {
                $('.customSelect').on('click', '.type', function () {
                    $('.chose').toggle();
                });
                $('.chose').on('click', 'li', function () {
                    var txt = $(this).text(),
                        search_url = $(this).attr('data-url');
                    $('.type span').text(txt);
                    $('.chose').hide();
                    $('.form-index').attr('action', search_url);
                });
            }
        },
        /*搜索 删除历史搜索*/
        delete_cookie: function () {
            if ($('.historySearch').size() > 0) {
                $('.historySearch p').on('click', 'i', function () {
                    $.ajax({
                        type: 'get',
                        async: true,
                        dataType: 'json',
                        url: hostUrl() + 'home/delete_cookie',
                        success: function (data) {
                            if (data.status) {
                                $('.historySearch').html('');
                            }
                        }
                    });
                });
            }
        },
        /*公告*/
        notice: function () {
            if ($('.bzNotice').size() > 0) {
                $('.bzNotice .notice-nav ul').on('click', 'li', function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    var class_id = $(this).attr('data-class-id');
                    $.ajax({
                        type: 'get',
                        async: true,
                        dataType: 'json',
                        url: hostUrl() + 'home/ajaxNotice',
                        data: {'class_id': class_id},
                        success: function (data) {
                            if (data.status) {
                                $('.bzNotice .noticeList').html(data.content);
                            } else {
                                $('.bzNotice .noticeList').html('');
                            }
                        }
                    });
                });
            }
        },
        /*大首页公告滚动*/
        index_notice: function () {
            if ($('.bzNotice').size() > 0) {
                var myScroll = new $.AMUI.iScroll('.notice-nav', {
                    eventPassthrough: true,
                    scrollX: true,
                    scrollY: false,
                    preventDefault: false
                });
            }
        },
        /*抽奖页面*/
        lottery: function () {
            $('.lotteryList').on('click', '.search', function () {
                $('.lotterySearch').show();
                $('.lottery').hide();
            });
            $('.lotterySearch').on('click', 'i', function () {
                $('.lotterySearch').hide();
                $('.lottery').show();
            });
            /*倒计时调用*/
            var count = $('.godraw .time span').attr('data-count');
            for (var i = 1; i <= count; i++) {
                var data_endtime = $('.downList' + i).attr('data-end-time');
                var data_id = $('.downList' + i).attr('data-id');
                indexHome.lottery_countdown(data_endtime, data_id);
            }
            /*清空输入框*/
            $('.lotterySearch .head').on('click', '.cancel', function () {
                $('input[name=keyword]').val("");
                $('.drawList1').html("");
            })
        },
        /*倒计时*/
        lottery_countdown: function (endtime, id) {
            var endtime = endtime;
            var id = id;
            window.setInterval(function () {
                var txt, enddate, nowdate, time, day, hour, minute, second;
                txt = "你来晚了，抽奖活动已结束！";
                enddate = (new Date(endtime)).getTime();//活动结束时间(秒)
                nowdate = (new Date()).getTime();//当前时间(秒)
                time = parseInt((enddate - nowdate) / 1000);
                if (time > 0) {
                    day = Math.floor(time / (60 * 60 * 24));
                    hour = Math.floor(time / (60 * 60)) - (day * 24);
                    minute = Math.floor(time / 60) - (day * 24 * 60) - (hour * 60);
                    second = Math.floor(time) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
                } else {
                    $('#' + id).parent().parent().html(txt)
                }
                //当数字小于10时加0
                if (day <= 9) day = '0' + day;
                if (hour <= 9) hour = '0' + hour;
                if (minute <= 9) minute = '0' + minute;
                if (second <= 9) second = '0' + second;
                // 页面时间赋值
                $('#' + id + ' .day').html(day);
                $('#' + id + ' .hour').html(hour);
                $('#' + id + ' .minute').html(minute);
                $('#' + id + ' .second').html(second);
                time--;
            }, 1000);
        },
        /*抽奖列表*/
        ajaxLottery: function () {
            if ($('.lotterySearch').size() > 0) {
                $('.lotterySearch .searchBox input').change(function () {
                    var keyword = $('input[name=keyword]').val();
                    $.ajax({
                        type: 'get',
                        async: true,
                        dataType: 'json',
                        url: hostUrl() + 'home/ajaxLottery',
                        data: {'keyword': keyword},
                        success: function (data) {
                            if (data.status) {
                                $('.lotterySearch .drawList1').html(data.content);
                            } else {
                                $('.lotterySearch .drawList1').html('');
                            }
                        }
                    });
                });
            }
        },
       /*大首页init*/
        index: function () {
            if ($('.newindex').size() > 0) {
                $('.topApp').on('click', 'i', function () {
                    $('.topApp').hide();
                    $('.search').css('top', '0');
                });
                $(function () {
                    $("#notice").marquee({yScroll: "bottom"});
                });
                // 搜索
                if ($('.lunbo').size() > 0) {
                    $(window).scroll(function () {
                        var h2 = $('.lunbo').offset().top + $('.lunbo').height() - $('.search').height();
                        if ($(window).scrollTop() > h2) {
                            $('.search').addClass('search1');
                        } else if ($(window).scrollTop() < h2) {
                            $('.search').removeClass('search1');
                        }
                    });
                }

            }
        },
        /*周边游更多热门景区*/
        ajaxTravelAround: function () {
            if ($('.travel-around-list').size() > 0) {
                var pg = 2;
                $('.travel-around-more').scrollspy({
                    animation: 'fade',
                    delay: 500
                });
                $('.travel-around-more').on('inview.scrollspy.amui', function () {
                    $.ajax({
                        'type': 'get',
                        'dataType': 'json',
                        'async': false,
                        'url': hostUrl() + 'home/ajaxTravelAround',
                        'data': {'pg': pg},
                        'success': function (data) {
                            if (data.status) {
                                pg++;
                                $('.travel-around-list').append(data.content);
                                $('img.lazy').lazyload({skip_invisible: false});
                            } else {
                                $('.travel-around-more').addClass('am-hide');
                                $('.no-more').removeClass('am-hide');
                            }
                        }
                    })
                })
            }
        },
        share: function () {
            var u = navigator.userAgent;
            var isBeiZhu = u.indexOf('BeiZ_Wap/ECCF3EFE2A3E11DAED68A4F63B8E2D14') > -1 || u.indexOf('BeiZ_Wap/ECCF3EFE2A3E11DAED68A4F63B8E2D14') > -1; //是否贝竹应用内部打开
            $('body').on('click', '.sales-share', function (e) {
                if (isBeiZhu) {
                    var share_url = window.location.href;
                    var share_title = document.title;
                    scenicShare(share_url, share_title);
                } else {
                    $('.recom-alert').modal();
                    var link = $(this).attr('data-link');
                    var name = $(this).attr('data-name');
                    var img = $(this).attr('data-img');
                    $('.am-modal-actions li a').attr('href', link).attr('data-name', name).attr('data-img', img);
                }
            });
        },
        'ajaxIndexTourism': function () {
            if ($('.index-tourism-list').size() > 0) {
                $.ajax({
                    'type': 'get',
                    'dataType': 'json',
                    'async': false,
                    'url': hostUrl() + 'home/ajaxIndexTourism',
                    'data': {'pg': 1},
                    'success': function (data) {
                        if (data.status) {
                            $('.index-tourism-list').html(data.content);
                            $('img.lazy').lazyload({skip_invisible: false});
                        }
                    }
                })
            }
        },
        'freeTravel': function () {
            if ($('.freeTravel-page').size() > 0) {
                // 城市选择
                $('.Head-cont-center').on('click', function () {
                    $('.main-page').hide();
                    $('.city-page').show();
                    $('#position-city').text(cookie.get('city'));
                });
                $('.city-page').on('click', '.city-return', function () {
                    $('.city-page').hide();
                    $('.main-page').show();
                });
            }
            
            
             // 城市选择
            $('.freeTravalCity .elt-hot').on('click', 'dd a', function (event) {
                event.preventDefault();
                var city_name = $(this).attr('data-name');
                $.ajax({
                    'type': 'post',
                    'dataType': 'json',
                    'async': false,
                    'url': hostUrl() + 'home/freeTravelSetCity',
                    'data': {
                        'cityName': city_name
                    },
                    'success': function (data) {
                        if (data.status) {
                            $('.city-page').hide();
                            $('.main-page').show();
                            $('.freeTravel-page .city').attr('data-city-name', city_name);
                            $('.Head-cont-center span').text(city_name);
                            $('.freeTravel-nav li.am-active').trigger('click');
                        }
                    }
                });
            });

            // 定位位置 城市选择
            $('.freeTravalCity .elt-loction').on('click', '', function (event) {
                var city_name = $(this).find('#position-city').html();
                if (city_name == '') {
                    return false;
                }
                $.ajax({
                    'type': 'post',
                    'dataType': 'json',
                    'async': false,
                    'url': hostUrl() + 'home/freeTravelSetCity',
                    'data': {
                        'cityName': city_name
                    },
                    'success': function (data) {
                        if (data.status) {
                            $('.city-page').hide();
                            $('.main-page').show();
                            $('.freeTravel-page .city').attr('data-city-name', city_name);
                            $('.Head-cont-center span').text(city_name);
                            $('.freeTravel-nav li.am-active').trigger('click');
                        }
                    }
                });
            });

            // first
            if ($('.freeTravel-page').size() > 0) {
                 var urlp = '';
                urlp = location.search; //获取url中"?"符后的字串
                var theRequest = new Object();
                if (urlp.indexOf("?") != -1) {
                    var str = urlp.substr(1);
                    strs = str.split("&");
                    for (var i = 0; i < strs.length; i++) {
                        theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
                    }
                }
                var url = '', list_class = '';
                switch (theRequest.type) {
                    case 'pub':
                        url = hostUrl() + 'home/ajaxHomeHotel';
                        $('.freeTravel-nav li').eq(1).addClass('am-active').siblings().removeClass('am-active');
                        $('.freeTravel-show div.am-tab-panel').eq(1).addClass('am-active').siblings().removeClass('am-active');
                        list_class = 'pub-list';
                        break;
                    case 'line':
                        url = hostUrl() + 'home/ajaxHomeLine';
                        $('.freeTravel-nav li').eq(2).addClass('am-active').siblings().removeClass('am-active');
                        $('.freeTravel-show div.am-tab-panel').eq(2).addClass('am-active').siblings().removeClass('am-active');
                        list_class = 'line-list';
                        break;
                    case 'food':
                        url = hostUrl() + 'home/ajaxHomeTourism';
                        $('.freeTravel-nav li').eq(3).addClass('am-active').siblings().removeClass('am-active');
                        $('.freeTravel-show div.am-tab-panel').eq(3).addClass('am-active').siblings().removeClass('am-active');
                        list_class = 'food-list';
                        break;
                    default:
                        url = hostUrl() + 'home/ajaxHomeScenery';
                        $('.freeTravel-nav li').eq(0).addClass('am-active').siblings().removeClass('am-active');
                        $('.freeTravel-show div.am-tab-panel').eq(0).addClass('am-active').siblings().removeClass('am-active');
                        list_class = 'scenery-list';
                        break;
                }
                var obj = {
                    'pg': 1,
                    'city_name': $('.freeTravel-page .city').attr('data-city-name')
                };
                $.ajax({
                    'type': 'post',
                    'dataType': 'json',
                    'async': false,
                    'url': url,
                    'data': obj,
                    'success': function (data) {
                        if (data.status) {
                            if (data.count < 10) {
                                $('.sec-load').addClass('am-hide');
                                $('.no-more').removeClass('am-hide');
                            } else {
                                $('.sec-load').removeClass('am-hide');
                                $('.no-more').addClass('am-hide');
                            }
                            obj.pg++;
                            $('.' + list_class).html(data.content);
                            indexHome.imgLazyLody();
                        } else {
                            $('.sec-load').addClass('am-hide');
                            $('.no-more').removeClass('am-hide');
                            if (list_class == 'pub-list') {
                                $('.no-more').addClass('am-hide');
                            }
                        }
                    }
                });
            }
            

            // 点击事件
            if ($('.freeTravel-page').size() > 0) {
                $('.freeTravel-page').on('click', '.freeTravel-nav li', function () {
                    var data_type = $(this).attr('data-type');
                    var data_post_url = $(this).attr('data-post-url');
                    var postObj = {};
                    obj.pg = 1;
                    postObj.pg = obj.pg;
                    postObj.city_name = $('.freeTravel-page .city').attr('data-city-name');
                    $.ajax({
                        'type': 'post',
                        'dataType': 'json',
                        'async': false,
                        'url': hostUrl() + 'home/' + data_post_url,
                        'data': postObj,
                        'success': function (data) {
                            if (data.status) {
                                if (data.count < 10) {
                                    $('.sec-load').addClass('am-hide');
                                    $('.no-more').removeClass('am-hide');
                                } else {
                                    $('.sec-load').removeClass('am-hide');
                                    $('.no-more').addClass('am-hide');
                                }
                                obj.pg++;
                                $('.' + data_type).html(data.content);
                                indexHome.imgLazyLody();
                            } else {
                                $('.' + data_type).html('');
                                $('.sec-load').addClass('am-hide');
                                $('.no-more').removeClass('am-hide');
                                if (data_type == 'pub-list') {
                                    $('.no-more').addClass('am-hide');
                                }
                            }
                        }
                    });
                });
            }

            // 分页
            if ($('.freeTravel-page').size() > 0) {
                $('.freeTravel-page .sec-load').scrollspy({animation: 'fade', delay: 500});
                $('.freeTravel-page .sec-load').on('inview.scrollspy.amui', function () {
                    var data_type = $('.freeTravel-page .freeTravel-nav').find('li.am-active').attr('data-type');
                    var data_post_url = $('.freeTravel-page .freeTravel-nav').find('li.am-active').attr('data-post-url');
                    var postObj = {};
                    postObj.pg = obj.pg;
                    postObj.city_name = $('.freeTravel-page .city').attr('data-city-name');
                    $.ajax({
                        'type': 'post',
                        'dataType': 'json',
                        'async': false,
                        'url': hostUrl() + 'home/' + data_post_url,
                        'data': postObj,
                        'success': function (data) {
                            if (data.status) {
                                if (data.count < 10) {
                                    $('.sec-load').addClass('am-hide');
                                    $('.no-more').removeClass('am-hide');
                                } else {
                                    $('.sec-load').removeClass('am-hide');
                                    $('.no-more').addClass('am-hide');
                                }
                                obj.pg++;
                                $('.' + data_type).append(data.content);
                                indexHome.imgLazyLody();
                            } else {
                                $('.sec-load').addClass('am-hide');
                                $('.no-more').removeClass('am-hide');
                            }
                        }
                    });
                });
            }

            // tab页面切换时回到顶部
            $('.freeTravel-nav li').on('open.tabs.amui', function(e) {
                $(window).smoothScroll({position: 0});
            })
            // 加入购物车
            if ($('.freeTravel-page').size() > 0) {
                $('.freeTravel-page').on('click', '.toCart', function (event) {
                    var attr_id = $(this).attr('goods-attr-id');
                    $.ajax({
                        type: 'get',
                        dataType: 'jsonp',
                        jsonCallback: 'jsonCallback',
                        url: $('.toCart').attr('shangpin-url') + 'tourism/addToCart',
                        data: {attr_id: attr_id, qty: 1},
                        success: function (data) {
                            if (data.status == 1) {
                                if (data.msg.indexOf('passport') > -1) {
                                    window.location.href = $('.toCart').attr('passport-url');
                                } else {
                                    indexHome.myalert('加入成功');
                                }
                            } else {
                                indexHome.myalert(data.msg);
                            }
                        }
                    });
                    return false;
                })
            }
        },
        // 弹层
        myalert: function (msg) {
            $('#my-alert').remove();
            var confirm = arguments[1] ? arguments[1] : '知道了';
            var tag = '<div class="alert-explain am-modal" tabindex="-1" id="my-alert"><p>' + msg + '</p><div class="am-modal-footer"><span class="am-modal-btn">' + confirm + '</span></div></div>';
            $('body').append(tag);
            $('#my-alert').modal({'closeViaDimmer': false});
        },
        imgLazyLody: function () {
            setTimeout(function () {
                $('img.lazy').lazyload({skip_invisible: false});
            }, 500)
        },
        init: function () {
            indexHome.search_init();
            indexHome.delete_cookie();
            indexHome.notice();
            indexHome.index_notice();
            indexHome.lottery();
            indexHome.ajaxLottery();
            indexHome.index();
            indexHome.ajaxTravelAround();
            indexHome.share();
            indexHome.ajaxIndexTourism();
            indexHome.freeTravel();
        }
    }
    indexHome.init();
});