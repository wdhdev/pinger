const ping = require("../util/ping");

const emoji = require("../config.json").emojis;

module.exports = {
	name: "trigger",
	description: "Manually trigger the ping.",
    options: [],
    botPermissions: [],
    enabled: true,
	async execute(interaction, client, Discord) {
        try {
            ping();

            const done = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.successful} Done.`)

            await interaction.editReply({ embeds: [done] });
        } catch(err) {
            client.logCommandError(interaction, Discord);
        }
    }
}