var express = require('express');
var router = express.Router();
var Course = require('./../model/courseModel');


  /* save courses */
  router.post('/save', function (req, res, next) {
    let response = {};
    let newCourse = new Course(req.body);
    Course.findOne({$or:[{course_name:req.body.course_name}]},function(course,err){
      if (course) {
        response = { success: false, message: 'Course is already exist.' };
        res.json(response);
      }
      else{
        newCourse.save(function (err) {
          if (err) {
            response = { success: false, message: 'Course is already exist or try again.'};
          } else {
            response = { success: true, message: 'Course added successfully!' };
          }
          return res.json(response);
        });
        
      }
  });
})
  /* get courses */
router.get('/fetch', function (req, res, next) {
  let response = {};
  Course.find(function (err, courses) {
    if (err) {
      response = { success: false, message: err };
    } else {
      response = { success: true, data: courses };
    }
    return res.json(courses);
  });
});

/* get single course */
router.get('/read/:id', function (req, res) {
  console.log('Request for a course');
    Course.findById(req.params.id,function (err, course) {
    if (err) {
      console.log('Error getting Data')
    } else{
      res.json(course);
    }
    
  });
});

 /* delete courses */
  router.delete('/delete/:id',function (req,res){
    let response={};
    Course.findOneAndDelete(req.params.id,function(err){
      if(err){
        response = { success: false, message: err  };
        
      }else {
        response = { success: true, message:'Course Deleted Successfully' };
       
      }
      return res.json(response);
    })
  })

 /* update courses */
  // router.put('/update/:id',function(req,res){
  //   let updateReqObj = new Course({
  //      course_name:req.body.course_name})
  //   Course.findByIdAndUpdate( req.params.id,updateReqObj,function(err){
  //     if(err){
  //       response = { success: false, message: err };
  //     }else {
  //       response = { success: true, message:'Course Updated Successfully' };
  //     }
  //     return res.json(response);
  //   })
  // })




module.exports = router;
