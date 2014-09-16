/**@jsx React.DOM**/

(function(){

    var Histogram = window.Histogram;
    // basic Histogram
    React.renderComponent( <Histogram config={window.initConfig}/>, document.querySelector('#ctn'));
})();