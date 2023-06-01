import {
   EleventyEdge,
   precompiledAppData,
 } from "./_generated/eleventy-edge-app.js";
 import idsmap from "./_generated/idsmap.js";

 
 export default async (request, context) => {
   //This is not used/under construction. 

   let url = new URL(request.url);
   let productId = url.pathname.split("/")[2]
   if(url.pathname.includes("/create-review/") && request.method === "POST") {
      if(request.headers.get("content-type") === "application/x-www-form-urlencoded") {
        let body = await request.clone().formData();
        console.log(body);
        let postData = Object.fromEntries(body);
         try {
         let edge = new EleventyEdge("edge", {
            request,
            context,
            precompiled: precompiledAppData,
      
            // default is [], add more keys to opt-in e.g. ["appearance", "username"]
            cookies: [],
         });
         console.log(postData);
         let productIdMap = new Map(Object.entries(idsmap));
         console.log(productIdMap);
         console.log(productId);
         let caseSensProdId = productIdMap.get(productId.toLowerCase());
         console.log(caseSensProdId);
         if(caseSensProdId){
            let apiResponse = await fetch('https://reviews-api.herokuapp.com/sf-api/reviews/'+caseSensProdId+'/',{
               method: "POST",
               headers:{
                  "Content-Type":"application/json"
               },
               body: JSON.stringify(postData)
            });

            let gptresponse = await apiResponse.json();
            edge.config((eleventyConfig) => {
               eleventyConfig.addGlobalData("SomeData", gptresponse.content);
            });
         }
         return await edge.handleResponse();
         } catch (e) {
         console.log("ERROR", { e });
         return context.next(e);
         }
      }
   }
 };
 