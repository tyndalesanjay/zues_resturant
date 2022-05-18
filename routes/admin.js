var express = require('express');
const conn = require('../lib/db');
var router = express.Router();

// get admin index
router.get('/', (req, res) => {
  if(req.session.loggedin === true){
    conn.query('SELECT * FROM restaurant.admintbl', (err, results) => {
      if (err) {
        res.render('admin/index', {admins: ''});
      }else{
        res.render('admin/index', {admins: results});
      }
    });
  } else {
    res.redirect('admin/login')
  }
});

// auth admin

router.post('/authlogin', (req, res, next) => {
  
    var admin_username = req.body.admin_username;
    var admin_password = req.body.admin_password;

  conn.query('SELECT * FROM admintbl WHERE admin_username = ? AND BINARY admin_password = ?', [admin_username, admin_password], (err, rows, fields) => {
    // if (err) throw err
    if (rows <= 0) {
      console.log('Username or Password is Incorrect')
      res.redirect('/admin/login')
    }else {
      req.session.loggedin = true;
      req.session.admin_name = rows[0].admin_name;
      req.session.admin_contact = rows[0].admin_contact;
      res.redirect('/admin');
    }
  })
});

/* GET admin login. */
router.get('/login', (req, res, next) => {
  res.render('admin/login.ejs', {
    title: 'Login',
  });
});

// add admin view

router.get('/create_45employee', (req, res) => {
  res.render('admin/add')
});

// add admin
router.post('/add_employee', (req, res, next) => {
  const data = {
    admin_name : req.body.admin_name,
    admin_contact : req.body.admin_contact,
    admin_username : req.body.admin_username,
    admin_password : req.body.admin_password
  };

  conn.query('INSERT INTO restaurant.admintbl SET ?', data, (err, results) => {
    if (err) throw err
    res.redirect('/admin/create_45employee')
  });
});

//  delete admin 
router.get('/admin-delete/:admin_id', (req, res) => {
  conn.query('DELETE FROM restaurant.admintbl WHERE admin_id =' + req.params.admin_id, (err, results) => {
    if (err) throw err
    res.redirect('/admin')
  });
});

// *********************************ADMIN MENU************************************************ //

// admin menu
router.get('/menu_6h512-admin', (req, res) => {
  conn.query('SELECT * FROM restaurant.menutbl', (err, results) => {
    if (err) {
      res.render('admin/menus/menu', {title: 'Menu', menus: ''})
    } else {
      res.render('admin/menus/menu', {title: 'Menu', menus: results})
    }
  });
});

// get menu add page 
router.get('/menu_add', (req, res) => {
  res.render('admin/menus/add')
});

// add meal
router.post('/add_menu', (req, res) => {

  const data = {
    menu_id : req.body.menu_id,
    meal_name : req.body.meal_name,
    meal_price : req.body.meal_price,
    meal_description : req.body.meal_description
  }

  conn.query('INSERT INTO restaurant.menutbl SET ?', data, (err, results) => {
    if (err) throw err
    res.redirect('/admin/menu_6h512-admin')
  });
});

router.get('/delete_menu/:menu_id', (req, res) => {
  conn.query('DELETE FROM menutbl WHERE menu_id='+ req.params.menu_id, (err, results) => {
    if (err) throw err 
      res.redirect('/admin/menu_6h512-admin')
  });
});

// edit meal
router.get('/menu_update/:menu_id', (req, res) => {
  conn.query('SELECT * FROM restaurant.menutbl WHERE menu_id =' + req.params.menu_id, (err, results) => {
    if (err) throw err
    res.render('admin/menus/edit', {menus: results[0]})
  });
});

// update meal
router.post('/update_meal/:menu_id', (req, res) => {
  const data = {
    menu_id : req.body.menu_id,
    meal_name : req.body.meal_name,
    meal_price : req.body.meal_price,
    meal_description : req.body.meal_description
  }

  conn.query('UPDATE restaurant.menutbl SET ? WHERE menu_id =' + req.params.menu_id, data, (err, results) => {
    if (err) throw err
    res.redirect('/admin/menu_6h512-admin')
  });

});

// *********************************************Admin Order******************************************************************** //

// order link
router.get('/customer_orders', (req, res) => {
  conn.query('SELECT * FROM restaurant.ordertbl', (err, results) => {
    if (err) {
      res.render('admin/orders/index', {title: 'View Orders', orders: ''});
    }else {
      res.render('admin/orders/index', {title: 'View Orders', orders: results[0]});  
    }
  });
});

module.exports = router;