const express = require('express');
const app=express()
const ideasRouter = express.Router();
const checkMillionDollarIdea=require('./checkMillionDollarIdea')

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

      //middle ware for minionId parameter
      ideasRouter.param("ideaId", (req, res, next, id) => {
        const getIdeas = getFromDatabaseById("ideas", id);
        if (getIdeas) {
          req.idea = getIdeas;
          next();
        } else {
          res.status(404).send("Invalid idea Id!");
        }
      })
        //request to fetch all minions from db
         
        ideasRouter.route('/')
        .get((req , res, next) =>{
          
          res.send({
              ideas: getAllFromDatabase('ideas')
           })
           
        })

       //request to post a new minion
       .post(checkMillionDollarIdea,(req , res, next ) =>{
        let name= req.body.name;
        let  description = req.body.title;
        let weeklyRevenue= (req.body.weeklyRevenue)
        let numWeeks     =req.body.numWeeks

           if(name === '' || description==='' || typeof numWeeks=== 'number'
           ||typeof weeklyRevenue==='number'){
               res.status(400).send();
           }else{

               req.body.weeklyRevenue= Number(weeklyRevenue);
               req.body.numWeeks= Number(numWeeks);

               const newIdea=  addToDatabase('ideas',req.body)
               res.status(201).send(newIdea)
           }
})

//fetch a minion by ID
ideasRouter.route('/:ideaId')
             .get((req ,res ,next) =>{
                
                res.status(200).json(req.idea);
                 
             })

             .put((req ,res ,next ) =>{
               
                const ideaEditer = updateInstanceInDatabase('ideas',req.body);
                res.send(ideaEditer);
                    
                 })
             .delete((req ,res ,next) =>{
                 let deletedIdea=deleteFromDatabasebyId('ideas',req.params.ideaId);
                 if(!deletedIdea)
                 res.status(404).send()
                 else
                 res.status(204).send(deletedIdea);

             })


module.exports=ideasRouter