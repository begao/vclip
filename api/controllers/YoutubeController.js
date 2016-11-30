/**
 * YoutubeController
 *
 * @description :: Server-side logic for managing imdbs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var request = require('request');
var youtubeAPIkey = 'key=AIzaSyAHoDhCioQn9I5g6M5OA52ytarU1QQs5Pc';
module.exports = {

	search : (req,res) => {
    let params = req.allParams();
    request.get({
      url: 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id='+params.id+'&'+youtubeAPIkey,
    },function(error,response,body){
      if(error) return sails.log.error(error);
      var data = JSON.parse(body);
      var [getData] = data.items;
      console.log(getData.contentDetails);
      sails.sockets.join(req,params.id);
      sails.sockets.broadcast(params.id,'getdata/youtube',{msg:getData.contentDetails,getThumbUrl:'https://img.youtube.com/vi/'+params.id+'/mqdefault.jpg'})
    });
  }
};

// let getThumbUrl = 'https://img.youtube.com/vi/'+params.id+'/0.jpg';
