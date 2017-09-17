/**
 * 常用联系人 选择省市区 js  
 */
var address = function(){
    var province_id = 0;
    var city_id = 0;
    var province_name = '';
    var city_name = '';
    
    var regionListOpen = function(){//打开城市列表之前 初始化
        $('#region-alert').on('open.modal.amui', function(){
            var provinceName = $('input[name=provinceName]').val();
            var cityName = $('input[name=cityName]').val();
            var districtName = $('input[name=districtName]').val();
            $('#province_name').text(provinceName);
            $('#city_name').text(cityName);
            $('#district_name').text(districtName);
            province_id = $('input[name=province_id]').val();
            city_id =    $('input[name=city_id]').val();
            /**
             * 省份遍历 获取以前的active
             */
            $('#provinces-list ul li').each(function(){
                if ( $.trim($(this).text()) == provinceName ) {
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    return;
                }
            });
            /**
             * 城市遍历 获取以前的active
             */
            $('#cities-list ul li').each(function(){
                if ( $.trim($(this).text()) == cityName ) {
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    return;
                }
            });
            /**
             * 区域遍历 获取以前的active
             */
            $('#districts-list ul li').each(function(){
                if ( $.trim($(this).text()) == districtName ) {
                    $(this).siblings().removeClass('active');
                    $(this).addClass('active');
                    return;
                }
            });
        });
    };
    var selectCities = function(){
        $('.region-title').click(function(event){
            if ( ! $(this).hasClass('active') ) {
                var type = $(this).attr('data-type');
                var state = false;
                if ( type == 1 && $('#provinces-list').children().is('ul') ) {
                    $('#provinces-list').removeClass('am-hide');
                    state = true;
                } else if ( type == 2 && $('#cities-list').children().is('ul') ) {
                    $('#cities-list').removeClass('am-hide');
                    state = true;
                } else if ( type == 3 && $('#districts-list').children().is('ul') ) {
                    $('#districts-list').removeClass('am-hide');
                    state = true;
                }
                if ( state ) {
                    $(this).addClass('active');
                    $(this).siblings().removeClass('active');
                }
            }
            event.stopPropagation();
        });
    };

    var ajaxRegion = function(){
        $('.city-scroller').on('click', 'ul li', function(event){
            var type = $(this).attr('data-type');
            var id = $(this).attr('data-id');
            var name = $(this).text();
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            if ( type == 1 || type == 2 ) {
                $.ajax({
                    type : 'post',
                    async:false,
                    dataType:'json',
                    data:{'id':id,'type': parseInt(type) + 1},
                    url : hostUrl() + 'address/ajaxRegion',
                    success:function(json){
                        if ( type == 1 ) {
                            $('#province_name').text(name);
                            $('#cities-list').removeClass('am-hide');
                            $('#cities-list').html(json.html);
                            $('#districts-list').html('');
                            $('#city_name').text('市');
                            $('#district_name').text('区');
                            $('#cities-title').addClass('active');
                            $('#cities-title').siblings().removeClass('active');
                            province_id = id;
                            province_name = name;
                        } else if ( type == 2 ) {
                            $('#districts-list').removeClass('am-hide');
                            $('#districts-title').addClass('active');
                            $('#districts-title').siblings().removeClass('active');
                            city_name = name;
                            city_id = id;
                            $('#city_name').text(name);
                            $('#district_name').text('区');
                            $('#districts-list').html(json.html);
                        }
                    }
                });
            } else if ( type == 3 ) {
                $('#region-alert').modal('close');
                if ($('#region-name').is('input')) {
                    $('#region-name').val($('#province_name').text() + $('#city_name').text() + name);
                } else {
                    $('#region-name').text($('#province_name').text() + $('#city_name').text() + name);
                }
                $('input[name=province_id]').val(province_id);
                $('input[name=city_id]').val(city_id);
                $('input[name=district_id]').val(id);
                $('#district_name').text(name);
                $('input[name=provinceName]').val($('#province_name').text());
                $('input[name=cityName]').val($('#city_name').text());
                $('input[name=districtName]').val($('#district_name').text());
            }
            event.stopPropagation();
        });
    }

    return {
        init : function() {
            selectCities();
            ajaxRegion();
            regionListOpen();
        }
    }

}();

jQuery(function(){ address.init(); });