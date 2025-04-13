let map;
let service;
let infowindow;

// Initialize Google Map
window.initMap = function () {
  const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // Default to NYC

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultLocation,
    zoom: 13,
  });

  infowindow = new google.maps.InfoWindow();
};

// Event listener for the search button
document.getElementById("search-button").addEventListener("click", () => {
  const address = document.getElementById("address-input").value.trim();
  if (!address) {
    alert("Please enter a location.");
    return;
  }

  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address }, (results, status) => {
    if (status === "OK" && results[0]) {
      const location = results[0].geometry.location;
      map.setCenter(location);
      map.setZoom(14);

      const request = {
        location: location,
        radius: 5000,
        keyword: "veterinary clinic",
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, handleSearchResults);
    } else {
      alert("Location not found. Please try a different address.");
    }
  });
});

// Handle search results
function handleSearchResults(results, status) {
  const resultsContainer = document.getElementById("vet-results");
  resultsContainer.innerHTML = "";

  if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
    results.forEach((place) => {
      const resultItem = document.createElement("div");
      resultItem.classList.add("vet-result-item");

      const name = `<strong>${place.name}</strong>`;
      const address = `<div>${place.vicinity}</div>`;
      const rating = place.rating ? `<div>⭐ ${place.rating}</div>` : "";
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        place.vicinity
      )}`;

      resultItem.innerHTML = `
        ${name}
        ${address}
        ${rating}
        <a href="${directionsUrl}" target="_blank">📍 Get Directions</a>
        <hr />
      `;

      resultsContainer.appendChild(resultItem);

      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
      });

      marker.addListener("click", () => {
        infowindow.setContent(`<strong>${place.name}</strong><br>${place.vicinity}`);
        infowindow.open(map, marker);
      });
    });
  } else {
    resultsContainer.innerHTML = "<p>No veterinary clinics found nearby.</p>";
  }
}
