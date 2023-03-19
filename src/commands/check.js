const checkURL = require("@williamharrison/validate-url");
const emoji = require("../config.json").emojis;
const urlSchema = require("../models/urlSchema");

module.exports = {
	name: "check",
	description: "Check a URL's last request.",
    options: [
        {
            type: 3,
            name: "url",
            description: "The URL to be checked.",
            max_length: 1024,
            required: true
        }
    ],
    botPermissions: [],
    enabled: true,
	async execute(interaction, client, Discord) {
        try {
            const url = interaction.options.getString("url");

            if(!checkURL(url)) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} Please enter a valid URL!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            if(!await urlSchema.exists({ url: url })) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} That URL is not in the database!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const data = await urlSchema.findOne({ url: url });

            const lastRequest = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setTitle("Last Request")
                .addFields (
                    { name: "URL", value: `${url}` },
                    { name: "Status Code", value: `${data.last_request.status_code}` }
                )

            await interaction.editReply({ embeds: [lastRequest] });
        } catch(err) {
            client.logCommandError(interaction, Discord);
        }
    }
}