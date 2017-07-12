const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const viewRouter = require("../../utils/viewRouter");
Page({
    data: {
        loading_hidden: true,
        has_more : true,
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
        endId:'',


    },
    onLoad: function (options) {
        this.getList(false);
    },

    onReady: function () {
        wx.setNavigationBarTitle({
            title: '我买到的'
        })
    },

    onReachBottom: function () {
        if(!this.data.has_more){
            return;
        }

        this.setData({
            loading_hidden:false,
        });

        this.getFilterList(true);
    },

    loadmore:function () {
        // this.getOrdersFromServer();
        this.getFilterList(true);
    },

    getList: function (isLoadMore) {
        var that = this;
        if(!isLoadMore){
            this.setData({
                list:[]
            });
        }

        httpUtil.http_get(URL.SERVER.ORDER_MYBUY_LIST, null, function (res) {
            that.setDataFromServer(res.data);
        });
    },

    setDataFromServer: function (data) {

        var list = data.data.list;
        for(var index in list){
            list[index].order_status_str = httpUtil.getOrderStatusStr(list[index].order_status,list[index].buy_type);
        }

        this.setData({
            endId:data.data.endId,
            list: this.data.list.concat(list),
            loading_hidden:true,
            has_more: data.data.endId == -1 ? false: true,
        });
    },

    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },

    onItemTap:function (e) {
        var index = e.currentTarget.dataset.index;
        // wx.navigateTo({
        //     url: 'orderDetail?data=' + JSON.stringify(this.data.list[index])
        // })
        var param = {
            order_id :this.data.list[index].order_id,
            isMyBuy : true,
        }
        viewRouter.switchToOrderDetail(param);
    }

})