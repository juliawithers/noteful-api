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
                return res
                    .status(200)
                    .json(folders)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const knexInstance = req.app.get('db')
        const newFolder = req.body;
        NotefulService.getAllFolders(knexInstance)
            .then(folders => {
                folders.map(folder => {
                    if (folder.name === newFolder.name) {
                        return res 
                            .status(400)
                            .json({
                                error: { message: `folder name is already in use, pick another name`}
                            })
                    }
                })
            })
        const cleanedFolder = NotefulService.cleanFolder(newFolder)
        console.log('cleaned folder= '+ cleanedFolder)
        NotefulService.insertFolder(knexInstance, cleanedFolder)
            .then(cleanedFolder => {
                // verify folder key:value pairs
                // clean the data
                console.log('cleanedFolder= '+cleanedFolder)
                return res
                    .status(201)
                    .json(cleanedFolder)
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
                        error: { message: `No notes` }
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
        const noteId = req.params.noteId;
        NotefulService.deleteNote(knexInstance, noteId)
            .then(note => {
                if (!note) {
                    logger.error(`note with id ${noteId} does not exist`)
                    return res.status(404).json({
                        error: { message: `note with id ${noteId} does not exist` }
                    })
                }
                return res
                    .status(204)
                    .json(`note with id ${noteId} deleted`)
            })
            .catch(next)
    })

module.exports = NotefulRouter

