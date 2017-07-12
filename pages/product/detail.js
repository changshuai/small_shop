// pages/product/detail.js
var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const md5 = require("../../utils/md5");
const tips = require("../../utils/tipsUtil");
const viewRouter = require("../../utils/viewRouter");

function writeObj(obj) {
    var description = "";
    for (var i in obj) {
        var property = obj[i];
        description += i + " = " + property + "\n";
    }
    console.log(description);
}

Page({
    data: {
        product: {},
        user:{},
        isConfirmHide: true,
        buy_number: 1,
        isMime: false
    },
    onLoad: function (options) {
        var that = this;
        //writeObj(JSON.parse(options.data));
        //writeObj(decodeURI(options.data));
        var input_data = JSON.parse(options.data);
        this.setData({
            user:input_data.user,
            product: input_data.product,
        });

        var data = {'product_id': this.data.product.id}

        httpUtil.http_get(URL.SERVER.PRODUCT_IS_MIME, data, function (res) {
            var res = res.data;
            that.setData({
                //isMime:res.data
            })
        });


    },

    onShareAppMessage: function () {
        var param = {
            user:this.data.user,
            product: this.data.product,
        };
        
        return {
            title: this.data.product.name,
            //path: '/pages/product/detail?data=' + encodeURIComponent(JSON.stringify(this.data.product)),
            path: '/pages/product/detail?data=' + JSON.stringify(param),
            success: function (res) {
                // 分享成功
            },
            fail: function (res) {
                // 分享失败
            }
        }
    },

    onReady: function () {
        // 页面渲染完成
        wx.setNavigationBarTitle({
            title: '产品详情'
        })
    },

    onOrder: function () {
        var that = this
        console.log("that.data.isMime : " + that.data.isMime);
        if (that.data.isMime == true) {
            tips.showTipModel('本人不可购买自已发布的商品,点右上角分享给他人购买哦');
            return;
        }
        // check this is my product, if yes , tip can't order self product. else goto next.
        this.setData({
            isConfirmHide: false
        });

    },

    onCloseNumberConfirm: function () {
        this.setData({
            isConfirmHide: true
        });
    },

    onNumberConfirm: function () {
        var that = this;
        this.setData({
            isConfirmHide: true
        });
        viewRouter.switchToBuyConfirm(this.data.product, this.data.buy_number);
        // if (wx.chooseAddress) {
        //     //get user info
        //     wx.chooseAddress({
        //         success: function (res) {
        //             var address = res.provinceName + res.cityName + res.countyName + res.detailInfo;
        //
        //             var param = {
        //                 'product': that.data.product,
        //                 'address': address,
        //                 'name': res.userName,
        //                 'mobile': res.telNumber,
        //                 'buy_number': that.data.buy_number,
        //             };
        //             // switch to order confirm.
        //             wx.navigateTo({
        //                 url: '../order/orderConfirm?data=' + encodeURIComponent(JSON.stringify(param)),
        //                 complete: function (res) {
        //                     console.log(res)
        //                 }
        //             })
        //         }
        //     })
        // } else {
        //     // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        //     wx.showModal({
        //         title: '提示',
        //         content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        //     })
        // }


    },

    onReduce: function () {
        if(this.data.buy_number == 1) {
            return;
        }

        this.setData({
            buy_number: this.data.buy_number - 1
        });
    },

    onIncrease: function () {
        this.setData({
            buy_number: this.data.buy_number + 1
        });
    },

    onbChat:function () {
        viewRouter.switchToConversation(this.data.user, this.data.product);
    },

    onShare:function () {

    }
})