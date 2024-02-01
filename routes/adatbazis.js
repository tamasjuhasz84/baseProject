const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite"
  });

const express = require('express');
const router = express.Router()
const cookieParser = require('cookie-parser');

async function employees (req,res,next){
    res.locals.employees = await sequelize.query("SELECT * FROM `Employees`", { type: QueryTypes.SELECT }); 
    res.locals.ages = await sequelize.query("SELECT age FROM `Employees`", { type: QueryTypes.SELECT });
    next();
  };
  
router.use(employees);
router.use(cookieParser());

router.get('/',(req, res, next)=>{
    res.render('adatbazis',{
      fullTable: res.locals.employees,
      allAges: res.locals.ages
  });
});


module.exports = router;
