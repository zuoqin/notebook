var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StorySchema = new Schema({
	creator: {type:Schema.Types.ObjectId, ref: 'User'},
	title: String,
	introduction: String,
	content: String,
	modified: {type: Date, default: Date.now}, 
	created: {type: Date, default: Date.now},
	topic: String,
	//images: { type : Array , "default" : [] }
	images: [{ data: Buffer, contentType: String, id: String, pic: String }]
	//img: 
});

module.exports = mongoose.model('Story', StorySchema);