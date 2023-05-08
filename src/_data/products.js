require('dotenv').config();
let EleventyFetch = require('@11ty/eleventy-fetch');
let fs = require('fs');

module.exports = async function () {

   let data = await EleventyFetch(process.env.apiUrl+'/sf-api/products/', {
      duration: "1d", // save for 1 day
      type: "json"    // we’ll parse JSON for you
    });
    let fileToCreate = '';
    let theMap = new Map();
    console.log(data);
    for(var i=0;i<data.length;i++){
      theMap.set(data[i].Id.toLowerCase(),data[i].Id);
    }
    console.log(theMap);
    mapString = JSON.stringify(Object.fromEntries(theMap));
    fileToCreate = "export default "+mapString;
    fs.writeFile('netlify/edge-functions/_generated/idsmap.js', fileToCreate, function (err) {
      if (err) throw err;
      console.log('Replaced!');
    });
    return data;

}
