import './sem.js';
import '../css/index.css';
import '../css/mobile.css';
var caseSwiper = new Swiper ('.case_swiper', {
  direction: 'horizontal', // 水平切换选项
  loop: true, // 循环模式选项
  slidesPerView: 'auto',
  // spaceBetween: 10,
  // 如果需要前进后退按钮
  navigation: {
    nextEl: '.case-button-prev',
    prevEl: '.case-button-next',
  },
})

// 点击输入框展开备选项
function openOptions(e,obj,key) {
  e.preventDefault();
  if(key == 1) {
    console.log($('#sence'))
    if($('#sence')[0].innerText == '室内') {
      $(obj).parents('.item_box').find('.shinei_select').slideToggle(300);
    } else if($('#sence')[0].innerText == '户外') {
      $(obj).parents('.item_box').find('.huwai_select').slideToggle(300);
    }
  } else {
    $(obj).parents('.item_box').find('.select_box').slideToggle(300);
  }
}

// 点击备选项收齐下拉框并修改数据
function chooseOption(e,obj) {
  if(e.target === obj){
      $(obj).slideToggle(300);
  }else{
    $(obj).slideToggle(300);
    var val = e.target.innerHTML;
    $(obj).parents('.item_box').find('.text').html(val);
    if(val == '室内') {
      $('#screen')[0].innerText = '会议高清屏'
    } else if(val == '户外') {
      $('#screen')[0].innerText = '信息告示屏'
    }
  }
}

$(function () {
  $('.bottom_folat_box').hide();
  // 滚动事件(每次滚动都做一次循环判断)
  $('.page_box').scroll(function() {
    for(var i=0; i<$('div').length; i++) {
      // 当页面滚动到“我们的优势”时，底部弹窗出现
      if($(this).scrollTop() > $('#case_box').offset().top - 200) {  // 减去一个固定值，是定位准确点
          $('.bottom_folat_box').show();
      }else{
          $('.bottom_folat_box').hide();
      }
    };
  });
})

// 留电提交
function submit(key) {
  let mobile = $("#mobile")[0].value;
  if(key == 2) {
    mobile = $("#pop_mobile")[0].value;
  }
  if (mobile.length == 0) {
    $(".mobile_item_box").css("border", '1px solid #FF0000')
    if(key == 2) {
      $("#pop_mobile").css("border", '1px solid #FF0000')
    }
    return
  } else if (!(/^1[3|4|5|8|9][0-9]\d{8}$/.test(mobile))) {
    $(".mobile_item_box").css("border", '1px solid #FF0000')
    if(key == 2) {
      $("#pop_mobile").css("border", '1px solid #FF0000')
    }
    return
  } else {
    $(".mobile_item_box").css("border", '1px solid rgba(243,243,243,1)')
    $("#pop_mobile").css("border", '1px solid rgba(243,243,243,1)')
    let scene = $('#sence')[0].innerText;
    let screenType = $('#screen')[0].innerText;
    let nickname = $("#nickname")[0].value;
    let area = $("#area")[0].value;
    let distance = $("#distance")[0].value;
    let order = {
      serviceType: null,
      screenType: null
    }
    switch (screenType) {
      case '广告传媒屏':
        order.screenType = 5;
        break;
      case '信息告示屏':
      case '交通信息屏':
      case '字幕屏':
        order.screenType = 2;
        break;
      case '门头字幕屏':
        order.screenType = 1;
        break;
      case '其他类型屏':
        order.screenType = 6;
        break;
      case '体育场馆屏':
      case '会议高清屏':
      case '展厅展览屏':
        order.screenType = 3;
        break;
      case '舞台演绎屏':
        order.screenType = 4;
        break;
      case '透明屏':
        if (scene == '户外') {
          order.screenType = 5;
        } else if (scene == '室内') {
          order.screenType = 3;
        }
        break;
      case '婚礼宴会用屏':
        order.screenType = 7;
        break;
      case '活动庆典用屏':
        order.screenType = 8;
        break;
      case '会议展览用屏':
        order.screenType = 9;
        break;
      case '舞台演出用屏':
        order.screenType = 10;
        break;
  
      default:
        break;
    }
    var city = globalData.selPos.city;
    var prov = globalData.cityToProvince[city];
    var sem = globalData.sem;
    let inquiryInfo = {
      'scene': scene,
      'distance': distance,
      'area': area,
      'user': {
        "mobile": mobile,
        'nickname': nickname
      },
      "semSource": sem,
    };
    $.each(inquiryInfo, function (key, value) {
      if (!value) {
        delete inquiryInfo[key];
      }
    });
    inquiryInfo = JSON.stringify(inquiryInfo);
    postDraft(inquiryInfo, {
      succ: function succ() {
        // 百度事件统计
        if(key == 2) {hideOfferPop()}
        $(".submit-success").fadeIn(300);
      },
      fail: function (error) {
        isClick = true;
        var msg = error.msg || "提交失败，请重试";
        alert(msg)
      }
    });
  }
}

// 关闭成功弹窗
function colse() {
  $(".submit-success").hide()
}

function openOfferPop() {
  $(".offer_pop_box").show()
}

function hideOfferPop() {
  $(".offer_pop_box").hide()
}

// 提交需求
function postDraft(data, cb) {
  ajax_post1("/order/createOrder", data, cb);
}

/** ajax请求方法 */
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