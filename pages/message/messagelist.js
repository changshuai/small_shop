// pages/product/list.js
var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const tipUtil = require("../../utils/tipsUtil");
const messagedata = require("messagedata");
const viewRouter = require("../../utils/viewRouter");

//TO-DO this get the news message
var getMessageList = function (that, startId,isLoadMore) {

    httpUtil.http_post(URL.SERVER.MESSAGE_LIST, null, function (res) {
        if (res.data.code == 1 && res.data.data.length > 0) {
            var list = res.data.data;
            that.mergeDataList(that,list);
        }

        that.setData({
            hidden:true,
        });
    });


}
//{
// "user":{
//     "displayName": "shuai",
//         "avatar": "http://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJJhSlTDHDXhuqDk2UXaeMuWUDBWFT1dpYLMYicxGmzpHo4OeLiavDsqypnPqeiaLDAlDxwFzpJrjy0Q/0",
//         "oId": "oi2vq0NCBUncv1CiaL8_YfyQbqSI"
// },
// "product":{
//     "name": "测试付费商品",
//         "image": "http://oo89w9eyc.bkt.clouddn.com/1494828856733bv93ed7b1wu7mcc",
//         "price": "0.01"
// },
// "message":{"id": "1", "text": "'你好'", "image": null, "type": "0",…}
// }

Page({
    data: {
        list: [],
        scrollTop: 0,
    },

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;

        this.getLocalStorage();

        httpUtil.http_get(URL.SERVER.AUTH_CHECKTOKEN_URL, null, function () {
            that.getFilterList(false);
        });
    },

    onReady: function () {
        // 页面渲染完成
        wx.setNavigationBarTitle({
            title: '消息列表'
        })
    },

    onShow:function () {
        this.getLocalStorage();
    },

    getLocalStorage:function () {
        this.setData({
            list : messagedata.getMessageList()
        });
    },

    switchToConversation: function (event) {
        console.log(event.currentTarget.dataset.index);
        wx.navigateTo({
            url: '../message/conversation?data=' + JSON.stringify(this.data.list[event.currentTarget.dataset.index]),
        })
    },

    // 列表刷新
    onPullDownRefresh:function () {
        this.setData({
            hidden:false,
            has_more:true,
            endId:0
        });
        this.getLocalStorage();

        this.getFilterList(false);

        wx.stopPullDownRefresh()
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
        this.getFilterList(true);
    },

    getFilterList:function(isLoadMore) {
        getMessageList(this,this.data.endId,isLoadMore);
    },

    mergeDataList:function (that, list) {
        for(var out_index in that.data.list){
            var id = that.data.list[out_index].product.id;

            for(var index in list){
                if(list[index].product.id == id) {
                    that.data.list[out_index].message = list[index].message;
                    list.splice(index,1);
                }
            }
        }

        if (list.length > 0) {
            that.setData({
                list: that.data.list.concat(list),
            })

        }

        // wx.setStorageSync("messageList", JSON.stringify(that.data.list));
        that.saveList(that.data.list)
    },

    saveList :function (list) {
        if(list.length > 0) {
            wx.setStorageSync("messageList", JSON.stringify(list));
        }
    },

    onUserIconTap:function (e) {
        var index = e.currentTarget.dataset.index;
        viewRouter.switchToUserProfile(this.data.list[index].user);
    },
})