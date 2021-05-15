const express = require("express");
const app = express();
const path = require("path");
const { monitorEventLoopDelay } = require("perf_hooks");
const {Pool} = require("pg");
require("dotenv").config();
const pool = new Pool({
  connectionString:process.env.DATABASE_URL,
  ssl:{
    rejectUnauthorized:false
  }
});
const dblib = require("./dblib.js");

dblib.getTotalRecords()
    .then(result => {
        if (result.msg.substring(0, 5) === "Error") {
            console.log(`Error Encountered.  ${result.msg}`);
        } else {
            console.log(`Total number of database records: ${result.totRecords}`);
        };
    })
    .catch(err => {
        console.log(`Error: ${err.message}`);
    });

app.listen(3000,()=>{ {
  console.log("Server started (http://localhost:3000/) !");
}});

app.set("view engine", "ejs");
app.set("views", path.join( __dirname + "/views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => { {
  res.render("index");
}});


app.get("/customer", async (req, res) => {
// Omitted validation check
const message = "get";
res.render("customer", {
    type: "get",
    totRecs: totRecs.totRecords

});
});

app.post("/customer", async (req, res) => {
// Omitted validation check
getTotalRecords()
    .then(result => {
        if (result.msg.substring(0, 5) === "Error") {
            console.log(`Error Encountered.  ${result.msg}`);
        } else {
            const totRecords = `Total number of database records: ${result.totRecords}`;
        };
    })
    .catch(err => {
        console.log(`Error: ${err.message}`);
    });
//  Add it as a hidden form value.
const totRecs = await findCustomers();
//get customers
dblib.findCustomers(req.body)
    .then(result => {
        res.render("search", {
            type: "post",
            totRecs: totRecs.totRecords,
            result: result,
            prod: req.body
        })
    })
    .catch(err => {
        res.render("customer", {
            type: "post",
            totRecs: totRecs.totRecords,
            result: `Unexpected Error: ${err.message}`,
            prod: req.body
        });
    });
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM customer WHERE cusID = $1";
  pool.query(sql, [id], (err, result) => {
    res.render("edit", { model: result.rows[0] });
  });
});

app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const customer = [req.body.cusID, req.body.cusFname, req.body.cusLname,req.body.cusState,req.body.SalesYTD,req.body.cusSalesPrev, id];
  const sql = "UPDATE customer SET cusID = $1, cusFname = $2, cusLname = $3, cusState = $4, cusSalesYTD = $5, cusSalesPrev = $6 WHERE (Book_ID = $7)";
  pool.query(sql, customer, (err, result) => {
    if (err){
        message= `Error. No customer exists`;

    }
    res.redirect("/customer");
  });
});

app.get("/delete", (req, res) => { {
const id = req.params.id;
  }});

  app.post("/edit/:id", (req, res) => {
    const id = req.params.id;
    const sql = " DELETE FROM customer WHERE cusID = $1, cusFname = $2, cusLname = $3, cusState = $4, cusSalesYTD = $5, cusSalesPrev = $6 WHERE (Book_ID = $7)";
    pool.query(sql, customer, (err, result) => {
      // if (err) ...
      res.redirect("/customer");
    });
  });




app.get("/create", (req, res) => { {
    //goal is to get data from the form 
    //data from form gets transferred. SQL suppose to be read as an array. Render needs to be on post for success/
    insertProduct();  
res.render("create");
}});


app.post("/create", (req,res)=>{{
    //send success/failure on post.
    //Is sure that insertProduct has a function for this.
    res.render("create");
}});

//render import page
app.get("/import", (req, res) => { {
res.render("import");
}});


app.post("/import",  upload.single('filename'), (req, res) => {
  if(!req.file || Object.keys(req.file).length === 0) {
      message = "Error: Import file not uploaded";
      return res.send(message);
  };
  //Read file line by line, inserting records
  const buffer = req.file.buffer; 
  const lines = buffer.toString().split(/\r?\n/);

  lines.forEach(line => {
       //console.log(line);
       product = line.split(",");
       //console.log(product);
       const sql = "INSERT INTO customer(cusID, cusFName, cusLname, cusState, cusSalesYTD, cusSalesPrev) VALUES ($1, $2, $3, $4, $5, $6)";
       pool.query(sql, product, (err, result) => {
           if (err) {
               console.log(`Insert Error.  Error message: ${err.message}`);
           } else {
               console.log(`Inserted successfully`);
           }
      });
  });
  message = `Processing Complete - Processed ${lines.length} records`;
  res.send(message);
});




app.get("/export", (req, res) => { {
  var message = "";
res.render("export");
}});

//export file to .csv
app.post("/export", (req, res) => {
  const sql = "SELECT * FROM customer ORDER BY cusID";
  pool.query(sql, [], (err, result) => {
      var message = "";
      if(err) {
          message = `Error - ${err.message}`;
          res.render("export", { message: message })
      } else {
          var output = "";
          message = `Export completed`;
          result.rows.forEach(product => {
              output += `${customer.cusID},${customer.cusFname},${customer.cusLname},${customer.cusState},${customer.SalesYTD},${customer.SalesPrev}\r\n`;
        res.render('export',{message:message});
          });
          res.header("Content-Type", "text/csv");
          res.attachment("export.csv");
          return res.send(output);
      };
  });
});


//function to find customers
const findCustomers = (customer) => {
  // Will build query based on data provided from the form
  //  Use parameters to avoid sql injection

  // Declare variables
  var i = 1;
  params = [];
  sql = "SELECT * FROM customer WHERE true";

  //query builds as each field gets entered.
  if (customer.cusID !== "") {
      params.push(parseInt(customer.cusID));
      sql += ` AND cusID = $${i}`;
      i++;
  };
  if (customer.cusFName !== "") {
      params.push(`${customer.cusFName}%`);
      sql += ` AND UPPER(cusFName) LIKE UPPER($${i})`;
      i++;
  };
  if (customer.cusLName !== "") {
    params.push(`${customer.cusLName}%`);
    sql += ` AND UPPER(cusLName) LIKE UPPER($${i})`;
    i++;
};
  if (customer.cusState !== "") {
      params.push(`${customer.cusState}%`);
      sql += ` AND UPPER(cusLName) LIKE UPPER($${i})`;
      i++;
  };
  if (customer.cusSalesYTD !== "") {
      params.push(parseFloat(customer.cusSalesYTD));
      sql += ` AND cusSalesYTD >= $${i}`;
      i++;
  };
  if (customer.cusSalesPrev !== "") {
      params.push(parseInt(customer.cusSalesPrev));
      sql += ` AND cusSalesPrev >= $${i}`;
      i++;
  };

  sql += ` ORDER BY cusID`;
  // for debugging
   console.log("sql: " + sql);
   console.log("params: " + params);

  return pool.query(sql, params)
      .then(result => {
          return { 
              trans: "success",
              result: result.rows
          }
      })
      .catch(err => {
          return {
              trans: "Error",
              result: `Error: ${err.message}`
          }
      });
};


const getTotalRecords = () => {
  sql = "SELECT COUNT(*) FROM customer";
  return pool.query(sql)
      .then(result => {
          return {
              msg: "success",
              totRecords: result.rows[0].count
          }
      })
      .catch(err => {
          return {
              msg: `Error: ${err.message}`
          }
      });
};

const insertCustomer = (customer) => {
    // Will accept either a product array or product object
    if (customer instanceof Array) {
        params = customer;
    } else {
        params = Object.values(customer);
    };

    const sql = `INSERT INTO customer (cusID, cusFname, cusLname, cusState, cusSalesYTD, cusSalesPrev)
                 VALUES ($1, $2, $3, $4, $5, $6)`;

    return pool.query(sql, params)
        .then(res => {
            return {
                trans: "success", 
                msg: `customer id ${params[0]} successfully inserted`
            };
        })
        .catch(err => {
            return {
                trans: "fail", 
                msg: `Error on insert of customer id ${params[0]}.  ${err.message}`
            };
        });
};


module.exports.insertCustomer = insertCustomer;
module.exports.findProducts = findProducts;