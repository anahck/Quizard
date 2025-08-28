document.addEventListener("DOMContentLoaded", async () => {
    // const quizSection = document.getElementById("quiz");
    // const scoresSection = document.getElementById("scores");
    // const pastSection = document.getElementById("past");
    const quizListSection = document.querySelector(".quiz-list")
    const quizListUl = document.getElementById("quiz-list-ul")
    const description = document.getElementById("quiz-description")

    // --- NEW: Add references for profile + points ---
    const profileEl = document.getElementById("user-email")
    const pointsEl = document.getElementById("user-points")


    try {
        const response = await fetch("http://localhost:3000/tests")
        const tests = await response.json()

        const testDescriptions = {
            "1": "This quiz tests your basic World War II knowledge.",
            "2": "This quiz covers Ancient Civilizations.",
            "3": "This quiz focuses on the Cold War.",
        }

        quizListUl.innerHTML = tests.map(test => `
            <div class="quiz-card" data-id="${test.testid}">${test.testname}</div>`).join("");

        document.querySelectorAll(".quiz-card").forEach(item => {
            const testId = item.getAttribute("data-id")

            item.addEventListener("mouseenter", (e) => {
                description.textContent = testDescriptions[testId]
            })

            item.addEventListener("mouseleave", () => {
                description.textContent = "Hover over a quiz to see its description."
            })

            item.addEventListener("click", () => {
                window.location.href = `quiz.html?id=${testId}`
            })
        })

    } catch (err) {
        quizListSection.innerHTML = `<p>Error loading quizzes: ${err.message}</p>`
    }

    // quizSection.classList.remove("hidden");

    // const menuLinks = document.querySelectorAll("#dashboard-menu a");
    // const menuLinks = document.querySelectorAll(".navbar a");
    // const sections = document.querySelectorAll(".content");

    // menuLinks.forEach(link => {
    //     link.addEventListener("click", async (e) => {
    //         e.preventDefault();
    //         sections.forEach(sec => sec.classList.add("hidden"));
    //         const target = link.getAttribute("data-section");
    //         const section = document.getElementById(target);
    //         section.classList.remove("hidden");
    //         try {
    //             if (target === "quiz") {
    //                 const response = await fetch("http://localhost:3000/tests");
    //                 const quizzes = await response.json();
    //                 section.innerHTML = `<h3>Available quizzes</h3>
    //                     <ul> ${tests.map(test => `<li><a href="#" class="quiz-item" data-id="${test.testid}">
    //                         ${test.testname}
    //                         </a>
    //                         </li>`).join("")}</ul>`
    //             }
    //             if (target === 'scores') {
    //                 const userId = localStorage.getItem("userid")
    //                 const [testsResponse, scoresResponse] = await Promise.all([
    //                     fetch("http://localhost:3000/tests"),
    //                     fetch(`http://localhost:3000/scores/users/${userId}`)
    //                 ])
    //                 const tests = await testsResponse.json()
    //                 const scores = await scoresResponse.json()
    //                 const testMap = {};
    //                 tests.forEach(t => {
    //                     testMap[t.testid] = t.testname;
    //                 });
    //                 section.innerHTML = `
    //                     <h3>Your Scores</h3>
    //                     <ul>
    //                     ${scores.map(s => `
    //                         <li>${testMap[s.testid] || "Unknown Test"}: ${s.score}</li>
    //                     `).join("")}
    //                     </ul>
    //                 `;
    //             }
    //         } catch (err) {
    //             section.innerHTML = `<p>Error loading data: ${err.message}</p>`;
    //         }
    //     });
    // });

    const menuLinks = document.querySelectorAll(".navbar a")
    const cardsContainer = document.getElementById("cards-container")

    menuLinks.forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault()
            const action = link.getAttribute("data-section")

            try {
                if (action === "scores") {
                    if (cardsContainer.querySelector(".card")) {
                        cardsContainer.innerHTML = ""
                        return
                    }
                    const userId = localStorage.getItem("userid")

                    const [testsResponse, scoresResponse] = await Promise.all([
                        fetch("http://localhost:3000/tests"),
                        fetch(`http://localhost:3000/scores/users/${userId}`)
                    ])

                    const tests = await testsResponse.json()
                    const scores = await scoresResponse.json()

                    const testMap = {}
                    tests.forEach(test => (testMap[test.testid] = test.testname))

                    const card = document.createElement("div")
                    card.className = "card"
                    card.innerHTML = `
                        <h3>Your Scores</h3>
                        <ul>
                            ${scores.map(score => `
                            <li>
                                <strong>${testMap[score.testid]}</strong> 
                                <small>${new Date(score.scoredate).toLocaleDateString()}</small><br>
                                Attempt ${score.attempt}: ${score.score} points <br>
                            </li>`).join("")}
                        </ul>
                    `
                    cardsContainer.appendChild(card)
                }
            } catch (err) {
                console.error(err)
                cardsContainer.innerHTML = `<p>Error loading data: ${err.message}</p>`
            }
        })
    })

    // --- NEW: Load user info and last attempt for profile + points ---
    try {
        const userId = localStorage.getItem("userid")
        const token = localStorage.getItem("token")

        if (!userId || !token) {
            window.location.href = "index.html"
            return
        }

        // fetch user details
        const userRes = await fetch(`http://localhost:3000/users/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        const userData = await userRes.json()

        // fetch scores
        const scoresRes = await fetch(`http://localhost:3000/scores/users/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        const scores = await scoresRes.json()

        // update profile + points headers
        profileEl.textContent = `Profile: ${userData.email || "Unknown"}`
        if (scores.length > 0) {
            const lastAttempt = scores[scores.length - 1] // take last record
            pointsEl.textContent = `Points: ${lastAttempt.score}`
        } else {
            pointsEl.textContent = "Points: 0"
        }
    } catch (err) {
        console.error("Error loading profile/points:", err)
        profileEl.textContent = "Profile: Error"
        pointsEl.textContent = "Points: Error"
    }
})

async function loadPosts () {
    const options = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
    };
      
    const response = await fetch("http://localhost:3000/users", options);

    if (response.status != 200) {
        window.location.assign("./index.html");
    }
}

loadPosts();
