const checkURL = require("@williamharrison/validate-url");
const emoji = require("../config.json").emojis;
const urlSchema = require("../models/urlSchema");

module.exports = {
	name: "remove",
	description: "Remove a URL from the database.",
    options: [
        {
            type: 3,
            name: "url",
            description: "The URL to be removed.",
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

            await urlSchema.findOneAndDelete({ url: url });

            const removed = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.successful} The URL has been removed from the database.`)

            await interaction.editReply({ embeds: [removed] });
        } catch(err) {
            client.logCommandError(interaction, Discord);
        }
    }
}