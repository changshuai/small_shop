// created by gpake
(function () {
    const base64 = require("base64");
    const URL = require("urlUtil");

    var config = {
        qiniuRegion: '',
        qiniuImageURLPrefix: '',
        qiniuUploadToken: '',
        qiniuUploadTokenURL: '',
        qiniuUploadTokenFunction: null
    }

    module.exports = {
        init: init,
        upload: upload,
        deleteBatch:deleteBatch,
    }

// 在整个程序生命周期中，只需要 init 一次即可
// 如果需要变更参数，再调用 init 即可
    function init(options) {
        config = {
            qiniuRegion: '',
            qiniuImageURLPrefix: '',
            qiniuUploadToken: '',
            qiniuUploadTokenURL: '',
            qiniuUploadTokenFunction: null
        };
        updateConfigWithOptions(options);
    }

    function updateConfigWithOptions(options) {
        if (options.region) {
            config.qiniuRegion = options.region;
        } else {
            console.error('qiniu uploader need your bucket region');
        }
        if (options.uptoken) {
            config.qiniuUploadToken = options.uptoken;
        } else if (options.uptokenURL) {
            config.qiniuUploadTokenURL = options.uptokenURL;
        } else if (options.uptokenFunc) {
            config.qiniuUploadTokenFunction = options.uptokenFunc;
        }
        if (options.domain) {
            config.qiniuImageURLPrefix = options.domain;
        }
    }

    function upload(filePath, success, fail, options) {
        if (null == filePath) {
            console.error('qiniu uploader need filePath to upload');
            return;
        }
        if (options) {
            init(options);
        }
        if (config.qiniuUploadToken) {
            doUpload(filePath, success, fail, options);
        } else if (config.qiniuUploadTokenURL) {
            getQiniuToken(function () {
                doUpload(filePath, success, fail, options);
            });
        } else if (config.qiniuUploadTokenFunction) {
            config.qiniuUploadToken = config.qiniuUploadTokenFunction();
            if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
                console.error('qiniu UploadTokenFunction result is null, please check the return value');
                return
            }
        } else {
            console.error('qiniu uploader need one of [uptoken, uptokenURL, uptokenFunc]');
            return;
        }
    }

    function doUpload(filePath, success, fail, options) {
        if (null == config.qiniuUploadToken && config.qiniuUploadToken.length > 0) {
            console.error('qiniu UploadToken is null, please check the init config or networking');
            return
        }
        var url = uploadURLFromRegionCode(config.qiniuRegion);
        var fileName = filePath.split('//')[1];
        if (options && options.key) {
            fileName = options.key;
        }

        var formData = {
            'token': config.qiniuUploadToken,
            'key': fileName
        };
        wx.uploadFile({
            url: url,
            filePath: filePath,
            name: 'file',
            formData: formData,
            success: function (res) {
                var dataString = res.data
                var dataObject = JSON.parse(dataString);
                //do something
                var imageUrl = config.qiniuImageURLPrefix + '/' + dataObject.key;
                dataObject.imageURL = imageUrl;
                console.log(dataObject);
                if (success) {
                    success(dataObject);
                }
            },
            fail: function (error) {
                console.error(error);
                if (fail) {
                    fail(error);
                }
            }
        })
    }

    function getQiniuToken(callback) {
        wx.request({
            url: config.qiniuUploadTokenURL,
            success: function (res) {
                var token = res.data.uptoken;
                if (token && token.length > 0) {
                    config.qiniuUploadToken = token;
                    if (callback) {
                        callback();
                    }
                } else {
                    console.error('qiniuUploader cannot get your token, please check the uptokenURL or server')
                }
            },
            fail: function (error) {
                console.error('qiniu UploadToken is null, please check the init config or networking: ' + error);
            }
        })
    }

    function uploadURLFromRegionCode(code) {
        var uploadURL = null;
        switch (code) {
            case 'ECN':
                uploadURL = 'https://up.qbox.me';
                break;
            case 'NCN':
                uploadURL = 'https://up-z1.qbox.me';
                break;
            case 'SCN':
                uploadURL = 'https://up-z2.qbox.me';
                break;
            case 'NA':
                uploadURL = 'https://up-na0.qbox.me';
                break;
            default:
                console.error('please make the region is with one of [ECN, SCN, NCN, NA]');
        }
        return uploadURL;
    }


    function deleteBatch(files,success,fail) {
        var $data = '';
        for(var index in files){
            var filename = files[index];
            var entry = "itman:" + filename;
            var encode_entry = base64.encoder(entry);
            $data += 'op=/delete/'+encode_entry+'&';
        }

        var options = {
            key: $data,
            uptokenURL: URL.SERVER.IMAGE_UPLOAD_TOKEN,
            region: 'SCN',
            domain: 'http://oo89w9eyc.bkt.clouddn.com'
        };

        batch($data,success,fail,options);
    }

    function batch($data, success, fail, options) {
        if (null == $data) {
            console.error('qiniu batch need filename');
            return;
        }
        if (options) {
            init(options);
        }

        if (config.qiniuUploadToken) {
            doBatch($data, success, fail);
        } else if (config.qiniuUploadTokenURL) {
            getQiniuToken(function () {
                doBatch(doBatch, success, fail);
            });
        } else {
            console.error('qiniu need one of [uptoken, uptokenURL, uptokenFunc]');
            return;
        }
    }

    function doBatch(param, success,fail) {

        // var entry = "itman:" + filename;
        // var encode_entry = base64.encoder(entry);
        var url = "http://rs.qiniu.com/batch/";

        wx.request({
            url: url, //仅为示例，并非真实的接口地址
            method:'POST',
            data:param,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': "QBox " + config.qiniuUploadToken
            },
            success: function (res) {
                console.log(res.data)
                typeof success == "function" && success()
            },

            fail: function (error) {
                console.error('delete file error: ' + error);
                typeof fail == "function" && fail()
            }
        })

    }

    function deleteFile(filename, success, fail, options) {
        if (null == filename) {
            console.error('qiniu delete need filename');
            return;
        }
        if (options) {
            init(options);
        }
        if (config.qiniuUploadToken) {
            doDeleteFile(filename, success, fail);
        } else if (config.qiniuUploadTokenURL) {
            getQiniuToken(function () {
                doDeleteFile(filename, success, fail);
            });
        } else {
            console.error('qiniu delete need one of [uptoken, uptokenURL, uptokenFunc]');
            return;
        }
    }

    function doDeleteFile(filename, success,fail) {

        var entry = "itman:" + filename;
        var encode_entry = base64.encoder(entry);
        var url = "http://rs.qiniu.com/delete/" + encode_entry + "\n";

        wx.request({
            url: url, //仅为示例，并非真实的接口地址
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': "QBox " + config.qiniuUploadToken
            },
            success: function (res) {
                console.log(res.data)
                typeof success == "function" && success()
            },

            fail: function (error) {
                console.error('delete file error: ' + error);
                typeof fail == "function" && fail()
            }
        })

    }

})();