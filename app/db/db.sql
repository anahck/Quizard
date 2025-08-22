DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS test CASCADE;
DROP TABLE IF EXISTS scores CASCADE;
DROP TABLE IF EXISTS userInfo CASCADE;

CREATE TABLE userInfo (
    userID INT GENERATED ALWAYS AS IDENTITY,
    firstName VARCHAR(30) NOT NULL,
    lastName VARCHAR(30) NOT NULL,
    email VARCHAR(30) UNIQUE NOT NULL,
    passwordHash CHAR(30) NOT NULL,
    userRole VARCHAR(30) NOT NULL,
    yearGroup INT NOT NULL,
    PRIMARY KEY (userID)
);

CREATE TABLE subjects(
    subjectID INT GENERATED ALWAYS AS IDENTITY,
    subjectName VARCHAR(30) NOT NULL,
    PRIMARY KEY (subjectID)
);

CREATE TABLE test(
    testID INT GENERATED ALWAYS AS IDENTITY,
    testName VARCHAR(30) NOT NULL,
    subjectID INT NOT NULL,
    dueDate DATE,
    assignedDate DATE,
    authorID INT,
    PRIMARY KEY (testID),
    FOREIGN KEY (subjectID) REFERENCES subjects(subjectID) ON DELETE CASCADE,
    FOREIGN KEY (authorID) REFERENCES userInfo(userID) ON DELETE CASCADE
);

CREATE TABLE scores(
    scoreID INT GENERATED ALWAYS AS IDENTITY,
    userID INT NOT NULL,
    testID INT NOT NULL,
    score INT NOT NULL,
    scoreDate DATE NOT NULL,
    PRIMARY KEY (scoreID),
    FOREIGN KEY (userID) REFERENCES userInfo(userID) ON DELETE CASCADE,
    FOREIGN KEY (testID) REFERENCES test(testID) ON DELETE CASCADE
);

CREATE TABLE questions(
    questionID INT GENERATED ALWAYS AS IDENTITY,
    questionContent VARCHAR(500) NOT NULL,
    testID INT NOT NULL,
    totalScore INT NOT NULL,
    answer VARCHAR(500) NOT NULL,
    FOREIGN KEY (testID) REFERENCES test(testID) ON DELETE CASCADE
);

INSERT INTO userInfo (firstName, lastName, email, passwordHash, userRole, yearGroup)
VALUES
('Alice', 'Johnson', 'alice@example.com', 'hashedpassword123', 'student', 10),
('Bob', 'Smith', 'bob@example.com', 'hashedpassword456', 'student', 11),
('Charlie', 'Brown', 'charlie@example.com', 'hashedpassword789', 'teacher', 0),
('Diana', 'Prince', 'diana@example.com', 'hashedpassword321', 'teacher', 0);

INSERT INTO subjects (subjectName)
VALUES
('History');

INSERT INTO test (testName, subjectID, dueDate, assignedDate, authorID)
VALUES
('World War II Basics', 1, '2025-09-01', '2025-08-15', 3),
('Ancient Civilizations', 1, '2025-09-10', '2025-08-20', 4),
('Modern History: Cold War', 1, '2025-09-20', '2025-08-25', 3);

INSERT INTO questions (questionContent, testID, totalScore, answer)
VALUES
-- Test 1: World War II Basics
('Who was the Prime Minister of Britain during most of WWII?', 1, 10, 'Winston Churchill'),
('What year did WWII begin?', 1, 5, '1939'),
('What year did WWII end?', 1, 5, '1945'),

-- Test 2: Ancient Civilizations
('Which civilization built the pyramids of Giza?', 2, 10, 'Ancient Egyptians'),
('Who was the first emperor of Rome?', 2, 10, 'Augustus'),
('What writing system was used in Ancient Mesopotamia?', 2, 10, 'Cuneiform'),

-- Test 3: Modern History: Cold War
('Which two superpowers were rivals during the Cold War?', 3, 10, 'USA and USSR'),
('What year did the Berlin Wall fall?', 3, 10, '1989'),
('Who was the Soviet leader during the Cuban Missile Crisis?', 3, 10, 'Nikita Khrushchev');

INSERT INTO scores (userID, testID, score, scoreDate)
VALUES
(1, 1, 18.00, '2025-08-20'),  -- Alice: WWII Basics
(2, 1, 15.00, '2025-08-20'),  -- Bob: WWII Basics
(1, 2, 25.00, '2025-08-22'),  -- Alice: Ancient Civilizations
(2, 3, 20.00, '2025-08-23');  -- Bob: Cold War


