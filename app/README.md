# API Documentation

The Quizard API has been deployed to render and can be accessed utilising [this link.](https://quizard-api.onrender.com)

## Local access

If you wish to run the API locally, after cloning the initial git repository, run `npm run dev` in the terminal in order to utilise localhost on a specified port.

## Usage

### Database Schema

The figure below shows how the tables within the databse are connected.
![Figure of database schema](./Database%20Schema.png)

### Endpoints

Each endpoint in the Quizard API has been designed utilsiing an MVC-like architecture with their own router, controller and model respectively. All routes have full CRUD functionality utilising restful routes and HTTP methods.

#### Available endpoints:

- Home: https://quizard-api.onrender.com
- Users: https://quizard-api.onrender.com/users
- Quizzes: https://quizard-api.onrender.com/tests
- Subjects: https://quizard-api.onrender.com/subjects
- Scores: https://quizard-api.onrender.com/scores
- Questions: https://quizard-api.onrender.com/questions
- Auth: https://quizard-api.onrender.com/auth
- Teacher: https://quizard-api.onrender.com/teacher

### Users Endpoint

#### Index

- An index route returns all the available user information:
  - GET users: https://quizard-api.onrender.com/users

Will return an array of objects in the form:

```
[
    {
        userid: 1,
        firstname: John,
        lastname: Doe,
        email: johnD123@email.com,
        passwordhash: hashed123,
        userrole: student,
        yeargroup: 8
    },
    {
        userid: 2,
        firstname: Jane,
        lastname: Doe,
        email: janeD123@email.com,
        passwordhash: hashed123,
        userrole: student,
        yeargroup: 10
    }
]
```

#### Show

- A show route allows a user to access information by id:
  - GET users by id: https://quizard-api.onrender.com/users/:id

Will return an array of objects in the form:

```
[
    {
        userid: 1,
        firstname: John,
        lastname: Doe,
        email: johnD123@email.com,
        passwordhash: hashed123,
        userrole: student,
        yeargroup: 8
    }
]
```

#### Create

- A create route allows a user to create a new user:
  - POST a new user: https://quizard-api.onrender.com/users

#### Update

- An update route allows a user to update their information except for their user id:
  - PATCH an existing user: https://quizard-api.onrender.com/users/:id

#### Destroy

- An destroy route allows a user to delete their account based on their user id:
  - DELETE an existing user: https://quizard-api.onrender.com/users/:id

---

### Quizzes Endpoint

#### Index

- An index route returns all the available quizzes:
  - GET quizzes: https://quizard-api.onrender.com/tests

Will return an array of objects in the form:

```
[
    {
        "testid": 1,
        "testname": "World War II Basics",
        "subjectid": 1,
        "duedate": "2025-09-10T00:00:00.000Z",
        "assigneddate": "2025-08-20T00:00:00.000Z",
        "authorid": 2
    }
    {
        "testid": 2,
        "testname": "Ancient Civilizations",
        "subjectid": 1,
        "duedate": "2025-09-10T00:00:00.000Z",
        "assigneddate": "2025-08-20T00:00:00.000Z",
        "authorid": 4
    }
]
```

#### Show

- A show route allows a user to access information by id:
  - GET quizzes by id: https://quizard-api.onrender.com/tests/:id

Will return an array of objects in the form:

```
[
    {
        "testid": 1,
        "testname": "World War II Basics",
        "subjectid": 1,
        "duedate": "2025-09-10T00:00:00.000Z",
        "assigneddate": "2025-08-20T00:00:00.000Z",
        "authorid": 2
    }
]
```

#### Create

- A create route allows a user to create a new quiz:
  - POST a new quiz: https://quizard-api.onrender.com/tests

#### Update

- An update route allows a user to update the quiz information except for the test id:
  - PATCH an existing quiz: https://quizard-api.onrender.com/tests/:id

#### Destroy

- An destroy route allows a user to delete a quiz based on its id:
  - DELETE an existing quiz: https://quizard-api.onrender.com/tests/:id

---

### Subjects Endpoint

#### Index

- An index route returns all the available subjects:
  - GET subjects: https://quizard-api.onrender.com/subjects

Will return an array of objects in the form:

```
[
  {
    "subjectid": 1,
    "subjectname": "History"
  },
  {
    "subjectid": 2,
    "subjectname": "Geography"
  },
]
```

#### Show

- A show route allows a user to access information by id:
  - GET subjects by id: https://quizard-api.onrender.com/subjects/:id

Will return an array of objects in the form:

```
[
  {
    "subjectid": 1,
    "subjectname": "History"
  },
]
```

#### Create

- A create route allows a user to create a new subject:
  - POST a new subject: https://quizard-api.onrender.com/subjects

#### Update

- An update route allows a user to update the subject name:
  - PATCH an existing subject: https://quizard-api.onrender.com/subjects/:id

#### Destroy

- An destroy route allows a user to delete a subject:
  - DELETE an existing subject: https://quizard-api.onrender.com/subjects/:id

---

### Scores Endpoint

#### Index

- An index route returns all the available scores:
  - GET scores: https://quizard-api.onrender.com/scores

Will return an array of objects in the form:

```
[
  {
    "scoreid": 3,
    "userid": 1,
    "testid": 2,
    "classid": 2,
    "score": 25,
    "scoredate": "2025-08-22T00:00:00.000Z",
    "attempt": 1
  },
  {
    "scoreid": 4,
    "userid": 2,
    "testid": 2,
    "classid": 2,
    "score": 25,
    "scoredate": "2025-08-22T00:00:00.000Z",
    "attempt": 1
  },
]
```

#### Show

- A show route allows a user to access information by id:
  - GET scores by id: https://quizard-api.onrender.com/scores/:id

Will return an array of objects in the form:

```
[
  {
    "scoreid": 3,
    "userid": 1,
    "testid": 2,
    "classid": 2,
    "score": 25,
    "scoredate": "2025-08-22T00:00:00.000Z",
    "attempt": 1
  }
]
```

- A show route allows a user to access scores by user:
  - GET scores by user id: https://quizard-api.onrender.com/scores/users/:id

Will return an array of objects in the form:

```
[
  {
    "scoreid": 3,
    "userid": 1,
    "testid": 2,
    "classid": 2,
    "score": 25,
    "scoredate": "2025-08-22T00:00:00.000Z",
    "attempt": 1
  }
]
```

#### Create

- A create route allows a user to create a new score:
  - POST a new score: https://quizard-api.onrender.com/scores

#### Update

- An update route allows a user to update the score and score date:
  - PATCH an existing score: https://quizard-api.onrender.com/scores/:id

#### Destroy

- An destroy route allows a user to delete a score:
  - DELETE an existing score: https://quizard-api.onrender.com/scores/:id

---

### Questions Endpoint

#### Index

- An index route returns all the available questions:
  - GET questions: https://quizard-api.onrender.com/questions

Will return an array of objects in the form:

```
[
  {
    "questionid": 4,
    "questioncontent": "Which civilization built the pyramids of Giza?",
    "testid": 2,
    "totalscore": 10,
    "answer": "Ancient Egyptians"
  },
  {
    "questionid": 5,
    "questioncontent": "Who was the first emperor of Rome?",
    "testid": 2,
    "totalscore": 10,
    "answer": "Augustus"
  },
  {
    "questionid": 6,
    "questioncontent": "What writing system was used in Ancient Mesopotamia?",
    "testid": 2,
    "totalscore": 10,
    "answer": "Cuneiform"
  }
]
```

#### Show

- A show route allows a user to access information by id:
  - GET questions by id: https://quizard-api.onrender.com/questions/:id

Will return an array of objects in the form:

```
[
  {
    "questionid": 4,
    "questioncontent": "Which civilization built the pyramids of Giza?",
    "testid": 2,
    "totalscore": 10,
    "answer": "Ancient Egyptians"
  }
]
```

- A show route allows a user to access questions by test id:
  - GET questions by test id: https://quizard-api.onrender.com/questions/tests/:id

Will return an array of objects in the form:

```
[
  {
    "questionid": 4,
    "questioncontent": "Which civilization built the pyramids of Giza?",
    "testid": 2,
    "totalscore": 10,
    "answer": "Ancient Egyptians"
  },
  {
    "questionid": 5,
    "questioncontent": "Who was the first emperor of Rome?",
    "testid": 2,
    "totalscore": 10,
    "answer": "Augustus"
  },
  {
    "questionid": 6,
    "questioncontent": "What writing system was used in Ancient Mesopotamia?",
    "testid": 2,
    "totalscore": 10,
    "answer": "Cuneiform"
  }
]
```

#### Create

- A create route allows a user to create a new question:
  - POST a new question: https://quizard-api.onrender.com/questions

#### Update

- An update route allows a user to update everything but the question id:
  - PATCH an existing question: https://quizard-api.onrender.com/questions/:id

#### Destroy

- An destroy route allows a user to delete a question:
  - DELETE an existing question: https://quizard-api.onrender.com/questions/:id

#### Check answers against database

- Functionality in order to check answers inputed by the user match the answers in the database and updates their scores with an attempt counter according to the test id and user id:
  - POST a new score: https://quizard-api.onrender.com/questions/checkanswers
