document.addEventListener("DOMContentLoaded", async () => {
    const quizListSection = document.querySelector(".quiz-list")
    const quizListUl = document.getElementById("quiz-list-ul")
    const description = document.getElementById("quiz-description")

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
                                    <strong>${testMap[score.testid]}</strong> <small>${new Date(score.scoredate).toLocaleDateString()}</small><br>
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

    try {
        const userId = localStorage.getItem("userid")
        const token = localStorage.getItem("token")

        if (!userId || !token) {
            window.location.href = "index.html"
            return
        }

        const userRes = await fetch(`http://localhost:3000/users/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        const userData = await userRes.json()

        const scoresRes = await fetch(`http://localhost:3000/scores/users/${userId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        const scores = await scoresRes.json()

        profileEl.textContent = userData.email || "Unknown"
        if (scores.length > 0) {
            const lastAttempt = scores[scores.length - 1]
            pointsEl.textContent = lastAttempt.score
        } else {
            pointsEl.textContent = "0"
        }
    } catch (err) {
        console.error("Error loading profile/points:", err)
        profileEl.textContent = "Error"
        pointsEl.textContent = "Error"
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
