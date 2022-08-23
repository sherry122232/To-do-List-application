// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date= require(__dirname + "/date.js");

// console.log(date());

const app = express();


let items = [];
let workItems= [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true})); //用于解析post request信息
app.use(express.static("public"));

app.get("/",function(req,res){
  let day = date.getDate();
  // let day = date.getDay();


  // var currentDay=today.getDay();
  // var dayName = ["Monday", "Tuesday", "Wednesday", "Thursday","Friday","Saturday","Sunday"];
  // var day=dayName[currentDay];
    // res.sendFile(__dirname+"/index.html");

      //list 是list.ejs的name
      res.render("list", {listTitle: day, newListItem: items});
})


app.post("/", function(req, res) {
  let item = req.body.newItem;
  console.log(req.body);
  if (req.body.list === "Work"){  //注意这个list是按钮的名字
      workItems.push(item);
      res.redirect("/work");
  }
  else{items.push(item);
  res.redirect("/");}

  // console.log(newItem)

});



app.get("/work",function(req,res){
  res.render("list",{listTitle: "Work List", newListItem: workItems});
})

app.post("/work",function(req,res){

  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

app.get("/about",function(req,res){
  res.render("about");
})



app.listen(3000,function(){
  console.log("Server started on port 3000!")
})
