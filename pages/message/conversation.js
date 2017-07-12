/**
 * Created by changshuai on 5/24/17.
 */
// pages/product/list.js
var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const messagedata = require("messagedata");
const viewRouter = require("../../utils/viewRouter");
const tipsUtil = require("../../utils/tipsUtil");

var timer;
Page({
    data: {
        list: [],
        user:{
            displayName:'fdfs',
            avatar:'http://dfsdf'
        },

        product:{
            name:'测试',
            price:'99.99',
            delivery_fee:'12.00'
        },
        inputMessage:'',
        myInfo:{

        },
        scrollTop: 0,
        toview:''
    },

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this

        app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
                myInfo: userInfo
            })
        })

        var param = JSON.parse(options.data);


        // get list storage
        var storage = wx.getStorageSync(param.product.id);
        var list = [];
        if(storage) {
            var list = JSON.parse(wx.getStorageSync(param.product.id));
            if(list.length <=0 ) {
                list = [];
            }
        }

        this.setData({
            user :param.user,
            product:param.product,
            list:list,
        });
        // THIS GET PRODUCT DETAIL AND MESSAGE NEWS

        httpUtil.http_get(URL.SERVER.AUTH_CHECKTOKEN_URL, null, function () {
            that.getProduct();

            that.getFilterList();

            that.scrollEnd();
        });
    },

    scrollEnd:function () {
        this.setData(
            {
                scrollTop:10000000000
            }
        );
    },

    onShow:function () {
        var that = this;
        timer=setInterval(function () {
            that.getFilterList();
        },6000)
    },

    onHide:function () {
        clearInterval(timer);
    },

    onUnload:function () {
        clearInterval(timer);
    },

    onReady: function () {
        // 页面渲染完成
        wx.setNavigationBarTitle({
            title: this.data.product.name
        })
    },

    // 列表刷新
    onPullDownRefresh:function () {
        wx.stopPullDownRefresh()
    },

    getProduct:function () {
        var that = this;
        var data = {
            productId:this.data.product.id,
        }
        httpUtil.http_post(URL.SERVER.PRODUCT_ONE, data, function (res) {
            if (res.data.code == 1 && res.data.data.product) {
                //that.mergeDataFromServer(res.data.data);

                that.setData({
                    product:res.data.data.product
                    }
                )
            } else {
                //
                tipsUtil.showConfirm('没有找到相关商品',function () {
                    wx.navigateBack({
                        delta: 1
                    })
                });
            }
        });
    },

    getFilterList:function() {
        var that = this;
        var getone_data = {
            userOpenId: this.data.user.oId,
            productId:this.data.product.id,
        };
        httpUtil.http_post(URL.SERVER.MESSAGE_ONE, getone_data, function (res) {
            if (res.data.code == 1 && res.data.data.length > 0) {
                that.mergeDataFromServer(that,res.data.data);
            }
        });
    },

    mergeDataFromServer:function (that, list) {

        for(var index in list){
            list[index].is_mine = false;
        }

        var newlist = that.data.list.concat(list);
        that.setData({
            list : newlist,
            scrollTop: that.data.scrollTop + 100,
        })

        wx.setStorageSync(that.data.product.id, JSON.stringify(that.data.list))

        // update messageList
        var item = {
            text:list[list.length-1].text,
            time:list[list.length-1].created_at,
        }
        messagedata.mergeMessage(that.data.user, that.data.product, item);
        that.scrollEnd();
    },

    messageInput:function (e) {
        this.setData({
            inputMessage: e.detail.value
        })
    },

    onSend:function () {
        var that = this;
        var data = {
            userOpenId:this.data.user.oId,
            productId:this.data.product.id,
            text:this.data.inputMessage
        };

        var item = {
            is_mine : true,
            text:that.data.inputMessage,
            //time:res.data.data.time,
        }

        this.setData({
            inputMessage:''
        });

        httpUtil.http_post(URL.SERVER.MESSAGE_SEND, data, function (res) {
            if (res.data.code == 1 && res.data.data) {
                //that.mergeDataFromServer(res.data.data);

                item.time = res.data.data.time;
                var arr =  new Array(1);
                arr[0] = item;

                that.setData({
                    list:that.data.list.concat(arr),
                    scrollTop: that.data.scrollTop + 100,
                    }
                )

                wx.setStorageSync(that.data.product.id, JSON.stringify(that.data.list));

                messagedata.mergeMessage(that.data.user, that.data.product, item);
                that.scrollEnd();
            }
        });
    },

    onPay:function () {
        viewRouter.switchToBuyConfirm(this.data.product, 1);
    },
    onReady: function () {
        wx.setNavigationBarTitle({
            title: '问问'
        })
    },
})