module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addFilter("dateShort", date =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
  );

  eleventyConfig.addFilter("dateLong", date =>
    new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
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
