document.addEventListener("DOMContentLoaded", async () => {
    const quizId = new URLSearchParams(window.location.search).get("id")
    const quizNameElement = document.getElementById("quiz-name")
    const questionContainer = document.getElementById("question-container")

    if (!quizId) {
        questionContainer.innerHTML = `<p>No quiz</p>`
        return
    }

    try {
        const testResponse = await fetch(`http://localhost:3000/tests/${quizId}`);
        const testData = await testResponse.json();
        quizNameEl.textContent = testData.testname;
        
        const questionsResponse = await fetch(`http://localhost:3000/questions/tests/${quizId}`)
        const questions = await questionsResponse.json()

        quizNameElement.textContent = "quiz"

        questionContainer.innerHTML = questions.map((q, i) => `
        <div class="question">
        <p><strong>Q${i + 1}:</strong> ${q.questioncontent}</p>
        <input type="text" name="answer-${q.questionid}" placeholder="Your answer">
        </div>`).join("")

    } catch (error) {
        console.log(error)
        questionContainer.innerHTML = `<p>Error with quiz: ${error.message}</p>`
    }

})