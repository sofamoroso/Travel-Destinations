document.addEventListener("DOMContentLoaded", () => {
  const addDestinationForm = document.getElementById("addDestinationForm");
  const addDestinationDialog = document.getElementById("addDestinationDialog");
  const addDestinationDialogClose = document.getElementById(
    "addDestinationDialogClose"
  );
  const addDestinationButton = document.getElementById("openDestinationDialog");

  const countrySelect = document.getElementById("country");
  const starElements = document.querySelectorAll("#stars .star");
  const ratingInput = document.getElementById("rating");

  addDestinationButton.addEventListener("click", () => {
    addDestinationDialog.showModal();
  });

  addDestinationDialogClose.addEventListener("click", (event) => {
    event.preventDefault();
    addDestinationDialog.close();
  });

  addDestinationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const country = document.getElementById("country").value;
    const city = document.getElementById("city").value;
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const rating = document.getElementById("rating").value;
    addDestination(country, city, date, description, rating);
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
                location.reload();
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
