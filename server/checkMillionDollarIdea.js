const checkMillionDollarIdea = (req,res,next) => {
    const {numWeeks,weeklyRevenue}=req.body;
    if(numWeeks && weeklyRevenue){
    const worth=Number(numWeeks) * Number(weeklyRevenue);
    if(!isNaN(worth) || worth >1000_000){
        next();
    } 
    else res.status(400).send('Idea must be worth at least A million');
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
