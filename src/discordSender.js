import { config } from "../config/config.js";
import Log from "./utils/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

export class DiscordSender {
    constructor(){
        this.webhookUrl = config.discord_webhook;
    }

    async sendEmbed(title, description, color = 0x2ecc71){
        const embed = {
            embeds: [{
                title,
                description,
                color,
                timestamp: new Date().toISOString(),
            }],
        };

        try {
            const response = await fetch(this.webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(embed),
            });

            if (!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            Log.done(`Discord message sent successfully: ${title}`);
        }
        catch (error){
            Log.error(`Failed to send Discord message: ${error.message}`);
        }
    }
}
