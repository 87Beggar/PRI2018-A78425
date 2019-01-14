var Tweet = require('../models/tweet')

const Tweets = module.exports

Tweets.getTweets = () => {
    return Tweet.find().exec();
}

/* Tweets.addGostos = (id) => {
    return Tweet.findAndModify()
}
 */
Tweets.inserir = (tweet) => {
    return Tweet.create(tweet);
}