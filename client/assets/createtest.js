document.getElementById("post-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
 
    const data = {
        testname: form.testname.value,
        subjectid: form.subjectid.value,
        assigneddate: form.assigneddate.value,
        duedate: form.duedate.value,
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
    }

    const result = await fetch("http://localhost:3000/tests", options);

    if (result.status == 201) {
        window.location.reload();
    }
})