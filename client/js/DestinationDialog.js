document.addEventListener('DOMContentLoaded', () => {
	sessionStorage.getItem('selectedCountry') ? sessionStorage.removeItem('selectedCountry') : null;

	let isEditMode = false;
	let currentDestinationId = null;

	const addDestinationForm = document.getElementById('addDestinationFor');
	const addDestinationDialog = document.getElementById('addDestinationDialog');
	const addDestinationDialogClose = document.getElementById('addDestinationDialogClose');
	const addDestinationButtons = document.querySelectorAll('.addDestinationBtn');

	const countrySelect = document.getElementById('country');
	const cityInput = document.getElementById('city');
	const dateInput = document.getElementById('date');
	const descriptionInput = document.getElementById('description');
	const ratingInput = document.getElementById('rating');
	const starElements = document.querySelectorAll('#stars .star');

	const destinationDialogTitle = document.getElementById('destinationDialogTitle');
	const destinationDialogSubmitButton = document.getElementById('destinationDialogSubmitButton');

	addDestinationButtons.forEach((button) => {
		button.addEventListener('click', () => {
			isEditMode = false;
			currentDestinationId = null;
			openAddDestinationDialog();
		});
	});

	// Close dialog event listener
	addDestinationDialogClose.addEventListener('click', (event) => {
		event.preventDefault();
		addDestinationDialog.close();
	});

	// Form submission handler
	addDestinationForm.addEventListener('submit', (event) => {
		event.preventDefault();
		if (isEditMode) {
			updateDestination(currentDestinationId, countrySelect.value, cityInput.value, dateInput.value, descriptionInput.value, ratingInput.value);
		} else {
			addDestination(countrySelect.value, cityInput.value, dateInput.value, descriptionInput.value, ratingInput.value);
		}
	});

	const updateDestination = async (destinationId, country, city, date, description, rating) => {
		const userId = sessionStorage.getItem('logged-_id');
		try {
			const response = await fetch(`/api/travel-destinations/${destinationId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId,
					country,
					city,
					date,
					description,
					rating,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				addDestinationDialog.close();
				alert(`Destination updated: ${city}`);
				console.log('Destination updated:', data);

				// Dispatch custom event to update the UI
				const event = new CustomEvent('destinationChanged', {
					detail: { action: 'update' },
				});
				document.dispatchEvent(event);
			} else {
				console.error('Error updating destination:', data);
			}
		} catch (error) {
			console.error('Error updating destination:', error);
		}
	};

	function openAddDestinationDialog() {
		const selectedCountry = sessionStorage.getItem('selectedCountry');

		// Reset form fields
		countrySelect.value = selectedCountry || '';
		cityInput.value = '';
		dateInput.value = '';
		descriptionInput.value = '';
		ratingInput.value = 0;
		document.querySelector('#stars').setAttribute('data-rating', '0');

		// Remove selected class from stars
		starElements.forEach((star) => {
			star.classList.remove('selected');
		});

		// Disable country select if a country is selected
		countrySelect.disabled = !!selectedCountry;

		// Update dialog title and button text
		destinationDialogTitle.textContent = 'Add a new travel destination';
		destinationDialogSubmitButton.textContent = 'Add';

		addDestinationDialog.showModal();
	}

	function openEditDestinationDialog(destination) {
		isEditMode = true;
		currentDestinationId = destination._id;

		// Populate form fields with existing data
		countrySelect.value = destination.country;
		cityInput.value = destination.city;
		dateInput.value = destination.date.split('T')[0]; // Format date
		descriptionInput.value = destination.description;
		ratingInput.value = destination.rating;
		document.querySelector('#stars').setAttribute('data-rating', destination.rating);

		// Update stars display
		starElements.forEach((star) => {
			const value = parseInt(star.getAttribute('data-value'));
			if (value <= destination.rating) {
				star.classList.add('selected');
			} else {
				star.classList.remove('selected');
			}
		});

		// Disable country select during edit
		countrySelect.disabled = true;

		// Update dialog title and button text
		destinationDialogTitle.textContent = 'Edit travel destination';
		destinationDialogSubmitButton.textContent = 'Save';

		addDestinationDialog.showModal();
	}

	const addDestination = async (country, city, date, description, rating) => {
		//Get user id from session storage
		const userId = sessionStorage.getItem('logged-_id');

		try {
			const response = await fetch('/api/travel-destinations', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId,
					country,
					city,
					date,
					description,
					rating,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				addDestinationDialog.close();
				alert(`Destination added ${country}`);
				console.log('Destination added:', data);

				// Dispatch custom event destinationAdded
				const event = new CustomEvent('destinationChanged', {
					detail: { action: 'add' },
				});
				document.dispatchEvent(event);
			} else {
				console.error('Error adding destination:', data);
			}
		} catch {
			console.error('Error adding destination:', error);
		}
	};

	// Fetch country data from a JSON file and populate the dropdown
	fetch('data/countries.json')
		.then((response) => response.json())
		.then((countries) => {
			// Add an empty first option to the dropdown
			const emptyOption = document.createElement('option');
			emptyOption.value = '';
			emptyOption.textContent = 'Select a country';
			emptyOption.disabled = true; // Disable selection of the empty option
			emptyOption.selected = true; // Make it the default selected option
			countrySelect.appendChild(emptyOption);

			// Populate the dropdown with country data
			countries.forEach((country) => {
				const option = document.createElement('option');
				option.value = country.name;
				option.textContent = country.name;
				countrySelect.appendChild(option);
			});
		})
		.catch((error) => console.error('Error loading countries:', error));

	// Star rating click event
	starElements.forEach((star) => {
		star.addEventListener('click', (event) => {
			const rating = event.target.getAttribute('data-value');
			ratingInput.value = rating;

			// Reset all stars and mark selected ones
			starElements.forEach((s) => s.classList.remove('selected'));
			for (let i = 0; i < rating; i++) {
				starElements[i].classList.add('selected');
			}
		});
	});
	window.openEditDestinationDialog = openEditDestinationDialog;
});
