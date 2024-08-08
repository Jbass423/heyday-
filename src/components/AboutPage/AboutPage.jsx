import React, { useState, useEffect } from "react";
import UserNavBar from "../UserNavBar/UserNavBar";
import { useHistory } from 'react-router-dom';
import {useSelector} from 'react-redux';
import './AboutPage.css'; 

function AboutPage() {
  const [happyHours, setHappyHours] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();
  const user = useSelector(store => store.user); 



/* COMMENTED OUT TO AVOID SCRAPING 
  useEffect(() => {
    const fetchHappyHours = async () => {
      setIsLoading(true); // load state
      setError(null); // set initial null state
      try {
        const response = await fetch("/api/scraper/scrape");
        if (!response.ok) {
          throw new Error("Failed to fetch happy hour info");
        }
        const data = await response.json();
        setHappyHours(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHappyHours();
  }, []); // empty dependency array, only run once on initial page load
*/
return (
  <div className="about-page">
    <h1 className="about-title">Welcome to Heyday!</h1>
    <p className="about-subtitle">Your go-to app for finding the best deals around</p>

    <div className="scrollable-content">
      <section className="about-section">
        <h2>How to Use the App</h2>
        <ol className="feature-list">
          <li>
            <strong>Search for Deals:</strong> Use the Home page to find deals by location and refine with filters.
          </li>
          <li>
            <strong>Discover Events:</strong> Explore the Heystack for events and user-rated deals.
          </li>
          <li>
            <strong>View Favorites:</strong> Check your saved favorite locations.
          </li>
          <li>
            <strong>Browse History:</strong> Review your recently viewed places.
          </li>
        </ol>
      </section>

      <section className="about-section">
        <h2>How It Works</h2>
        <ol className="feature-list">
          <li>We collect data from popular food and drink sources.</li>
          <li>Our system categorizes venues by vibe, diet, and offerings.</li>
          <li>We use location data to find the best deals near you.</li>
          <li>The app is regularly updated with current information.</li>
        </ol>
      </section>

      <section className="about-section">
        <h2>Enjoy Responsibly</h2>
        <p>
          While we love a good deal, we encourage all our users to drink
          responsibly and never drink and drive. Always plan for a safe ride home!
        </p>
      </section>
    </div>
<div className="navtwo">
    <UserNavBar />
    </div>
  </div>
);
}

export default AboutPage;

/*
// Misc. Code for a Leaflet Style Map Below:
  const leafletMapRef = useRef(null); // create a reference point using the hook, set it null initially since we don't have a DOM at this point (after mount and dom is created apply .current to the DOM element)
  // this references the DOM element in the html below, where we will render a map for HeyDay!
useEffect(() => {
  if (leafletMapRef.current) {
    // run the map when our component mounts (AKA using useEffect)
    //

    const map = L.map(leafletMapRef.current).setView(
      [32.5252, -93.763504],
      15
    );
    // This is how we create an instance of a map and send it to the ref
    // listed below in the return HTML
    // setView allows us to pick a latitude and longitude coordinate and
    // a "starting" zoom level (the 13 after the comma)

    // Tile layer is a leaflet method that creates tiles/grids for the map
    // we can grab other map tiles from different URLS by passing
    // different URLs that host tiles. NOTE: The copyright and usage
    // of these tiles are tricky AND NEED TO BE READ ABOUT IN DETAIL
    // BEOFRE ANY COMMERCIAL/LARGE SCALE APP DEPLOYMENT

    // maxZoom sets zoom, attribution gives credit to the provider
    // and addTo(map) applies the actual tile layer to the map instance above
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map); // this essentially adds a location to the map via a marker; This should be London, the .addTo(map) adds it to the map, like above
    return () => {
      map.remove(); // remove the map when the componenet unmounts to free up memory/resources, this is a good practice with maps especially, as they are data hogs
    };
  }
}, []); // dependency arry, only run when first mounted since its empty, remember we can force rerenders here by providing a variable within the array, when the variable changes, a rerender would be triggered

return (
  <div
  ref={leafletMapRef}
  style={{ height: "500px", width: "100%" }}
></div>
)


// Start nlp language processor code THIS IS OUR MACHING LEARNING STUFF
// WILL NEED TO USE AI TO CREATE A BUNCH OF EXAMPLES TO FEED IT:

import React, { useState, useEffect} from 'react';
import UserNavBar from '../UserNavBar/UserNavBar';

// It seems like we will have to parse Google reviews 
// to get Vibe and Diet, which is cool but maybe not super 
// reliable lol

// Need to import nlp.js modules

import { containerBootstrap } from '@nlpjs/core'; // destructure and require in Bootstrap container for NLP (this will be the "home" to managing nlp components and is meant for dependency injection which helps decouple classes and instances)
import { Nlp } from '@nlpjs/nlp'; // destructure and require in the nlp module itself
import { LangEn } from '@nlpjs/lang-en-min'; // use English, because we say so
// this stuff will need to be integrated into the function below, UserFavoriteLocations, im sure

// async would basically make it so the container is properly loaded before proceeding???


function UserFavoriteLocations() {

const [nlpResponse, setNlpResponse] = useState("") // setter and getter to manage state changes and store NLP processing

useEffect(() => {
    async function setupNlp() {
        const container = await containerBootstrap() 
        container.use(Nlp) // This actually makes it so the Nlp class is used within the container giving access to NLP functionalities that the module has
        container.use(LangEn) // container only uses English currently
        const nlp = container.get('nlp') // RETRIEVES (not creates) an instance of the class we made above called Nlp AKA RETRIVES the already instantiated instance
        nlp.settings.autoSave = false; // dont autosave MODEL CHANGES, I.e, dont persist them across sessions
        nlp.addLanguage('en'); // use english because thats what we are telling it to
        // Adds training DATA to the machine with example phrases and intents,
        // we are teaching the machine model
        nlp.addDocument('en', 'goodbye for now', 'greetings.bye');
        nlp.addDocument('en', 'bye bye take care', 'greetings.bye');
        nlp.addDocument('en', 'okay see you later', 'greetings.bye');
        nlp.addDocument('en', 'bye for now', 'greetings.bye');
        nlp.addDocument('en', 'i must go', 'greetings.bye');
        nlp.addDocument('en', 'hello', 'greetings.hello');
        nlp.addDocument('en', 'hi', 'greetings.hello');
        nlp.addDocument('en', 'howdy', 'greetings.hello');
        // This text below must be the response we are programming the machine 
        // to respond with after the above information is given to it
        // i.e, how we want to machine to REACT to the above DATA in 
        // addDocument
        nlp.addAnswer('en', 'greetings.bye', 'Till next time');
        nlp.addAnswer('en', 'greetings.bye', 'see you soon!');
        nlp.addAnswer('en', 'greetings.hello', 'Hey there!');
        nlp.addAnswer('en', 'greetings.hello', 'Greetings!');
        await nlp.train(); // This actually trains the model with the
        // documents we provided and answers we gave in .addDocument
        // and .addAnswer, preparing it to "know better" in the future
        // and handle similar inputs with more precision
        const response = await nlp.process('en', 'I should go now') // create a response
        // process input text "I should go now" and returns a response
        // BASED ON THE MODELING AND CONDITIONING WE GAVE IT ABOVE
        // Then generates an appropriate response based on its
        // learning
        setNlpResponse(JSON.stringify(response, null, 2))

    }
    // call setupNlp
    setupNlp()
},
[] // empty dependency array, wont allow updates/will ensure componenet only renders once on initial DOM load
)

  return (
    <div>
      UserFavoriteLocations
      <p>Commence Language Machine Learning Experimentation:</p>
      <pre>{nlpResponse}</pre>
      <center><UserNavBar /></center>

    </div>
  );
}

export default UserFavoriteLocations;



*/
