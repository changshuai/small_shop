/**
 * Created by uyoung on 03/06/2017.
 */
var app = getApp();

Page({
    data:{

    }
    ,
    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
    },

    onReady: function () {
        wx.setNavigationBarTitle({
            title: '帮助'
        })
    },

    onHelp:function (e) {
        var type = e.currentTarget.dataset.type;//  event.currentTarget.dataset.index
        switch (type){
            case 0:

                break;
        }

        wx.navigateTo({
            url: 'helpContent?data=' + type,
        });
    }
})