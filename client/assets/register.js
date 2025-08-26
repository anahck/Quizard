document.getElementById("registration-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const form = new FormData(e.target)

    const options = {
        method: "POST",
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstname: form.get("firstname"),
            lastname: form.get("lastname"),
            email: form.get("email"),
            passwordhash: form.get("password"),
            userrole: form.get("userrole"),
            yeargroup: form.get("yeargroup"),
        })
    }

    const response = await fetch("http://localhost:3000/users/register", options)
    const data = await response.json();

    if (response.status == 201) {
        window.location.assign("login.html")
    } else {
        alert(data.error);
    }
})