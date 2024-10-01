document.addEventListener("DOMContentLoaded", () => {
  const addDestinationForm = document.getElementById("addDestinationForm");
  const addDestinationDialog = document.getElementById("addDestinationDialog");
  const addDestinationDialogClose = document.getElementById("addDestinationDialogClose");
  const addDestinationButton = document.getElementById("openDestinationDialog");

  const countrySelect = document.getElementById("country");
  const cityInput = document.getElementById("city");
  const dateInput = document.getElementById("date");
  const descriptionInput = document.getElementById("description");
  const ratingInput = document.getElementById("rating");

  const starElements = document.querySelectorAll("#stars .star");

  addDestinationButton.addEventListener("click", () => {
    //Clean up the inputs
    countrySelect.value = "";
    cityInput.value = "";
    dateInput.value = "";
    descriptionInput.value = "";
    ratingInput.value = "";

    addDestinationDialog.showModal();
  });

  addDestinationDialogClose.addEventListener("click", (event) => {
    event.preventDefault();
    addDestinationDialog.close();
  });

  addDestinationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addDestination(countrySelect.value, cityInput.value, dateInput.value, descriptionInput.value, ratingInput.value)
  });

    const addDestination = async (country, city, date, description, rating) => {
        //Get user id from session storage
        const userId = sessionStorage.getItem("logged-_id");

        try {
            const response = await fetch("/api/travel-destinations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, country, city, date, description, rating }),
            });

            const data = await response.json();

            if (response.ok) {
                addDestinationDialog.close();
                alert(`Destination added ${country}`);
                console.log("Destination added:", data);

                // Dispatch custom event destinationAdded
                const event = new CustomEvent("destinationAdded");
                document.dispatchEvent(event);
            } else {
                console.error("Error adding destination:", data);
            }

        } catch {
            console.error("Error adding destination:", error);
        }

        
    }
    

  // Fetch country data from a JSON file and populate the dropdown
  fetch("countries.json")
    .then((response) => response.json())
    .then((countries) => {
      // Add an empty first option to the dropdown
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "Select a country";
      emptyOption.disabled = true; // Disable selection of the empty option
      emptyOption.selected = true; // Make it the default selected option
      countrySelect.appendChild(emptyOption);

      // Populate the dropdown with country data
      countries.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.name;
        option.textContent = country.name;
        countrySelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error loading countries:", error));

  // Star rating click event
  starElements.forEach((star) => {
    star.addEventListener("click", (event) => {
      const rating = event.target.getAttribute("data-value");
      ratingInput.value = rating;

      // Reset all stars and mark selected ones
      starElements.forEach((s) => s.classList.remove("selected"));
      for (let i = 0; i < rating; i++) {
        starElements[i].classList.add("selected");
      }
    });
  });
});
