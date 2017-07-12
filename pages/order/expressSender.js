// pages/order/ExpressSender.js
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const tips = require("../../utils/tipsUtil");

Page({
    data: {
        express_company: ['不发快递', '顺丰', '中通', '圆通', '韵达'],
        company_index: 0,

        express_number:"",
        order_id:""

    },
    onLoad: function (options) {
        var that = this;
        var param = JSON.parse(options.data);
        this.setData({
            order_id: param.order_id,
        });
    },

    onReady: function () {
        wx.setNavigationBarTitle({
            title: '发货订单'
        })
    },

    numberInput: function(e) {
        this.setData({
            express_number: e.detail.value
        })
    },

    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            company_index: e.detail.value
        })
    },

    expressConfirm: function () {
        var that = this;
        if(this.data.order_id == ""){
            tips.showConfirm('订单号为空');
            return;
        }

        if(this.data.company_index == 0){
            // update order_status to send express
            tips.showConfirmCancel('是否不需要发送快递？',function(){
                that.updateOrderStatus();
            });
            
            return;
        } else {
            if(this.data.express_number == ""){
                tips.showConfirm('快递号为空');
                return;
            }
        }

        var express_obj = {
                order_id:this.data.order_id,
                express_company:this.data.express_company[this.data.company_index],
                express_number:this.data.express_number
                };
        var express_str = JSON.stringify(express_obj);
        var data = {
            express:express_str
        };

        httpUtil.http_post(URL.SERVER.EXPRESS_CREATE, data, function (res) {
            tips.showConfirm("发货成功",function(){
                wx.navigateBack({
                  delta: 1, // 回退前 delta(默认为1) 页面
                })
            });
        })
    },

    updateOrderStatus:function(){
        var data = {
            orderId:this.data.order_id,
            data:'{"order_status":6}',
                
        };

        httpUtil.http_post(URL.SERVER.ORDER_UPDATE_DELEIVERY, data, function (res) {
            console.log('发货成功', res)
            tips.showConfirm("发货成功",function(){
                wx.navigateBack({
                  delta: 1, // 回退前 delta(默认为1) 页面
                })
            });
        })
    },

    onScan:function () {
        var that = this;
        if (this.data.company_index ==0) {
            tips.showConfirm('请先选择快递公司！');
            return;
        }
        wx.scanCode({
            success: function (res) {
                console.log(res);
                that.setData({
                    express_number: res.result
                })
            }
        });
    }
})