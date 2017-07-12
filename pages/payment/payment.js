var app = getApp();
const httpUtil = require("../../utils/httpUtil");
const urlUtil = require("../../utils/urlUtil");
const tips = require("../../utils/tipsUtil");
Page({
	data: {
		orderId: '',
		orderMoney: 0.0,
        prepay_id:''
	},

	onLoad: function (options) {
        var param = JSON.parse(options.data);
		console.log('order id : ' + param.orderId);
		this.setData({
			orderId: param.orderId,
            orderMoney: param.orderMoney
		})
	},
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '支付'
        })
    },

	onPay: function () {
		var that = this;
		// update order
        httpUtil.pre_wx_pay(this.data.orderId, function (response) {
            that.setData({prepay_id: response.data.data.prepay_id});

            httpUtil.wx_pay(response,
				function (res) {
					var param = {
                        'prepay_id':that.data.prepay_id,
						'orderId':that.data.orderId
					}
					// send the success message to own user
            		httpUtil.http_post(urlUtil.SERVER.PAY_MESSAGE_SUCCES, param, null);

					tips.showConfirm("支付成功！",function () {

					    var param = {order_id:that.data.orderId, isMyBuy:true};
						wx.redirectTo({
							url: '../order/orderDetail?data=' + JSON.stringify(param)
						})
                    });


				},
				function () {
                    tips.showConfirm("支付失败！",function () {

                    });
                }
			);
		});
	}
})