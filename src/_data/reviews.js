require('dotenv').config();
let EleventyFetch = require('@11ty/eleventy-fetch');

module.exports = async function () {
   //We are using eleventy fetch to connect to a heroku app. The heroku app hosts an express app which uses an npm package to connect to a Salesforce.com api which contains some 
   //product review data. I used EleventyFetch so that I would not be making a new API call everytime I regenerated the site. The API has some volume limitations and I did not want to exceed the number of calls allotted to me.
   //This gets all products. There are about 30 of them. Then it passes each product to a different route to get a certain number of reviews for the product. 
   //This was the least relevant aspect of the course work and took me a tremendous amount of troubleshooting because the npm package that I was using to connect to Salesforce had a steep learning curve. 
   //JSFORCE is the name of the npm package. It relies heavily on promises and I clearly need to brush up on how promises work. 
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

   return reviews;
  
}
