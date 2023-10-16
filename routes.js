const express = require('express');
var router = express.Router()

router.get('/product/add', (req, res)=>{
    res.render('add_product')
})

router.get('/category/add', (req, res)=>{
    res.render('add_category')
})


module.exports = router