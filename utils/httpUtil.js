const md5 = require("md5");
const tipUtil = require("tipsUtil");
var app = getApp();


function http_get(url, data, cb) {
    http_request(url, "GET", data, cb);
}

function http_post(url, data, cb) {
    http_request(url, "POST", data, cb);
}

function http_request(url, method, data, cb){

    var param = new Object();

    if (data != null) {
        param = data;
    }

    param.rd_session = app.getSession();
    param.token = app.getToken();

    wx.request({
        url: url,
        data: param,
        method: method,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
            console.log("http request url: " + url);
            console.log("http request result: " + JSON.stringify(res.data));

            if (res.data.code == 4005) {
                app.wxLogin();
                wx.showToast({title: '用户错误', icon: 'fail', duration: 2000})
            } if(res.data.code == 5005){
                //手机号没有登陆
                //show 登陆画面
                tipUtil.showTipModel("用户未登陆，是否重新登陆！", function () {
                    wx.navigateTo({
                        url: '/pages/auth/bind'
                    })
                });

            } else {
                typeof cb == "function" && cb(res)
            }
        },

        fail: function (res) {
            console.log("app httpRequest fail: " + JSON.stringify(res.errMsg));
            wx.showToast({title: '网络失败', icon: 'fail', duration: 2000})
            typeof cb == "function" && cb(res)
        }
    });
};

function pre_wx_pay(orderId, cb){
    var url = 'https://www.juxianjia.net/itman/index.php/ws/pay/bookOrder';
    //var url = 'https://www.jxj.net/itman/index.php/ws/pay/bookOrder';
    var param = {'orderId' : orderId};
    http_get(url, param, cb);
}

function wx_pay(param, success,fail) {
    // 发起支付
    var data = param.data.data;
    var appId = data.appid;
    var timeStamp = (Date.parse(new Date()) / 1000).toString();
    var pkg = 'prepay_id=' + data.prepay_id;
    var nonceStr = data.nonce_str;
    var paySign = md5.hex_md5('appId=' + appId + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=763FE580FA5B95EF36582D46B8B58CBC").toUpperCase();
    wx.requestPayment({
        'timeStamp': timeStamp,
        'nonceStr': nonceStr,
        'package': pkg,
        'signType': 'MD5',
        'paySign': paySign,
        'success': function (res) {
            console.log('success: '+ JSON.stringify(res.data));
            typeof success == "function" && success(res)
        },
        fail:function (res) {
            console.log('fail: '+ JSON.stringify(res.data));
            typeof fail == "function" && fail(res)
        }
    });
}

function user_login() {
    
}

function openOnlineDoc(url) {
    wx.showLoading({
        title: '打开中...',
    });

    setTimeout(function(){
        wx.hideLoading()
    },15000);

    wx.downloadFile({
        url: url,
        success: function (res) {
            var filePath = res.tempFilePath
            wx.openDocument({
                filePath: filePath,
                success: function (res) {
                    wx.hideLoading();
                    console.log('打开文档成功')
                }
            })
        }
    })
}

// buytype 0：预订 （buy_type:0 预订不支付）2:已支付 6:已发货 8:已完成(已完成，货款才可以打到卖家)
//                                       买家确认收货 之后订单才可以完成,默认5天自动收货。
//                                       3.请求退款 4 同意退款 7 确认收货 。退款流程如何设计。
//
// order status
function getOrderStatusStr (order_status,buy_type) {
    var ret = '未支付';
        switch (order_status) {
            case '0':
                ret = '未支付';
                if (buy_type == '0') {
                    ret = '预订不支付';
                }
                break;
            case '2':
                ret = '买家已支付';
                break;
            case '6':
                ret = '卖家已发货';
                break;
            case '8':
                ret = '已完成';
                break;
            default:
                break;
        }
        return ret;
}

function  randomChar(len) {
    var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp = "";
    var timestamp = new Date().getTime();
    for (var i = 0; i < len; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return timestamp + tmp;
}

var orderStatusStr = {
    0:'未支付',
}
module.exports = {
    pre_wx_pay: pre_wx_pay,
    wx_pay:wx_pay,
    http_get:http_get,
    http_post:http_post,
    getOrderStatusStr:getOrderStatusStr,
    openOnlineDoc:openOnlineDoc,
    randomChar:randomChar
}