const knex = require('knex')
const app = require('../src/app')
const { makeFoldersArray } = require('./noteful.fixtures')
const { makeNotesArray } = require('./noteful.fixtures')

describe.only('Noteful Endpoints', function() {
    let db

    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DATABASE_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
    
    before('clean the notes table', () => db('notes').truncate())
    before('clean the folders table', () => db('folders').truncate())

    afterEach('cleanup', () => db('notes').truncate())   
    afterEach('cleanup', () => db('folders').truncate())

    describe(`GET /folders`, () => {
        context(`Given no folders`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/noteful/folders')
                    .expect(200, [])
            })
        })

        context('Given there are folders in the database', () => {
            const testFolders = makeFoldersArray()
            beforeEach('insert folders', () => {
            return db
                .into('folders')
                .insert(testFolders)
            })
            it('GET /notes responds with 200 and all of the folders', () => {
                return supertest(app)
                    .get('/api/noteful/folders')
                    .expect(200)
                    .expect(testFolders)
            })
        })
    })

    describe(`POST /folders`, () => {
        context(`given folders in the database`, () => {
            const testFolders = makeFoldersArray()
            
            beforeEach('insert folders', () => {
                return db
                    .into('folders')
                    .insert(testFolders)
            })

            it(`responds with 400 if folder already exists`, ()=>{
                const testFolder = testFolders[0]
                return supertest(app)
                    .post('/api/noteful/folders')
                    .send(testFolder)
                    .expect(400,{
                        error: { 
                            message: `folder name is already in use, pick another name`}
                        })
            })

            it(`responds with 201 when folder is successfully created`,()=>{
                const testFolder = {
                    id: 6,
                    name: 'randomestFolder',
                    date_published: '2029-01-22T16:28:32.615Z'
                }
                return supertest(app)
                    .post('/api/noteful/folders')
                    .send(testFolder)
                    .expect(201)
                    .expect(res=>{
                        expect(res.body.name).to.eql(testFolder.name)
                        expect(res.body.id).to.eql(testFolder.id)
                    })
            })
        })
        context(`Given an XSS attack folders`, () => {
            const testFolders = makeFoldersArray()

            beforeEach('insert folders', () => {
            return db
                .into('folders')
                .insert(testFolders)
            })

            const maliciousFolder = {
                id: 6,           
                name: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad. Naughty naughty very naughty <script>alert("xss");</script>`,
                date_published: '2029-01-22T16:28:32.615Z'
            }

            it('removes XSS attack folders', () => {
            return supertest(app)
                .post(`/api/noteful/folders`)
                .send(maliciousFolder)
                .expect(201)
                .expect(res => {
                    console.log(res.body)
                    expect(res.body.name).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad. Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;`)
                })
            })
        })   
    })

    describe(`GET /notes`, () => {
        context(`Given no notes`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/noteful/notes')
                    .expect(200, [])
            })
        })

        context('Given there are notes in the database', () => {
            const testNotes = makeNotesArray()
            beforeEach('insert notes', () => {
            return db
                .into('notes')
                .insert(testNotes)
            })
            it('GET /notes responds with 200 and all of the notes', () => {
                return supertest(app)
                    .get('/api/noteful/notes')
                    .expect(200)
                    .expect(res =>{
                    expect(testNotes)
                  })
            })
        })
    })

    describe(`POST /notes`, () => {
        context(`Given notes in the database`,()=>{
            const testNotes = makeNotesArray()

            beforeEach('insert notes', () => {
            return db
                .into('notes')
                .insert(testNotes)
            })

            it(`creates a note, responding with 201 and the new note`, function () {
                const newNote = {
                    id: 11,
                    name: 'randomestNote',
                    modified: '2018-08-13T23:00:00.000Z',
                    folder_id: 4,
                    content: 'content yay',
                    date_published: '2029-01-22T16:28:32.615Z'
                }
                
                return supertest(app)
                    .post('/api/noteful/notes')
                    .send(newNote)
                    .expect(201)
                    .expect( res =>{
                        expect(res.body.name).to.eql(newNote.name)
                        expect(res.body.modified).to.eql(newNote.modified)
                        expect(res.body.folder_id).to.eql(newNote.folder_id)
                        expect(res.body.content).to.eql(newNote.content)
                        expect(res.body).to.have.property('id')
                    })
            })
            
        })              
        context(`Given an XSS attack notes`, () => {
            const testNotes = makeNotesArray()

            beforeEach('insert notes', () => {
            return db
                .into('notes')
                .insert(testNotes)
            })

            const maliciousNote = {
                id: 11,           
                name: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
                modified: '2018-08-13T23:00:00.000Z',
                folder_id: 4,
                content: `Naughty naughty very naughty <script>alert("xss");</script>`,
                date_published: '2029-01-22T16:28:32.615Z'
            }

            it('removes XSS attack notes', () => {
            return supertest(app)
                .post(`/api/noteful/notes`)
                .send(maliciousNote)
                .expect(201)
                .expect(res => {
                    console.log(res.body)
                    expect(res.body.content).to.eql(`Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;`)
                    expect(res.body.name).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                })
            })
        })   
    })

    describe(`GET /notes/:noteId`, () => {
        context(`Given no notes`, () => {
            it(`responds with 404`, () => {
            const noteId = 123456
            return supertest(app)
                .get(`/api/noteful/notes/${noteId}`)
                .expect(404, { error: { message: `No notes`} })
            })
        })

        context('Given there are notes in the database', () => {
            const testNotes = makeNotesArray()
            
            beforeEach('insert notes', () => {
            return db
                .into('notes')
                .insert(testNotes)
            })
    
            it('GET /notes/:noteId responds with 200 and the specified note', () =>{
                const noteId = 2
                const expectedNote = testNotes.find(note => note.id === noteId)
                return supertest(app)
                    .get(`/api/noteful/notes/${noteId}`)
                    .expect(200)
                    .expect(res =>{
                        expect(res.body.name).to.eql(expectedNote.name)
                        expect(res.body.modified).to.eql(expectedNote.modified)
                        expect(res.body.folder_id).to.eql(expectedNote.folder_id)
                        expect(res.body.content).to.eql(expectedNote.content)
                        expect(res.body).to.have.property('id')
                    })
            })
        })
    })

    describe(`DELETE /notes/:noteId`,()=>{
        context(`Given notes in the database`,()=>{ 
            const testNotes = makeNotesArray()
            beforeEach('insert notes', () => {
                return db
                    .into('notes')
                    .insert(testNotes)
            })   

            it(`responds with 404 if the note id does not exist`,()=>{
                const idToDelete = 9999999
                return supertest(app)
                    .delete(`/api/noteful/notes/${idToDelete}`)
                    .send({ id: idToDelete })
                    .expect(404, {
                        error: { message: `note with id ${idToDelete} does not exist`}
                    } ) 

            })

            it(`deletes a note from the database`,()=>{
                const deleteNote = testNotes[0]
                const idToDelete = deleteNote.id
                return supertest(app)
                    .delete(`/api/noteful/notes/${idToDelete}`)
                    .send({id: idToDelete})
                    .expect(204)
            })
        })

        context(`Given no notes in the database`,()=>{
            const testNotes = makeNotesArray()
            beforeEach('insert notes', () => {
                return db
                    .into('notes')
                    .insert(testNotes)
            }) 

            it(`returns an empty array`,()=>{
                const deleteNote = testNotes[0]
                const idToDelete = deleteNote.id
                return supertest(app)
                    .delete(`/api/noteful/notes/${idToDelete}`)
                    .send({id: idToDelete})
                    .expect(204)
            })    
        })
        
    })
})