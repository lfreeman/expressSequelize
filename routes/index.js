var express = require('express');
var models  = require('../models');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

    models.sequelize
        .authenticate()
        .then(function () {
            console.log('Connection successful');
        })
        .catch(function(error) {
            console.log("Error creating connection:", error);
        });


  res.render('index', { title: 'Express' });
});

module.exports = router;
