require('dotenv').config()
const express = require('express')
const logger = require('../logger')
const NotefulRouter = express.Router()
const NotefulService = require('./noteful-service')
// const xss = require('xss')

const bodyParser = express.json()


NotefulRouter
    .route('/folders')
    .get(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        NotefulService.getAllFolders(knexInstance)
            .then(folders => {
                console.log(folders)
                if (!folders) {
                    res.status(404).json({
                        error: { message: 'No folders found' }
                    })
                }
                return res
                    .status(200)
                    .json(folders)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const folder = req.body;
        const cleanedFolder = NotefulService.cleanFolder(folder)
        NOtefulService.insertFolder(knexInstance, cleanedFolder)
            .then(cleanedFolder => {
                // verify folder key:value pairs
                // clean the data
                console.log(cleanedFolder)
                return res
                    .status(200)
                    .json(folder)
            })
            .catch(next)
    })

NotefulRouter
    .route('/notes')
    .get(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        NotefulService.getAllNotes(knexInstance)
            .then(notes => {
                if (!notes) {
                    logger.error(`No notes in database`)
                    return res.status(404).json({
                        error: { message: `No notes found` }
                    })
                }
                return res
                    .status(200)
                    .json(notes)

            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const note = req.body;
        // verify folder key:value pairs
        // clean the data
        const cleanedNote = NotefulService.cleanNote(note)
        NotefulService.insertNote(knexInstance, cleanedNote)
            .then(cleanedNote => { 
                return res
                    .status(201)
                    .json(cleanedNote)
            })
            .catch(next)
    })

NotefulRouter
    .route('/notes/:noteId')
    .get(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const noteId = req.params.noteId
        NotefulService.getNoteById(knexInstance, noteId)
            .then(note => {
                if (!note) {
                    logger.error(`note with id ${noteId} does not exist`)
                    return res.status(404).json({
                        error: { message: `note does not exist` }
                    })
                }
                return res
                    .status(200)
                    .json(note)
            })
            .catch(next)
    })
    .delete(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const noteId = req.params;
        NotefulService.deleteUser(knexInstance, noteId)
            .then(note => {
                if (!note) {
                    logger.error(`note with id ${noteId} does not exist`)
                    return res.status(404).json({
                        error: { message: `note does not exist` }
                    })
                }
                return res
                    .status(201)
                    .json(`note with id ${noteId} deleted`)
            })
            .catch(next)
    })

module.exports = NotefulRouter

