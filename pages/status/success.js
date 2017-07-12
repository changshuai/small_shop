/**
 * Created by uyoung on 11/05/2017.
 */
Page({
    data: {
        content:"操作成功"
    },
    onLoad: function (options) {
        var that = this;
        var text = JSON.parse(options.text);
        this.setData({
            content: text
        })
    },


})