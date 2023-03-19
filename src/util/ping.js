const axios = require("axios");
const urlSchema = require("../models/urlSchema");

module.exports = async () => {
    try {
        const urls = await urlSchema.find();

        for(const item of urls) {
            try {
                const req = await axios.get(item.url);

                await urlSchema.findOneAndUpdate({ url: item.url }, {
                    last_request: {
                        status_code: `${req.status}`
                    }
                })
            } catch(err) {
                console.log(`[PING] Failed to fetch "${item.url}" with a status code of ${err.response.status}`);

                await urlSchema.findOneAndUpdate({ url: item.url }, {
                    last_request: {
                        status_code: `${err.response.status}`
                    }
                })
            }
        }
    } catch(err) {
        console.log(err);
    }
}