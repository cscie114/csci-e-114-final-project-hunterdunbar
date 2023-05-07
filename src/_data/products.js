require('dotenv').config();
let EleventyFetch = require('@11ty/eleventy-fetch');

module.exports = async function () {

   return EleventyFetch(process.env.apiUrl+'/sf-api/products/', {
      duration: "1d", // save for 1 day
      type: "json"    // we’ll parse JSON for you
    });
  
}
