var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const viewRouter = require("../../utils/viewRouter");

var getList = function (that) {

    httpUtil.http_get(URL.SERVER.HOME_LIST_URL, null, function (res) {
        if (!res.data.error || res.data.length > 0) {
            // var data = JSON.parse(res.data.data);
            that.setData({
                list: res.data.data,
                hidden: true
            });
        }
    });
}

var getBanner = function (that, cb) {
    httpUtil.http_get(URL.SERVER.HOME_BANNER_URL, null, function (res) {
        console.log(JSON.stringify(res.data));
        that.setData({
            banner: res.data.data
        });
    });
}

Page({
    data: {
        hidden: true,
        banner: [],
        list: [],
        menus: [
            {
                "name": "上传新品",
                "url": '../images/home_menu/create.png',
                "nav": '../product/create/input'
            },
            {
                "name": "我的商品",
                "url": '../images/home_menu/products.png',
                "nav": '../product/list'
            },
            {
              "name": "支付记录",
              "url": '../images/home_menu/money.png',
              "nav": '../trade/list'
            },
            {
                "name": "购买记录",// 再分自已货，和别人货
                "url": '../images/home_menu/order.png',
                "nav": '../order/myBuyList'
            },
        ],
        scrollTop: 0,
        itemList: ['查看','关注','投诉'],
        isFollowing:false
    },

    onLoad: function (options) {
        //wait the user info fetch reday then get the server information
        getBanner(this);
        getList(this);

    },

    onReady: function () {
        // 页面渲染完成
        wx.setNavigationBarTitle({
            title: '首页'
        })
    },

    bindDownLoad: function () {
        //  该方法绑定了页面滑动到底部的事件
        var that = this;
    },

    scroll: function (event) {
        //  该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },

    checkToken:function() {
        httpUtil.http_get(URL.SERVER.AUTH_CHECKTOKEN_URL,null,function(){
        });
    },

    switchToDetail: function (event) {
        console.log(event.currentTarget.dataset.index);
        viewRouter.switchToProductDetail(this.data.list[event.currentTarget.dataset.index].user,
            this.data.list[event.currentTarget.dataset.index].product);
        // wx.navigateTo({
        //     url: '../product/detail?data=' + encodeURIComponent(JSON.stringify(this.data.list[event.currentTarget.dataset.index].product))
        // })
    },

    switchToCreate: function (event) {
        this.checkToken();
        wx.navigateTo({
            url: '../product/create/input',
            complete: function (res) {
                console.log(res)
            }
        })
    },

    switchView: function (e) {
        var nav_url = this.data.menus[e.currentTarget.dataset.index].nav;
        wx.navigateTo({
            url: nav_url,
            complete: function (res) {
                console.log(res)
            }
        })
    },

    onShareAppMessage: function () {
        return {
            title: '私人物品交易平台',
            path: '/pages/home/main',
            success: function (res) {
                // 分享成功
            },
            fail: function (res) {
                // 分享失败
            }
        }
    },

    onPullDownRefresh: function () {
        getList(this)

        getBanner(this, function () {
            wx.stopPullDownRefresh()
        });

    },
    onUserIconTap:function (e) {
        var index = e.currentTarget.dataset.index;
        // wx.navigateTo({
        //     //url: '../user/info?data=' + JSON.stringify(this.data.list[index]),
        //     url:'../user/productlist?data=' + JSON.stringify(this.data.list[index].user)
        // })

        viewRouter.switchToUserProfile(this.data.list[index].user);
    },
    // user tap action

    onUserTap:function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;

        var param = {
            followId: this.data.list[index].user.oId,
        }

        that.setData({
            isFollowing :false
        });

        httpUtil.http_post(URL.SERVER.IS_FOLLOWING, param, function (res) {
            if (res.data.code == 1 && res.data.data.length > 0) {
                // var data = JSON.parse(res.data.data);
                that.setData({
                    itemList: ['查看','取消关注','投诉'],
                    isFollowing :true
                })
            } else {
                that.setData({
                    itemList: ['查看','关注','投诉'],
                    isFollowing :false
                })
            }

            wx.showActionSheet({
                itemList: that.data.itemList,
                success: function(res) {
                    that.onUserAction(res.tapIndex,index);
                    console.log(res.tapIndex)
                },
                fail: function(res) {
                    console.log(res.errMsg)
                }
            })
        });


    },

})