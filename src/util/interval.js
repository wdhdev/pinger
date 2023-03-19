const ping = require("./ping");

module.exports = async () => {
    setInterval(async () => {
        await ping();
    }, 60000);
}