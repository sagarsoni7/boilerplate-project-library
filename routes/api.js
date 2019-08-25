/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');

//Import model
let user = require('../schema.js').user;

const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
mongoose.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true })


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
     user.find({}, (err, data) => {
       if(err) console.log(err);
       res.json(data)      
         })
       })
         
    .post(function (req, res){
      var title = req.body.title;
      var comments = [];
      var newEntry = {
        title: title,
        comments: comments,
        commentcount: 0
      }
      if(title) {
         user.create(newEntry, (err, data) => {
        if(err) console.log(err);
        res.json({
          title: data.title,
          comments: data.comments,
          _id: data._id
        })
      })
      } else {
        res.send('missing title')
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    user.deleteMany({}, (err) => {
      if(err) console.log(err);
      res.send('complete delete successful')
    })
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      await user.findOne({_id: bookid}, (err, data) => {
        if(data) {
          res.json({
            title: data.title,
            _id: data._id,
            comments: data.comments
          })} else {
            res.send('no book exists')
          }
        })
    })
    
    .post(async function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      let existingComment;
      await user.findOne({_id: bookid}, (err, data) => {
         existingComment = data.comments
      })
      let commentEntry = [...existingComment, comment]
      let counter;
      await user.findOne({_id: bookid}, (err, data) => {
        counter = data.commentcount
      })
        await user.findOneAndUpdate({_id: bookid},
                              {$set:{
                                comments: commentEntry,
                                commentcount: counter + 1
                              }}, { new : true }, (err, data) => {
            if(err) res.send(err);
            res.json({
              title: data.title,
              _id: data._id,
              comments: data.comments
            })
          })
     })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      user.deleteOne({_id: bookid}, (err) => {
      if(err) console.log(err);
      res.send('delete successful')
    })
    });
  
};
