const baseUrl = 'http://localhost:5000';

// Register Form Submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        document.getElementById('registerResponse').textContent = JSON.stringify(data);
    } catch (error) {
        document.getElementById('registerResponse').textContent = 'Error: ' + error.message;
    }
});

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    console.log('Form submitted');

    try {
        console.log(baseUrl);

        const response = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        console.log('Response status:', response.status);

        const data = await response.json();

        console.log('Response data:', data);

        if (response.ok) {
            const accountType = data.user.account_type;

            console.log('Account type:', data.user.account_type);

            // Redirect based on account type
            if (accountType === 'basic') {
                window.location.href = '/test/select_account_type';
            } else if (accountType === 'driver') {
                window.location.href = '/test/driver_dashboard';
            }

            // Display the response for debugging (optional)
            document.getElementById('loginResponse').textContent = 'Login successful!';
        } else {
            document.getElementById('loginResponse').textContent = `Error: ${data.message || 'Login failed'}`;
        }
    } catch (error) {
        document.getElementById('loginResponse').textContent = 'Error: ' + error.message;
    }
});
