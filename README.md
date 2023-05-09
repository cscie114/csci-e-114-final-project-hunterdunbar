# Product Reviews Application
We recently had a hackathon at work to use chatGPT for unique use cases. We build a python application that passes product reviews information to chatGPT and prompts the model to break down the topics and sentiment of the reviews. 
The team had previously built this with an Amazon sentiment model tool but the ChatGPT model provide more accurate and detailed sentiment analysis. 

The purpose of this project was to use eleventy and edge functions to expose the data that was collected. The data model is Products > Reviews > Topics. On build, data providers in the _data directory make a callout to the heroku-hosted API to pull in data from the data source. All this data is currently stored in a Salesforce database. I initially started loading this data into a cockroach db but the prisma plugin was creating challenges and I wanted to focus on my static site and not on building a database. This backfired because I ended up spending a lot of time debugging issues with the NPM jsforce package. The code for the API is here: https://github.com/hunterdunbar/reviews-api The only file that matter is routes/sf-api.js

Another unique thing that happens on build is that idsmap.liquid and reviewidsmap.liquid will generate javascript files in the _generated directory of my netlify/edge-functions directory. The reason for this is that I make a callout to my API anytime a product page is loaded. I use a productid parameter from the URL to specify the product to load reviews for. Netlify and Eleventy want to downcase all url params which created issues with my api. So I generate a map of downcased IDs to normal cased Ids and then use those for the API call. 

Otherwise this is a pretty basic site. There were a lot of difficulties getting the edge functions to work when deploying from Github to Netlify and I eventually punted on it and am just using the out of the box Netlify CI. The deploy to netlify is commented in my CI.yaml. The deployment worked but I could not get the build to build the site in a way that would generate my edge functions correctly. 

Things to add to this project would be:
- auth
- a form for creating reviews
- some summary level information on the topics for each product

To run this project:

```
git clone https://github.com/cscie114/csci-e-114-final-project-hunterdunbar.git
```

```
npm init
```

```
npx netlify dev
```

