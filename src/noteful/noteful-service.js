// const bcrypt = require('bcryptjs')
const xss = require('xss')

const NotefulService = {
    getAllFolders(knex) {
        // return all characters
        return knex.select('*').from('folders')
    },
    getAllNotes(knex) {
        // return all characters
        const notes = knex.select('*').from('notes')
        return notes
    },
    insertFolder(knex, newFolder) {
        // insert new user data   
        return knex 
            .insert(newFolder)
            .into('folders')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    insertNote(knex, newNote) {
        // insert new character data
        return knex 
            .insert(newNote)
            .into('notes')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getNoteById(knex, id) {
        return knex
            .from('notes')
            .select('*')
            .where('id', id)
            .first()
    },
    deleteNote(knex, id) {
        // delete user by id
        return knex('notes')
            .where({ id })
            .delete()
    },
    cleanFolder(folder) {
        return {
            id: folder.id,           
            name: xss(folder.auth),
            date_published: folder.date_published
        }
    },
    cleanNote(note) {
        return {
            id: note.id,
            name: xss(note.name),
            modified: note.modified,
            content: xss(note.content),
            date_published: note.date_published
        }
    }
}

module.exports = NotefulService