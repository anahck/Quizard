// const Test = require("supertest/lib/test")
const db = require("../../../db/connect")
const Question = require("../../../models/Question")

describe("Question", () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())
    
    describe('getAll', () => {
        it('resolves with questions on successful db query', async () => {
            // ARRANGE
            const mockQuestion = [
                { questionid: 1, questioncontent: 'A question1?', testid: 1, totalScore: 10, answer: "answer1" },
                { questionid: 2, questioncontent: 'A question2?', testid: 1, totalScore: 10, answer: "answer2" },
                { questionid: 3, questioncontent: 'A question3?', testid: 1, totalScore: 10, answer: "answer3" },
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockQuestion })
            // ACT
            const questions = await Question.getAll()
            // ASSERT
            expect(questions).toHaveLength(3)
            expect(questions[0]).toHaveProperty('questionid')
            expect(questions[0].questioncontent).toBe('A question1?')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM questions;")
        })

        it('should throw an Error when no questions are found', async () => {
            // ARRANGE
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Question.getAll()).rejects.toThrow("No questions available")
        })
    })

    describe('getOneByID', () => {
        it('resolves with question on successful db query', async () => {
            // ARRANGE
            const testQuestion = [{ questionid: 1, questioncontent: 'A question1?', testid: 1, totalScore: 10, answer: "answer1" }]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testQuestion })
            // ACT
            const result = await Question.getOneByID(1)
            // ASSERT
            expect(result).toBeInstanceOf(Question)
            expect(result.questioncontent).toBe('A question1?')
            expect(result.questionid).toBe(1)
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM questions WHERE questionid = $1;", [1])
        })

        it('should throw an Error when no question is found', async () => {
            // ARRANGE
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Question.getOneByID(999)).rejects.toThrow("Unable to locate question")
        })
    })

    describe('getByTestID', () => {
        it('resolves with questions on successful db query', async () => {
            // ARRANGE
            const testid = 1
            const mockQuestion = [
                { questionid: 1, questioncontent: 'A question1?', testid: 1, totalScore: 10, answer: "answer1" },
                { questionid: 2, questioncontent: 'A question2?', testid: 1, totalScore: 10, answer: "answer2" },
                { questionid: 3, questioncontent: 'A question3?', testid: 1, totalScore: 10, answer: "answer3" },
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockQuestion })
            // ACT
            const questions = await Question.getByTestID(testid)
            // ASSERT
            expect(questions).toHaveLength(3)
            expect(questions[0]).toHaveProperty('questionid', 1)
            expect(questions[0].questioncontent).toBe('A question1?')
            expect(questions[0].testid).toBe(1)
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM questions WHERE testid = $1;", [testid])
        })

        it('should throw an Error when no questions are found', async () => {
            // ARRANGE
            const testid = 1
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Question.getByTestID(testid)).rejects.toThrow("No questions available for this test")
        })
    })

    xdescribe('create', () => {
        it('resolves with test on successful creation', async () => {
            // ARRANGE
            const testData = { testname: 'History Basics', subjectid: 1, duedate: "2025-08-30", assigneddate: "2025-08-26", authorid: 1 }
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
                .mockResolvedValueOnce({ rows: [{ subjectid: 1 }] })
                .mockResolvedValueOnce({ rows: [{ userid: 1 }] })
                .mockResolvedValueOnce({ rows: [{ ...testData, testid: 1 }] })
            // ACT
            const result = await Test.create(testData)
            // ASSERT
            expect(result).toBeInstanceOf(Test)
            expect(result).toHaveProperty("testid", 1)
            expect(result).toHaveProperty("testname", "History Basics")
            expect(db.query).toHaveBeenCalledWith("INSERT INTO test (testname, subjectid, duedate, assigneddate, authorid) VALUES ($1, $2, $3, $4, $5) RETURNING *;", [testData.testname, testData.subjectid, testData.duedate, testData.assigneddate, testData.authorid ])
        })

        it('should throw an Error when test name is missing', async () => {
            // ARRANGE
            const incompleteTestData = {}
            // ACT & ASSERT
            await expect(Test.create(incompleteTestData)).rejects.toThrow("Test name is missing")
        })
        
        it('should throw an Error when test already exists', async () => {
            // ARRANGE
            const testData = { testname: 'History Basics', subjectid: 1, duedate: "2025-08-30", assigneddate: "2025-08-26", authorid: 1 }
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ ...testData, testid: 1 }] })
                .mockResolvedValueOnce({ rows: [{ subjectid: 1 }] })
                .mockResolvedValueOnce({ rows: [{ userid: 1 }] })
            // ACT & ASSERT
            await expect(Test.create(testData)).rejects.toThrow("A test with this name already exists")
        })

        it('should throw an Error when subject id is incorrect', async () => {
            // ARRANGE
            const incorrectTestData = { testname: 'History Basics', subjectid: 100, duedate: "2025-08-30", assigneddate: "2025-08-26", authorid: 1 }
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
                .mockResolvedValueOnce({ rows: [] })
                .mockResolvedValueOnce({ rows: [{ userid: 1 }] })
            // ACT & ASSERT
            await expect(Test.create(incorrectTestData)).rejects.toThrow("A subject with this ID does not exist")
        })

        it('should throw an Error when author/user id is incorrect', async () => {
            // ARRANGE
            const incorrectTestData = { testname: 'History Basics', subjectid: 1, duedate: "2025-08-30", assigneddate: "2025-08-26", authorid: 100 }
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
                .mockResolvedValueOnce({ rows: [{ subjectid: 1 }] })
                .mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Test.create(incorrectTestData)).rejects.toThrow("An author with this ID does not exist")
        })
    })

    xdescribe('update', () => {
        it('should return the updated test on successful update', async () => {
            // ARRANGE
            const test = new Test({ testid: 1, testname: 'History Basics', subjectid: 1, duedate: "2025-08-30", assigneddate: "2025-08-26", authorid: 1 })
            const updatedData = { testname: 'History Advanced' }
            const updatedTest = { testid: 1, ...updatedData }
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedTest] })
            // ACT
            const result = await test.update(updatedData)
            // ASSERT
            expect(result).toBeInstanceOf(Test)
            expect(result.testname).toBe('History Advanced')
            expect(result.testid).toBe(1)
            expect(db.query).toHaveBeenCalledWith("UPDATE test SET testname = COALESCE($1, testname), subjectid = COALESCE($2, subjectid), duedate = COALESCE($3, duedate), assigneddate = COALESCE($4, assigneddate), authorid = COALESCE($5, authorid) WHERE testid = $6 RETURNING *;", [updatedData.testname, test.subjectid, test.duedate, test.assigneddate, test.authorid, test.testid])
        })

        it('should throw an Error on db query failure', async () => {
            // ARRANGE
            const test = new Test({ testid: 1, testname: 'History Basics' })
            jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));
            // ACT & ASSERT
            await expect(test.update({ testname: 'History Advanced' })).rejects.toThrow('Database error');
        });
    })

    xdescribe('destroy', () => {
        it('should return nothing on successful deletion', async () => {
            // ARRANGE
            const test = new Test({ testid: 1, testname: 'History Basics', subjectid: 1, duedate: "2025-08-30", assigneddate: "2025-08-26", authorid: 1 });
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
            // ACT
            const result = await test.destroy()
            // ASSERT
            expect(db.query).toHaveBeenCalledWith("DELETE FROM test WHERE testid = $1;", [test.testid])
        })

        it('should throw an Error on db query failure', async () => {
            // ARRANGE
            const test = new Test({ testid: 1, testname: 'History Basics', subjectid: 1, duedate: "2025-08-30", assigneddate: "2025-08-26", authorid: 1 })
            jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));
            // ACT & ASSERT
            await expect(test.destroy()).rejects.toThrow('Cannot delete')
        });
    })
})