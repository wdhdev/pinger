const emoji = require("../../config.json").emojis;

module.exports = {
	name: "interactionCreate",
	async execute(client, Discord, interaction) {
        try {
            const requiredPerms = ["SendMessages", "EmbedLinks"];

            if(!interaction.guild.members.me.permissions.has(requiredPerms)) return;
            if(!interaction.type === Discord.InteractionType.ApplicationCommand) return;

            const command = client.commands.get(interaction.commandName);

            if(!command) return;

            await interaction.deferReply();

            const owner = client.config_default.owners.includes(interaction.user.id);

            if(!owner) return;

            if(command.enabled === false) {
                const commandDisabled = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.error} This command has been disabled!`)

                await interaction.editReply({ embeds: [commandDisabled] });
                return;
            }

            const validPermissions = client.validPermissions;

            if(command.botPermissions.length) {
                const invalidPerms = [];

                for(const perm of command.botPermissions) {
                    if(!validPermissions.includes(perm)) {
                        return;
                    }

                    if(!interaction.guild.members.me.permissions.has(perm)) {
                        invalidPerms.push(perm);
                    }
                }

                if(invalidPerms.length) {
                    const permError = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`I am missing these permissions: \`${invalidPerms.join("\`, \`")}\``)

                    await interaction.editReply({ embeds: [permError] });
                    return;
                }
            }

            try {
                await command.execute(interaction, client, Discord);
            } catch(err) {
                client.logEventError(interaction, Discord);
            }
        } catch(err) {
            console.error(err);
        }
    }
}