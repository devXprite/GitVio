const express = require("express");
const { recentProfiles } = require("../src/recentProfiles");

const router = express.Router();

router.get("/", async (req, res) => {
  const profiles = await recentProfiles(2000, false);
  const profileUrls = profiles.map((profile) => `https://gitvio.vercel.app/@${profile.login}`);
  const siteMap = profileUrls.join("\n");
  res.set("Content-Type", "text/plain").send(siteMap);
});

module.exports = router;
