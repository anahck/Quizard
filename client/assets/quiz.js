document.addEventListener("DOMContentLoaded", async () => {
  const quizId = new URLSearchParams(window.location.search).get("id");
  const quizNameElement = document.getElementById("quiz-name");
  const questionContainer = document.getElementById("question-container");

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");

  let questions = [];
  let currentQuestionIndex = 0;
  const answers = {};

  if (!quizId) {
    questionContainer.innerHTML = `<p>No quiz selected</p>`;
    return;
  }

  try {
    const testResponse = await fetch(`http://localhost:3000/tests/${quizId}`);
    const testData = await testResponse.json();

    quizNameElement.textContent = `${testData.subjectname} - ${testData.testname}`;

    const questionsResponse = await fetch(`http://localhost:3000/questions/tests/${quizId}`);
    questions = await questionsResponse.json();

    if (questions.length === 0) {
      questionContainer.innerHTML = `<p>No questions found for this quiz.</p>`;
      return;
    }

    showQuestion(currentQuestionIndex);

    prevBtn.addEventListener("click", () => {
      saveAnswer();
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
      }
    });

    nextBtn.addEventListener("click", () => {
      saveAnswer();
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
      }
    });

//     submitBtn.addEventListener("click", () => {
//       saveAnswer();

//     let score = 0;
//     questions.forEach(q => {
//         if (answers[q.questionid]?.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
//             score += q.totalScore || 1
//         }
//     })

//   console.log("Your score:", score);

//       console.log("Submitted answers:", answers);
//       questionContainer.innerHTML = `<p>Quiz submitted!</p>`;
//       prevBtn.style.display = "none";
//       nextBtn.style.display = "none";
//       submitBtn.style.display = "none";
    // });
    
    submitBtn.addEventListener("click", async () => {
    saveAnswer(); // save the last question

    try {
        const response = await fetch("http://localhost:3000/questions/checkanswers", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                testId: parseInt(quizId),
                answers: questions.map(question => ({
                    questionId: question.questionid,
                    answer: (answers[question.questionid] || "").trim()
                }))
            })
        })


        let result;
            const text = await response.text(); // read once
            try {
                result = JSON.parse(text); // attempt JSON parse
            } catch {
                throw new Error(`Non-JSON response from server: ${text}`);
            }
        
        // const result = await response.json();

        if (response.ok) {
            questionContainer.innerHTML = `<p>Quiz submitted! Your score: ${result.totalScore}</p>`;
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
            submitBtn.style.display = "none";
        } else {
            questionContainer.innerHTML = `<p>Error submitting quiz: ${result.error}</p>`;
        }

    } catch (err) {
        console.error(err);
        questionContainer.innerHTML = `<p>Error submitting quiz: ${err.message}</p>`;
    }
})

  } catch (error) {
    console.error("Error loading quiz:", error);
    questionContainer.innerHTML = `<p>Error loading quiz: ${error.message}</p>`;
  }

  function showQuestion(index) {
    const q = questions[index];
    questionContainer.innerHTML = `
      <div class="question">
        <p><strong>Q${index + 1}:</strong> ${q.questioncontent}</p>
        <input type="text" id="answer-input"
               name="answer-${q.questionid}"
               placeholder="Your answer"
               value="${answers[q.questionid] || ""}">
      </div>
    `;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === questions.length - 1;
    submitBtn.style.display = index === questions.length - 1 ? "inline-block" : "none";
  }

  function saveAnswer() {
    const q = questions[currentQuestionIndex];
    const input = document.getElementById("answer-input");
    if (input) {
      answers[q.questionid] = input.value;
    }
  }
});
