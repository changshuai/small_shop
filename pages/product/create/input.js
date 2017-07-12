var app = getApp();
//qiniu
const qiniuUploader = require("../../../utils/qiniuUploader");
const util = require("../../../utils/util");
const httpUtil = require("../../../utils/httpUtil");
const URL = require("../../../utils/urlUtil");
const request_helper = require("request");
//index.js

Page({
    data: {
        showTopTips: false,
        textearaLen:0,
        isDeliveryFree:true,
        deliveryFee:"",

        files: [], // this for image local choosed
        images:[], // *important this use for upload interface, so did not modify it
        name:"",
        detail:"",
        price:"",
        stock:"",
        address:"",
        isUploading:false,

        //categor
        category_list:[],
        category_name : '' ,
        category_id : '',

        isEditMode : false,

        latitude:'',
        longitude:''
    },

    onLoad:function(options){
        var that = this;

        if(options.data) {
            var data = JSON.parse(options.data);
            this.initData(data);
        }

        httpUtil.http_get(URL.SERVER.AUTH_CHECKTOKEN_URL,null,function(){
        });

        wx.getLocation(
            {
                type:'wgs84',
                success: function (res) {
                    var latitude = res.latitude
                    var longitude = res.longitude
                    that.setData(
                        {
                            latitude:latitude,
                            longitude:longitude
                        }
                    );
                }
            });
    },

    initData:function (data) {
        this.setData(
            {
                id:data.id,
                isDeliveryFree:data.isDeliveryFree,
                deliveryFee:data.deliveryFee,
                images:data.images,
                name:data.name,
                detail:data.description,
                price:data.price,
                stock:data.stock,
                address:data.address,
                isEditMode : true,
            }
        );
    },

    sendProduct: function(){
        var that = this;

        if((this.data.files.length <= 0 && this.data.images.length <= 0 )||
            this.data.name.length <= 0 ||
            this.data.price <=0 ||
            //this.data.stock <=0 ||
            this.data.address.length <= 0||
            this.data.detail.length <= 0 ||
            this.data.category_id == ''
        ){
            wx.showToast({
                title: '信息不完整哦～',
                icon: 'success',
                duration: 2000
            });
            return;
        }

        wx.showLoading({
            title: '上传中...',
        });
        setTimeout(function(){
            wx.hideLoading()
        },15000);


        this.setData({
            isUploading :true,
        });

        // file代表用户选择了文件，但还未上传
        if(this.data.files.length > 0){
            request_helper.uploadFiles(this,this.data.files,function(){
                request_helper.createProduct(that,function () {
                    that.setData({
                        isUploading :false,
                    });
                    wx.hideLoading();
                    wx.showToast({title: '产品创建成功！',icon: 'success',duration: 2000})
                    wx.navigateBack();
                });
            });
            // images代表 上传过的图片
        }else if(this.data.images.length > 0){
            request_helper.createProduct(that,function () {
                that.setData({
                    isUploading :false,
                });
                wx.hideLoading();
                wx.showToast({title: '产品创建成功！',icon: 'success',duration: 2000})
                wx.navigateBack();
            });
        }


    },

    bindAgreeChange: function (e) {
        var that = this;
        this.setData({
            allowAgent: !that.data.allowAgent
        });
    },

    onDeliveryFreeTap:function (e) {
        var that = this;
        this.setData({
            isDeliveryFree: !that.data.isDeliveryFree
        });
    },
    onReady:function(){
        // 页面渲染完成
        wx.setNavigationBarTitle({
        title: '创建产品'
        })
    },

    chooseImage: function (e) {
        var that = this;
        if (this.data.files.length >= 6) {
            wx.showModal({ content: '超过最大限制。',showCancel: false });
            return;
        }

        wx.chooseImage({
            count:6,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {

                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                    });
                }
            }
        );
    },
    
    previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },

    onImageRemove:function(e) {
        var that = this;
        this.data.files.splice(e.currentTarget.dataset.index,1);
        this.setData(
            {
                files:that.data.files
            }
        );
    },

    onImageRemoveEditmode:function (e) {
        var that = this;
        this.data.images.splice(e.currentTarget.dataset.index,1);
        this.setData(
            {
                images:that.data.images
            }
        );
    },
    // input bind
    nameInput: function(e) {
        this.setData({
            name: e.detail.value
        })
    },

    priceInput: function(e) {
        var price_v = parseInt(e.detail.value);
        if( price_v > 10000){
            return '999';
        }

        this.setData({
            price: e.detail.value
        })
    },
    stockInput: function(e) {
    this.setData({
        stock: e.detail.value
        })
    },
    deliveryFeeInput: function(e) {
        var price_v = parseInt(e.detail.value);
        if( price_v > 100){
            return '99';
        }
    this.setData({
        deliveryFee: e.detail.value
        })
    },

    allowAgentClick: function(e) {
    this.setData({
        allowAgent: e.detail.value
        })
    },

    agentPercentInput: function(e) {
    this.setData({
        agentPercent: e.detail.value
        })
    },
    addressInput: function(e) {
    this.setData({
        address: e.detail.value
        })
    },

    limitedWordsNum:function(e) {
        var l = e.detail.value.length;
        console.log('texteara，携带value值为：', e.detail.value, l);
        if(l >= 1000) {
           this.showTopTips();

            wx.showModal({
            content: '超过最大长度限制。',
            showCancel: false,
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                }
                }
            });
        } else {
            this.setData({
                textearaLen: l,
                detail: e.detail.value
            })
        }
    
    },

    onSelectCategory:function () {
        // wx.navigateTo({
        //     url: '../categorylist'
        // })
        var that = this;
        httpUtil.http_get(URL.SERVER.CATEGOR_ALL, null, function (res) {
            if (res.data.code == 1 && res.data.data.length > 0) {

                var list = res.data.data;
                that.setData({
                    category_list:list,
                });
            }
        });
    },

    onItemClick:function (e) {
        var category = this.data.category_list[e.currentTarget.dataset.index];

        this.setData({
            category_name:category.name,
            category_id:category.id,
            category_list:[],
        });


    }

});