var express = require('express');
var router = express.Router();
var conn = require('../lib/db')

router.get('/', (req, res) => {
    
    conn.query('SELECT menu_id, meal_name, meal_price, meal_description from restaurant.menutbl', (err, results) => {
        if (err) throw err;
        res.render('menu/index', {orders: results, title: 'Menu'});
    })
});

router.get('/order_form/:order_id', (req, res, next) => {
    var sql = "SELECT order_id, meal_name, meal_price, meal_servings, total_price, username FROM restaurant.menu_detailtbl"

    conn.query(sql, (err, results) => {
        res.render('menu/index', {orders:results[0]})
        next();
    })
})

router.get('/add_cart', (res, req) => {
    var sql = "INSERT INTO carttbl (meal_name, price) SELECT meal_name, meal_price FROM restaurant.menutbl"
    conn.query(sql, (err, results) => {
        if (err) throw err;
        // return success(res, results);
        res.render('/menu', {orders:results[0]}); 

    });
})

router.get('/add_cart')

module.exports = router;