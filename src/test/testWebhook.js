import { DiscordSender } from "../discordSender.js";
import Log from "../utils/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const sender = new DiscordSender();

try {
    await sender.sendEmbed(
        "Webhook Test",
        "If you can see this message, the webhook is working correctly!",
        // 0x00ff00, // Green color
    );
    Log.done("Test message sent successfully!");
}
catch (error){
    Log.error("Failed to send test message:", error);
}
