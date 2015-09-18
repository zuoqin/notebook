var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ControlSchema = new Schema({
	name: String,
	sfield1: String,
	sfield2: String,
	sfield3: String,
	bfield1: Boolean
});

module.exports = mongoose.model('Control', ControlSchema);