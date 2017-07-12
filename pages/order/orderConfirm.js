// pages/order/orderConfirm.js
var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");

function createOrder(that, param) {
    var data = {order: JSON.stringify(param)};

    httpUtil.http_post(URL.SERVER.ORDER_CREATE_URL,data,function (res) {
        console.log(res.data);
        that.setData({
            onConfirm_enable : false,
        });

        var view_data ={
            orderId:res.data.data.orderId,
            orderMoney:param.payAmount,
        }

        if (res.data.code == 1) {
            wx.showToast({title: '订单创建成功～', icon: 'success', duration: 2000})
            // navigate to payment
            wx.redirectTo({
                url: '../payment/payment?data=' + JSON.stringify(view_data),
            })
        } else {
            wx.showToast({title: '订单创建失败！', icon: 'fail', duration: 2000})
        }
    });
};


function switchToPaymentView(orderId, payAmount) {
    var view_data ={
        orderId:orderId,
        orderMoney:payAmount,
    }

    wx.navigateTo({
        url: '../payment/payment?data=' + JSON.stringify(view_data),
    })
}

Page({
    data: {
        content: {},
        total: 0,
        mobile: '',
        form_id: '',

        // 第一次购买没有order_id,也没有订单相关信息
        order_id:'',

        onConfirm_enable: false,
    },

    onLoad: function (options) {
        var that = this;
        var param = JSON.parse(decodeURIComponent(options.data));//JSON.parse(options.data);
        var total = parseFloat(param.product.price * param.buy_number) + parseFloat(param.product.deliveryFee);
        this.setData({
            content: param,
            total: total,
            order_id: param.order_id,
        });
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '订单确认'
        })
    },

    onConfirm: function (type, form_id) {
        this.setData({
            onConfirm_enable: true,
        });

        if (!this.data.content.mobile ) {
            wx.showToast({title: '电话为空！', icon: 'fail', duration: 2000})
            return;
        }

        if(this.data.order_id){
            switchToPaymentView(this.data.order_id, this.data.content.pay_amount);
            return;
        }

        //var that = this;
        //{"productId":"28","userMobile":"18910252121","userAddress":"中国北京","buyType":"0","payAmount":0,"payStatus":0}
        var send_data = {
            productId: this.data.content.product.id,
            userMobile: this.data.content.mobile,
            userAddress: this.data.content.address,
            userName:this.data.content.name,
            buyCount:this.data.content.buy_number,
            buyType: type,
            payAmount: parseFloat(this.data.total),
            payStatus: 0,
            form_id:form_id,
        }
        console.log('createOrder: ', send_data);

        createOrder(this, send_data);
    },

    onPay:function (e) {
        //this.onConfirm(1, this.data.total, this.data.form_id);
    },

    onOrder:function (e) {
        //this.onConfirm(0, 0, this.data.form_id);
    },

    formSubmit:function (e) {
        console.log('form发生了submit事件,携带数据为: ', e.detail.formId);

        var form_id = e.detail.formId;
        // 分订购与在线支付，最新只支持在线支付
        var type = e.detail.target.dataset.type;

        // var money = (type == 0? 0 : this.data.total);
        // var money = this.data.order_id? this.data.total: this.data.pay_amount;

        this.onConfirm(type, form_id);

    },

})

