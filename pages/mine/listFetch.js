// pages/trade/list.js
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");

Page({
    data: {
        list: [
            // {
            //     user_open_id: '2017050410254509',
            //     fetch_money: 'shuai',
            //     fetch_status: 'beibei',
            //     created_at: '2017-05-08 17:00',
            // },
            // {
            //     user_open_id: '2017050410254509',
            //     fetch_money: 'shuai',
            //     fetch_status: 'beibei',
            //     created_at: '2017-05-08 17:00',
            // },
        ],

    },

    onLoad: function (options) {
        this.getList(false);
    },

    getList: function (isLoadMore) {
        var that = this;
        if(!isLoadMore){
            this.setData({
                list:[]
            });
        }

        httpUtil.http_get(URL.SERVER.WALLET_FETCH_LIST, null, function (res) {
            that.setDataFromServer(res.data);
        });
    },

    setDataFromServer: function (data) {

        var list = data.data.list;

        this.setData({
            list: this.data.list.concat(list),
        });
    },

    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    }


})