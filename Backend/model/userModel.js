var mongoose = require('mongoose');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-auto-increment');
/* user model */
var userSchema = new Schema({
  studentId:{type:Number,default:0, unique:true},
  userid:{type: String,required: 'User Id name can\'t be empty',unique:true},
  mobileNo: {type: String,required: 'Full name can\'t be empty',unique:true},
  email: {type: String,required: 'Email can\'t be empty',unique: true},
  password: {type: String,required: 'Password can\'t be empty',minlength: [4, 'Password must be atleast 4 character long']},
  admin: { type: Boolean, default: false },
  token: { type: String, trim: true },
  reset_password_token: { type: String, trim: true },
  reset_password_expires: { type: Date },
  updated_at: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },
  admission_status:{type:Boolean,default:false},
  applicationForm: [{ type: Schema.Types.ObjectId, ref: 'ApplicationForm' }],
  saltSecret: String
 
});
autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection); 
userSchema.plugin(autoIncrement.plugin, {
  model: 'userSchema',
  field: 'studentId',
  startAt: 1,
  incrementBy: +1
});

module.exports.getUserById = function(id,callback){
  User.findById(id,callback);
  }
module.exports = User = mongoose.model('Users', userSchema);