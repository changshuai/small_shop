/**
 * Created by changshuai on 5/25/17.
 */

function mergeMessage(user, product, message) {
    var newProduct = product;
    if(product.images && product.images.length > 0) {
        newProduct = {
            id : product.id,
            name : product.name,
            image : product.images[0],
        }
    }

    var data = {
        user: user,
        product: newProduct,
        message:message,
    }

    mergeMessageObject(data);
}

function mergeMessageObject(message_obj) {
    var arr = new Array(1);
    arr[0] = message_obj;

    var oldlist = getMessageList();
    mergeMessageList(oldlist, arr);
}

function mergeMessageList(oldlist, mewlist) {
    if(oldlist){
        for(var out_index in oldlist){
            var id = oldlist[out_index].product.id;

            for(var index in mewlist){
                if(mewlist[index].product.id == id) {
                    oldlist[out_index].message = mewlist[index].message;
                    mewlist.splice(index,1);
                }
            }
        }

        if (mewlist.length > 0) {
            oldlist =  oldlist.concat(mewlist);
        }

        wx.setStorageSync("messageList", JSON.stringify(oldlist));

    } else {

        if (mewlist.length > 0) {
            wx.setStorageSync("messageList", JSON.stringify(mewlist));
        }
    }


}

function getMessageList() {
    var data_storage = wx.getStorageSync("messageList");
    if(data_storage) {
        return JSON.parse(data_storage);
    }
    return null;
}

module.exports = {
    mergeMessage:mergeMessage,
    mergeMessageObject : mergeMessageObject,
    mergeMessageList : mergeMessageList,
    getMessageList : getMessageList
}