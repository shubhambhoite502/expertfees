var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* course model */
var courseSchema = new Schema({
    course_name: { type: String, lowercase: true, trim: true,unique:true },
    updated_at: { type: Date, default: Date.now },
    status: { type: Boolean, default: true },
});

module.exports = Course = mongoose.model('Course', courseSchema);