"use strict";

var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var multer = require("multer");

// require and use "multer"...
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname} - ${Date.now()}`);
  }
});

var upload = multer({ storage: storage });

var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/hello", function(req, res) {
  res.json({ greetings: "Hello, API" });
});

//{"name":"Car Insurance.pdf","type":"application/pdf","size":450067}
//{"fieldname":"upfile","originalname":"Car Insurance.pdf","encoding":"7bit","mimetype":"application/pdf","destination":"uploads","filename":"upfile - 1580637290293","path":"uploads/upfile - 1580637290293","size":450067}
app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  let file = req.file;

  if (file) {
    res.json({name: file.originalname, type: file.mimetype, size: file.size});
  } else {
    res.send("File upload Error");
  }
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Node.js listening ...");
});
