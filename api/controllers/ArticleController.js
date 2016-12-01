/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  manager: (req,res) => {
      Article.find(function(err,allPost) {
        if (err) return res.negotiate(err);
        else res.view('template/article/manager',{allPost})
      })
  },
  //
  // view: (req,res) => {
  //   let params = req.allParams();
  //   Category.find(function(err,allCategory) {
  //     Post.find({limit:5,sort: 'createdAt DESC'}).exec(function(err,fivePost) {
  //       Post.findOne({id: params.id}).exec(function (err,result) {
  //         if (err) {
  //           return res.negotiate(err)
  //         }
  //         let updateView = result.view+1;
  //         Post.update({id:params.id},{view:updateView}).exec(function(err,done){
  //           //do something
  //         });
  //         res.view('template/post',{result,allCategory,fivePost,title:result.name})
  //       })
  //     })
  //   })
  // },

  // edit: (req,res) => {
  //   if (!req.isSocket) {
  //     return res.badRequest('sai zồi')
  //   }
  //   let params = req.allParams();
  //   Category.update({id:params.id},{
  //     name: params.name,
  //     description: params.description,
  //     column: params.column,
  //     status: params.status
  //   }).exec(function(err,result) {
  //     if (err) {
  //       return res.negotiate(err)
  //     }
  //     res.json(result)
  //   })
  // },

  add: (req,res) => {
    Files.find(function(err,allThumb) {
      if (err) return res.negotiate(err);
      Category.find(function(err,allCategory) {
        res.view('template/article/add',{allCategory,allThumb})
      })
    });
  },

  // search: (req,res) => {
  //   let params = req.allParams();
  //   let postLimit = 12;
  //   Post.find({
  //     slug:{'contains':params.keyword},sort:'createdAt DESC'})
  //     .paginate({page:params.page,limit:postLimit})
  //     .exec(function(err,searchPost) {
  //       if (!searchPost) {
  //         res.negotiate('Không tìm thấy phim')
  //       } else {
  //         Category.find(function(err,allCategory) {
  //           Post.find({limit:5}).exec(function(err,fivePost) {
  //             res.view('template/search', {searchPost,allCategory,fivePost,title:'Clip Share - Tìm Phim'})
  //           })
  //         })
  //       }
  //     })
  // }

};

