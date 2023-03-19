const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    url: String,
    last_request: Object
})

module.exports = mongoose.model("urls", schema, "urls")