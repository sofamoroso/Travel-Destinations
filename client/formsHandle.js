
// Modal handling
const signupModal = document.getElementById('signupModal');
const openSignupModal = document.getElementById('openSignupModal');
const closeModal = document.getElementById('closeModal');

openSignupModal.onclick = () => {
    signupModal.style.display = 'block';
};

closeModal.onclick = () => {
    signupModal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target == signupModal) {
        signupModal.style.display = 'none';
    }
};

// Handle sign-up form submission
document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            // Successful sign-up
            alert('Sign up successful! Please log in.');
            signupModal.style.display = 'none';
            document.getElementById('signupForm').reset();
        } else {
            // Display error message
            const signupErrorMessage = document.getElementById('signupErrorMessage');
            signupErrorMessage.textContent = result.error || 'Sign up failed. Please try again.';
            signupErrorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        const signupErrorMessage = document.getElementById('signupErrorMessage');
        signupErrorMessage.textContent = 'An error occurred. Please try again.';
        signupErrorMessage.style.display = 'block';
    }
});

