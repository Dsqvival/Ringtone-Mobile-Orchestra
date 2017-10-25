var raccoon = require('raccoon');

// Recommendation system
raccoon.connect(6379, '127.0.0.1');

module.exports = {
  liked: function(userId, gestureId, itemId, callback) {
    raccoon.liked(userId, gestureId, itemId, callback ? callback : function(){});
  },
    
disliked: function(userId, gestureId, itemId, callback) {
    raccoon.disliked(userId, gestureId, itemId, callback ? callback : function(){});
},

  recommendFor: raccoon.recommendFor,
};
