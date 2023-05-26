const { EleventyEdgePlugin } = require("@11ty/eleventy");

//Nothing crazy in this file. It just includes the EleventyEdgePlugin and a link to the css assets.
module.exports = function(eleventyConfig) {

    eleventyConfig.addPlugin(EleventyEdgePlugin);
    eleventyConfig.addPassthroughCopy("src/assets/**");

   return {
      dir: {
         input: "src",
         output: "dist"
      }
   };
   };