import {
   EleventyEdge,
   precompiledAppData,
 } from "./_generated/eleventy-edge-app.js";
 import idsmap from "./_generated/idsmap.js";

 
 export default async (request, context) => {
   let url = new URL(request.url);
   console.log(idsmap);
   let productId = url.pathname.split("/")[2]
         try {
         let edge = new EleventyEdge("edge", {
            request,
            context,
            precompiled: precompiledAppData,
      
            // default is [], add more keys to opt-in e.g. ["appearance", "username"]
            cookies: [],
         });
         let productIdMap = new Map(Object.entries(idsmap));
         console.log(productIdMap);
         console.log(productId);
         let caseSensProdId = productIdMap.get(productId.toLowerCase());
         console.log(caseSensProdId);
         if(caseSensProdId){
            let getReviewsData = await fetch('https://reviews-api.herokuapp.com/sf-api/reviews/'+caseSensProdId +'/100');
            let reviewsdata = await getReviewsData.json();
            edge.config((eleventyConfig) => {
               eleventyConfig.addGlobalData("SomeData", reviewsdata);
            });
         }
         return await edge.handleResponse();
         } catch (e) {
         console.log("ERROR", { e });
         return context.next(e);
         }
   
 };
 