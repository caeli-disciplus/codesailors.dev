const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const assetHashes = new Map();

function assetHash(filename) {
  if (!assetHashes.has(filename)) {
    const content = fs.readFileSync(path.join(__dirname, "src", "assets", filename));
    assetHashes.set(filename, crypto.createHash("sha256").update(content).digest("hex").slice(0, 8));
  }
  return assetHashes.get(filename);
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addShortcode("asset", filename => `/assets/${filename}?v=${assetHash(filename)}`);

  eleventyConfig.addFilter("dateShort", date =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
  );

  eleventyConfig.addFilter("dateLong", date =>
    new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("dateYear", date =>
    new Date(date === "now" ? Date.now() : date).toLocaleDateString("en-US", { year: "numeric", timeZone: "UTC" })
  );

  eleventyConfig.addFilter("limit", (arr, n) => arr.slice(0, n));

  eleventyConfig.addFilter("getPrevPost", function(posts, url) {
    const sorted = [...posts].reverse();
    const index = sorted.findIndex(p => p.url === url);
    return index > 0 ? sorted[index - 1] : null;
  });

  eleventyConfig.addFilter("getNextPost", function(posts, url) {
    const sorted = [...posts].reverse();
    const index = sorted.findIndex(p => p.url === url);
    return index < sorted.length - 1 ? sorted[index + 1] : null;
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes" }
  };
};
