// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

// Creates an Article Schema. This will be the basis of how article data is stored in the db
var ArticleSchema = new Schema({
    category: {type: String, required: true},
    date: {type: Date, required: true},
    title: {type: String, required: true, unique: true},
    author: {type: String, required: true},
    description: {type: String, required: true},
    imgURL: {type: String, required: true},
    link: {type: String, required: true},
    comments: [{
    	type: Schema.Types.ObjectId,
    	ref: 'Comments'
    }]
});

// Exports the ArticleSchema for use elsewhere. Sets the MongoDB collection to be used as: "Articles"
module.exports = mongoose.model('Articles', ArticleSchema);