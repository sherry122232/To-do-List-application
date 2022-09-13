// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date= require(__dirname + "/date.js");
const _ = require("lodash");
const mongoose =require("mongoose");
// console.log(date());

const app = express();


let items = [];
let workItems= [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true})); //用于解析post request信息
app.use(express.static("public"));


//updated 9/4
// mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true}); //this is for local
mongoose.connect("mongodb+srv://wang3s4:Sherry!1998@cluster0.bw3mj4n.mongodb.net/todolistDB",{useNewUrlParser: true});

const itemSchema ={
  name: String,
};
const Item=mongoose.model("Item",itemSchema);

const listSchema = {
  name:String,
  items:[itemSchema]
};

const List = mongoose.model("List", listSchema);

const item1 = new Item ({
  name:"Do homework",
});
const item2 = new Item ({
  name:"Do housework",
});
const item3 = new Item ({
  name:"Relax yourself",
});
const defaultItems=[item1,item2,item3];




app.get("/",function(req,res){
  let day = date.getDay();


//updated 9/4
Item.find(function(err,foundItems){
  if (foundItems.length ===0){

    Item.insertMany(defaultItems, function(err){
      if (err){
        console.log(err);
      } else {
        console.log("Successfully saved all the items to itemsDB");
      }
    });
    res.redirect("/");
    //这一句话就是重新回到app.get然后回到下面那个else，因为这时候已经insertmany了

    //updated 9/4
  } else {
    res.render("list",{listTitle:day,newListItem: foundItems});
  }

});
});
//updated 9/4



  let day = date.getDay();


  // var currentDay=today.getDay();
  // var dayName = ["Monday", "Tuesday", "Wednesday", "Thursday","Friday","Saturday","Sunday"];
  // var day=dayName[currentDay];
    // res.sendFile(__dirname+"/index.html");


      //list 是list.ejs的name

//updated 9/4
      // res.render("list", {listTitle: day, newListItem: items});
      //updated 9/4

app.get("/:custonListName", function(req,res){
  const custonListName= _.capitalize(req.params.custonListName);

  List.findOne({name:custonListName}, function(err,foundList){
    if (!err){
      if (!foundList){
        // Create a new list
        const list = new List({
          name: custonListName,
          items: defaultItems
        });
          list.save();
          res.redirect("/"+custonListName);
      } else {
        //show an existing list
        res.render("list",{listTitle: foundList.name, newListItem: foundList.items});
        // console.log("Exists!");
      }
    }
  });
});


app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });

  console.log(listName);
  if (listName ===day){
    item.save();
    res.redirect("/");
  } else {

    List.findOne({name: listName}, function(err,foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/"+ listName);
    });
  }
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName ===day){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if (!err){
        console.log("Successfully deleted that item!");
        res.redirect("/");
      }
    });
  } else {

    List.findOneAndUpdate({name: listName},{$pull:{items:{_id:checkedItemId}}},function(err,foundList){
      if (!err){
        res.redirect("/"+ listName);
      }
    });
  }



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


let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}

app.listen(port,function(){
  console.log("Server has started!")
});
