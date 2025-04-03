import { schedule } from "node-cron";
import Log from "./utils/log.js";
import { FollowerManager } from "./followerManager.js";
import { meta } from "../config/config.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

const appname = meta.getName();
const version = meta.getVersion();
const author = meta.getAuthor();
const pad = 16 + appname.length + version.toString().length + author.length;

Log.raw(
    "\n" +
    " #" + "-".repeat(pad) + "#\n" +
    " # Started " + appname + " v" + version + " by " + author + " #\n" +
    " #" + "-".repeat(pad) + "#\n",
);

Log.info("--- START ---");
Log.info(appname + " v" + version + " by " + author);

Log.debug("Environment: " + process.env.NODE_ENV, true);
Log.debug("Bun version: " + process.versions.bun, true);
Log.debug("OS: " + process.platform + " " + process.arch, true);

const followerManager = new FollowerManager();

followerManager.checkFollowers();

schedule("0 * * * *", () => followerManager.checkFollowers());

Log.info("Cron job scheduled to run every hour");
