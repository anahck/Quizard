const db = require("../../../db/connect")
const Subject = require("../../../models/Subject")

describe("Subject", () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())
    
    describe('getAll', () => {
        it('resolves with subjects on successful db query', async () => {
            // ARRANGE
            const mockSubject = [
                { subjectid: 1, subjectname: 'History' },
                { subjectid: 2, subjectname: 'Geography' },
                { subjectid: 3, subjectname: 'Languages' },
            ]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: mockSubject })
            // ACT
            const subjects = await Subject.getAll()
            // ASSERT
            expect(subjects).toHaveLength(3)
            expect(subjects[0]).toHaveProperty('subjectid')
            expect(subjects[0].subjectname).toBe('History')
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM subjects;")
        })

        it('should throw an Error when no subjects are found', async () => {
            // ARRANGE
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Subject.getAll()).rejects.toThrow("No subjects available")
        })
    })

    describe('getOneByID', () => {
        it('resolves with subject on successful db query', async () => {
            // ARRANGE
            const testSubject = [{ subjectid: 1, subjectname: 'History' }]
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: testSubject })
            // ACT
            const result = await Subject.getOneByID(1)
            // ASSERT
            expect(result).toBeInstanceOf(Subject)
            expect(result.subjectname).toBe('History')
            expect(result.subjectid).toBe(1)
            expect(db.query).toHaveBeenCalledWith("SELECT * FROM subjects WHERE subjectid = $1;", [1])
        })

        it('should throw an Error when no subject is found', async () => {
            // ARRANGE
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] })
            // ACT & ASSERT
            await expect(Subject.getOneByID(999)).rejects.toThrow("Unable to locate subject")
        })
    })

    describe('create', () => {
        it('resolves with subject on successful creation', async () => {
            // ARRANGE
            const subjectData = { subjectname: 'History' }
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [{ ...subjectData, subjectid: 1 }] })
            // ACT
            const result = await Subject.create(subjectData)
            // ASSERT
            expect(result).toBeInstanceOf(Subject)
            expect(result).toHaveProperty("subjectid", 1)
            expect(result).toHaveProperty("subjectname", "History")
            expect(db.query).toHaveBeenCalledWith("INSERT INTO subjects (subjectname) VALUES ($1) RETURNING *;", [subjectData.subjectname])
        })

        it('should throw an Error when subject name is missing', async () => {
            // ARRANGE
            const incompleteSubjectData = {}
            // ACT & ASSERT
            await expect(Subject.create(incompleteSubjectData)).rejects.toThrow("Subject name is missing")
        })
        
        it('should throw an Error when subject already exists', async () => {
            // ARRANGE
            const subjectData = { subjectname: 'History' }
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [{ ...subjectData, subjectid: 1 }] })
            // ACT & ASSERT
            await expect(Subject.create(subjectData)).rejects.toThrow("A subject with this name already exists")
        })
    })

    describe('update', () => {
        it('should return the updated subject on successful update', async () => {
            // ARRANGE
            const subject = new Subject({ subjectid: 1, subjectname: 'Hitsory'})
            const updatedData = { subjectname: 'History' }
            const updatedSubject = { subjectid: 1, ...updatedData }
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [updatedSubject] })
            // ACT
            const result = await subject.update(updatedData)
            // ASSERT
            expect(result).toBeInstanceOf(Subject)
            expect(result.subjectname).toBe('History')
            expect(result.subjectid).toBe(1)
            expect(db.query).toHaveBeenCalledWith("UPDATE subjects SET subjectname = $1 WHERE subjectid = $2 RETURNING subjectid, subjectname;", [updatedData.subjectname, subject.subjectid])
        })

        it('should throw an Error on db query failure', async () => {
            // ARRANGE
            const subject = new Subject({ subjectid: 1, subjectname: 'History' })
            jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));
            // ACT & ASSERT
            await expect(subject.update({ subjectname: 'Geography' })).rejects.toThrow('Database error');
        });
    })

    describe('destroy', () => {
        it('should return nothing on successful deletion', async () => {
            // ARRANGE
            const subject = new Subject({ subjectid: 1, subjectname: 'History' });
            jest.spyOn(db, 'query').mockResolvedValueOnce({ rows: [] });
            // ACT
            const result = await subject.destroy()
            // ASSERT
            expect(db.query).toHaveBeenCalledWith("DELETE FROM subjects WHERE subjectid = $1;", [subject.subjectid])
        })

        it('should throw an Error on db query failure', async () => {
            // ARRANGE
            const subject = new Subject({ subjectid: 1, subjectname: 'History' })
            jest.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));
            // ACT & ASSERT
            await expect(subject.destroy()).rejects.toThrow('Cannot delete')
        });
    })
})