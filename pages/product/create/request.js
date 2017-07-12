const qiniuUploader = require("../../../utils/qiniuUploader");
const URL = require("../../../utils/urlUtil");
const httpUtil = require("../../../utils/httpUtil");
var app = getApp();
//var url = "https://www.jxj.net/itman/index.php/ws/product/create";

function createProduct(that,cb){
    var post_data = that.data;
    if (post_data.images.length == 0) {
        post_data.images = "";
    }

    var param = {product:JSON.stringify(post_data)};
    var url = URL.SERVER.PRODUCT_CREATE_URL;
    if(post_data.isEditMode){
        url = URL.SERVER.PRODUCT_EDIT_URL;
    }

    httpUtil.http_post(url, param, function(res){
            if(res.data.code==1){
                typeof cb == "function" && cb()
            }
        });
};

function  randomChar(len) {
    var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp = "";
    var timestamp = new Date().getTime();
    for (var i = 0; i < len; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    return timestamp + tmp;
}

function uploadFiles(that, files, callback) {
    var count = 0;
    function done(){
        count++;
        if(count == files.length){
            console.log("image upload done count: " + count);
            typeof callback == "function" && callback()
        }
    }
    for(var index in files){
        var filePath = files[index];
        console.log('file ready upload: ' + filePath);
        var fileKey = randomChar(15);//filePath.split('//')[1];
        var options = {
            key: fileKey,
            uptokenURL: URL.SERVER.IMAGE_UPLOAD_TOKEN + fileKey,
            region: 'SCN', 
            domain: URL.SERVER.QINIU_DOMAIN, //'http://oo89w9eyc.bkt.clouddn.com'
        };

        // 交给七牛上传
        qiniuUploader.upload(
            filePath, 
            function(res){
                // {"hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98","key": "gogopher.jpg","imageURL":"xxxxxxx" }
                console.log('success: ' + res);
                that.setData({
                    images:  that.data.images.concat(encodeURI(res.imageURL))
                });
                done();
            }, 
            function(error) {
                console.log('error: ' + error);
                done();
            },
            options);
        }
    };

function deleteFiles(files, callback) {
    // 交给七牛上传
    qiniuUploader.deleteBatch(
        files,
        function () {
            typeof callback == "function" && callback()
        },
        function () {

        }
    );

};
module.exports = {
    createProduct:createProduct,
    uploadFiles: uploadFiles,
    deleteFiles:deleteFiles
}