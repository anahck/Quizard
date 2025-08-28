const subjectsController = require('../../../controllers/subjects')
const Subject = require('../../../models/Subject')

// Mocking response methods
const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

// we are mocking .send(), .json() and .end()
const mockStatus = jest.fn(() => ({ 
  send: mockSend, 
  json: mockJson, 
  end: mockEnd 
}))

const mockRes = { status: mockStatus }

describe('Subjects controller', () => {
    beforeEach(() => jest.clearAllMocks())
    afterAll(() => jest.resetAllMocks())

    describe('index', () => {
        it('should return subjects with a status code 200', async () => {
            const testSubjects = ['s1', 's2']
            jest.spyOn(Subject, 'getAll').mockResolvedValue(testSubjects)

            await subjectsController.index(null, mockRes)
            
            expect(Subject.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(200)
            expect(mockJson).toHaveBeenCalledWith(testSubjects)
        })

        it('should return an error upon failure', async () => {
            jest.spyOn(Subject, 'getAll').mockRejectedValue(new Error('Something happened to your db'))

            await subjectsController.index(null, mockRes)
            
            expect(Subject.getAll).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(500)
            expect(mockJson).toHaveBeenCalledWith({ error: 'Something happened to your db' })
            })
    })

    describe ('showId', () => {
        let testSubject, mockReq;

        beforeEach(() => {
            testSubject = { subjectid: 1, subjectname: 'Test subject' }
            mockReq = { params: { id: 1 } }
        });

        it('should return a goat with a 200 status code', async () => {
            jest.spyOn(Subject, 'getOneByID').mockResolvedValue(new Subject(testSubject))

            await subjectsController.showId(mockReq, mockRes);
            
            expect(Subject.getOneByID).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(new Subject(testSubject))
        })

        it('should return an error if the subject is not found', async () => {
            jest.spyOn(Subject, 'getOneByID').mockRejectedValue(new Error('oh no'))

            await subjectsController.showId(mockReq, mockRes)
            
            expect(Subject.getOneByID).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(404)
            expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' })
        })
    })

    describe ('create', () => {
        it('should return a new subject with a 201 status code', async () => {
            let testSubject = { subjectname: 'Test Subject' }
            const mockReq = { body: testSubject }

            jest.spyOn(Subject, 'create').mockResolvedValue(new Subject(testSubject))

            await subjectsController.create(mockReq, mockRes)
            
            expect(Subject.create).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(201)
            expect(mockJson).toHaveBeenCalledWith(new Subject({ ...testSubject }))
        })


        it('should return an error if creation fails', async () => {
            let testSubject = { subjectname: 'Test Subject' }
            const mockReq = { body: testSubject }

            jest.spyOn(Subject, 'create').mockRejectedValue(new Error('oh no'))

            await subjectsController.create(mockReq, mockRes)
            
            expect(Subject.create).toHaveBeenCalledTimes(1)
            expect(mockStatus).toHaveBeenCalledWith(400)
            expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' })
        })
    })

    describe ('update', () => {
        it('should update a goat and return it with a 200 status code', async () => {
            const existingSubject = { subjectid: 22, subjectname: 'Geography'}
            const updatedSubject = { ...existingSubject, subjectname: 'Updated Subject' };
            const mockReq = { params: { id: 22 }, body: { subjectname: 'Updated Subject' } }

            jest.spyOn(Subject, 'getOneByID').mockResolvedValue(new Subject(existingSubject))
            jest.spyOn(Subject.prototype, 'update').mockResolvedValue(updatedSubject)

            await subjectsController.update(mockReq, mockRes)

            expect(Subject.getOneByID).toHaveBeenCalledWith(22);
            expect(Subject.prototype.update).toHaveBeenCalledWith({ subjectname: 'Updated Subject' });
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(updatedSubject);
        })

        it('should return an error if the subject is not found', async () => {
            const mockReq = { params: { id: '49' }, body: {} };

            jest.spyOn(Subject, 'getOneByID').mockRejectedValue(new Error('Subject not found'));

            await subjectsController.update(mockReq, mockRes);

            expect(Subject.getOneByID).toHaveBeenCalledWith(49);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Subject not found' });
        })
    })

    describe ('destroy', () => {
        it('should return a 204 status code on successful deletion', async () => {
            const testSubject = { subjectid: 1, subjectname: 'Test Subject' };
            const mockReq = { params: { id: '1' } };

            jest.spyOn(Subject, 'getOneByID').mockResolvedValue(new Subject(testSubject));
            jest.spyOn(Subject.prototype, 'destroy').mockResolvedValue();

            await subjectsController.destroy(mockReq, mockRes);

            expect(Subject.getOneByID).toHaveBeenCalledWith(1);
            expect(Subject.prototype.destroy).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(204);
            expect(mockEnd).toHaveBeenCalled();
        });

        it('should return an error if the subject is not found', async () => {
            const mockReq = { params: { id: '49' } };

            jest.spyOn(Subject, 'getOneByID').mockRejectedValue(new Error('Subject not found'));

            await subjectsController.destroy(mockReq, mockRes);

            expect(Subject.getOneByID).toHaveBeenCalledWith(49);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Subject not found' });
        });
    })
})