var isClick = true;
$(document).ready(function () {
    var bannerSwiper = new Swiper('.banner-container', {
        pagination: {
            el: '.swiper-pagination',
        },
        on: {
            slideNextTransitionStart: function () {
                var lazyloadImages = $('.banner-container').find('.lazy');
                for (var key in lazyloadImages) {
                    var element = lazyloadImages[key];
                    if (element.dataset) {
                        element.src = element.dataset.src;
                        element.classList.remove('lazy');
                    }
                }

            },
        }
    });

    var mySwiper2 = new Swiper('.swiper-container-company', {
        loop: true, // 循环模式选项
        autoplay: true,

        hashNavigation: {
            watchState: true,
        },
        navigation: {
            nextEl: '.company-button-next',
            prevEl: '.company-button-prev',
        },
        on: {
            slideChange: function () {
                var activeIndex = this.activeIndex;
                var aSpans = $('.swiper-text-nav').children().find('a');
                for (var index = 0, len = aSpans.length; index < len; index++) {
                    $(aSpans[index]).removeClass("active")
                }
                // 添加选中样式
                var newIndex = 0;
                switch (activeIndex) {
                    case 0:
                    case 3:
                        newIndex = 2
                        break;
                    case 1:
                    case 4:
                        newIndex = 0
                        break;
                    case 2:
                        newIndex = 1
                        break;
                    default:
                        break;
                }
                $(aSpans[newIndex]).addClass("active")
            },
        }
    })


    var mySwiper3 = new Swiper('.swiper-container-customized', {
        navigation: {
            nextEl: '.customized-button-next',
            prevEl: '.customized-button-prev',
        },
        on: {
            slideNextTransitionStart: function () {
                var lazyloadImages = $('.swiper-container-customized').find('.lazy');
                for (var key in lazyloadImages) {
                    var element = lazyloadImages[key];
                    if (element.dataset) {
                        element.src = element.dataset.src;
                        element.classList.remove('lazy');
                    }
                }

            },
            slideChange: function () {
                var activeIndex = this.activeIndex;
                switch (activeIndex) {
                    case 0:
                        $('.section-led-text')[0].innerText = '指挥中心高清大屏'
                        break;
                    case 1:
                        $('.section-led-text')[0].innerText = '安防监控高清大屏'
                        break;
                    case 2:
                        $('.section-led-text')[0].innerText = '会议室高清大屏'
                        break;
                    case 3:
                        $('.section-led-text')[0].innerText = '户外商业显示大屏'
                        break;
                    case 4:
                        $('.section-led-text')[0].innerText = '室内显示大屏'
                        break;
                    case 5:
                        $('.section-led-text')[0].innerText = '门头字幕滚动屏'
                        break;

                    default:
                        break;
                }
            }
        }

    })

    /** 获取ip定位省市 */
    globalData.ipPos = {
        city: "深圳市",
        city_id: 440300,
        county: "南山区",
        county_id: 440305,
        prov: "广东省",
        prov_id: 440000,
        addr: ""
    };
    globalData.selPos = {
        city: "深圳市",
        city_id: 440300,
        county: "南山区",
        county_id: 440305,
        prov: "广东省",
        prov_id: 440000,
        addr: ""
    };
    ajax_post1("/order/ip/getIpInfo", null, {
        succ: function succ(json) {
            globalData.ipPos = json.body;
            globalData.selPos = json.body;
            $('.citySelect').html(json.body.city);
        },
        fail: function fail(data) {}
    });

    $('.inq-mobile').focus(function () {
        $('.error-inq').hide();
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() >= 300) {
            $('.btn_bottom').fadeIn(300)
        } else {
            $('.btn_bottom').fadeOut(300)
        }
    });
});
//询价提交电话号码
function submit(clickBtn) {

    var mobile, city, prov, sem, errorTip, cate = 1;

    if (clickBtn == 1) {
        mobile = $('#phone').val().trim();
        errorTip = $('#inquiry .errorTip');
    } else if (clickBtn == 2) {
        mobile = $('#phone2').val().trim();
        errorTip = $('.offer_box .errorTip');
    } else if (clickBtn == 3) {
        mobile = $('.inq-mobile').val().trim();
        errorTip = $('.error-inq');
    }

    if (mobile != '') {
        if (!checkPhone(mobile)) {
            errorTip.text("请填写正确的手机号").show();
            return false;
        }
    } else {
        errorTip.text("手机号不能为空").show();
        return false;
    }

    city = globalData.selPos.city;
    prov = globalData.selPos.prov;
    sem = globalData.sem;
    var inquiryInfo;
    // 新参数
    var order = {
        provinceId: null,
        cityId: null,
        screenType: null,
    }
    cityData.forEach(item => {
        if (item.name.indexOf(city) != -1) {
            globalData.selPos.city_id = item.id;
            globalData.selPos.prov_id = item.parentId;
        }
    });
    order.provinceId = Number(globalData.selPos.prov_id);
    order.cityId = Number(globalData.selPos.city_id);
    var screenType = $('#screenType').text();
    switch (screenType) {
        case '广告传媒屏':
            screenType = '户外广告屏';
            order.screenType = 5;
            break;
        case '信息告示屏':
        case '交通信息屏':
        case '字幕屏':
            screenType = '信息告示屏';
            order.screenType = 2;
            break;
        case '门头字幕屏':
            screenType = '门头屏';
            order.screenType = 1;
            break;
        case '其他类型屏':
            screenType = '其他屏幕类型';
            order.screenType = 6;
            break;
        case '体育场馆屏':
        case '会议高清屏':
        case '展厅展览屏':
            screenType = '室内高清屏';
            order.screenType = 3;
            break;
        case '舞台演绎屏':
            screenType = '舞台用屏';
            order.screenType = 4;
            break;
        case '透明屏':
            if (scene == '户外') {
                screenType = '户外广告屏';
                order.screenType = 5;
            } else if (scene == '室内') {
                screenType = '室内高清屏';
                order.screenType = 3;
            }
            break

        default:
            break;
    }
    switch (clickBtn) {
        case 1:
            let scene = $('#scene').text();
            let wide = Number($('#width').val());
            let length = Number($('#long').val());
            let distance = Number($('#distance').val());
            if (scene == '请选择') {
                scene = ''
            }
            if (wide == 0) {
                wide = ''
            }
            if (length == 0) {
                length = ''
            }
            if (distance == 0) {
                distance = ''
            }
            inquiryInfo = {
                'scene': scene,
                'wide': wide,
                'length': length,
                'distance': distance,
                'user': {
                    "mobile": mobile
                },
                "semSource": sem,
                'order': order
            };
            break;
        case 2:
        case 3:
            inquiryInfo = {
                'user': {
                    "mobile": mobile
                },
                "semSource": sem,
                'order': order
            };
            break;

        default:
            break;
    }
    $.each(inquiryInfo, function (key, value) {
        if (!value) {
            delete inquiryInfo[key];
        }
    });
    inquiryInfo = JSON.stringify(inquiryInfo);

    if (!isClick) {
        return;
    } else {
        isClick = false;
    }
    postDraft(inquiryInfo, {
        succ: function succ() {
            // 百度事件统计
            trackBaidu(3, clickBtn);
            window._agl && window._agl.push(['track', ['success', {
                t: 18
            }]])
            isClick = true;
            $('#inquiryModal').hide();
            $("#submitSuccess").fadeIn(300);
        },
        fail: function (error) {
            isClick = true;
            var msg = error.msg || "提交失败，请重试";
            alert(msg)
        }
    });
}

// 验证手机号码
function checkPhone(phone) {
    if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone)) {
        return false;
    }
    return true;
}
// 关闭手机号码错误提醒
function removeSelf(e, obj) {
    $(obj).hide();
    $(obj).prev('input').focus();
}

// 关闭提交成功弹窗
function closeSuccessPanel() {
    $('.submit-success').fadeOut(300)
}

// 点击输入框展开备选项
function openOptions(e, obj, num) {
    e.preventDefault();
    if (num == 1 && $('#scene').text() == '户外') {
        $('#huwai-options').slideToggle(300);
    } else if (num == 1 && $('#scene').text() == '室内') {
        $('#shinei-options').slideToggle(300);
    } else if (num == 1 && $('#scene').text() == '请选择') {
        alert('请先选择使用场景')
    } else if (num == 2 && $('#scene2').text() == '户外') {
        $('#huwai-options2').slideToggle(300);
    } else if (num == 2 && $('#scene2').text() == '室内') {
        $('#shinei-options2').slideToggle(300);
    } else if (num == 2 && $('#scene2').text() == '请选择') {
        alert('请先选择使用场景')
    } else {
        $(obj).parents('.choose-pane').find('.options').slideToggle(300);
    }
    $(obj).next('.icon-circle-down').toggleClass('rotate');
}
// 点击备选项收齐下拉框并修改数据
function chooseOption(e, obj, num) {
    if (e.target === obj) {
        $(obj).slideToggle(300);
        $(obj).parents('.choose-pane').find('.icon-circle-down').toggleClass('rotate');
    } else {
        $(obj).slideToggle(300);
        $(obj).parents('.choose-pane').find('.icon-circle-down').toggleClass('rotate');
        var val = e.target.innerHTML;
        $(obj).parents('.choose-pane').find('.value-div').html(val);
        if (val == '户外') {
            if (num == 2) {
                $('#screenType2').html('广告传媒屏');
            } else {
                $('#screenType').html('广告传媒屏');
            }
        } else if (val == '室内') {
            if (num == 2) {
                $('#screenType2').html('会议高清屏');
            } else {
                $('#screenType').html('会议高清屏');
            }
        }
    }
}

// 显示报价弹窗
function showInquiryModal() {
    $('#inquiryModal').fadeIn(300);
}
// 关闭报价弹窗
function hideSelf(obj, e) {
    if (obj == e.target) {
        $(obj).fadeOut(300)
    }
}

function closeModal() {
    $('#inquiryModal').fadeOut(300)
}

// 打开城市选择
function openCitySelect() {
    $('#CitySelector').show();
    setTimeout(function () {
        $(".nav-bar").css("visibility", "visible");
    }, 300)
}
// 关闭城市选择
function closeCityPanel() {
    $(".nav-bar").css("visibility", "hidden");
    $('#CitySelector').hide();
}

// 城市列表页
(function () {
    var cityList = [{
        "letter": "A",
        "list": ["阿拉善盟", "鞍山市", "安庆市", "安阳市", "阿坝藏族羌族自治州", "安顺市", "阿里地区", "安康市", "阿克苏地区", "阿勒泰地区", "阿拉尔市", "澳门特别行政区"]
    }, {
        "letter": "B",
        "list": ["北京市", "保定市", "包头市", "巴彦淖尔市", "本溪市", "白山市", "白城市", "蚌埠市", "亳州市", "滨州市", "北海市", "百色市", "白沙黎族自治县", "保亭黎族苗族自治县", "巴中市", "毕节市", "保山市", "宝鸡市", "白银市", "博尔塔拉蒙古自治州", "巴音郭楞蒙古自治州", "北屯市"]
    }, {
        "letter": "C",
        "list": ["承德市", "沧州市", "长治市", "赤峰市", "长春市", "常州市", "滁州市", "池州市", "长沙市", "常德市", "郴州市", "潮州市", "崇左市", "澄迈县", "昌江黎族自治县", "成都市", "楚雄彝族自治州", "昌都市", "昌吉回族自治州"]
    }, {
        "letter": "D",
        "list": ["大同市", "大连市", "丹东市", "大庆市", "大兴安岭地区", "东营市", "德州市", "东莞市", "儋州市", "东方市", "定安县", "德阳市", "达州市", "大理白族自治州", "德宏傣族景颇族自治州", "迪庆藏族自治州", "定西市"]
    }, {
        "letter": "E",
        "list": ["鄂尔多斯市", "鄂州市", "恩施土家族苗族自治州"]
    }, {
        "letter": "F",
        "list": ["抚顺市", "阜新市", "阜阳市", "福州市", "莆田市", "抚州市", "佛山市", "防城港市"]
    }, {
        "letter": "G",
        "list": ["赣州市", "广州市", "桂林市", "贵港市", "广元市", "广安市", "甘孜藏族自治州", "贵阳市", "甘南藏族自治州", "果洛藏族自治州", "固原市"]
    }, {
        "letter": "H",
        "list": ["邯郸市", "衡水市", "呼和浩特市", "呼伦贝尔市", "葫芦岛市", "哈尔滨市", "鹤岗市", "黑河市", "淮安市", "杭州市", "湖州市", "合肥市", "淮南市", "淮北市", "黄山市", "菏泽市", "鹤壁市", "黄石市", "黄冈市", "衡阳市", "怀化市", "惠州市", "河源市", "贺州市", "河池市", "海口市", "红河哈尼族彝族自治州", "汉中市", "海东市", "海北藏族自治州", "黄南藏族自治州", "海南藏族自治州", "海西蒙古族藏族自治州", "哈密市", "和田地区"]
    }, {
        "letter": "J",
        "list": ["晋城市", "晋中市", "锦州市", "吉林市", "鸡西市", "佳木斯市", "嘉兴市", "金华市", "景德镇市", "九江市", "吉安市", "济南市", "济宁市", "焦作市", "济源市", "荆门市", "荆州市", "江门市", "揭阳市", "嘉峪关市", "金昌市", "酒泉市"]
    }, {
        "letter": "K",
        "list": ["开封市", "昆明市", "克拉玛依市", "克孜勒苏柯尔克孜自治州", "喀什地区", "可克达拉市", "昆玉市"]
    }, {
        "letter": "L",
        "list": ["廊坊市", "临汾市", "吕梁市", "辽阳市", "辽源市", "连云港市", "丽水市", "六安市", "龙岩市", "莱芜市", "临沂市", "聊城市", "洛阳市", "娄底市", "柳州市", "来宾市", "临高县", "乐东黎族自治县", "陵水黎族自治县", "泸州市", "乐山市", "凉山彝族自治州", "六盘水市", "丽江市", "临沧市", "拉萨市", "林芝市", "兰州市", "陇南市", "临夏回族自治州"]
    }, {
        "letter": "M",
        "list": ["牡丹江市", "马鞍山市", "茂名市", "梅州市", "绵阳市", "眉山市"]
    }, {
        "letter": "N",
        "list": ["南京市", "南通市", "宁波市", "南平市", "宁德市", "南昌市", "南阳市", "南宁市", "内江市", "南充市", "怒江傈僳族自治州", "那曲地区"]
    }, {
        "letter": "P",
        "list": ["盘锦市", "萍乡市", "平顶山市", "濮阳市", "攀枝花市", "普洱市", "平凉市"]
    }, {
        "letter": "Q",
        "list": ["秦皇岛市", "齐齐哈尔市", "七台河市", "衢州市", "泉州市", "青岛市", "潜江市", "清远市", "钦州市", "琼海市", "琼中黎族苗族自治县", "黔西南布依族苗族自治州", "黔东南苗族侗族自治州", "黔南布依族苗族自治州", "曲靖市", "庆阳市"]
    }, {
        "letter": "R",
        "list": ["日照市", "日喀则市"]
    }, {
        "letter": "S",
        "list": ["石家庄市", "朔州市", "沈阳市", "四平市", "松原市", "双鸭山市", "绥化市", "上海市", "苏州市", "宿迁市", "绍兴市", "宿州市", "厦门市", "三明市", "上饶市", "三门峡市", "商丘市", "十堰市", "随州市", "神农架林区", "邵阳市", "韶关市", "深圳市", "汕头市", "汕尾市", "三亚市", "三沙市", "遂宁市", "山南市", "商洛市", "石嘴山市", "石河子市", "双河市"]
    }, {
        "letter": "T",
        "list": ["天津市", "唐山市", "太原市", "通辽市", "铁岭市", "通化市", "泰州市", "台州市", "铜陵市", "泰安市", "漯河市", "天门市", "屯昌县", "铜仁市", "铜川市", "天水市", "吐鲁番市", "塔城地区", "图木舒克市", "铁门关市", "台湾省"]
    }, {
        "letter": "W",
        "list": ["乌海市", "乌兰察布市", "无锡市", "温州市", "芜湖市", "潍坊市", "威海市", "武汉市", "梧州市", "五指山市", "文昌市", "万宁市", "文山壮族苗族自治州", "渭南市", "武威市", "吴忠市", "乌鲁木齐市", "五家渠市"]
    }, {
        "letter": "X",
        "list": ["邢台市", "忻州市", "兴安盟", "锡林郭勒盟", "徐州市", "宣城市", "新余市", "新乡市", "许昌市", "信阳市", "襄阳市", "孝感市", "咸宁市", "仙桃市", "湘潭市", "湘西土家族苗族自治州", "西双版纳傣族自治州", "西安市", "咸阳市", "西宁市", "香港特别行政区"]
    }, {
        "letter": "Y",
        "list": ["阳泉市", "运城市", "营口市", "延边朝鲜族自治州", "伊春市", "盐城市", "扬州市", "鹰潭市", "宜春市", "烟台市", "宜昌市", "岳阳市", "益阳市", "永州市", "阳江市", "云浮市", "玉林市", "宜宾市", "雅安市", "玉溪市", "延安市", "榆林市", "玉树藏族自治州", "银川市", "伊犁哈萨克自治州"]
    }, {
        "letter": "Z",
        "list": ["张家口市", "朝阳市", "镇江市", "舟山市", "漳州市", "淄博市", "枣庄市", "郑州市", "周口市", "驻马店市", "株洲市", "张家界市", "珠海市", "湛江市", "肇庆市", "中山市", "重庆市", "自贡市", "资阳市", "遵义市", "昭通市", "张掖市", "中卫市"]
    }];
    var CityIndex = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
    var CityHots = ["北京市", "长春市", "常州市", "长沙市", "大连市", "贵阳市", "广州市", "哈尔滨市", "济南市", "昆明市", "宁波市", "青岛市", "上海市", "深圳市", "无锡市", "西安市", "厦门市", "郑州市"];
    // 渲染热门城市
    var hotDom = '';
    $.each(CityHots, function (index, value) {
        hotDom += '<div class="city-button" data-city="' + value + '">' + value + '</div>';
    });
    $('.line-1').html(hotDom);

    //渲染城市列表
    var cityDom = '';
    $.each(cityList, function (index, item) {
        var letter = '<div class="city-part" id="CitySelector-' + item.letter + '"><span class="city-list">' + item.letter + '</span>';
        var citys = '';
        $.each(item.list, function (i, city) {
            citys += '<div class="city-item" data-city="' + city + '">' + city + '</div>';
        });
        cityDom += letter + citys + '</div>';
    });
    $('.city-all').html(cityDom);

    // 渲染字母表
    var letDom = '';
    $.each(CityIndex, function (index, value) {
        letDom += '<a href="#CitySelector-' + value + '">' + value + '</a>';
    });
    $('.nav-bar').append(letDom);
})();
// 城市选择事件
function selected(e) {
    var selCity = e.target.getAttribute('data-city');
    if (selCity) {
        globalData.selPos.city = selCity;
        globalData.selPos.prov = globalData.cityToProvince[selCity];
        $(".nav-bar").css("visibility", "hidden");
        $('#CitySelector').hide();
        $(".citySelect").html(selCity);
        $(".currCity").html(selCity);
    }
}

// 百度统计事件
function trackBaidu(type, pos) {
    var src = 'http://m.pingmishu.com/track/Click_And_Submit_Main.html';
    if (type == 3) {
        if (pos == 2) {
            src = 'http://m.pingmishu.com/track/Click_And_Submit_Case.html';
        } else if (pos == 3) {
            src = 'http://m.pingmishu.com/track/Click_And_Submit_Bottom.html';
        } else {
            src = 'http://m.pingmishu.com/track/Click_And_Submit_Main.html';
        }
    }
    var iframe = '<div class="hide"><iframe src="' + src + '"></iframe>"</div>';
    $('body').append(iframe);
}


// 提交需求草稿
function postDraft(data, cb) {
    ajax_post1("/order/createOrder", data, cb);
}

/** ajax请求方法 */
function ajax_post(url, data, cb) {
    var URL = "https://opc.wanpinghui.com/api" + url;
    $.ajax(URL, $.extend({
        method: 'POST',
        data: data,
        dataType: "json",
        timeout: 30000,
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Accept': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        contentType: 'application/x-www-form-urlencoded',
        success: function success(json, status, xhr) {
            cb && cb.always && cb.always(json);
            if (json.status == "200") {
                cb && cb.succ && cb.succ(json);
            } else {
                cb && cb.fail && cb.fail(json);
            }
        },
        error: function error(xhr, status, thrown) {
            console.log("[!err!](" + url + "): status: " + xhr.status + ", msg: " + thrown);
            cb && cb.fail && cb.fail();
            console.error("接口[" + url + "]：失败");
        }
    }));
}

function ajax_post1(url, data, cb) {
    var URL = "https://api.wanpinghui.com" + url;
    $.ajax(URL, $.extend({
        method: 'POST',
        data: data,
        dataType: "json",
        timeout: 30000,
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Content-Type': 'application/json'
        },
        success: function success(json, status, xhr) {
            cb && cb.always && cb.always(json);
            if (json.status == "200") {
                cb && cb.succ && cb.succ(json);
            } else {
                cb && cb.fail && cb.fail(json);
            }
        },
        error: function error(xhr, status, thrown) {
            console.log("[!err!](" + url + "): status: " + xhr.status + ", msg: " + thrown);
            cb && cb.fail && cb.fail();
            console.error("接口[" + url + "]：失败");
        }
    }));
}