const express = require('express');
const app=express()
const minionsRouter = express.Router();
const Joi =require('joi')

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

     
        //request to fetch all minions from db
         
        minionsRouter.route('/')
        .get((req , res, next) =>{
          
          res.send({
              minions: getAllFromDatabase('minions')
           })
           
        })

       //request to post a new minion
       .post((req , res, next ) =>{
        let name= req.body.name;
        let  title = req.body.title;
        let  weaknesses= req.body.weaknesses;
        let salary= (req.body.salary)

           if(name === '' || title==='' || weaknesses=== ''
           || salary===''){
               res.status(400).send();
           }else{

               req.body.salary= Number(salary);

               const newMinion=  addToDatabase('minions',req.body)
               res.status(201).send(newMinion)
           }
})

 //middle ware for minionId parameter
 minionsRouter.param("minionId", (req, res, next, id) => {
  const getminion = getFromDatabaseById("minions", id);
  if (getminion) {
    req.minion = getminion;
    next();
  } else {
    res.status(404).send("Invalid minion Id!");
  }
});

//fetch a minion by ID
minionsRouter.route('/:minionId')
             .get((req ,res ,next) =>{
                
                res.status(200).json(req.minion);
                 
             })

             .put((req ,res ,next ) =>{
               
                const mionionEditer = updateInstanceInDatabase('minions',req.body);
                res.send(mionionEditer);
                    
                 })
             .delete((req ,res ,next) =>{
                 let deletedminion=deleteFromDatabasebyId('minions',req.params.minionId);
                 if(!deletedminion)
                 res.status(404).send()
                 else
                 res.status(204).send(deletedminion);

             });

             //route for bossess to manage minion's work

minionsRouter.route('/:minionId/work')
             .get(( req, res, nex) =>{
            
             const workForMinion= getAllFromDatabase('work').filter( (work) =>{
              return work.minionId ===req.params.minionId });
               
               if(workForMinion) res.status(200).json(workForMinion);
               else res.status(404).send();
            
             })
             .post((req ,res ,next )=>{
                 const {error}= validateWork(req.body);
              if(error) res.status(400).send('Bad request!');
               
               const work=req.body;
               work.minionId=req.params.minionId;

               const newWork =addToDatabase('work',work);
               res.status(200).json(newWork);

             })
             .put(( req, res, next) =>{
              const {error}= validateWork(req.body);
              if(error) res.status(400).send('Bad request!');
               
              const work=req.body;
              
             if (work.minionId === req.params.minionId){
               const workEdited= updateInstanceInDatabase('work',work);
               res.status(201).json(workEdited)
             }else res.status(404).send();
            })
            .delete((req ,res ,next) =>{
              const workDeleted= deleteFromDatabasebyId('work',req.params.minionId);
              (workDeleted) ? res.status(203).send(workDeleted) : res.status(404).send() ;
             })

             function validateWork(work) {
              const schema = Joi.object({
                title: Joi.string().min(3).trim().required(),
                description: Joi.string().min(3).trim().required(),
                hours: Joi.number().required(),
                minionId: Joi.string().required(),
              });
            
              return schema.validate(work);
            }

module.exports=minionsRouter