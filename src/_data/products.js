require('dotenv').config();
let EleventyFetch = require('@11ty/eleventy-fetch');

module.exports = async function () {
   //We are using eleventy fetch to connect to a heroku app. The heroku app hosts an express app which uses an npm package to connect to a Salesforce.com api which contains some 
   //product review data. 
   let data = await EleventyFetch(process.env.apiUrl+'/sf-api/products/', {
      duration: "1d", // save for 1 day
      type: "json"    // we’ll parse JSON for you
    });
    return data;

}
