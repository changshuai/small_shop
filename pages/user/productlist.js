// pages/product/list.js
var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const tipUtil = require("../../utils/tipsUtil");
const viewRouter = require("../../utils/viewRouter");

var getList = function (that,openId) {
    var param = {
        oId:openId
    }
    var url = URL.SERVER.PRODUCT_LIST_URSER_URL;
    if(typeof(that.data.userInfo.isMime)!="undefined" && that.data.userInfo.isMime) {
        url = URL.SERVER.MY_PRODUCT_LIST_URL;
    }

    httpUtil.http_post(url, param, function (res) {
        if (res.data.code == 1 && res.data.data.length > 0) {
            that.setData({
                list: res.data.data,
                hidden: true
            });
        } else {
            tipUtil.showConfirm('没有相关信息！')
        }
    });
}

Page({
    data: {
        userInfo:{},
        hidden: true,
        page:0,

        endId:'',
        list: [],
        scrollTop: 0,
        delBtnWidth:180,

        isFollowing:false,
    },

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数

        var that = this

        this.setData({
            userInfo: JSON.parse(options.data),
        });

        httpUtil.http_get(URL.SERVER.AUTH_CHECKTOKEN_URL, null, function () {
            that.getFollowingInfo();
            getList(that, that.data.userInfo.oId);
        });
    },

    onReady: function () {
        // 页面渲染完成
        wx.setNavigationBarTitle({
            title: '商品列表'
        })
    },

    switchToDetail: function (event) {
        console.log(event.currentTarget.dataset.index);
        viewRouter.switchToProductDetailWith(this.data.list[event.currentTarget.dataset.index]);
    //     wx.navigateTo({
    //         url: '../product/detail?data=' + JSON.stringify(this.data.list[event.currentTarget.dataset.index].product)
    //     })
    },

    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },

    onFollowtap:function () {
        if(!this.data.isFollowing){
            this.follow(this.data.userInfo.oId);
        } else {
            this.unfollow(this.data.userInfo.oId);
        }

    },

    follow:function (openId) {
        var that = this;
        var param = {
            followId: openId,
        }
        // depond on the isFollowing then add the follow logical
        httpUtil.http_post(URL.SERVER.USER_FOLLOW, param, function (res) {
            if (res.data.code == 1 || res.data.length > 0) {
                that.setData({
                    isFollowing :true,
                });
                wx.showToast({
                    title: '关注成功',
                    icon: 'success',
                    duration: 2000
                });
            }
        });
    },
    unfollow:function (openId) {
        var that = this;
        var param = {
            followId: openId,
        }
        httpUtil.http_post(URL.SERVER.USER_UNFOLLOW, param, function (res) {
            if (res.data.code == 1 || res.data.length > 0) {
                that.setData({
                    isFollowing :false,
                });
                wx.showToast({
                    title: '取消成功',
                    icon: 'success',
                    duration: 2000
                });
            }
        });
    },

    getFollowingInfo:function () {
        var that = this;

        var param = {
            followId: this.data.userInfo.oId,
        }

        that.setData({
            isFollowing :false
        });

        httpUtil.http_post(URL.SERVER.IS_FOLLOWING, param, function (res) {
            if (res.data.code == 1 && res.data.data.length > 0) {
                that.setData({
                    isFollowing :true
                })
            } else {
                that.setData({
                    isFollowing :false
                })
            }
        });
    },

    onImageTap:function () {
        var that = this;
        wx.showActionSheet({
            itemList: ['投诉'],
            success: function(res) {
                that.onUserAction(res.tapIndex);
                console.log(res.tapIndex)
            },
            fail: function(res) {
                console.log(res.errMsg)
            }
        })
    },

    onUserAction: function (tapIndex) {

        switch (tapIndex) {
            case 0://查看用户信息
                this.onComplain();

                break;
            case 1: {

            }

                break;
            case 2:
                //this.onComplain(listIndex);
                break;
        }
    },

    onComplain:function () {
        wx.navigateTo({
            url:'../complain/complainlist?data=' + JSON.stringify(this.data.userInfo.oId)
        })
    },

    onShareAppMessage: function () {
        return {
            title: this.data.product.name,
            path: '/pages/user/productlist?data=' + this.userInfo,
            success: function (res) {
                // 分享成功
            },
            fail: function (res) {
                // 分享失败
            }
        }
    },

})