var async = require('async'),
config = require('./config.js'),
_ = require('underscore');

// the jaccard coefficient
var jaccardCoefficient = function(userId1, userId2, callback){
    var similarity = 0,
    finalJaccard = 0,
    ratedInCommon = 0;
    
    client.sinter([config.className,userId1,'liked'].join(":"),[config.className,userId2,'liked'].join(":"), function(err, results1){
                  client.sinter([config.className,userId1,'disliked'].join(":"),[config.className,userId2,'disliked'].join(":"), function(err, results2){
                                client.sinter([config.className,userId1,'liked'].join(":"),[config.className,userId2,'disliked'].join(":"), function(err, results3){
                                              client.sinter([config.className,userId1,'disliked'].join(":"),[config.className,userId2,'liked'].join(":"), function(err, results4){
                                                             similarity = (results1.length+results2.length-results3.length-results4.length);
                                                             ratedInCommon = (results1.length+results2.length+results3.length+results4.length);
                                                             finalJaccardScore = similarity / ratedInCommon;
                                                             callback(finalJaccardScore);
                                                            });
                                              });
                                });
                  });
};

// updates the similarity for one user versus all others
// ［ -1 , 1 ］
exports.updateSimilarityFor = function(userId, cb){
    userId = String(userId);
    var similaritySet, userRatedItemIds, itemLiked, itemDisliked, itemLikeDislikeKeys;
    similaritySet = [config.className,userId,'similaritySet'].join(":");
    client.sunion([config.className,userId,'liked'].join(":"),[config.className,userId,'disliked'].join(":"), function(err, userRatedItemIds){
                  if (userRatedItemIds.length > 0){
                  itemLikeDislikeKeys = _.map(userRatedItemIds, function(itemId, key){
                                              itemLiked = [config.className, itemId, 'liked'].join(":");
                                              itemDisliked = [config.className, itemId, 'disliked'].join(":");
                                              return [itemLiked, itemDisliked];
                                              });
                  }
                  itemLikeDislikeKeys = _.flatten(itemLikeDislikeKeys);
                  client.sunion(itemLikeDislikeKeys, function(err, otherUserIdsWhoRated){
                                async.each(otherUserIdsWhoRated,
                                           function(otherUserId, callback){
                                           if (otherUserIdsWhoRated.length === 1 || userId === otherUserId){
                                           callback();
                                           }
                                           if (userId !== otherUserId){
                                           jaccardCoefficient(userId, otherUserId, function(result) {
                                                              client.zadd(similaritySet, result, otherUserId, function(err){
                                                                           callback();
                                                                          });
                                                              });
                                           }
                                           },
                                           function(err){
                                           cb();
                                           }
                                           );
                                });
                  });
};


// Recommendation
exports.updateRecommendationsFor = function(userId, cb){
    userId = String(userId);
    var setsToUnion = [];
    var scoreMap = [];
    var tempSet = [config.className, userId, 'tempSet'].join(":");
    var tempDiffSet = [config.className, userId, 'tempDiffSet'].join(":");
    var similaritySet = [config.className, userId, 'similaritySet'].join(":");
    var recommendedSet = [config.className, userId, 'recommendedSet'].join(":");
    // an array of the users : k nearest neighbors
    client.zrevrange(similaritySet, 0, config.nearestNeighbors-1, function(err, mostSimilarUserIds){
                     client.zrange(similaritySet, 0, config.nearestNeighbors-1, function(err, leastSimilarUserIds){
                                   _.each(mostSimilarUserIds, function(id, key){
                                          setsToUnion.push([config.className,id,'liked'].join(":"));
                                          });
                                   
                                   if (setsToUnion.length > 0){
                                   async.each(setsToUnion,
                                              function(set, callback){
                                              client.sunionstore(tempSet, set, function(err){
                                                                 callback();
                                                                 });
                                              },
                                              function(err){
                                              client.sdiff(tempSet, [config.className,userId,'liked'].join(":"), [config.className,userId,'disliked'].join(":"), function(err, notYetRatedItems){
                                                           async.each(notYetRatedItems,
                                                                      function(itemId, callback){
                                                                      exports.predictFor(userId, itemId, function(score){
                                                                                         scoreMap.push([score, itemId]);
                                                                                         callback();
                                                                                         });
                                                                      }
                                                                      function(err){
                                                                      client.del(recommendedSet, function(err){
                                                                                 async.each(scoreMap,
                                                                                            function(scorePair, callback){
                                                                                            client.zadd(recommendedSet, scorePair[0], scorePair[1], function(err){
                                                                                                        callback();
                                                                                                        });
                                                                                            },
                                                                                            function(err){
                                                                                            client.del(tempSet, function(err){
                                                                                                       client.zcard(recommendedSet, function(err, length){
                                                                                                                    client.zremrangebyrank(recommendedSet, 0, length-config.numOfRecsStore-1, function(err){
                                                                                                                                           cb();
                                                                                                                                           });
                                                                                                                    });
                                                                                                       });
                                                                                            }
                                                                                            );
                                                                                 });
                                                                      }
                                                                      );
                                                           });
                                              }
                                              );
                                   } else {
                                   cb();
                                   }
                                   });
                     });
};

// the wilson score
exports.updateWilsonScore = function(itemId, callback){
    var scoreBoard = [config.className, 'scoreBoard'].join(":");
    var likedBySet = [config.className, itemId, 'liked'].join(':');
    var dislikedBySet = [config.className, itemId, 'disliked'].join(':');
   
    var z = 1.96;
    var n, pOS, score;
    client.scard(likedBySet, function(err, likedResults){
                client.scard(dislikedBySet, function(err, dislikedResults){
                              if ((likedResults + dislikedResults) > 0){
                              n = likedResults + dislikedResults;
                              pOS = likedResults / parseFloat(n);
                              try {
                              score = (pOS + z*z/(2*n) - z*Math.sqrt((pOS*(1-pOS)+z*z/(4*n))/n))/(1+z*z/n);
                              } catch (e) {
                              console.log(e.name + ": " + e.message);
                              score = 0.0;
                              }
                              client.zadd(scoreBoard, score, itemId, function(err){
                                          callback();
                                          });
                              }
                              });
                 });
};