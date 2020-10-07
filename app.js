var express = require('express');

const path =require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
// Bring in models
let Article = require('./models/article')
mongoose.connect('mongodb://localhost/nodekb', {useNewUrlParser: true, useUnifiedTopology: true});
let db = mongoose.connection;

// check connection 

db.once('open', function(){
    console.log('Connected to MongoDB')
})
// check db errors

db.on('error', function(err){
    console.log(err)
});
app.set('views', path.join(__dirname , 'views'));
app.set('view engine', 'pug')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Set public folder

app.use(express.static(path.join(__dirname,'public')))

app.get('/', function (req, res) {
     Article.find({}, function(err, articles){
         if(err){
             console.log(err)
             
         }else{
              res.render('index',{
            title: 'Articles',
            articles: articles
          
        } )
         }

      

     });
    //     id:1,
    //     title:'Article One',
    //     author:'Danal Fernando',
    //     body:'This is article one'
    // },
    // {
    //     id:2,
    //     title:'Article Two',
    //     author:'Geevinda Samaraweera',
    //     body:'This is article one'
    // },{
    //     id:3,
    //     title:'Article One',
    //     author:'Sandev Abeykoon',
    //     body:'This is article one'
    // },
    //     ];
   
    
});


// add route
app.get('/articles/add', function(req , res){
    res.render('add_article',{
        title: 'Add Article',
      
    } )
    
})
// add submit
app.post("/articles/add", function(req,res){
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article.save(function(err){
        if(err){
            console.log(err)
            return;

        }else{
            res.redirect('/')
        }
    })
  
})
// use port 3000 unless there exists a preconfigured port
var port = process.env.port || 3000;

app.listen(port);