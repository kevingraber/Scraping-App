var express = require('express');
var morgan = require('morgan');
var bodyparser = require('body-parser')
var path = require('path')

var app = express();
var PORT = process.env.PORT || 80;

app.use(morgan('dev'));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.text());
app.use(bodyparser.json({type:'application/vnd.api+json'}));
app.use(express.static('public'));

var mongoose = require('mongoose');

//Database configuration
mongoose.connect('mongodb://localhost/MagicScraperDB');
var db = mongoose.connection;



var request = require('request');
var cheerio = require('cheerio');

var Article = require('./models/article.js')
var Comment = require('./models/comment.js')

app.get('/', function(req, res){

	res.sendFile(path.join(__dirname+'/public/index.html'));

});



app.get('/api', function(req, res){

	// db.animals.find().sort({"name": 1})

	Article.find({}).sort({date: -1}).exec(function(err, docs){
		if (err) {
          	res.send(err);
        } else {
          	res.json(docs);
        }
	})

	var stuffs = []

	// Reddit
	request('https://magic.wizards.com/en/content/articles', function (error, response, html) {

		var $ = cheerio.load(html);

		$('.article').not('#date-picker').not('#card-day').each(function(i, element){

			var category = $(element).children('.wrap').children('.details').children('.cat').text()
			var date = $(element).children('.wrap').children('.details').children('.date').text()
			var title = $(element).children('.wrap').children('.details').children('.title').text()
			var author = $(element).children('.wrap').children('.details').children('.auth').text()
			var description = $(element).children('.wrap').children('.details').children('.infos').children('p').first().text().trim()
			var imgURL = $(element).children('.wrap').children('.visual').css('background-image')
			imgURL = imgURL.replace('url(','').replace(')','');
			var link = 'https://magic.wizards.com' + $(element).children('.wrap').children('.details').children('.infos').children('p').children('a').attr('href')

			var newArticle = new Article({
				category: category,
				date: date,
				title: title,
				author: author,
				description: description,
				imgURL: imgURL,
				link: link
			})
			newArticle.save(function(err, doc) {
				if (err) {
					console.log(err);
			  	} else {
			    	console.log(doc);
			  	}
			});

			// var obj = {
			// 	category, date, title, author, description, imgURL, link
			// }

			// var newArticle = new Article({obj})

			

			// stuffs.push(obj)

			// console.log('+++++')
			// console.log(obj)
			// console.log('+++++')


			// console.log('-----')
			// console.log('Category: ' + category)
			// console.log('Date: ' + date)
			// console.log('Title: ' + title)
			// console.log('Author: ' + author)
			// console.log('Description: ' + description)
			// console.log('Image URL: ' + imgURL)
			// console.log('Article URL: ' + link)
			// console.log('-----')

		});

		// Article.find({}, function(err, docs){
		// 	if (err) {
	 //          	res.send(err);
	 //        } else {
	 //          	res.json(docs);
	 //        }
		// })

	});

});

app.get('/api/:id', function(req,res){
	console.log('[[[[[[]]]]]]]]]]]')
	console.log(req.params.id)
	Article.findById(req.params.id)
		.populate('comments')
		.exec(function(err, doc) {
			if (err) {
				res.send(err);
			} else {
				res.json(doc);
				// console.log(doc)
			}
		});
})

// app.get('/api/:id', function(req, res){
// 	Article.findOne({'_id': req.params.id})
// 	.populate('comments')
// 	.exec(function(err, doc){
// 		if (err){
// 			console.log(err);
// 		} else {
// 			console.log(doc)
// 			// res.json(doc);
// 		}
// 	});
// });


app.listen(PORT, function(){
	console.log("App is now listening on PORT: " + PORT);
});