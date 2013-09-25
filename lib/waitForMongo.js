var MongoClient = require('mongodb').MongoClient;

function waitForMongo(mongoUrl, options, callback) {
  if(typeof(options) == 'function') {
    callback = options;
    options = {};
  }

  options = options || {};
  options.timeout = options.timeout || 1000 * 60 * 2; //2 minutes
  var startedTime = Date.now();
  var timeouted = false;

  var timeoutHandler = setTimeout(function() {
    timeouted = true;
    callback(new Error('TIMEOUTED_WAIT_FOR_MONGO'));
  }, options.timeout);

  connectAgain();
  function connectAgain() {
    MongoClient.connect(mongoUrl, function(err, db) {
      if(timeouted) return;

      if(err) {
        setTimeout(connectAgain, 500);
      } else {
        db.close();
        clearTimeout(timeoutHandler);
        timeoutHandler = null;
        
        callback();
      }
    });
  }
}

module.exports = waitForMongo;