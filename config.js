var qiniu = {
  accessKey: process.env.ACCESS_KEY || '<ACCESS_KEY>',
  secretKey: process.env.SECRET_KEY || '<SECRET_KEY>',
  bucket: process.env.BUCKET || '<BUCKET>',
  domain: process.env.DOMAIN || '<DOMAIN>'
};

//echo -n '<passwd>' | md5sum
var passwd = process.env.PASSWD || '<PASSWD>';

exports.qiniu = qiniu;
exports.passwd = passwd;
