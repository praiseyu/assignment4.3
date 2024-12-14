const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", handleLoginSubmission)

async function handleLoginSubmission(e) {
    e.preventDefault();

    if (!loginForm.checkValidity()) {
        loginForm.classList.add("was-validated");
    } else {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            if (response.ok) {
                const { token } = await response.json();
                localStorage.setItem("authToken", token);
                alert("Login was succesful");
                await checkAuthenticationAndRedirect();

            } else {
                alert("Error logging in.");
            }
        } catch (err) {
            console.error(`Error during login: ${err}`);
        }
    }
}

async function checkAuthenticationAndRedirect() {
    const token = localStorage.getItem("authToken");

    const response = await fetch("/api/auth", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (response.ok) {
        window.location.href = "/dashboard";
    } else {
        alert("Authentication failed, please log in again.");
        window.location.href = "/login";
    }
}