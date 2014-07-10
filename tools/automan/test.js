var page = require('webpage').create();

// page.onInitialized = function() {
//     page.evaluate(function() {
//         Math.random = function() {
//             return 42 / 100;
//         };
//     });
// };
page.open('http://www.souche.com', function(status) {
    var result;
    if (status !== 'success') {
        console.log('Network error.');
    } else {
        page.evaluate(function() {
            $('.collect-box').click();

        });
        setTimeout(function() {
            var p = page.evaluate(function() {

                return $("#noreg-popup").css("display")
            });
            console.log(p);
            phantom.exit();
        }, 1000)

    }

});