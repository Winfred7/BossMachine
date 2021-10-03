const express = require('express');
const app=express()
const meetingsRouter = express.Router();

const {createMeeting,
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
    deleteAllFromDatabase} = require('./db')


      //body parser middleware
      app.use(express.urlencoded({extended: true}));
      app.use(express.json())

      meetingsRouter.route('/')
                    .get((req ,res, next) =>{
                        const meetings= getAllFromDatabase('meetings');
                        if(meetings) res.send(meetings);
                        else res.status(404).send('No meetings schedule Yet!');
                    })
                    .post( (req, res,next) =>{
                        const meeting =createMeeting();
                        res.send(meeting);
                    })
                    .delete((req ,res ,next) =>{
                        const removeMeetings= deleteAllFromDatabase('meetings');

                        removeMeetings ? res.send('Meetings deleted') : res.status(404).send('No meeting to delete')
                    })


module.exports=meetingsRouter;