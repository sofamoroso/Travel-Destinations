export async function deleteDestination(destination) {
    // Show confirmation dialog
    const userConfirmed = confirm(`Are you sure you want to delete ${destination.city}?`);
    if (!userConfirmed) {
        // User clicked "Cancel", do nothing
        return;
    }
    // Proceed with deletion
    try {
        const response = await fetch(`/api/travel-destinations/${destination._id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            console.log(`Deleted destination: ${destination.city} from ${destination.country}`);
            // Dispatch custom event destinationAdded
            const event = new CustomEvent('destinationChanged', { detail: { action: 'delete' } });
            document.dispatchEvent(event);
        } else {
            console.error('Failed to delete destination');
        }
    } catch (error) {
        console.error('Error while deleting destination:', error);
    }
}

// Fetch all destinations for a specific user and country
export async function fetchTravelDestinationsByUserAndCountry(userId, country) {
    try {
        const response = await fetch(`/api/travel-destinations/${userId}/${country}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const travelDestinations = await response.json();
        console.log('trvDestinationsByUserAndCountry', travelDestinations);

        return travelDestinations;
    } catch (error) {
        console.error('Error fetching visited places:', error);
        return [];
    }
}

// Function to fetch users from the backend
export async function fetchUsers() {
    try {
        const response = await fetch('/api/users');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const users = await response.json();
        console.log(users);

        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// Function to fetch visited places from the backend
export async function fetchTravelDestinations() {
    try {
        const response = await fetch('/api/travel-destinations');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const travelDestinations = await response.json();
        console.log(travelDestinations);

        return travelDestinations;
    } catch (error) {
        console.error('Error fetching visited places:', error);
        return [];
    }
}