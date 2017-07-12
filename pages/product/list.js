// pages/product/list.js
var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const tipUtil = require("../../utils/tipsUtil");
const request_helper = require("create/request");
const viewRouter = require("../../utils/viewRouter");

var getList = function (that) {

    httpUtil.http_get(URL.SERVER.MY_PRODUCT_LIST_URL, null, function (res) {
        if (res.data.code != -1 && res.data.data.length > 0) {
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
        hidden: true,
        page:0,
        list: [],
        scrollTop: 0,

        delBtnWidth:180
    },

    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var that = this;
        getList(this);
    },
    onReady: function () {
        // 页面渲染完成
        wx.setNavigationBarTitle({
            title: '产品列表'
        })
    },

    onShow: function () {
        //  在页面展示之后先获取一次数据
        var that = this;
        //GetList(that);
    },
    bindDownLoad: function () {
        //  该方法绑定了页面滑动到底部的事件
        var that = this;
        //GetList(that);
    },
    scroll: function (event) {
        //  该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },

    switchToDetail: function (event) {
        console.log(event.currentTarget.dataset.index);
        // wx.navigateTo({
        //     url: 'detail?data=' + JSON.stringify(this.data.list[event.currentTarget.dataset.index].product)
        // })

        viewRouter.switchToProductDetail(this.data.list[event.currentTarget.dataset.index].user,
            this.data.list[event.currentTarget.dataset.index].product);
    },

    switchToCreate: function (event) {
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

    refresh: function (event) {
    },

    //点击删除按钮事件
    delItem:function(e){
        var that = this;
        //获取列表中要删除项的下标
        var index = e.target.dataset.index;

        tipUtil.showConfirmCancel('确认删除？',function () {
            that.deleteItemFromServer(index);
        });
    },
    editItem: function (event) {
        var that = this;
        //获取列表中要删除项的下标
        var index = event.target.dataset.index;

        tipUtil.showConfirmCancel('确认编辑？',function () {
            //that.deleteItemFromServer(index);
            wx.navigateTo({
                url: 'create/input?data=' + JSON.stringify(that.data.list[index].product) ,
            })
        });
    },

    deleteItemFromServer:function (index) {
        var that = this;
        var param = {
            productId: this.data.list[index].product.id
        };

        var list = this.data.list;

        httpUtil.http_post(URL.SERVER.PRODUCT_DELETE_ONE, param, function (res) {
            if(res.data.data){
                //商品暂时不删除
                //request_helper.deleteFiles(list[index].product.images);

                list.splice(index,1);
                that.setData({
                    list: list,
                });

                wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                })
            }
        });
    },
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    }
})