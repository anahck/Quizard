document.addEventListener("DOMContentLoaded", async () => {
    const quizId = new URLSearchParams(window.location.search).get("id")
    const quizNameElement = document.getElementById("quiz-name")
    const questionContainer = document.getElementById("question-container")

    if (!quizId) {
        questionContainer.innerHTML = `<p>No quiz</p>`
        return
    }

    try {
        const response = await fetch(`http://localhost:3000/questions/tests/${quizId}`)
        const questions = await response.json()

        quizNameElement.textContent = "quiz"

        // questionContainer.innerHTML = 
    } catch (error) {

    }




})