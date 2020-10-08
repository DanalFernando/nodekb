var express = require('express');

const path =require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
// Bring in models
let Article = require('./models/article');
const article = require('./models/article');
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

    
});


// add route
app.get('/articles/add', function(req , res){
    res.render('add_article',{
        title: 'Add Article',
      
    } )

    
})

// get article
app.get('/article/:id', function(req,res){
    Article.findById(req.params.id,function(err,article){
        res.render('article',{
            article: article,
          
        } )
    
    })
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

// load edit form
app.get('/article/edit/:id', function(req,res){
    Article.findById(req.params.id,function(err,article){
        res.render('edit_article',{
            title : 'Edit Article',
            article: article,
          
        } )
    
    })
})
// use port 3000 unless there exists a preconfigured port
var port = process.env.port || 5000;

app.listen(port);