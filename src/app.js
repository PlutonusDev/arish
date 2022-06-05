(async () => {
	const discord = require("discord.js");
	const client = new discord.Client();
	const chalk = (await import("chalk")).default;
	const config = require("./config");

	client.once("ready", async () => {
		console.log(chalk.blue(`\tLogged in as: ${chalk.green(`${client.user.username}#${client.user.discriminator}`)} (${chalk.white(client.user.id)})`));
		console.log(chalk.blue("\tVerifying config file..."));
		try {
			// Check these on bot startup and intentionally die if something goes wrong.
			for(let guildId of config.FROMGUILDS) {
				console.log(chalk.green(`\t\tFROMGUILD > ${guildId}`));
				client.guilds.get(guildId);
			}
			console.log(chalk.green(`\t\tTOCHANNEL > ${config.TOCHANNEL}`));
			client.channels.get(config.TOCHANNEL);
		} catch {
			console.log(chalk.red("\tConfiguration error! One or more guilds or the channel doesn't exist!"));
			process.exit(0);
		}
		console.log(chalk.green("\t\tCONFIG CHECK SUCCESSFUL!"));
		console.log(chalk.blue("\tREADY!\n"));
	});

	client.on("message", msg => {
		if(
			msg.channel.type === "text"
			&& config.FROMGUILDS.includes(msg.guild.id)
			&& (msg.attachments.first() || msg.embeds[0])
		) {
			console.log(chalk.blue(`\tIntercepted message:\n\t\tUSER:    ${chalk.green(msg.author.username)}\n\t\tCHANNEL: #${chalk.green(msg.channel.id)}\n\t\tGUILD:   ${chalk.green(msg.guild.name)}\n`));
			client.channels.get(config.TOCHANNEL).send(`Got message from \` ${msg.author.username} \` in \` #${msg.channel.name} \` in server \` ${msg.guild.name} \`:\n${msg.content ? `\n__**Content:**__\n${msg.content}\n` : ""}\n__**Attachments:**__\n${msg.attachments.map(att => att.url).join("\n")}\n\n__**Embed info:**__\n\`\`\`js\n${JSON.stringify(msg.embeds)}\n\`\`\``);
		}
	});

	client.login(config["TOKEN"]);
})();
