var mongoose = require('mongoose');

var ShortUrlSchema = new mongoose.Schema({
  original_url: {type: String, required: true},
  short_url: {type: String, unique: true}
});

ShortUrlSchema.methods.getPublicFields = function () {
    var returnObject = {
        original_url: this.original_url,
        short_url: this.short_url
    };
    return returnObject;
};

module.exports = mongoose.model('ShortUrl', ShortUrlSchema);