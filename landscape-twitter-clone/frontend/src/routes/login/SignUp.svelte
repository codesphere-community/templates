<script>
    async function signUp(event) {
        event.preventDefault();

        const form = event.target;
        const formData = new FormData(form);

        const userName = formData.get('userName');
        const password = formData.get('password');

        const newUser = {
            name: userName,
            password: password
        };

        try {
            const response = await fetch(`/backend/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) {
                throw new Error('Failed to create user');
            }

            const createdUser = await response.json();
            console.log(createdUser); // Output response from server

            // Save logged-in user details to local storage
            localStorage.setItem('loggedInUserId', createdUser.id.toString());
            localStorage.setItem('loggedInUserName', createdUser.name);

            // Handle success (e.g., show a success message, redirect user)
            alert('User created successfully');
            form.reset(); // Clear form inputs

            window.location.href = '/'; // Redirect to main route
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Failed to create user');
        }
    }
</script>

<div class="signup-container">
    <div>
        <h1>Sign Up</h1>
        <form class="form-container" on:submit|preventDefault={signUp}>
            <label for="userName">User name</label>
            <input type="userName" id="userName" name="userName" required>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Sign Up</button>
        </form>
    </div>

    <strong>
        Please dont use any of your real passwords! <br>
        This is a demo application and the passwords are stored in plain text!
    </strong>
</div>
<style>
    .form-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }

    .signup-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
    }
</style>