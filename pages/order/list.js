// pages/order/list.js
var sliderWidth = 0;
var app = getApp();
const URL = require("../../utils/urlUtil");
const httpUtil = require("../../utils/httpUtil");
const tips = require("../../utils/tipsUtil");
const viewRouter = require("../../utils/viewRouter");

Page({
    data: {
        tabs: ["我的产品", "代理的产品"],
        loading_hidden: true,
        has_more : true,

        list: [
            // {
            //     "pay_status": "0",
            //     "pay_amount": "0.01",
            //     "order_id": "2017042152575451",
            //     "order_status": "0",
            //     "buy_type": "1",
            //     "name": "测试支付产品",
            //     "price": "0.01",
            //     "image_urls": "[\"http:\\/\\/oo89w9eyc.bkt.clouddn.com\\/tmp_1581875747o6zAJs2g-QQ1sNXZ4b3WzNTfGUjU11137ddd679ed6aead91e22034f51174.jpg\",\"http:\\/\\/oo89w9eyc.bkt.clouddn.com\\/tmp_1581875747o6zAJs2g-QQ1sNXZ4b3WzNTfGUjU682d435723406315e4e940f6213c57df.jpg\",\"http:\\/\\/oo89w9eyc.bkt.clouddn.com\\/tmp_1581875747o6zAJs2g-QQ1sNXZ4b3WzNTfGUjU8278b40278df5f4f543b26f555486869.jpg\"]"
            // },
        ],
        endId:0,


        dropdown_array:[['预定不支付','在线支付','全部'],['未支付', '已支付', '已发货', '已完成', '全部'],['未支付', '已支付', '已发货', '已完成']],
        isfull: false,
        dropdown_active_index: 0 ,
        is_dropdown_display: false,
        dropdown_content:[],

        dropdown_array_selected:[],
        // 支付类弄   支付状态
        filterType : 0,
        dropdown_selected_index: -1,

    },

    getOrderStatus:function(status){
        var ret = "未发货";
        switch(status) {
            case 1:
                ret = '已发货';
            break;
        }
        return ret;
    },

    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    },

    scroll: function (event) {
        //  该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
        this.setData({
            scrollTop: event.detail.scrollTop
        });
    },

    onPullDownRefresh:function () {
        this.setData({
            loading_hidden:false,
            has_more:true,
            endId:0
        });
        //this.getOrdersFromServer();
        this.getFilterList(false);
        wx.stopPullDownRefresh()
    },

    onReachBottom: function () {
        if(!this.data.has_more){
            return;
        }

        this.setData({
            loading_hidden:false,
        });
        //this.getOrdersFromServer();

        this.getFilterList(true);
    },

    loadmore:function () {
        // this.getOrdersFromServer();
        this.getFilterList(true);
    },

    onReady: function () {
        // 页面渲染完成
        wx.setNavigationBarTitle({
            title: '订单列表'
        })
    },

    onLoad: function () {
        this.getOrdersFromServer();
    },

    onShow: function () {
        //this.getOrdersFromServer();
    },

    //
    switchToDetail: function (event) {
        console.log(event.currentTarget.dataset.index);
        var param = {
            order_id :this.data.list[event.currentTarget.dataset.index].order_id,
            isMyBuy : false,
        }
        viewRouter.switchToOrderDetail(param);
        // wx.navigateTo({
        //     url: 'orderDetail?data=' + JSON.stringify(this.data.list[event.currentTarget.dataset.index])
        // })
    },


    // ###############   drop down menu ################
    showDropdownMenu: function (e) {
        if (this.data.is_dropdown_display) {
            this.setData({
                is_dropdown_display:false,
                isfull: false,
                dropdown_active_index: 0,
                filterType:0
            })
        } else {
            var index = e.currentTarget.dataset.nav;
            this.setData({
                dropdowncontent: this.data.dropdown_array[index-1],
                is_dropdown_display:true,
                isfull: true,
                dropdown_active_index: index,
                filterType:index,
            })
        }
    },

    dropdown_selected: function (e) {
        this.setData({
            dropdown_selected_index: e.target.dataset.index,
        });

        this.getFilterList(false);
        this.hidebg();
    },

    hidebg: function (e) {
        this.setData({
            isfull: false,
            dropdown_active_index: 0,
            is_dropdown_display:false
        })
    },

    
    // 评价系统
    // 发货, 收货需要商户和用户主动点击的，下订单，支付，发货，添快递单，收到货，评价（要不要相互评价？），完成。
    onEditStatus:function(event) {

    },

    
    onSendExpress:function(event) {
        wx.navigateTo({
                    url: 'expressSender?data=' + JSON.stringify(this.data.list[event.currentTarget.dataset.index])
                })
    },


    // get list by filter
    getFilterList:function(isLoadMore) {
        var that = this;
        if(!isLoadMore){
            this.setData({
                list:[]
            });
        }

        var isGet = false;
        //var filterType = this.data.dropdown_active_index;
        if(this.data.filterType == 1){
            // filter by buy_type
            // dropdown_selected_index
            if(this.data.dropdown_selected_index < 2) {
                isGet = true;
                this.getFilterListByBuyType(this.data.dropdown_selected_index);
            }
        }else if(this.data.filterType == 2) {
            // filter by order status 
            // 0：预订 （buy_type:0 预订不支付）2:已支付 6:已发货 8:已完成
            var status = this.getOrderStatusBySelected();
            // if(this.data.dropdown_selected_index == 0) {
            //     status = 0;
            // }else if(this.data.dropdown_selected_index == 1) {
            //     status = 2;
            // }else if(this.data.dropdown_selected_index == 2){
            //     status = 6;
            // }
            // else if(this.data.dropdown_selected_index == 3){
            //     status = 8;
            // }
            if(this.data.dropdown_selected_index < 4) {
                isGet = true;
                this.getFilterListByStatus(status);
            }
        }else if(this.data.filterType == 3) {
            
            tips.showConfirmCancel('确订要导出Excel?', function () {
                var status = that.getOrderStatusBySelected();
                that.doExportExcel(status);
            });

        }

        if(!isGet){
            this.getOrdersFromServer();
        }
        
    },

    // ================== get data from server =====

    getOrdersFromServer:function (data) {
        var that = this;
        var data = {startId:this.data.endId};
        httpUtil.http_post(URL.SERVER.MY_OWN_ORDER_LIST, data, function (res) {
            that.setDataFromServer(res.data);
        })
    },

    // get data from setData
    getFilterListByBuyType:function(buy_type){
        var that = this;
        var param = {
            startId:this.data.endId,
            buyType:buy_type
            };
        httpUtil.http_post(URL.SERVER.ORDER_LIST_BUYTYPE, param ,function (res) {
            that.setDataFromServer(res.data);
        });
    },

    getFilterListByStatus:function(status){
        var that = this;
        var param = {
            startId:this.data.endId,
            status:status
            };
        httpUtil.http_post(URL.SERVER.ORDER_LIST_STATUS, param, function (res) {
            that.setDataFromServer(res.data);
        });
    },

    setDataFromServer:function(data) {
        var list = data.data.list;
        for(var index in list){
                list[index].order_status_str = httpUtil.getOrderStatusStr(list[index].order_status,list[index].buy_type);
            }
        this.setData({
            list : this.data.list.concat(list),
            endId : data.data.endId,
            loading_hidden:true,
            has_more: data.data.endId == -1 ? false: true,
        });
    },
    
    getOrderStatusBySelected:function () {
        var status = 0;
        if(this.data.dropdown_selected_index == 0) {
            status = 0;
        }else if(this.data.dropdown_selected_index == 1) {
            status = 2;
        }else if(this.data.dropdown_selected_index == 2){
            status = 6;
        }
        else if(this.data.dropdown_selected_index == 3){
            status = 8;
        }
        return status;
    },

    doExportExcel:function (status) {
        var that = this;
        this.setData({
            loading_hidden:false,
        });

        var data = {
            status : status,
        };

        httpUtil.http_post(URL.SERVER.ORDER_EXPORT, data, function (res) {
            that.setData({
                loading_hidden:true,
            });

            if(res.data.code == 1) {

                var open_url = URL.SERVER.QINIU_DOMAIN + res.data.data.filekey;
                var timestamp = (new Date()).valueOf();

                wx.setStorageSync(URL.SERVER.QINIU_EXCEL_KEY, open_url + "?e=" + timestamp);

                httpUtil.openOnlineDoc(open_url + "?e=" + timestamp);
            }
        })
    }

})