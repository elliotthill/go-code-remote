import express from 'express';
const router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {

    if (!req.isAuthenticated())
        res.status(500).send("No Access");

    res.render("index", {title: 'Express', version: '1'}, function(err, list) {

        res.send(list);
    });


});

export default router;
