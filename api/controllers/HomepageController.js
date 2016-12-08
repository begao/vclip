/**
 * HomepageController
 * Author       :: Kingasawa
 * @description :: Server-side logic for managing homepages
 * @help        :: https://facebook.com/kingasawa.chan
 */

module.exports = {

  index: (req,res) => {
    let presentDate = (new Date()).toString();
    let postLimit = 30;
    let params = req.allParams();

    // Count all post
    let findCountPost = new Promise((resolve, reject) => {
      Post.count().exec((err, countPost) => {
        if (err) {reject(err)}
        resolve(countPost);
      })
    });
    // Select all Featured Post - no limit
    let findFeaturedPost = new Promise((resolve, reject) => {
      Post.find({featured:1,sort:'createdAt DESC'}).exec((err, featuredPost) => {
        if (err) {reject(err)}
        resolve(featuredPost);
      })
    });
    // Select all Category - no limit
    let findAllCategory = new Promise((resolve, reject) => {
      Category.find().populate('posts').exec((err, allCategory) => {
        if (err) {reject(err)}
        resolve(allCategory);
      })
    });
    // Select all Post - limit 32
    let findAllPost = new Promise((resolve, reject) => {
        Post.find({kind:'video'},{sort:'createdAt DESC'}).limit(8).exec((err, allPost) => {
          if (err) { reject(err) }
          resolve(allPost);
        })
    });
    let findAllArticle = new Promise((resolve, reject) => {
      if (!params.page) {
        Post.find({kind:'article'},{sort:'createdAt DESC'})
          .populate('cid')
          .limit(postLimit)
          .exec((err, allArticle) => {
          if (err) {
            reject(err)
          }
          resolve(allArticle);
        })
      } else {
        Post.find({kind:'article'},{sort:'createdAt DESC'})
          .populate('cid')
          .paginate({page:params.page,limit:postLimit})
          .exec((err, allArticle) => {
          if (err) {
            reject(err)
          }
          resolve(allArticle);
        })
      }
    });
    // Solve all using Async/Await
    (async () => {
      var [featuredPost,allCategory,allPost,allArticle] = await Promise.all([
        findFeaturedPost,
        findAllCategory,
        findAllPost,
        findAllArticle
      ]);
      return res.view("homepage", {featuredPost,allCategory,allPost,allArticle})
    })
    ()
  }
};
