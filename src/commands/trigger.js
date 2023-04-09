const ping = require("../util/ping");

const emoji = require("../config.json").emojis;

module.exports = {
	name: "trigger",
	description: "Manually trigger server pinging.",
    options: [],
    botPermissions: [],
    enabled: true,
	async execute(interaction, client, Discord) {
        try {
            ping();

            const done = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.successful} Server pinging has been triggered..`)

            await interaction.editReply({ embeds: [done] });
        } catch(err) {
            client.logCommandError(interaction, Discord);
        }
    }
}
