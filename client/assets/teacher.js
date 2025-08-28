document.addEventListener("DOMContentLoaded", async () => {
    const profileEl = document.getElementById("user-email");
    try {
        const userId = localStorage.getItem("userid");
        const token = localStorage.getItem("token");
        const userrole = localStorage.getItem("role")
        if (!userId || !token || (userrole != 'teacher' && userrole != 'developer')) {
            window.location.href = "index.html";
            return;
        }
        const userRes = await fetch(`https://quizard-api.onrender.com/users/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const userData = await userRes.json();
        profileEl.textContent = userData.email || "Unknown";
    } catch (err) {
        if (profileEl) profileEl.textContent = "Error";
    }

    const navbar = document.querySelector(".navbar ul");
    navbar.addEventListener("click", async (e) => {
        if (e.target && e.target.textContent.trim() === "View students quiz results") {
            e.preventDefault();
            let resultsSection = document.querySelector(".students-quiz-results");
            if (!resultsSection) {
                resultsSection = document.createElement("section");
                resultsSection.className = "students-quiz-results";
                resultsSection.innerHTML = `<h3>Students Quiz Results</h3><p>Loading...</p>`;
                document.querySelector("main.dashboard").appendChild(resultsSection);
            }
            try {
                const userid = localStorage.getItem("userid")
                const response = await fetch(`https://quizard-api.onrender.com/teacher/${userid}`);
                const scores = await response.json();
                if (scores.length === 0) {
                    resultsSection.innerHTML = `<h3>Students Quiz Results</h3><p>No results found.</p>`;
                } else {
                    resultsSection.innerHTML = `<h3>Students Quiz Results</h3><ul>${scores.map(score => `<li>${score.name} - ${score.testname}: ${score.score}</li>`).join("")}</ul>`;
                }
            } catch (err) {
                resultsSection.innerHTML = `<h3>Students Quiz Results</h3><p>Error loading results: ${err.message}</p>`;
            }
        }
    });
});
