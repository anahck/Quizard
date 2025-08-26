document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const email = form.get("email");       
    const password = form.get("password"); 

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, passwordhash: password })
    };

    try {
        const response = await fetch("http://localhost:3000/users/login", options);
        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("user", JSON.stringify(data)); 
            window.location.href = "dashboard.html"; 
        } else {
            alert(data.error || "Login failed");
        }
    } catch (err) {
        console.error(err);
        alert("An error occurred");
    }
});
