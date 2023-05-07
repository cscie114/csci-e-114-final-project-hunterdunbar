require('dotenv').config();
let EleventyFetch = require('@11ty/eleventy-fetch');

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
   console.log(reviews);
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
