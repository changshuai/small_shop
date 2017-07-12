/**
 * Created by changshuai on 5/25/17.
 */
function switchToConversation (user, product) {
    var param = {
        user:user,
        product:product
    }

    wx.navigateTo({
        url: '../message/conversation?data=' + JSON.stringify(param),
    })
}
function switchToProductDetailWith(obj) {
    switchToProductDetail(obj.user, obj.product);
}

function switchToProductDetail(user, product) {
    var param = {
        user:user,
        product:product
    }

    wx.navigateTo({
        url: '../product/detail?data=' + JSON.stringify(param),
    })
}

function switchToBuyConfirm(product, buy_number, order) {
    if(order) {
        var param = {
            'product': product,

            'address': order.address,
            'name': order.userName,
            'mobile': order.mobile,

            'buy_number': order.buy_count,
            'order_id' : order.order_id,
            'pay_amount' : order.pay_amount,
        };
        // switch to order confirm.
        wx.navigateTo({
            url: '../order/orderConfirm?data=' + encodeURIComponent(JSON.stringify(param)),
            complete: function (res) {
                console.log(res)
            }
        })
        return;
    }

    if (wx.chooseAddress) {
        //get user info
        wx.chooseAddress({
            success: function (res) {
                var address = res.provinceName + res.cityName + res.countyName + res.detailInfo;

                var param = {
                    'product': product,

                    'address': address,
                    'name': res.userName,
                    'mobile': res.telNumber,
                    'buy_number': buy_number,
                };
                // switch to order confirm.
                wx.navigateTo({
                    url: '../order/orderConfirm?data=' + encodeURIComponent(JSON.stringify(param)),
                    complete: function (res) {
                        console.log(res)
                    }
                })
            }
        })
    } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
    }
}

function switchToUserProfile(user) {
    wx.navigateTo({
        url:'../user/productlist?data=' + JSON.stringify(user)
    })
}

function switchToUserComplain(userId) {
    wx.navigateTo({
        url:'../complain/complainlist?data=' + JSON.stringify(userId)
    })
}

// param {order_id:  ismine};
function switchToOrderDetail(param) {
    wx.navigateTo({
        url: 'orderDetail?data=' + JSON.stringify(param)
    })
}

module.exports = {
    switchToProductDetailWith:switchToProductDetailWith,
    switchToProductDetail:switchToProductDetail,
    switchToConversation: switchToConversation,
    switchToBuyConfirm:switchToBuyConfirm,
    switchToUserProfile:switchToUserProfile,
    switchToUserComplain:switchToUserComplain,
    switchToOrderDetail:switchToOrderDetail,

}