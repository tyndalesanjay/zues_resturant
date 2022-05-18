const e = require('express');
var express = require('express');
var router = express.Router();
var conn = require('../lib/db')

router.get('/', (req, res) => {
    
    conn.query('SELECT * from restaurant.carttbl', (err, results) => {
        // if (err) throw err;
        // res.render('menu/cart', {items: results[0], title: 'Cart'});

        if (err) {
            console.log(err)
            res.render('menu/cart', {items: '', title: 'Cart'});
        }else{
            res.render('menu/cart', {items: results, title: 'Cart'});
        }
    });
});

router.get('/delete/:cart_id', (req, res) => {
    conn.query('DELETE FROM restaurant.carttbl WHERE cart_id =' + req.params.cart_id, (err, results) => {
      if (err) {
        res.redirect('/cart', {items: ''})
      } else {
   
        res.redirect('/cart', {items: results})
      }
    });
  });

router.post('/checkout', (req, res) => {
    // orderNumber = Math. floor (Math.random() *100) + new Date().toSON().slice (0, 10).split('-').reverse().join('')
    const data = { 
        username: req.body.username,
        meal_name: req.body.meal_name, 
        meal_price: req.body.meal_price,
        order_number: req.body.order_number
    }

    conn.query('INSERT INTO restaurant.order_detailtbl (order_number, username, meal_name, meal_price) VALUES (?,?,?,?)',[data.order_number, data.username, data.meal_name, data.meal_price], (err, results) => {
        if (err) {
            console.log(err)
        }else {
            res.redirect('/menu')
        }
    });

    // conn.query('INSERT INTO restaurant.order_detailtbl SET ?', req.body, (err, results) => {
    //     if (err) throw err
    //     res.redirect('/menu')
    // });
});



module.exports = router;
