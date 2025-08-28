async function loadProfile() {
    const profileEl = document.getElementById("user-email");
    try {
        const userId = localStorage.getItem("userid");
        const token = localStorage.getItem("token");
        const userrole = localStorage.getItem("role")
        if (!userId || !token || (userrole != 'teacher' && userrole != 'developer')) {
            window.location.href = "index.html";
            return;
        }
        const userRes = await fetch(`http://localhost:3000/users/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const userData = await userRes.json();
        const scoresRes = await fetch(`http://localhost:3000/scores/users/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const scores = await scoresRes.json();
        profileEl.textContent = userData.email || "Unknown";

    } catch (err) {
        const profileEl = document.getElementById("user-email");
        profileEl.textContent = "Error";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    document.getElementById("post-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = {
            testname: form.testname.value,
            subjectid: form.subjectid.value,
            assigneddate: form.assigneddate.value,
            duedate: form.duedate.value,
            authorid: localStorage.getItem("userid"),
            question1: form.question1.value,
            answer1: form.answer1.value,
        };
        console.log(data);
        const options = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const result = await fetch("http://localhost:3000/tests", options);
        if (result.status == 201) {
            window.location.reload();
        }
    });
});