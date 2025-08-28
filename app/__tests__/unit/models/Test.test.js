// const Test = require("supertest/lib/test")
const db = require("../../../db/connect")
const Test = require("../../../models/Test")

describe("Test", () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())
    
    describe('getAll', () => {
        it('resolves with tests on successful db query', async () => {
            // ARRANGE
            const mockTest = [
                { testid: 1, testname: 'History Basics', subjectid: 1},
                { testid: 2, testname: 'Geography Basics', subjectid: 2},
                { testid: 3, testname: 'Languages Basics', subjectid: 3},
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockTest })
            // ACT
            const tests = await Test.getAll()
            // ASSERT
            expect(tests).toHaveLength(3)
            expect(tests[0]).toHaveProperty('testid')
            expect(tests[0].testname).toBe('History Basics')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM test;")
        })

        it('should throw an Error when no tests are found', async () => {
            // ARRANGE
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Test.getAll()).rejects.toThrow("No tests available")
        })
    })

    describe('getOneByID', () => {
        it('resolves with test on successful db query', async () => {
            // ARRANGE
            const testTest = [{ testid: 1, testname: 'History Basics', subjectid: 1 }]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testTest })
            // ACT
            const result = await Test.getOneByID(1)
            // ASSERT
            expect(result).toBeInstanceOf(Test)
            expect(result.testname).toBe('History Basics')
            expect(result.testid).toBe(1)
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM test WHERE testid = $1;", [1])
        })

        it('should throw an Error when no test is found', async () => {
            // ARRANGE
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Test.getOneByID(999)).rejects.toThrow("Unable to locate test")
        })
    })

    describe('create', () => {
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

    describe('update', () => {
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

    describe('destroy', () => {
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