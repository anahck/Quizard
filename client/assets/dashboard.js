document.addEventListener("DOMContentLoaded", async () => {
    const quizSection = document.getElementById("quiz");
    const scoresSection = document.getElementById("scores");
    const pastSection = document.getElementById("past");
    const quizListSection = document.querySelector(".quiz-list")
    const quizListUl = document.getElementById("quiz-list-ul")

    try {
        const response = await fetch("http://localhost:3000/tests")
        const tests = await response.json()

        quizListUl.innerHTML = tests.map(test => `
            <li>
                <a href="quiz.html?id=${test.testid}">${test.testname}</a>
            </li>`).join("")
        
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
    //                 // section.innerHTML = `<h3>Start a New Quiz</h3><ul>` +
    //                 //     quizzes.map(q => `<li>${testName}</li>`).join("") +
    //                 //     `</ul>`;
    //                     section.innerHTML = `<h3>Available quizzes</h3>
    //                     <ul> ${tests.map(test => `<li><a href="#" class="quiz-item" data-id="${test.testid}">
    //                         ${test.testname}
    //                         </a>
    //                         </li>`).join("")}</ul>`

    //             // if (target === "scores") {
    //             //     const response = await fetch("http://localhost:3000/scores");
    //             //     const scores = await response.json();
    //             //     section.innerHTML = `<h3>Your Scores</h3>` +
    //             //         scores.map(s => `<p>${testName}: ${scores}</p>`).join("");
    //             // }
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

    //                 // render into the section
    //                 section.innerHTML = `
    //                     <h3>Your Scores</h3>
    //                     <ul>
    //                     ${scores.map(s => `
    //                         <li>${testMap[s.testid] || "Unknown Test"}: ${s.score}</li>
    //                     `).join("")}
    //                     </ul>
    //                 `;
    //             }
                

    //             if (target === "past") {
    //                 const response = await fetch("http://localhost:3000/past-quizzes");
    //                 const past = await response.json();
    //                 section.innerHTML = `<h3>Past Quizzes</h3><ul>` +
    //                     past.map(p => `<li>${testName} – ${score}</li>`).join("") +
    //                     `</ul>`;
    //             }
    //         }
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
                        <strong>${testMap[score.testid] || "Unknown Test"}</strong> <small>${new Date(score.scoredate).toLocaleDateString()}</small><br>
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