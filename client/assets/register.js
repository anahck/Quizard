document.getElementById("signup-form").addEventListener("submit", async (e) => {
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
            passwordhash: form.get("passwordhash"),
            userrole: form.get("userrole"),
            yeargroup: form.get("yeargroup"),
        })
    }

    console.log(options);

    const response = await fetch("http://localhost:3000/users/register", options)
    const data = await response.json();

    if (response.status == 201) {
        window.location.assign("index.html")
    } else {
        alert(data.error);
    }
})