// Function to load the navbar
function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;

            // Attach logout event listener after the navbar has been loaded
            const logoutButton = document.getElementById("logoutButton");
            if (logoutButton) {
                logoutButton.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent default link behavior
                    handleLogout(); // Call the global logout function
                });
            }
        })
        .catch(error => console.error('Error loading navbar:', error));
}

function loadData() {
    // Check if users and visitedPlaces arrays are defined
    if (typeof users !== 'undefined' && typeof visitedPlaces !== 'undefined') {
        const userButtonsContainer = document.getElementById('user-buttons');
        const childFrame = document.getElementById('worldMapIframe');

        users.forEach(user => {
            const button = document.createElement('button');
            button.textContent = user.name;
            button.addEventListener('click', () => {
                // Filter visitedPlaces based on the clicked user
                const filteredPlaces = visitedPlaces.filter(place => place.username === user.name.split(' ')[0]);
                // Send the filtered array to the child iframe
                childFrame.contentWindow.postMessage({ action: 'visitedPlaces', travelDestinations: filteredPlaces }, '*');
            });
            userButtonsContainer.appendChild(button);
        });
    } else {
        console.error('users or visitedPlaces array is not defined');
    }
}

// Function to show the sidebar with the clicked path's ID
function showSidebar(pathId) {
    console.log(pathId);

    const sidebar = document.getElementById('right-sidebar');
    const sidebarContent = document.getElementById('sidebar-content');
    sidebarContent.textContent = `You clicked on ${pathId}`;
    sidebar.classList.add('show');

}

function hideSidebar() {
    const sidebar = document.getElementById('right-sidebar');
    sidebar.classList.remove('show');
}




export { loadNavbar, loadData, showSidebar, hideSidebar };
