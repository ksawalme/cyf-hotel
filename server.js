const dbFilename = '/Users/ksawalme/Documents/Studies/week16/sql/cyf-hotel.sqlite';
const sqlite = require('sqlite3').verbose();


const express = require("express");
const exphbs = require("express-handlebars");
const bodyparser = require("body-parser");
const formidable = require("formidable");


let db = new sqlite.Database(dbFilename);



const SERVER_PORT = process.env.PORT || 8080;


const apiRouter = require("./api");

const app = express();
const router = express.Router();

app.get("/customers", function (req, res) {
  db.all("SELECT title, firstname, surname " +
    "FROM customers", function (err, rows) {
      console.log(err)
      res.status(200).json({
        customers: rows
      });

      rows.forEach(function (row) {
        console.log(row.title, row.firstname,
          row.surname);

      });
    });
});

  app.get("/customers/:id", function(req, res) {
    console.log(req.params.id)
    console.log("req.params.id")
    sqlQuery = "SELECT * FROM customers where id = "+ req.params.id
    db.all( sqlQuery , function (err, rows) {
      if (err){
        return console.log (err.message)

      }
      res.status(200).json({
       customers: rows
     });

         
});
});

app.get("/customers/name/:firstname", function (req, res) {
  console.log(req.params.firstname)

  sqlQuery = "SELECT * FROM customers where firstname || surname like '%'||?||'%'"
  db.all(sqlQuery, [req.params.firstname], function (err, rows) {
    if (err){
      return console.log (err.message)

    }
    res.status(200).json({
     customers: rows
   });

   
  });
});

app.post("/customers/", function (req, res) {
  var ttl = req.body.title;
  var fnm = req.body.firstname;
  var snm = req.body.surname;
  var eml = req.body.email;
  db.run("INSERT INTO customers (title, firstname, surname, email) VALUES (?, ?, ?, ?)",
    [ttl, fnm, snm, eml], function (err) {
      if (err == null) {
        var rowid = this.lastID;  //get the PK
        var rowchange = this.changes;
        console.log(`New customer id = ${rowid} and the number of row changed = ${rowchange}`);
        res.status(200).json({ lastId: rowid.toString() });  // return the PK
      } else {
        res.status(500).json({ error: err });
      }
    });
});
app.get("/invoices", function (req, res) {
db.all("select * from invoices", function (err, rows){
  if (err==null){
  res.status(200).json({
    invoices: rows
  });
 } else {
    res.status(500).json({ error: err });
  }
});

});

app.get("/invoices/:id", function(req, res) {
  sqlQuery = "SELECT * FROM invoices where id = "+ req.params.id
  db.all( sqlQuery , function (err, rows) {
    if (err){
      return console.log (err.message)

    }
    res.status(200).json({
      invoices: rows
   });

       
});
});

app.get("/reservations", function (req, res) {
  db.all("select * from reservations", function (err, rows){
    if (err==null){
    res.status(200).json({
      reservations: rows
    });
   } else {
      res.status(500).json({ error: err });
    }
  });
  
  });

  app.get("/reservations/:customer_id", function(req, res) {
    sqlQuery = "SELECT * FROM reservations where customer_id = "+ req.params.customer_id
    db.all( sqlQuery , function (err, rows) {
      if (err){
        return console.log (err.message)
  
      }
      res.status(200).json({
        reservations: rows
     });
  
         
  });
  });
 
  app.post("/reservations/", function (req, res) {
    var custid = req.body.customer_id;
    var room_num= req.body.room_number;
    var checkin = req.body.check_in_date;
    var checkout = req.body.check_out_date;
    var price = req.body.price_per_night;

      db.run("INSERT INTO reservations (customer_id, room_number, check_in_date, check_out_date,price_per_night) VALUES (?, ?, ?, ?, ?)",
        [custid, room_num, checkin, checkout, price], function (err) {
  if (err == null) {
          var rowid = this.lastID;  //get the PK
          var rowchange = this.changes;
          console.log(`New reservation id = ${rowid} and the number of row changed = ${rowchange}`);
            res.status(200).json({ lastReservation: rowid.toString() });  // return the PK
              } else {
          res.status(500).json({ error: err });
        }
      });
  });
  



app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: "hbs"
  })
);
app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.static("assets"));

app.use("/api", apiRouter);

// handle HTTP POST requests
app.use(bodyparser.json());

app.get("/", function (req, res, next) {
  res.render("home");
});

app.listen(SERVER_PORT, () => {
  console.info(`Server started at http://localhost:${SERVER_PORT}`);
});
