import {
   EleventyEdge,
   precompiledAppData,
 } from "./_generated/eleventy-edge-app.js";

 
 export default async (request, context) => {
   let url = new URL(request.url);
   let productId = url.pathname.split("/")[2]
         try {
         let edge = new EleventyEdge("edge", {
            request,
            context,
            precompiled: precompiledAppData,
      
            // default is [], add more keys to opt-in e.g. ["appearance", "username"]
            cookies: [],
         });
         let getReviewsData = await fetch('https://reviews-api.herokuapp.com/sf-api/reviews/'+productId +'/10');
         let reviewsdata = await getReviewsData.json();
         edge.config((eleventyConfig) => {
            eleventyConfig.addGlobalData("SomeData", reviewsdata);
         });
         
         return await edge.handleResponse();
         } catch (e) {
         console.log("ERROR", { e });
         return context.next(e);
         }
   
 };
 