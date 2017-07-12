// pages/product/list.js
var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const tipUtil = require("../../utils/tipsUtil");
const viewRouter = require('../../utils/viewRouter');

var getFollowList = function (that, startId, direction, ismore) {
    that.setData({
        hidden: false,
    });

    var param = {
        startId: startId
    }

    var url = URL.SERVER.USER_FOLLOWING_LIST;
    if(direction == 1){
        url = URL.SERVER.USER_FOLLOWED_LIST;
    }

    httpUtil.http_post(url, param, function (res) {
        if (res.data.code == 1 && res.data.data.list.length > 0) {

            var list = res.data.data.list;
            if(ismore){
                list = that.data.list.concat(list)
            }

            that.setData({
                list : list,
                endId : res.data.data.endId,
                hidden:true,
                has_more: res.data.data.endId == -1 ? false: true,
            });
        }
    });
}


Page({
    data: {

        hidden: true,
        page:0,
        list: [],
        endId: 0,
        has_more: true,

        scrollTop: 0,
        follow_direction:0,// 0:following  1:followed
    },

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数

        var that = this

        this.setData({
            follow_direction: JSON.parse(options.data),
        });


        httpUtil.http_get(URL.SERVER.AUTH_CHECKTOKEN_URL, null, function () {
            //getList(that, that.data.userInfo.oId);
            that.getFilterList(false);
        });
    },
    onReady: function () {
        // 页面渲染完成
        wx.setNavigationBarTitle({
            title: '关注'
        })
    },

    switchToDetail: function (event) {
        console.log(event.currentTarget.dataset.index);
        wx.navigateTo({
            url: '../product/detail?data=' + JSON.stringify(this.data.list[event.currentTarget.dataset.index].product)
        })
    },

    // 列表刷新
    onPullDownRefresh:function () {
        this.setData({
            hidden:false,
            has_more:true,
            endId:0
        });
        //this.getOrdersFromServer();
        getFollowList();
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
        //this.getOrdersFromServer();

        this.getFilterList(true);
    },

    loadmore:function () {
        // this.getOrdersFromServer();
        this.getFilterList(true);
    },
    getFilterList:function(isLoadMore) {
        // if (!isLoadMore) {
        //     this.setData({
        //         list: []
        //     });
        // }

        getFollowList(this,this.data.endId,this.data.follow_direction, isLoadMore);
    },

    onDropdown:function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        wx.showActionSheet({
            itemList: ['查看','投诉'],

            success: function(res) {
                that.onUserAction(res.tapIndex,index);
                console.log(res.tapIndex)
            },
            fail: function(res) {
                console.log(res.errMsg)
            }
        })
    },

    onUserAction: function (tapIndex,listIndex) {

        switch (tapIndex) {
            case 0://查看用户信息
                viewRouter.switchToUserProfile(this.data.list[listIndex]);
                break;
            case 1:
                this.onComplain(listIndex);
                break;
        }
    },

    onComplain:function (listIndex) {
        viewRouter.switchToUserComplain(this.data.list[listIndex].user.openid);
    },

    onUserTap:function (e) {
        var index = e.currentTarget.dataset.index;
        var user = this.data.list[index];
        user.oId = user.openid;
        user.displayName = user.display_name;
        user.avatar = user.avatar_url;
        viewRouter.switchToUserProfile(user);
    }
})