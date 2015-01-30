var qiniu = require('qiniu');
var config = require('./config');

qiniu.conf.ACCESS_KEY = config.qiniu.accessKey;
qiniu.conf.SECRET_KEY = config.qiniu.secretKey;
var client = new qiniu.rs.Client();

function getFileList(marker, files, callback){
    if(marker || (!marker && !files[0])){
        qiniu.rsf.listPrefix(config.qiniu.bucket, null, marker, null, function(err, ret) {
            if (!err) {
                if(!ret.items[0]){
                   callback(files);
                   return;
                }
                for(var index in ret.items){
                    files.push({
                        name: ret.items[index].key,
                        size: ret.items[index].fsize,
                        time: ret.items[index].putTime
                    });
                }
                getFileList(ret.marker, files, callback);
            } else {
                console.log(err)
            }
        });
    }else{
        callback(files);
    }
}

function deleteFile(key, callback){
    client.remove(config.qiniu.bucket, key, function(err, ret) {
        if (!err) {
            callback(ret);
        } else {
            console.log(err);
        }
    });
}

function moveFile(keySrc, keyDest, callback){
    client.move(config.qiniu.bucket, keySrc,
                config.qiniu.bucket, keyDest, function(err, ret){
        if(!err){
            callback(ret);
        }else{
            console.log(err);
        }
    });
}

function getUpToken(){
    var putPolicy = new qiniu.rs.PutPolicy(config.qiniu.bucket);
    return putPolicy.token();
}

function getDownloadUrl(key){
    var baseUrl = qiniu.rs.makeBaseUrl(config.qiniu.domain, key);
    var policy = new qiniu.rs.GetPolicy();
    return policy.makeRequest(baseUrl);
}

exports.getFileList = getFileList;
exports.deleteFile = deleteFile;
exports.moveFile = moveFile;
exports.getUpToken = getUpToken;
exports.getDownloadUrl = getDownloadUrl;
