var express = require('express');
var router = express.Router();
var ApplicationForm = require('./../model/applicationFormModel');
var User = require('./../model/userModel');
const passport = require('passport');
// user: req.body._id
/* add appliction form by id */
router.post('/add/:id', function (req, res) {
    var response = {};
    let newApplicationForm = new ApplicationForm(req.body);
    console.log(req.params.id);
    User.findById(req.params.id, function (err, user) {
        if (err) {
            response = { success: false, message: err };
        } else {
            console.log("Iam here 2");
            if(user == null ) {
                response = { success: true, message: 'User is not exist' };
            } else{
                newApplicationForm.user = user._id;
                newApplicationForm.save();
                response = { success: true, message: 'application form submitted' };
            }
        }
        res.json(response);
    });

});

/* get appliction form by id */
router.get('/getapplicationform/:id', function (req, res) {
    ApplicationForm.findOne({user: req.params.id}, function (err, appForm) {
        if (err) {
            response = { success: false, message: err };
        } else {
            if(appForm == null ) {
                response = { success: true, message: 'Application form is not exist' };
            } else{
                response = { success: true, appForm: appForm, message:"application form found" };
            }
        }
        res.json(response);
    });

});

router.put('/update/:id',function(req,res){
    var response = {};
    ApplicationForm.findByIdAndUpdate({ user: req.params.id },function(err,appForm,doc){
        if (err){
            response = { success: false, message: err };
            
        } else{
            if (appForm == null){
                response = { success: true, message: 'Application form is not exist' };
                
            }
            else{
                doc.name = req.body;
                doc.save();
                response = { success: true, message: 'application form updated successfully' };
            }
        }
        res.json(response);
    })
})
// Student.findByIdAndUpdate(req.params.id, {
//     $set: req.body
//   }, (error, data) => {
//     if (error) {
//       return next(error);
//       console.log(error)
//     } else {
//       res.json(data)
//       console.log('Student successfully updated!')
//     }
//   })

/* get all appliction forms */
router.get('/all', function (req, res, next) {
    let response = {};
    ApplicationForm.find(function (err, applications) {
      if (err) {
        response = { success: false, message: err };
      } else {
        response = { success: true, data: applications };
      }
      return res.json(response);
    });
  });

  /* get application forms by course_name */
router.post('/courseapplications',function(req,res){
    ApplicationForm.find({course_name: req.body.course_name}, function (err, applications) {
        if (err) {
            response = { success: false, message: err };
        } else {
            if(applications.length === 0) {
                response = { success: true, message: 'Application form is not exist' };
            } else{
                response = { success: true, application: applications, message:"Application forms found" };
            }
        }
        res.json(response);
    });

});

 /* get application form by full_name */
 router.post('/fullnameapplications',function(req,res){
    let response = {};
    ApplicationForm.find({fullname:req.body.fullname},function(err,fullnameapplications){
        if (err){
            response = { success: false, message: err + "error is here" };
        }else{
            if(fullnameapplications.length === 0 ) {
                response = { success: true, message: 'Application form is not exist with provided fullname' };
            }else{
                response = { success: true, fullnameapplications: fullnameapplications, message:"application form found with provided fullname" };
            }
        }
        res.json(response);
    })
})  
        
 

module.exports = router;
