document.getElementById("registration-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const form = new FormData(e.target)

    const options = {
        method: "POST",
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: ({
            firstname: form.get("firstname"),
            lastname: form.get("lastname"),
            email: form.get("email"),
            passwordhash: form.get("password"),
            userrole: form.get("userrole"),
            yeargroup: form.get("yeargroup"),
        })
    }
    console.log(options);

    const response = await fetch("http://localhost:3000/users/register")
})