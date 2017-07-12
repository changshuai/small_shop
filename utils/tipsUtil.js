
function showTipModel (text, confirm) {
    wx.showModal({
        title: '提示',
        content: text,

        success: function(res) {
            if (res.confirm) {
                typeof confirm == "function" && confirm()
            }
        }
    })
}

function showConfirm (text, confirm) {
    wx.showModal({
        title: '提示',
        content: text,
        showCancel:false,

        success: function(res) {
            if (res.confirm) {
                typeof confirm == "function" && confirm()
            }
        }
    })
}
function showConfirmCancel (text, confirm) {
    wx.showModal({
        title: '提示',
        content: text,

        success: function(res) {
            if (res.confirm) {
                typeof confirm == "function" && confirm()
            }
        }
    })
}

function showConfirmTitle (title, text, confirm) {
    wx.showModal({
        title: title,
        content: text,

        success: function(res) {
            if (res.confirm) {
                typeof confirm == "function" && confirm()
            }
        }
    })
}

function toast() {
    wx.showToast({
        title: '已完成',
        icon: 'success',
        duration: 3000
    });
}

module.exports = {
    showTipModel: showTipModel,
    showConfirm : showConfirm,
    showConfirmCancel : showConfirmCancel,
    showConfirmTitle:showConfirmTitle,
}