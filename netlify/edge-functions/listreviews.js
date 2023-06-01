import {
   EleventyEdge,
   precompiledAppData,
 } from "./_generated/eleventy-edge-app.js";
 import idsmap from "./_generated/idsmap.js";

 
 export default async (request, context) => {
   //Getting this edge to work was an adventure. I did not realize that the edge does not have access to my node_modules
   //So something as simple as pulling in environment variables was a challenge. I initially wanted to connect to an api directly but I only 
   //have access to out of the box modules like fetch. 
   //Also, I could not figure out how to pass parameters in other than via the URL. But netlify downcases all URL. And slugify will downcase all urls. 
   //So I had to generate a file at build time and feed it to the _generated directory. This file includes a mapping of downcase URLs to the actual case sensitive URLs.
   //My api requires case sensitive URLs. 
   //This edge gets the URL Product Id and converts it to case sensitive. Then it passes it to the reviews endpoint in the api. 
   let url = new URL(request.url);
   console.log(idsmap);
   let productId = url.pathname.split("/")[2]
         try {
         let edge = new EleventyEdge("edge", {
            request,
            context,
            precompiled: precompiledAppData,
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

            //let getTopicsData = await fetch('https://reviews-api.herokuapp.com/sf-api/topics/'+caseSensProdId +'/100');
            //let topicsData = reviewsdata.json();
            let topicCategoryCountMap = new Map();
            let topicSentimentCountMap = new Map();
            topicSentimentCountMap.set("Positive",0);
            topicSentimentCountMap.set("Neutral", 0);
            topicSentimentCountMap.set("Negative",0);
            console.log(reviewsdata);  
            reviewsdata.forEach(data => {
               console.log(data);
               if(data.Topics__r){
                  data.Topics__r.records.forEach(topic => {
                     if(topicCategoryCountMap.get(topic.Topic_Category__c) == undefined){
                        topicCategoryCountMap.set(topic.Topic_Category__c, 1);
                     }else{
                        topicCategoryCountMap.set(topic.Topic_Category__c, topicCategoryCountMap.get(topic.Topic_Category__c)+1);
                     }
                     topicSentimentCountMap.set(topic.Topic_Sentiment__c, topicSentimentCountMap.get(topic.Topic_Sentiment__c)+1);
                  });
               }
               
               
               
            });

            console.log(Array.from(topicCategoryCountMap.keys()));
            console.log(JSON.stringify(Array.from(topicCategoryCountMap.keys())));
            edge.config((eleventyConfig) => {
               eleventyConfig.addGlobalData("SomeData", reviewsdata);
               eleventyConfig.addGlobalData("CategoryDataLabels", JSON.stringify(Array.from(topicCategoryCountMap.keys())));
               eleventyConfig.addGlobalData("CategoryDataValues", JSON.stringify(Array.from(topicCategoryCountMap.values())));
               eleventyConfig.addGlobalData("SentimentDataLabels", JSON.stringify(Array.from(topicSentimentCountMap.keys())));
               eleventyConfig.addGlobalData("SentimentDataValues", JSON.stringify(Array.from(topicSentimentCountMap.values())));

            });
         }
         return await edge.handleResponse();
         } catch (e) {
         console.log("ERROR", { e });
         return context.next(e);
         }
   
 };
 