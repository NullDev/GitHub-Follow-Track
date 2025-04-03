import fs from "node:fs/promises";
import path from "node:path";
import Log from "./utils/log.js";
import { DiscordSender } from "./discordSender.js";
import { config } from "../config/config.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

export class FollowerManager {
    constructor(){
        this.URL = `https://api.github.com/users/${config.user}/followers?per_page=100`;
        this.FOLLOWERS_FILE = path.join(process.cwd(), "followers.json");
        this.discordSender = new DiscordSender();
    }

    async fetchFollowers(){
        let allFollowers = [];
        let page = 1;
        let hasMore = true;

        while (hasMore){
            try {
                const response = await fetch(`${this.URL}&page=${page}`);
                if (!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const followers = await response.json();
                if (followers.length === 0){
                    hasMore = false;
                    break;
                }
                allFollowers = allFollowers.concat(followers.map(follower => ({
                    login: follower.login,
                    html_url: follower.html_url,
                })));
                page++;
            }
            catch (error){
                Log.error(`Failed to fetch followers: ${error.message}`);
                return [];
            }
        }
        return allFollowers;
    }

    async loadPreviousFollowers(){
        try {
            const data = await fs.readFile(this.FOLLOWERS_FILE, "utf-8");
            return JSON.parse(data);
        }
        catch (error){
            if (error.code === "ENOENT"){
                return [];
            }
            Log.error(`Failed to load previous followers: ${error.message}`);
            return [];
        }
    }

    async saveFollowers(followers){
        try {
            await fs.writeFile(this.FOLLOWERS_FILE, JSON.stringify(followers, null, 2));
        }
        catch (error){
            Log.error(`Failed to save followers: ${error.message}`);
        }
    }

    async checkFollowers(){
        const currentFollowers = await this.fetchFollowers();
        const previousFollowers = await this.loadPreviousFollowers();

        const newFollowers = currentFollowers.filter(follower =>
            !previousFollowers.some(prev => prev.login === follower.login),
        );
        const unfollowed = previousFollowers.filter(prev =>
            !currentFollowers.some(follower => follower.login === prev.login),
        );

        const oldCount = previousFollowers.length;
        const newCount = currentFollowers.length;
        const diff = newCount - oldCount;
        const diffText = diff > 0 ? `+${diff}` : diff.toString();

        await this.saveFollowers(currentFollowers);

        if (oldCount === 0 && newCount > 0){
            Log.info("First start, skipping.");
            return;
        }

        if (newFollowers.length > 0){
            Log.info(`New followers (${newFollowers.length}): ${newFollowers.map(f => f.login).join(", ")}`);
            await this.discordSender.sendEmbed(
                `${newFollowers.length === 1 ? "New Follower" : "New Followers"}`,
                `${newFollowers.map(f => `[${f.login}](${f.html_url})`).join("\n")}\n\nTotal: ${oldCount} → ${newCount} (${diffText})`,
            );
        }

        if (unfollowed.length > 0){
            Log.warn(`Unfollowed (${unfollowed.length}): ${unfollowed.map(f => f.login).join(", ")}`);
            await this.discordSender.sendEmbed(
                `${unfollowed.length === 1 ? "Unfollowed" : "Unfollowed"}`,
                `${unfollowed.map(f => `[${f.login}](${f.html_url})`).join("\n")}\n\nTotal: ${oldCount} → ${newCount} (${diffText})`,
            );
        }

        if (newFollowers.length === 0 && unfollowed.length === 0){
            Log.info("No changes in followers.");
        }
    }
}
