// const { text } = require("express");

document.addEventListener('DOMContentLoaded', () => {
    initializeSVGPan();
    initializeSVGZoom();
    addClickListenersToCountries();
    showCountryName();
});

// Listen for messages (travelDestinations) from the parent window
window.addEventListener('message', (event) => {
	if (event.data && event.data.action === 'visitedPlaces') {
		const uniqueCountries = event.data.travelDestinations;

		const svg = document.querySelector('svg');
		if (svg) {
			// Ensure the SVG is fully loaded
			if (document.readyState === 'complete' || document.readyState === 'interactive') {
				console.log('Document state (SVG):', document.readyState);

				highlightVisitedPlaces(uniqueCountries);
			} else {
				window.addEventListener('load', () => {
					highlightVisitedPlaces(uniqueCountries);
				});
			}
		} else {
			console.error('SVG element not found');
		}
	}
	if (event.data && event.data.action === 'removeClickedClass') {
		const clickedPath = document.querySelector('.clicked');
		if (clickedPath) {
			clickedPath.classList.remove('clicked');
		}
	}
});

function highlightVisitedPlaces(uniqueCountries) {
	const svg = document.querySelector('svg');
	const paths = svg.querySelectorAll('path');
	paths.forEach((path) => {
		const country = path.getAttribute('title');
		if (uniqueCountries.has(country)) {
			path.classList.add('visited');
		} else {
			path.classList.remove('visited'); // Remove the class if not visited
		}
	});
}

function addClickListenersToCountries() {
	const svg = document.querySelector('svg');
	const paths = svg.querySelectorAll('path');
	paths.forEach((path) => {
		const country = path.getAttribute('title');
		path.addEventListener('click', () => {
			console.log('Path clicked:', country);
			const previouslyClickedPath = svg.querySelector('path.clicked');
			if (previouslyClickedPath) {
				previouslyClickedPath.classList.remove('clicked');
			}
			path.classList.add('clicked');
			window.parent.postMessage(
				{
					action: 'countryClicked',
					path: country,
					countryCode: path.id,
				},
				'*'
			);
		});
	});
}

// Show Country Name
function showCountryName() {
    const svg = document.querySelector('svg');
    const paths = svg.querySelectorAll('path');
    const textContainer = document.getElementById('country-name');

    paths.forEach((path) => {
        const country = path.getAttribute('title');
        path.addEventListener('mousemove', (event) => {
            const x = event.clientX;
            const y = event.clientY;
            textContainer.textContent = country;
            textContainer.style.left = `${x}px`; 
            textContainer.style.top = `${y}px`;
            textContainer.style.display = 'block'; 
        });

         path.addEventListener('mouseout', () => {
            textContainer.style.display = 'none';
        });
    });
}


// Listen for messages from the parent window
window.addEventListener('message', (event) => {
	if (event.data && event.data.action === 'visitedPlaces') {
		highlightVisitedPlaces(event.data.travelDestinations);
	}

	if (event.data && event.data.action === 'removeClickedClass') {
		const clickedPath = document.querySelector('.clicked');
		if (clickedPath) {
			clickedPath.classList.remove('clicked');
		}
	}
});

function initializeSVGPan() {
	const svg = document.querySelector('svg');
	let isPanning = false;
	let startX, startY;
	let viewBoxValues;

	// Define the limits for panning
	const minX = 100;
	const minY = -100;
	const maxX = 900; // Adjust based on your SVG content dimensions
	const maxY = 800; // Adjust based on your SVG content dimensions

	// Function to initiate panning
	function startPan(event) {
		if (event.button !== 0) return; // Only allow left mouse button
		event.preventDefault(); // Prevent default actions (like text selection)
		isPanning = true;
		startX = event.clientX;
		startY = event.clientY;
		viewBoxValues = svg.getAttribute('viewBox').split(' ').map(Number);
		document.body.style.userSelect = 'none'; // Disable text selection
	}

	// Function to perform the panning
	function pan(event) {
		if (!isPanning) return;

		const dx = (event.clientX - startX) * (viewBoxValues[2] / svg.clientWidth);
		const dy = (event.clientY - startY) * (viewBoxValues[3] / svg.clientHeight);

		let newViewBoxX = viewBoxValues[0] - dx;
		let newViewBoxY = viewBoxValues[1] - dy;

		// Apply limits to panning
		newViewBoxX = Math.max(minX, Math.min(newViewBoxX, maxX - viewBoxValues[2]));
		newViewBoxY = Math.max(minY, Math.min(newViewBoxY, maxY - viewBoxValues[3]));

		svg.setAttribute('viewBox', `${newViewBoxX} ${newViewBoxY} ${viewBoxValues[2]} ${viewBoxValues[3]}`);
	}

	// Function to stop panning
	function endPan() {
		isPanning = false;
		document.body.style.userSelect = ''; // Re-enable text selection
	}

	// Enable mouse events for panning
	svg.addEventListener('mousedown', startPan);
	window.addEventListener('mousemove', pan);
	window.addEventListener('mouseup', endPan);

	// Prevent scrolling when panning with the mouse wheel
	svg.addEventListener('wheel', (event) => {
		if (isPanning) {
			event.preventDefault(); // Prevent scroll while panning
		}
	});
}

function initializeSVGZoom() {
	const svg = document.querySelector('svg');
	svg.addEventListener('wheel', function (event) {
		event.preventDefault();

		const zoomFactor = 1.1;
		const maxViewBoxWidth = 800; // Maximum viewBox width
		const maxViewBoxHeight = 800; // Maximum viewBox height
		const minViewBoxWidth = 100; // Minimum viewBox width
		const minViewBoxHeight = 100; // Minimum viewBox height

		const svgRect = svg.getBoundingClientRect();
		const mouseX = event.clientX - svgRect.left;
		const mouseY = event.clientY - svgRect.top;

		let viewBox = svg.getAttribute('viewBox').split(' ').map(Number);
		let [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = viewBox;

		const zoomIn = event.deltaY < 0;

		if (zoomIn) {
			// Zoom in
			const newViewBoxWidth = viewBoxWidth / zoomFactor;
			const newViewBoxHeight = viewBoxHeight / zoomFactor;

			// Check if the new dimensions are greater than the minimum allowed dimensions
			if (newViewBoxWidth >= minViewBoxWidth && newViewBoxHeight >= minViewBoxHeight) {
				viewBoxWidth = newViewBoxWidth;
				viewBoxHeight = newViewBoxHeight;
			}
		} else {
			// Zoom out
			const newViewBoxWidth = viewBoxWidth * zoomFactor;
			const newViewBoxHeight = viewBoxHeight * zoomFactor;

			// Check if the new dimensions exceed the maximum allowed dimensions
			if (newViewBoxWidth <= maxViewBoxWidth && newViewBoxHeight <= maxViewBoxHeight) {
				viewBoxWidth = newViewBoxWidth;
				viewBoxHeight = newViewBoxHeight;
			}
		}

		// Adjust viewBox to keep the mouse position as the focal point when zooming in
		if (zoomIn) {
			const newViewBoxX = mouseX - (mouseX - viewBoxX) * (viewBoxWidth / viewBox[2]);
			const newViewBoxY = mouseY - (mouseY - viewBoxY) * (viewBoxHeight / viewBox[3]);
			svg.setAttribute('viewBox', [newViewBoxX, newViewBoxY, viewBoxWidth, viewBoxHeight].join(' '));
		} else {
			// Center the SVG when zooming out
			const centerX = viewBoxX + viewBox[2] / 2;
			const centerY = viewBoxY + viewBox[3] / 2;
			const newViewBoxX = centerX - viewBoxWidth / 2;
			const newViewBoxY = centerY - viewBoxHeight / 2;
			svg.setAttribute('viewBox', [newViewBoxX, newViewBoxY, viewBoxWidth, viewBoxHeight].join(' '));
		}
	});
}
