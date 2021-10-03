const express = require('express');
const app = require('../server');
const apiRouter = express.Router();
const minionsRouter = require('./minions')
const ideassRouter = require('./ideas')
const meetingsRouter=require('./meetings')


apiRouter.use('/minions',minionsRouter);
apiRouter.use('/ideas',ideassRouter)
apiRouter.use('/meetings',meetingsRouter)
      


module.exports = apiRouter