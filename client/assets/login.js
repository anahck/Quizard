document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(e.target)

    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: form.get("email"),
            passwordhash: form.get("password")
        })
    }
    const response = await fetch("http://localhost:3000/auth/login", options)
    const data = await response.json();

    if (response.status == 200) {
        if (data.token) {
            console.log(data);
            localStorage.setItem("token", data.token);
            localStorage.setItem("userid", data.userid)
            localStorage.setItem("role", data.userrole);
            if(data.userrole == 'teacher'){
                window.location.assign("teacher.html");
            }
            else{
                window.location.assign("dashboard.html");
            }
        } else {
            document.getElementById("otp-container").style.display = "block";
            document.getElementById("email").disabled = true;
            document.getElementById("password").disabled = true;
            document.querySelector("button[type='submit']").disabled = true;
        }
    } else {    
        alert(data.error);
    }
})

document.getElementById("otp-submit").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const otp = document.getElementById("otp").value;
    const options = {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
    };
    const response = await fetch("http://localhost:3000/auth/verify-otp", options);
    const data = await response.json();
    if (response.status == 200) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userid", data.userid);
        localStorage.setItem("role", data.userrole);
        if(data.userrole == 'teacher'){
            window.location.assign("teacher.html");
        }
        else{
            window.location.assign("dashboard.html");
        }
    } else {
        alert(data.error);
    }
});