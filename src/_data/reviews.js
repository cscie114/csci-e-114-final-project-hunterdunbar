require('dotenv').config();
let EleventyFetch = require('@11ty/eleventy-fetch');
let fs = require('fs');

module.exports = async function () {

   let products = await EleventyFetch(process.env.apiUrl+'/sf-api/products/', {
      duration: "1d", // save for 1 day
      type: "json"    // we’ll parse JSON for you
   });
   let reviews = [];
   for(var i=0;i<products.length;i++){
      console.log(products[i].Id);
      let response = await EleventyFetch(process.env.apiUrl+'/sf-api/reviews/'+products[i].Id, {
         duration: "1d", // save for 1 day
         type: "json"    // we’ll parse JSON for you
       });
       console.log(response.length);
       if(response && response.length > 0){
         reviews = reviews.concat(response);
      }

   }

   let fileToCreate = '';
    let theMap = new Map();
    for(var i=0;i<reviews.length;i++){
      theMap.set(reviews[i].Id.toLowerCase(),reviews[i].Id);
    }
    console.log(theMap);
    mapString = JSON.stringify(Object.fromEntries(theMap));
    fileToCreate = "export default "+mapString;
    fs.writeFile('netlify/edge-functions/_generated/reviewsidsmap.js', fileToCreate, function (err) {
      if (err) throw err;
      console.log('Replaced!');
    });


   //console.log(reviews);
   /*reviews.filter(removenullids);
   function removenullids(data){
      if(data.Id.toLowerCase() == 'a00dm000001yvunias'){
         console.log(data.Name);
      }
      reviews.findIndex( item => data.Id.toLowerCase())
      //console.log('review ids'+data.Id)
      return data.Id != undefined && !reviews.includes(data.Id);
   }*/
   return reviews;
  
}
