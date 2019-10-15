$(function () {
  function showBookingMask() {
    $(".bookingBoxMask").show();
    var topPX = $(document).scrollTop() + ($(window).height() - $(".mask .bookingBox").height()) / 2;
    var topRem = topPX / parseInt($("html").css("font-size"));
    $(".mask .bookingBox").css("top",topRem+"rem");
  }

  //页面30s内自动弹出弹出框
  setTimeout(function () {
    showBookingMask();
  }, 30000)

  //点击预约出行
  $("header button").on("tap",function () {
    showBookingMask();
  })

  //关闭弹窗
  $(".bookingBoxMask .closeBtn").on("tap",function () {
    document.activeElement.blur();
    $(".bookingBoxMask").hide();
  })

  //定制tab栏切换
  $(".customMenu div").on("tap", function (e) {
    if ($(this).hasClass("selected")) {
      return false;
    } else {
      $(this).siblings().removeClass("selected");
      $(this).addClass("selected");
      var type = $(this).data("type");
      $(".personal").hide();
      $(".group").hide();
      $("." + type).show();
    }
  })

  //点击footer免费获取方案
  $(".getFreeSolution").on("tap", function () {
    showBookingMask();
  })

  //点击咨询
  $(".consultBtn").on("tap",function () {
    location.href = 'http://p.qiao.baidu.com/cps/chat?siteId=13201117&userId=27500048';
  })

  //开始定制旅游
  function submitData(dataObj, $this) {
    if(!/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(dataObj.contactName)) {
      mui.toast("请填写联系人");
      return false;
    }
    if(!/^\d{11}$/.test(dataObj.contactPhone)) {
      mui.toast("请填写正确的手机格式");
      return false;
    }
    if(!dataObj.destination.trim()) {
      mui.toast("请填写目的地");
      return false;
    }
    $this.addClass("loading")
    var initData = {
      orderSource:3,
      travelNumber:1,
      travelNature:1,
      departureDate:'',
      sourceUrl:window.location.href
    }
    dataObj = Object.assign(initData,dataObj);
    $.ajax({
      type:"POST",
      url:"https://boss.feiying360.com/api/boss-erp/customizedInformation/save",
      contentType:"application/json;charset=UTF-8",
      crossDomain: true,
      dataType:"json",
      data:JSON.stringify(dataObj),
      success:function(res){
        if(res.code == 200) {
          mui.alert('悠悠将尽快安排定制师联系您，请耐心等待', '提交成功', function() {
            $("input").val("");
            $(".loading").removeClass("loading")
          });
        }
      },
      error:function(xhr, textStatus){
        mui.toast(textStatus)
      }
    });
  }

  //个人公司定制
  $(".customBox .btn").on("tap",function (e) {
    if($(this).hasClass("loading")) {
      return false
    }
    var data = {};
    var type = $(this).data("travelnature");
    console.log(type)
    data.contactName = $("."+type+" .name-tel .fl").val();
    data.contactPhone = $("."+type+" .name-tel .fr").val();
    data.destination = $("."+type+" .destination").val();
    if(type === 'personal') {
      data.travelNature = 1;
      data.departureDate = $("."+type+" .monthPicker").val();
    }else if(type === 'group') {
      data.travelNature = 2;
      data.travelNumber = $("."+type+" .personsNum").val();
    }
    submitData(data, $(this));
  })

  //定制旅游
  $(".openCustomizedTourism .btn").on("tap",function () {
    if($(this).hasClass("loading")) {
      return false
    }
    var data = {};
    data.contactName = $(".openCustomizedTourism .name-tel .fl").val();
    data.contactPhone = $(".openCustomizedTourism .name-tel .fr").val();
    data.destination = $(".openCustomizedTourism .destination").val();
    submitData(data, $(this));
  })

  //弹窗定制
  $(".bookingBoxMask .btn").on("tap",function () {
    if($(this).hasClass("loading")) {
      return false
    }
    var data = {};
    data.contactName = $(".bookingBoxMask .name-tel .fl").val();
    data.contactPhone = $(".bookingBoxMask .name-tel .fr").val();
    data.destination = $(".bookingBoxMask .destination").val();
    submitData(data, $(this));
  })
})
