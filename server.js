var express  = require('express');
var path = require('path');
var mongoose = require('mongoose');

var port     = process.env.PORT || 5000;
var app      = express();
var mongoUrl = process.env.MONGODBURL;

//database schemas and models

var visitorSchema = mongoose.Schema({  visitors: Number });

var Visitor=mongoose.model('Visitor',visitorSchema);

// basic server setup 

app.use(express.static( path.join(__dirname,'/')));
app.engine('html', require('ejs').renderFile);

app.get('/',function(req,res){
  getCounts(Visitor,res);
  //res.end(JSON.stringify(countJSON));  
});

app.listen(port);
console.log('server runs on port  ' + port);

// database functions 

function getCounts(visitors,Render){
 var all={};
 var countJSON={visitors: 0};
 console.log("getCounts executing");
 visitors.findOne(all,function(e,d){
    if (e) return handleError(e);
    if(d === null)
     {console.log("no database entry");
      console.log("creating entry");
      visitors.create(countJSON,function(e,d){
           if (e) return handleError(e);
           console.log(JSON.stringify(countJSON)+" created");      
       });
     }
    else 
     {visitors.findOneAndUpdate({_id: d._id},{$inc: {visitors: +1}})
       .exec(function(e,d){
              if(e)
               {console.log("incrementing failed");} 
              else  
               {console.log("incremented");
                console.log(d.visitors); 
               } 
             }
            );
      ++d.visitors;      
      console.log(JSON.stringify(d));
      Render.end(JSON.stringify(d));
     } 
  });
}

// database initalisation

mongoose.connect(mongoUrl);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected to the MongoDB server");
});
