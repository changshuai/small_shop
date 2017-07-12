var config = "prod";

var base_server_debug = "https://www.jxj.net/";
var base_server_prod = "https://www.juxianjia.net/";
var base_server = base_server_debug;
if(config != "debug"){
    base_server = base_server_prod;
}

// TO-DO
// 支付成功后没有跳出支付页面。支付成功后，后台回调没有，没有改变订单，也没有同步交易表。

var SERVER = {
    LOGIN_URL : base_server + "itman/index.php/ws/user/wslogin",

    // HOME
    HOME_LIST_URL : base_server + "itman/index.php/ws/product/listrecent",
    HOME_BANNER_URL : base_server + "itman/index.php/ws/operator/banner",

    //my product list
    MY_PRODUCT_LIST_URL : base_server + "itman/index.php/ws/product/listMime",
    PRODUCT_LIST_URSER_URL : base_server + "itman/index.php/ws/product/listUser",

    // get own order
    MY_OWN_ORDER_LIST : base_server + "itman/index.php/ws/order/getOwnList",
    ORDER_PRODUCT_DETAIL : base_server + "itman/index.php/ws/order/getDetail",
    ORDER_UPDATE_STATUS: base_server + "itman/index.php/ws/order/updateOne",
    ORDER_UPDATE_DELEIVERY: base_server + "itman/index.php/ws/order/delieveryStatus",
    ORDER_UPDATE_PAYAMOUNT: base_server + "itman/index.php/ws/order/updatePayAmount",
    ORDER_UPDATE_RECEIVED: base_server + "itman/index.php/ws/order/received",
    
    ORDER_LIST_STATUS : base_server + 'itman/index.php/ws/order/getOwnListWithStatus',
    ORDER_LIST_BUYTYPE: base_server + 'itman/index.php/ws/order/getOwnListWithBuyType',
    ORDER_MYBUY_LIST: base_server + 'itman/index.php/ws/order/getBuyList',

    //order export
    ORDER_EXPORT: base_server + 'itman/index.php/ws/order/exportbystatus',


    // mobile
    AUTH_SMS_GETCODE_URL : base_server + "itman/index.php/ws/sms/getCode",
    // code, mobile, display_name
    AUTH_USER_LOGIN_URL : base_server + "itman/index.php/ws/user/instantlogin",
    AUTH_CHECKTOKEN_URL : base_server + "itman/index.php/ws/user/checkToken",

    //https://www.jxj.net/itman/index.php/ws/product/create

    PRODUCT_CREATE_URL :  base_server + "itman/index.php/ws/product/create",
    PRODUCT_IS_MIME : base_server + "itman/index.php/ws/product/isMyProduct",
    PRODUCT_DELETE_ONE : base_server + "itman/index.php/ws/product/deleteOne",
    PRODUCT_ONE : base_server + "itman/index.php/ws/product/getone",
    PRODUCT_EDIT_URL: base_server + "itman/index.php/ws/product/edit",


    ORDER_CREATE_URL : base_server + 'itman/index.php/ws/order/create',

    IMAGE_UPLOAD_TOKEN: base_server + 'itman/index.php/ws/user/uploadToken/',

    //express
    EXPRESS_CREATE: base_server + 'itman/index.php/ws/express/create',

    //trade
    TRADE_MY_LIST: base_server + 'itman/index.php/ws/trade/mylist',
    TRADE_MY_MONEY: base_server + 'itman/index.php/ws/trade/getMyMoney',

    // wallet
    WALLET_TOTAL: base_server + 'itman/index.php/ws/wallet/total',
    WALLET_FETCH: base_server + 'itman/index.php/ws/wallet/getFetchRecord',//提现接口
    WALLET_FETCH_LIST: base_server + 'itman/index.php/ws/wallet/getFetchList',//提现记录

    // pay
    PAY_MESSAGE_SUCCES: base_server + "itman/index.php/ws/pay/successMsg",

    // advice
    ADVICE_MESSAGE: base_server + "itman/index.php/ws/advice/create",

    // user follow
    USER_FOLLOW:    base_server + "itman/index.php/ws/UserRelation/follow",
    USER_UNFOLLOW:  base_server + "itman/index.php/ws/UserRelation/unfollow",
    USER_FOLLOWING_LIST:  base_server + "itman/index.php/ws/UserRelation/getFollowing",
    USER_FOLLOWED_LIST:  base_server + "itman/index.php/ws/UserRelation/getFollowed",
    IS_FOLLOWING:   base_server + "itman/index.php/ws/UserRelation/isFollowing",

    // category
    CATEGOR_ALL : base_server + "itman/index.php/ws/category/all",

    // complain
    COMPLAIN_TYPE_LIST: base_server + "itman/index.php/ws/complain/getcomplainlist",

    // message
    MESSAGE_LIST: base_server + "itman/index.php/ws/chat/getnews",
    MESSAGE_ONE: base_server + "itman/index.php/ws/chat/getone",
    MESSAGE_SEND: base_server + "itman/index.php/ws/chat/newone",

    //qiniu
    QINIU_DOMAIN: 'http://files.juxianjia.net/', //config == "debug" ? 'http://oe2adkg9g.bkt.clouddn.com' : 'http://files.juxianjia.net/'
    QINIU_EXCEL_KEY:'QINIU_EXCEL_KEY'

}

module.exports = {
    SERVER: SERVER,
}