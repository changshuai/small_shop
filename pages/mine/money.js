//index.js
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const tipUtil = require("../../utils/tipsUtil");
//获取应用实例
var app = getApp()
Page({
    data: {
        total: 0,
        outpay: 0,
        fetch_money:0,
    },

    onLoad: function () {
        var that = this
        this.getData();
    },

    onReady: function () {
        wx.setNavigationBarTitle({
            title: '我的'
        })
    },

    getData: function () {
        var that = this;
        httpUtil.http_get(URL.SERVER.WALLET_TOTAL, null, function (res) {
            //that.setDataFromServer(res.data);
            that.setData(
                {
                    total: res.data.data.money,
                    //outpay:res.data.data
                }
            )
        });
    },

    fetchMoney:function () {
        // 提现的提示。。。
        // 提现的限制 1. 每日一次 2. 每次取现的上限1000块
        var that = this;

        if(that.data.fetch_money <= 0){
            wx.showToast({
                title: '提现数额错误～',
                icon: 'success',
                duration: 2000
            });
            return;
        }

        var param = {fetch_money:that.data.fetch_money};

        tipUtil.showConfirmCancel("确认提现 "+ encodeURIComponent(this.data.fetch_money)+ " ?" , function () {

            httpUtil.http_post(URL.SERVER.WALLET_FETCH, param, function (res) {
                if(res.data.code == 1) {
                    // wx.showToast({title: res.data.message, icon: 'success', duration: 2000})
                    tipUtil.showConfirm('提现成功，请等待〜',function () {
                        wx.navigateBack();
                    });
                }else {
                    tipUtil.showConfirm(res.data.message,function () {
                        wx.navigateBack();
                    });
                }
            });
        });

    },

    onListFetch:function () {
        wx.navigateTo({
            url: 'listFetch'
        })
    },

    onConfirm:function () {

    },

    moneyInput:function (e) {
        var money = parseFloat(e.detail.value);
        if( money > 1000 || money> this.data.total){
            var ret = Math.min(1000,this.data.total);

            this.setData({
                fetch_money: ret
            });
            return ret;
        }

        this.setData({
            fetch_money: e.detail.value
        })
    },


})
