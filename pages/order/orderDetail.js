// pages/order/orderDetail.js
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const viewRouter = require("../../utils/viewRouter");
const tipUtil = require("../../utils/tipsUtil");

// 0:  未支付 (buy_type  类型匹配） 2：已支付  6：发货 8：完成
Page({
    data: {
        order_id: "",

        content: {},

        image_small:"",

        order_status_str: '未支付',

        isMyBuy:false,

        //is modify order price
        isModifyPrice:false,
        modifiedPrice:''

    },
    onLoad: function (options) {
        var that = this;
        var param = JSON.parse(options.data);
        var orderId = param.order_id;
        this.setData({
            order_id: orderId,
            isMyBuy:param.isMyBuy,
        });

        var param = {orderId: orderId};
        httpUtil.http_post(URL.SERVER.ORDER_PRODUCT_DETAIL, param, function (res) {
            var data = res.data.data;
            var status_str = httpUtil.getOrderStatusStr(data.order_status, data.buy_type);
            that.setData({
                content: data,
                order_status_str : status_str,
                image_small:data.image_urls[0]
            });
        });
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '订单详情'
        })
    },

    onContinuePay:function () {
        var product = {
            name:this.data.content.name,
            price:this.data.content.price,
            buy_count:this.data.content.buy_count,
            deliveryFee: this.data.content.delivery_fee,
            images: this.data.content.image_urls
        }

        var order = {
            order_id:this.data.order_id,
            pay_amount:this.data.content.pay_amount,

            address:this.data.content.address,
            userName:this.data.content.receiver_name,
            mobile:this.data.content.receiver_mobile,

            buy_count:this.data.content.buy_count
        }

        viewRouter.switchToBuyConfirm(product, null, order);
    },

    onModifyPrice:function () {
        this.setData({
            isModifyPrice : true,
        })
    },

    priceInput:function (e) {
        var money = parseInt(e.detail.value);
        if( money > 10000){
            return '999';
        }

        this.setData({
            modifiedPrice: e.detail.value
        })
    },

    onModifyPriceConfirm: function () {
        var that = this;
        var data = {
            orderId:this.data.order_id,
            payAmount:this.data.modifiedPrice
        }
        httpUtil.http_post(URL.SERVER.ORDER_UPDATE_PAYAMOUNT,data,function (res) {
            if(res.data.code == 1){
                that.setData({
                    isModifyPrice : false,
                })
                wx.navigateBack({
                    delta: 1
                })
            } else {
                // fail
            }
        });


    },

    onSendProduct:function () {
        var param = {
            order_id: this.data.order_id,
        }
        wx.navigateTo({
            url: 'expressSender?data=' + JSON.stringify(param)
        })

    },

    onReceive:function () {
        var that = this;
        tipUtil.showConfirmCancel("确认收货？",function () {
            var param = {
                orderId: that.data.order_id,
            }

            httpUtil.http_post(URL.SERVER.ORDER_UPDATE_RECEIVED,param,function (res) {
                if(res.data.code == 1) {
                    wx.navigateBack({
                        delta: 1
                    })
                }
            })
        })
    }
})