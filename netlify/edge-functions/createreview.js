import {
   EleventyEdge,
   precompiledAppData,
 } from "./_generated/eleventy-edge-app.js";
 
 export default async (request, context) => {
   let url = new URL(request.url);
   if(url.pathname === "/create-review/" && request.method === "POST") {
      if(request.headers.get("content-type") === "application/x-www-form-urlencoded") {
        let body = await request.clone().formData();
        let postData = Object.fromEntries(body);
         try {
         let edge = new EleventyEdge("edge", {
            request,
            context,
            precompiled: precompiledAppData,
      
            // default is [], add more keys to opt-in e.g. ["appearance", "username"]
            cookies: [],
         });
         console.log("We are in the edge");
         edge.config((eleventyConfig) => {
            eleventyConfig.addGlobalData("SomeData", postData);
         });
         
         return await edge.handleResponse();
         } catch (e) {
         console.log("ERROR", { e });
         return context.next(e);
         }
      }
   }
 };
 