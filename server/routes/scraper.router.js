// routes/scraper.router.js
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');  // this is javascripts html parsing/scraping library
const natural = require('natural'); // natural supports tokenization and 
// classification of data/words, which
// allows us to break down language into segments for our
// machine learning nlp library

const NodeGeocoder = require('node-geocoder'); // turns addresses into lat. and long. and vice versa

const fs = require('fs').promises; // file system for reading/writing purposes
// promises specifically provide async file system methods based on failure
// or success. Its how we get the .json file to save to our root directory
// (will need logic if we want to READ that file eventually though)


// scraper function, takes URL parameter and scans the url for
// the data we are looking for (bars and restaurants with happy hours)
// this runs in a headless (no gui) terminal

async function scrapeHappyHours(url) {

  console.log("Scraping:", url); // log it so we know what url we're scraping at the moment
  // helps use keep track of the process

  const browser = await puppeteer.launch({headless: 'new'}); // use headless mode with puppeteer

  const page = await browser.newPage(); // this opens new pages in the "browser"

  await page.goto(url, {waitUntil: 'networkidle0'}); // go to the given url, and wait 
  // until no network connections for 500ms; we do this to prevent causing
  // server issues for the websites we are scraping and also
  // to prevent being timed out or blocked access to a site 
  // for intiaiting too many requests in a short period of time

  let happyHours = []; // init empty array to store scraped info
  
  try {
    // scraping logic

    // page.evaluate function for exceuting JS on the page we are currently on
    happyHours = await page.evaluate(() => {

      const items = document.querySelectorAll('div, p, span'); // grab all divs, paragraphs, and spans


      // extract the text and HTML content of element then filter the ones that have 'happy hour', 'discount', or 'special' in them
      // we can mess with this to select different text contents from the page
      // as in, we could add a item.text.toLowerCase().includes('drinks')
      // if we wanted to 
      return Array.from(items).map(item => ({
        text: item.innerText,
        html: item.innerHTML
      })).filter(item => 
        item.text.toLowerCase().includes('happy hour') || 
        item.text.toLowerCase().includes('discount') ||
        item.text.toLowerCase().includes('special')
      );
    });
  } catch (error) {
    // error handling that lets us know which url we
    // are having issues with and what the error is
    console.error(`Error scraping ${url}:`, error);
  }

  await browser.close(); // this closes the browser and page when we are done
  return happyHours; // return for the scraped data
}


// this is where natural.js is used for machine learning and
// language processing, the first line inits a a new instance 
// of natural
const classifier = new natural.BayesClassifier();

// this is training info, TEAM: if you need more references about how this
// works check out commented section at the bottom of the AboutPage.jsx


// Cozy

classifier.addDocument('warm and inviting atmosphere', 'cozy');
classifier.addDocument('soft, ambient lighting', 'cozy');
classifier.addDocument('comfortable and snug setting', 'cozy');
classifier.addDocument('intimate and relaxing environment', 'cozy');
classifier.addDocument('homey feel with soft lighting', 'cozy');
classifier.addDocument('welcoming space with warm tones', 'cozy');
classifier.addDocument('relaxed and comfortable atmosphere', 'cozy');
classifier.addDocument('dim lighting with a peaceful vibe', 'cozy');
classifier.addDocument('charming and inviting surroundings', 'cozy');
classifier.addDocument('pleasantly warm and cushy environment', 'cozy');
classifier.addDocument('tranquil setting with gentle lighting', 'cozy');
classifier.addDocument('relaxing ambiance with soft furnishings', 'cozy');
classifier.addDocument('cozy nook with plush seating', 'cozy');
classifier.addDocument('intimate space with calming lighting', 'cozy');
classifier.addDocument('warm and soothing atmosphere', 'cozy');
classifier.addDocument('comfortably lit and snug setting', 'cozy');
classifier.addDocument('peaceful space with dim lights', 'cozy');
classifier.addDocument('comfortable and warm atmosphere', 'cozy');
classifier.addDocument('softly lit and inviting space', 'cozy');
classifier.addDocument('cozy corner with ambient lighting', 'cozy');

// Trendy

classifier.addDocument('contemporary decor and stylish art', 'trendy');
classifier.addDocument('modern furnishings and chic design', 'trendy');
classifier.addDocument('fashionable interior with cutting-edge style', 'trendy');
classifier.addDocument('sleek and sophisticated decor', 'trendy');
classifier.addDocument('up-to-date with the latest design trends', 'trendy');
classifier.addDocument('modern and fashionable environment', 'trendy');
classifier.addDocument('hip and stylish ambiance', 'trendy');
classifier.addDocument('innovative and contemporary design', 'trendy');
classifier.addDocument('modern aesthetics with a trendy vibe', 'trendy');
classifier.addDocument('stylish decor with a modern touch', 'trendy');
classifier.addDocument('cool and contemporary space', 'trendy');
classifier.addDocument('fashion-forward interior design', 'trendy');
classifier.addDocument('on-trend with the latest decor', 'trendy');
classifier.addDocument('sleek design with modern art', 'trendy');
classifier.addDocument('chic and contemporary atmosphere', 'trendy');
classifier.addDocument('trendsetting design and decor', 'trendy');
classifier.addDocument('stylish space with modern furnishings', 'trendy');
classifier.addDocument('cutting-edge interior with trendy details', 'trendy');
classifier.addDocument('modern and sleek ambiance', 'trendy');
classifier.addDocument('stylishly decorated with contemporary art', 'trendy');

// Dog Friendly

classifier.addDocument('dog-friendly patio', 'pet-friendly');
classifier.addDocument('pet-friendly environment with water bowls', 'dog friendly');
classifier.addDocument('outdoor seating area welcoming dogs', 'dog friendly');
classifier.addDocument('dog-friendly space with treats available', 'dog friendly');
classifier.addDocument('ample space for dogs to play', 'dog friendly');
classifier.addDocument('patio area that welcomes pets', 'dog friendly');
classifier.addDocument('designated dog-friendly zones', 'dog friendly');
classifier.addDocument('dog-friendly park nearby', 'dog friendly');
classifier.addDocument('welcomes dogs with open arms', 'dog friendly');
classifier.addDocument('dog-friendly policies in place', 'dog friendly');
classifier.addDocument('dogs allowed inside and outside', 'dog friendly');
classifier.addDocument('provides dog waste bags', 'dog friendly');
classifier.addDocument('features dog-friendly amenities', 'dog friendly');
classifier.addDocument('offers dog-friendly services', 'dog friendly');
classifier.addDocument('space for dogs to relax', 'dog friendly');
classifier.addDocument('welcomes furry friends', 'dog friendly');
classifier.addDocument('dog-friendly with pet stations', 'dog friendly');
classifier.addDocument('pet-friendly patio', 'dog friendly');
classifier.addDocument('dogs welcome in all areas', 'dog friendly');
classifier.addDocument('provides water bowls for dogs', 'dog friendly');
classifier.addDocument('offers dog-friendly treats', 'dog friendly');

// Casual

classifier.addDocument('relaxed and informal setting', 'casual');
classifier.addDocument('laid-back vibe with simple decor', 'casual');
classifier.addDocument('comfortable and easy-going environment', 'casual');
classifier.addDocument('no dress code required', 'casual');
classifier.addDocument('casual atmosphere with friendly staff', 'casual');
classifier.addDocument('informal dining with a relaxed feel', 'casual');
classifier.addDocument('easy-going and unpretentious', 'casual');
classifier.addDocument('come as you are attitude', 'casual');
classifier.addDocument('casual seating and simple layout', 'casual');
classifier.addDocument('unfussy and straightforward', 'casual');
classifier.addDocument('laid-back ambiance', 'casual');
classifier.addDocument('informal and welcoming', 'casual');
classifier.addDocument('casual environment with a relaxed pace', 'casual');
classifier.addDocument('easy-going with a comfortable vibe', 'casual');
classifier.addDocument('informal setting with a friendly atmosphere', 'casual');
classifier.addDocument('relaxed and unpretentious', 'casual');
classifier.addDocument('casual feel with a homey touch', 'casual');
classifier.addDocument('simple and comfortable', 'casual');
classifier.addDocument('informal and easy-going', 'casual');
classifier.addDocument('relaxed setting with no frills', 'casual');

// Romantic

classifier.addDocument('intimate setting with soft lighting', 'romantic');
classifier.addDocument('candlelit dinners and quiet ambiance', 'romantic');
classifier.addDocument('romantic atmosphere with elegant decor', 'romantic');
classifier.addDocument('cozy and secluded tables', 'romantic');
classifier.addDocument('romantic music and dim lighting', 'romantic');
classifier.addDocument('charming and intimate', 'romantic');
classifier.addDocument('romantic setting perfect for dates', 'romantic');
classifier.addDocument('elegant and intimate dining experience', 'romantic');
classifier.addDocument('romantic ambiance with a touch of elegance', 'romantic');
classifier.addDocument('romantic candlelight and soft music', 'romantic');
classifier.addDocument('intimate and charming atmosphere', 'romantic');
classifier.addDocument('romantic setting with a cozy vibe', 'romantic');
classifier.addDocument('elegant and romantic', 'romantic');
classifier.addDocument('romantic decor with a quiet ambiance', 'romantic');
classifier.addDocument('intimate and elegant', 'romantic');
classifier.addDocument('romantic ambiance with soft lighting and music', 'romantic');
classifier.addDocument('cozy and romantic', 'romantic');
classifier.addDocument('romantic setting with a charming touch', 'romantic');
classifier.addDocument('elegant decor and romantic ambiance', 'romantic');
classifier.addDocument('romantic and cozy atmosphere', 'romantic');

// Lively/Bustling

classifier.addDocument('energetic atmosphere with a busy crowd', 'lively');
classifier.addDocument('lively ambiance with music and chatter', 'lively');
classifier.addDocument('bustling environment with vibrant energy', 'lively');
classifier.addDocument('high-energy space with a lively crowd', 'lively');
classifier.addDocument('bustling venue with live entertainment', 'lively');
classifier.addDocument('lively atmosphere with upbeat music', 'lively');
classifier.addDocument('vibrant and bustling with activity', 'lively');
classifier.addDocument('busy and lively with lots of energy', 'lively');
classifier.addDocument('energetic vibe with a crowded scene', 'lively');
classifier.addDocument('lively and bustling with a festive feel', 'lively');
classifier.addDocument('bustling with people and vibrant energy', 'lively');
classifier.addDocument('lively environment with a buzzing crowd', 'lively');
classifier.addDocument('high-energy atmosphere with lively music', 'lively');
classifier.addDocument('bustling crowd and a lively setting', 'lively');
classifier.addDocument('lively ambiance with an energetic crowd', 'lively');
classifier.addDocument('vibrant atmosphere with a bustling crowd', 'lively');
classifier.addDocument('lively setting with lots of chatter and music', 'lively');
classifier.addDocument('bustling environment with vibrant entertainment', 'lively');
classifier.addDocument('energetic crowd and a lively scene', 'lively');
classifier.addDocument('lively venue with a busy and bustling atmosphere', 'lively');

// Outdoor Seating

classifier.addDocument('outdoor patio seating available', 'outdoor seating');
classifier.addDocument('seating on the outdoor patio', 'outdoor seating');
classifier.addDocument('enjoyable outdoor seating options', 'outdoor seating');
classifier.addDocument('patio seating available outdoors', 'outdoor seating');
classifier.addDocument('outdoor seating with a view', 'outdoor seating');
classifier.addDocument('seating available on the outdoor terrace', 'outdoor seating');
classifier.addDocument('enjoy meals with outdoor seating', 'outdoor seating');
classifier.addDocument('comfortable outdoor seating area', 'outdoor seating');
classifier.addDocument('relaxing outdoor seating options', 'outdoor seating');
classifier.addDocument('patio seating in the open air', 'outdoor seating');
classifier.addDocument('outdoor seating for a fresh dining experience', 'outdoor seating');
classifier.addDocument('dine on the patio with outdoor seating', 'outdoor seating');
classifier.addDocument('outdoor seating in the garden area', 'outdoor seating');
classifier.addDocument('available outdoor seating on the deck', 'outdoor seating');
classifier.addDocument('patio seating under the open sky', 'outdoor seating');
classifier.addDocument('alfresco dining with outdoor seating', 'outdoor seating');
classifier.addDocument('enjoy outdoor seating on the porch', 'outdoor seating');
classifier.addDocument('outdoor seating for a pleasant atmosphere', 'outdoor seating');
classifier.addDocument('terrace seating available outdoors', 'outdoor seating');
classifier.addDocument('outdoor seating in a scenic setting', 'outdoor seating');

// Diets

// Gluten-Free

classifier.addDocument('gluten-free menu options available', 'gluten-free');
classifier.addDocument('offering gluten-free dishes', 'gluten-free');
classifier.addDocument('gluten-free meals on the menu', 'gluten-free');
classifier.addDocument('variety of gluten-free choices', 'gluten-free');
classifier.addDocument('gluten-free dining options', 'gluten-free');
classifier.addDocument('gluten-free friendly menu', 'gluten-free');
classifier.addDocument('gluten-free alternatives available', 'gluten-free');
classifier.addDocument('gluten-free cuisine offered', 'gluten-free');
classifier.addDocument('gluten-free food selection', 'gluten-free');
classifier.addDocument('gluten-free items on the menu', 'gluten-free');
classifier.addDocument('gluten-free options provided', 'gluten-free');
classifier.addDocument('delicious gluten-free dishes', 'gluten-free');
classifier.addDocument('gluten-free meals offered', 'gluten-free');
classifier.addDocument('gluten-free friendly dishes', 'gluten-free');
classifier.addDocument('gluten-free food choices', 'gluten-free');
classifier.addDocument('gluten-free options available for dining', 'gluten-free');
classifier.addDocument('enjoy gluten-free meals', 'gluten-free');
classifier.addDocument('gluten-free cuisine available', 'gluten-free');
classifier.addDocument('gluten-free menu choices', 'gluten-free');
classifier.addDocument('wide range of gluten-free options', 'gluten-free');


// Vegan

classifier.addDocument('vegan menu options available', 'vegan');
classifier.addDocument('offering vegan dishes', 'vegan');
classifier.addDocument('vegan meals on the menu', 'vegan');
classifier.addDocument('variety of vegan choices', 'vegan');
classifier.addDocument('vegan dining options', 'vegan');
classifier.addDocument('vegan-friendly menu', 'vegan');
classifier.addDocument('vegan alternatives available', 'vegan');
classifier.addDocument('vegan cuisine offered', 'vegan');
classifier.addDocument('vegan food selection', 'vegan');
classifier.addDocument('vegan items on the menu', 'vegan');
classifier.addDocument('vegan options provided', 'vegan');
classifier.addDocument('delicious vegan dishes', 'vegan');
classifier.addDocument('vegan meals offered', 'vegan');
classifier.addDocument('vegan-friendly dishes', 'vegan');
classifier.addDocument('vegan food choices', 'vegan');
classifier.addDocument('vegan options available for dining', 'vegan');
classifier.addDocument('enjoy vegan meals', 'vegan');
classifier.addDocument('vegan cuisine available', 'vegan');
classifier.addDocument('vegan menu choices', 'vegan');
classifier.addDocument('wide range of vegan options', 'vegan');


// Vegetarian

classifier.addDocument('vegetarian menu options available', 'vegetarian');
classifier.addDocument('offering vegetarian dishes', 'vegetarian');
classifier.addDocument('vegetarian meals on the menu', 'vegetarian');
classifier.addDocument('variety of vegetarian choices', 'vegetarian');
classifier.addDocument('vegetarian dining options', 'vegetarian');
classifier.addDocument('vegetarian-friendly menu', 'vegetarian');
classifier.addDocument('vegetarian alternatives available', 'vegetarian');
classifier.addDocument('vegetarian cuisine offered', 'vegetarian');
classifier.addDocument('vegetarian food selection', 'vegetarian');
classifier.addDocument('vegetarian items on the menu', 'vegetarian');
classifier.addDocument('vegetarian options provided', 'vegetarian');
classifier.addDocument('delicious vegetarian dishes', 'vegetarian');
classifier.addDocument('vegetarian meals offered', 'vegetarian');
classifier.addDocument('vegetarian-friendly dishes', 'vegetarian');
classifier.addDocument('vegetarian food choices', 'vegetarian');
classifier.addDocument('vegetarian options available for dining', 'vegetarian');
classifier.addDocument('enjoy vegetarian meals', 'vegetarian');
classifier.addDocument('vegetarian cuisine available', 'vegetarian');
classifier.addDocument('vegetarian menu choices', 'vegetarian');
classifier.addDocument('wide range of vegetarian options', 'vegetarian');

// End machine learning NLP additions

// this is the method to train the machine
classifier.train();

// this function analyzes the descriptions using info we trained the model with
// we can add more training above but we need to keep an eye on confidence levels
// and over/under fitment of the model
function analyzeDescription(description) {
    // return the description
  return classifier.classify(description);
}

// this is used to translate addresses to geo. cordinates and vice versa,
// provider lets us use it with the Google Maps provider and API key 
// calls the key from within our .env file in the root

const geocoder = NodeGeocoder({
  provider: 'google',
  apiKey: process.env.GOOGLE_MAPS_API_KEY
});

// this is the function that grabs the actual address
// coordinates then geocodes the given address over to coords, based on lng and lat
async function getCoordinates(address) {
  try {
    const res = await geocoder.geocode(address);
    // if you find coordinates, return them, otherwise return null
    return res[0] ? { lat: res[0].latitude, lng: res[0].longitude } : null;
  } catch (error) {
    console.error('Geocoding error:', error); // log errors related to the geocoding process
    return null;
  }
}

// this is our route for scraping, we can add more urls here if needed
// but the data structures and formatting of each website is different
// keep this in mind because we might have to change the info we are grabbing
// it might be worth it to create seperate functions
// for simplifying the json object we get

router.get('/scrape', async (req, res) => {
  try {
    // if we wanted to add additional urls to scrape, add them
    // as a string here to this array
    const urls = [
      'https://twincities.eater.com/maps/best-happy-hour-twin-cities-minneapolis-st-paul',
      'https://www.yelp.com/search?find_desc=Happy+Hour&find_loc=Minneapolis%2C+MN',
      'https://feed.appyhourmobile.com/city/minneapolismn?sort=nearest',
      'https://www.minnesotamonthly.com/food-drink/jason-derushas-favorite-happy-hours/',
      'https://thethriftlist.com/happy-hours/minneapolis/',
    ];

    // initialize empty allHappyHours array to store all the happy hour
    // data
    let allHappyHours = [];
    // for of loop that scrapes the given happy hour urls
    // this is so each url is cycled (iterated) through and the data
    // from the scraping gets concatenated to the 
    // allHappyHours array
    for (let url of urls) {
      const happyHours = await scrapeHappyHours(url);
      allHappyHours = allHappyHours.concat(happyHours);
    }

    // usse promise.all to wait for async ops in the array to complete!!!
    // allHappyHours.map creates new array where each element is a promise obj. returned from the async function

    // process the scraped data to get all coordinates and analyze it for
    // descriptions we want
    const mappableHappyHours = await Promise.all(allHappyHours.map(async (hh) => {
      const coordinates = await getCoordinates(hh.text); // use 'text' instead of 'address', gotta mess with this more, this gets coordinates for the text its given essentially
      // use analyzer to decipher happyhour text
      // and return an object with coords, hh, and vibe
      const vibe = analyzeDescription(hh.text);
      return {
        ...hh,
        coordinates,
        vibe
      };
    }));

    // save the data to a JSON file in our routes directory
    // convert to JSON string using mappableHappyHours array,
    // null means include all properties of the object (meaning not seperated or disincluding anything))
    // 2 tells the writing how much white space to use while writing,
    await fs.writeFile('happyHours.json', JSON.stringify(mappableHappyHours, null, 2));
    console.log('Data saved to happyHours.json');

    console.log('Scraped happy hours:', mappableHappyHours);

    // send as JSON
    res.json(mappableHappyHours);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'An error occurred while scraping data', details: error.message });
  }
});
/*
async function scrapeEater(url) {

}

async function scrapeYelp(url) {
    
}
async function scrapeAppyHour(url) {
    
}
async function scrapeMnMonthly(url) {
    
}
async function scrapeThriftList(url) {
    
}
*/
module.exports = router;