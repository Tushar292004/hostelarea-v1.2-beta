
// Get references to the HTML elements
const checkCustomLocationButton = document.getElementById("checkCustomLocation");
const autoLocationButton = document.getElementById("autoLocation");
const userLocationDiv = document.getElementById("userLocation");
const resultDiv = document.getElementById("result");

// Function to calculate the distance between two points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c * 1000; // Distance in meters
    
    console.log(distance);
    return distance;
}

// Function to get the user's location automatically
function getAutoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            
            document.getElementById("latitude").value = userLat.toFixed(6);
            document.getElementById("longitude").value = userLng.toFixed(6);

            userLocationDiv.innerHTML = `Your Location: Latitude ${userLat.toFixed(6)}, Longitude ${userLng.toFixed(6)}`;
        });
    } else {
        resultDiv.innerHTML = "Geolocation is not supported by your browser.";
    }
}

// Function to check proximity to a selected hostel
function checkCustomLocation() {
    const selectedHostel = document.getElementById("hostel").value;
    const userLat = parseFloat(document.getElementById("latitude").value);
    const userLng = parseFloat(document.getElementById("longitude").value);

    if (isNaN(userLat) || isNaN(userLng)) {
        resultDiv.innerHTML = "Please enter valid coordinates.";
        resultDiv.classList.remove("popup");
    } else {
        fetch('hostel_data.json')
            .then(response => response.json())
            .then(data => {
                if (data[selectedHostel]) {
                    const hostel = data[selectedHostel];
                    const distance = calculateDistance(userLat, userLng, hostel.lat, hostel.lng);

                    // Display the user's custom location
                    userLocationDiv.innerHTML = `Your Custom Location: Latitude ${userLat.toFixed(6)}, Longitude ${userLng.toFixed(6)}`;

                    if (distance <= hostel.radius) {
                        resultDiv.innerHTML = `You are near ${selectedHostel} Boys Hostel.`;
                        resultDiv.classList.add("popup");
                        window.location.href = hostel.url;
                    } else {
                        resultDiv.innerHTML = `You are not near ${selectedHostel} Boys Hostel.`;
                        resultDiv.classList.remove("popup");
                    }
                } else {
                    resultDiv.innerHTML = "Invalid hostel selection.";
                    resultDiv.classList.remove("popup");
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

// Add click event listeners to the buttons
autoLocationButton.addEventListener("click", getAutoLocation);
checkCustomLocationButton.addEventListener("click", checkCustomLocation);
