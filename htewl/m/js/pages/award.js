/**
 * 现场颁奖 搜索
 */
var award = function() {
    var pages = 0; //页数
    var refreshState = false;
    /**
     * 现场颁奖 异步刷新列表
     */
    var winnersList = function(name) {
        $.ajax({
            type : 'post',
            async : true,
            dataType : 'json',
            url : hostUrl() + 'award/ajaxWinnersList',
            data : name ? {lottery_id: $('input[name=lottery_id]').val(), username_key : name} : $('#lottery-award-form').serialize(),
            success : function (data) {
                if (data.status) {
                    if (pages > 0) {
                        $('#winners-list').append(data.html);
                    } else {
                        $('#winners-list').html(data.html);
                    }
                    $('.no-award-item').addClass('am-hide');
                    if (data.more) {
                        $('.search-more-no').addClass('am-hide');
                        $('#winner-scrollspy').removeClass('am-hide');
                    } else {
                        $('#winner-scrollspy').addClass('am-hide');
                        $('.search-more-no').removeClass('am-hide');
                    }
                } else {
                    $('.no-award-item').removeClass('am-hide');
                    $('#winner-scrollspy').addClass('am-hide');
                    $('.search-more-no').addClass('am-hide');
                    $('#winners-list').html('');
                }
            }
        });
    };

    /**
     * 现场颁奖  中奖 抽奖总数异步
     */
    var winnersTotal = function() {
        $.ajax({
            type : 'post',
            async : true,
            dataType : 'json',
            url : hostUrl() + 'award/ajaxWinnersTotal/' + $('input[name=lottery_id]').val(),
            data : {},
            success : function(data) {
                $('#winners-total').html(data.html);
            }
        });
    };

    /**
     * 现场颁奖 异步参与抽奖列表
     */
    var userLottery = function() {
        $.ajax({
            type : 'post',
            async : true,
            dataType : 'json',
            url : hostUrl() + 'award/lotteryUserList',
            data : $('#lottery-user-form').serialize(),
            success : function (data) {
                if (data.status) {
                    if (pages > 0) {
                        $('.loteryUser-list').append(data.html);
                    } else {
                        $('.loteryUser-list').html(data.html);
                    }
                    $('.no-award-item').addClass('am-hide');
                    if (data.more) {
                        $('.search-more-no').addClass('am-hide');
                        $('#user-lottery-scrollspy').removeClass('am-hide');
                    } else {
                        $('#user-lottery-scrollspy').addClass('am-hide');
                        $('.search-more-no').removeClass('am-hide');
                    }
                } else {
                    $('.no-award-item').removeClass('am-hide');
                    $('#user-lottery-scrollspy').removeClass('am-hide');
                    $('.search-more-no').addClass('am-hide');
                    $('.loteryUser-list').html('');
                }
            }
        });
    };

    return {
        init: function() {
            /**
             * 现场颁奖页面
             */
            if ($('#lottery-award-form').size() > 0) {
                winnersList(); //异步加载列表
                winnersTotal(); //统计异步加载
                /**
                 * 筛选条件
                 */
                $('.navlink .am-dropdown-content').on('click', 'li', function() {
                    if ( !$(this).hasClass('am-active')) {
                        $(this).siblings().removeClass('am-active');
                        $(this).addClass('am-active');
                        var tag = $(this).parent().attr('data-tag');
                        var val = $(this).attr('data-val');
                        $('input[name='+ tag +']').val(val);
                        $('input[name=pages]').val(0);
                        var text = $(this).text();
                        if (text === '全部') {
                            if (tag === 'prize_type') {
                                text = '奖品类型';
                            } else if (tag === 'dateType') {
                                text = '中奖时间';
                            } else if (tag === 'grade') {
                                text = '奖项';
                            }
                        }
                        $(this).parent('ul').prev('a').html(text+'<span class="caret"></span>');
                        $(this).parent('ul').prev('a').addClass('active');
                        pages = 0;
                        winnersList();
                    }
                    $(this).parents('.am-dropdown').dropdown('close');
                });

                /**
                 * 点击查看中奖者详情  
                 */
                $('.award-list').on('click', 'li.already-award', function() {
                    var id = $(this).attr('data-id');
                    $('#user-detail-modal-shiwu' + id).modal({closeViaDimmer: 0});
                });

                /**
                 * 监听滚动
                 */
                $('#winner-scrollspy').scrollspy({
                     animation: 'fade',
                     delay: 500
                 });
                 $('#winner-scrollspy').on('inview.scrollspy.amui', function() {
                    pages += 1;
                    $('input[name=pages]').val(pages);
                    winnersList();
                 });

                 //用户名搜索
                 $('.i-search').on('click', function() {
                    $('#lottery-award-form').submit();
                    return false;
                 });
                 $('#lottery-award-form').submit(function() {
                    var name = $('input[name=user_name]').val();
                    if (name || refreshState === true) {
                        refreshState = true;
                        $('input[name=pages]').val(0);
                        winnersList();
                    }
                    return false;
                 });

                /**
                 * 切换活动
                 */
                //  $('#select-action').addClass('am-modal-out').hide();//默认关闭选择
                // $('.award.page_1').on('click','.am-header-title',function(){
                //     $('#select-action').modal('open');
                // });
                $('#select-action').on('click', 'ul.am-list li', function(){
                    if ( !$(this).hasClass('active')) {
                        $('input').val('');
                        $(this).siblings().removeClass('active');
                        $(this).addClass('active');
                        console.log($(this).children('span'));
                        $('#lottery-name').text($(this).children('span').text());
                        var id = $(this).attr('data-id');
                        $('input[name=lottery_id]').val(id);
                        winnersList(); //异步加载列表
                        winnersTotal(); //统计异步加载
                    }
                    $('#select-action').modal('close');
                });

                /**
                 * 页面2 搜索
                 */
                var page2Refresh = false;
                $('#page2-submit-form').on('click', function() {
                    $('#page2-search-form').submit();
                    return false;
                });
                $('#page2-search-form').submit(function() {
                    var name = $('input[name=username_key]').val();
                    if (name || page2Refresh === true) {
                        page2Refresh = true;
                        $('input[name=pages]').val(0);
                        winnersList(name);
                        $('.page_1').show();
                        $('.page_2').hide();
                    }
                    return false;
                });

                /**
                 * 现场颁奖  
                 */
                $('.awards-link').on('click','a',function(){
                    $('#select-action').modal('close');
                    $('.page_1').hide();
                    $('.page_2').show();
                    return false;
                });

                //返回
                $('.page_2').on('click','.return',function(){
                    $('.page_1').show();
                    $('.page_2').hide();
                    return false;
                });

                /**
                 * 确认颁奖
                 */
                $('#winners-list').on('click', '.am-modal-fd-status2', function() {
                    var id = $(this).attr('data-id');
                    $.ajax({
                        type : 'post',
                        async : true,
                        dataType : 'json',
                        url : hostUrl() + 'award/winnersPost',
                        data : {id : id},
                        success : function(data) {
                            if (data.status) {
                                window.location.reload();
                            } else {
                                alertMessage(data.messages);
                            }
                        }
                    });
                });
            }

            /**
             * 抽奖--参与用户列表
             */
            if ($('#lottery-user-form').size() > 0) {
                userLottery();//异步加载列表
                /**
                 * 筛选条件
                 */
                $('.navlink ul.am-dropdown-content').on('click', 'li', function() {
                    if ( !$(this).hasClass('am-active')) {
                        $(this).siblings().removeClass('am-active');
                        $(this).addClass('am-active');
                        var tag = $(this).parent().attr('data-tag');
                        var val = $(this).attr('data-val');
                        $('input[name='+ tag +']').val(val);
                        $('input[name=pages]').val(0);
                        userLottery();
                    }
                    $(this).parents('.am-dropdown').dropdown('close');
                });

                //用户名搜索
                 $('.username-search').on('click', function() {
                    var name = $('input[name=user_name]').val();
                    if (name || refreshState === true) {
                        refreshState = true;
                        $('input[name=pages]').val(0);
                        userLottery();
                    }
                 });

                 $('#lottery-user-form').submit(function() {
                    var name = $('input[name=user_name]').val();
                    if (name || refreshState === true) {
                        refreshState = true;
                        $('input[name=pages]').val(0);
                        userLottery();
                    }
                    return false;
                 });

                 /**
                  * 查看详情
                  */
                $('.loteryUser-list').on('click','li',function(){
                    var id = $(this).attr('data-id');
                    $('#user-detail-modal' + id).modal(open);
                });

                /**
                 * 监听滚动 翻页
                 */
                $('#user-lottery-scrollspy').scrollspy({
                     animation: 'fade',
                     delay: 500
                 });
                 $('#user-lottery-scrollspy').on('inview.scrollspy.amui', function() {
                    pages += 1;
                    $('input[name=pages]').val(pages);
                    userLottery();
                 });
            }
        }
    };
}();

jQuery(function(){ award.init(); });