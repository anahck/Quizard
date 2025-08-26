document.addEventListener("DOMContentLoaded", async () => {
    const quizSection = document.getElementById("quiz");
    const scoresSection = document.getElementById("scores");
    const pastSection = document.getElementById("past");

    quizSection.classList.remove("hidden");

    const menuLinks = document.querySelectorAll("#dashboard-menu a");
    const sections = document.querySelectorAll(".content");

    menuLinks.forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault();
            
            sections.forEach(sec => sec.classList.add("hidden"));

            const target = link.getAttribute("data-section");

            const section = document.getElementById(target);
            section.classList.remove("hidden");
            try {
                if (target === "quiz") {
                    const response = await fetch("http://localhost:3000/quizzes");
                    const quizzes = await response.json();
                    section.innerHTML = `<h3>Start a New Quiz</h3><ul>` +
                        quizzes.map(q => `<li>${testName}</li>`).join("") +
                        `</ul>`;
                }

                if (target === "scores") {
                    const response = await fetch("http://localhost:3000/scores");
                    const scores = await response.json();
                    section.innerHTML = `<h3>Your Scores</h3>` +
                        scores.map(s => `<p>${testName}: ${scores}</p>`).join("");
                }

                if (target === "past") {
                    const response = await fetch("http://localhost:3000/past-quizzes");
                    const past = await response.json();
                    section.innerHTML = `<h3>Past Quizzes</h3><ul>` +
                        past.map(p => `<li>${testName} – ${score}</li>`).join("") +
                        `</ul>`;
                }
            } catch (err) {
                section.innerHTML = `<p>Error loading data: ${err.message}</p>`;
            }
        });
    });
});
