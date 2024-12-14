const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", handleSignupSubmission);

async function handleSignupSubmission(e) {
    e.preventDefault();

    if (!signupForm.checkValidity()) {
        signupForm.classList.add("was-validated");
    } else {
        const formData = {
            name: document.getElementById("fullname").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value,
        };

        try {
            const response = await fetch("/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert("User signed up successfully!");
                window.location.href = "/login";
            } else {
                alert("Error signing up");
            }
        } catch (err) {
            console.error(`Error submitting form: ${err}`);
        }
    }

}