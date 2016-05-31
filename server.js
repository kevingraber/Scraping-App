var request = require('request');
var cheerio = require('cheerio');

// Reddit
request('https://magic.wizards.com/en/content/articles', function (error, response, html) {

	var $ = cheerio.load(html);
	// var result = [];
	// $('div.article').each(function(i, element){

	//     var title = $(this).text();
	//     // var link = $(element).children().attr('href');
	  
	//     result.push({
	//       title:title,
	//       // link:link
	//     });
	//   });
	// console.log(result);
	// var title = $('.article .title').text()
	// var description = $('.article .infos p').text()
	// console.log(title)
	// console.log(description)

	$('.article').not('#date-picker').not('#card-day').each(function(i, element){

		var category = $(element).children('.wrap').children('.details').children('.cat').text()
		var date = $(element).children('.wrap').children('.details').children('.date').text()
		var title = $(element).children('.wrap').children('.details').children('.title').text()
		var author = $(element).children('.wrap').children('.details').children('.auth').text()
		var description = $(element).children('.wrap').children('.details').children('.infos').children('p').first().text().trim()
		var imgURL = $(element).children('.wrap').children('.visual').css('background-image')
		imgURL = imgURL.replace('url(','').replace(')','');
		var link = 'https://magic.wizards.com' + $(element).children('.wrap').children('.details').children('.infos').children('p').children('a').attr('href')


		console.log('-----')
		console.log('Category: ' + category)
		console.log('Date: ' + date)
		console.log('Title: ' + title)
		console.log('Author: ' + author)
		console.log('Description: ' + description)
		console.log('Image URL: ' + imgURL)
		console.log('Article URL: ' + link)
		console.log('-----')

	});

});


