// // Generated by CoffeeScript 1.7.1
// (function() {

//     PerformanceClickModel = new BaseModel("performance/clicks");
//     TrafficModel = new BaseModel("TrafficModel", "mongo");
//     module.exports = {
//         "/click": {
//             get: function() {
//                 return function(req, res) {
//                     var phone_match, tag_match;
//                     if (!req.query || !req.query.cookie) {
//                         res.send('error');
//                         return;
//                     }
//                     req.query.user_ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
//                     phone_match = req.query.cookie.match(/noregisteruser=([0-9]*?);/);
//                     if (phone_match) {
//                         req.query.user_phone = phone_match[1];
//                     }
//                     tag_match = req.query.cookie.match(/usertag=([0-9a-zA-Z_]*?);/);
//                     if (tag_match) {
//                         req.query.user_tag = tag_match[1];
//                     }
//                     PerformanceClickModel.add(req.query).done(function(err) {
//                         res.send('ok');
//                     })
//                 }
//             }
//         },
//         "/click-chart": {
//             get: function() {
//                 return function(req, res) {
//                     res.locals.url = req.query.url;
//                     res.locals.time = req.query.time;
//                     return res.render('performance/clicks');
//                 }
//             }
//         },
//         "/click-data": {
//             get: function() {
//                 return function(req, res) {
//                     var condition, maxTime, minTime, time, times, url;
//                     url = decodeURIComponent(req.query.url);
//                     time = req.query.time;
//                     if (time) {
//                         times = time.split(' to ');
//                         minTime = times[0] + " 00:00:00";
//                         maxTime = times[1] + " 23:59:59";
//                     }
//                     console.log(url);
//                     condition = {
//                         page_url: url
//                     };
//                     if (time) {
//                         condition.createdAt = {
//                             gt: minTime,
//                             lt: maxTime
//                         };
//                     }
//                     PerformanceClickModel.getAll().offset(1).limit(1000000).order({
//                         id: "desc"
//                     }).where(condition).fields(['page_x', 'page_y']).done(function(error, clicks) {
//                         res.send(clicks);
//                     });

//                 }
//             }
//         },
//         "/traffic_begin": {
//             get: function() {
//                 return function(req, res) {
//                     var phone_match, tag_match;
//                     if (!req.query || !req.query.cookie) {
//                         res.send('error');
//                         return;
//                     }
//                     req.query.ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'];
//                     phone_match = req.query.cookie.match(/noregisteruser=([0-9]*?);/);
//                     if (phone_match) {
//                         req.query.phone = phone_match[1];
//                     }
//                     tag_match = req.query.cookie.match(/usertag=([0-9a-zA-Z_]*?);/);
//                     if (tag_match) {
//                         req.query.userTag = tag_match[1];
//                     }
//                     req.query.stay_second = 0;
//                     req.query.click_count = 0;
//                     req.query.visit_length = 0;
//                     TrafficModel.add(req.query).done(function(error, traffic) {
//                         res.send(req.query.callback + "('" + traffic._id + "')");
//                     })
//                 }
//             }
//         },
//         "/traffic_end": {
//             get: function() {
//                 return function(req, res) {
//                     var id = req.query._id;
//                     delete req.query._id;
//                     TrafficModel.where({
//                         _id: id
//                     }).update(req.query).done(function(error, traffic) {
//                         res.send("ok")
//                     })
//                 }
//             }
//         }
//     };

// }).call(this);