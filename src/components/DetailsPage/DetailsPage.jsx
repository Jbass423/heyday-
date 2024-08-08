import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DetailsPage.css";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import UserNavBar from "../UserNavBar/UserNavBar";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

function DetailsPage() {

  const [isFavorited, setIsFavorited] = useState(false);
  const [business, setBusiness] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const favorites = useSelector((state) => state.favorites);

  
  console.log("Current favorites", favorites);
  // Fetch business details whenever the ID changes
  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  useEffect(() => {
    if (business) {
      const isAlreadyFavorited = favorites.some(
        (fav) => fav.name === business.business_name
      );
      setIsFavorited(isAlreadyFavorited);
    }
  }, [favorites, business]);
  // Function to fetch business details from the API
  const fetchBusinessDetails = () => {
    fetch(`/api/business/${id}`)
      .then((response) => {
        // Check if the response is okay
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the JSON data from the response
        return response.json();
      })
      .then((data) => {
        // Update the state with the fetched business data
        setBusiness(data);
      })
      .catch((error) => {
        // Log any errors that occur during the fetch
        console.error("Error fetching business details:", error);
      });
  };
  // Function to show the next image in the gallery
  const showNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % business.images.length // Loop back to the first image
    );
  };
  // Display a loading message if business data is not yet available
  if (!business) {
    return <div>Loading...</div>;
  }

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    business.address
  )}`;
  const handleFav = () => {
    console.log("handleFav clicked");
    const userId = user.id;
    console.log("checking id", userId);

    if (isFavorited) {
      // Find the favorite item
      const favoriteItem = favorites.find(
        (fav) => fav.name === business.business_name
      );
      if (favoriteItem) {
        // Unfavorite
        dispatch({
          type: "DELETE_FAVS",
          payload: {
            id: favoriteItem.id, // Include the id of the favorite item
            user_id: userId,
            name: business.business_name,
          },
        });
      }
    } else {
      // Favorite
      dispatch({
        type: "ADD_FAV",
        payload: {
          user_id: userId,
          name: business.business_name,
          address: business.address,
          business_id: business.id,
        },
      });
    }

    setIsFavorited(!isFavorited);
    console.log(
      isFavorited
        ? "DELETE_FAVS action dispatched"
        : "ADD_FAV action dispatched"
    );
  };
  return (
    <div>
      <div className="details-page">
        <h1 className="business-name">{business.business_name}</h1>
        <div className="image-gallery">
          {business.images.length > 0 && (
            <div className="image-container">
              <img
                src={business.images[currentImageIndex]}
                alt={`${business.business_name} ${currentImageIndex + 1}`}
                className="business-image"
              />
              <div className="buttons-container">
                <button className="favorite-button" onClick={handleFav}>
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={isFavorited ? "favorited" : ""}
                  />
                </button>
                <button className="next-icon" onClick={showNextImage}>
        <FontAwesomeIcon icon={faChevronRight} />
       </button>
              </div>
            </div>
          )}
        </div>
        <p className="address">
    Address:{" "}
    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
     {business.address}
    </a>
   </p>
        <p className="business-type">Type: {business.business_type}</p>
        <p className="description">Description: {business.description}</p>
        <p className="phone-number">Phone: {business.phone_number}</p>
        <h2 className="section-title">Diets</h2>
        <ul className="diet-list">
          {business.diets.map((diet) => (
            <li key={diet.id} className="diet-item">
              {diet.name}
            </li>
          ))}
        </ul>
        <h2 className="section-title">Vibes</h2>
      <ul className="diet-list">
        {business.vibes.map((vibe) => (
          <li key={vibe.id} className="diet-item">
            {vibe.name}
          </li>
        ))}
      </ul>

        <h2 className="section-title">Happy Hours</h2>
        <ul className="happy-hour-list">
          {business.happy_hours.map((hh, index) => (
            <li key={index} className="happy-hour-item">
              {hh.day_of_week}:{" "}
              {new Date(`1970-01-01T${hh.start_time}`).toLocaleTimeString(
                "en-US",
                { hour: "numeric", minute: "2-digit", hour12: true }
              )}{" "}
              -{" "}
              {new Date(`1970-01-01T${hh.end_time}`).toLocaleTimeString(
                "en-US",
                {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <UserNavBar />
      </div>
    </div>
  );
}
export default DetailsPage;
