// pages/trade/list.js
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");

var getList = function (that) {

    httpUtil.http_get(URL.SERVER.TRADE_MY_LIST, null, function (res) {
        if (!res.data.error || res.data.length > 0) {
            // var data = JSON.parse(res.data.data);
            that.setData({
                list: res.data.data,
                hidden: true
            });
        }
    });
}


Page({
    data: {
        list: [
            {
                order_id: '2017050410254509',
                from_user: 'shuai',
                to_user: 'beibei',
                created_at: '2017-05-08 17:00',
                pay_amount: '200'
            },
            {
                order_id: '2017050410254509',
                from_user: 'shuai',
                to_user: 'beibei',
                created_at: '2017-05-08 17:00',
                pay_amount: '201'
            },
        ],

        endId: 0,
        loading_hidden: true,
        has_more: true,
    },
    onLoad: function (options) {
        this.getList(false);
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '支付记录'
        })
    },

     onPullDownRefresh:function () {
        this.setData({
            loading_hidden:false,
            has_more:true,
            endId:0
        });
        //this.getOrdersFromServer();
        this.getList(false);
    },

    onReachBottom: function () {
        if(!this.data.has_more){
            return;
        }

        this.setData({
            loading_hidden:false,
        });

        this.getList(true);
    },

    getList: function (isLoadMore) {
        var that = this;
        if(!isLoadMore){
            this.setData({
                list:[]
            });
        }
        var data = {startId:this.data.endId};
        httpUtil.http_get(URL.SERVER.TRADE_MY_LIST, data, function (res) {
            that.setDataFromServer(res.data);
        });
    },

    setDataFromServer: function (data) {

        var list = data.data.list;

        this.setData({
            list: this.data.list.concat(list),
            endId: data.data.endId,
            loading_hidden: true,
            has_more: data.data.endId == -1 ? false : true,
        });
    },


})