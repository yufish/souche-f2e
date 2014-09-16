

(function(){
    window.config = {
        // horizontal or vertical
        style: 'hor',
       
        value: {
            max: 1.9,
            min: 1.3,
            guide: 1.6
        },
        showGuideLine: true,
        classes: {
            more: 'normal',
            less: 'danger'
            // 暂时不支持between里 骚等..
            // between
        },
        // key - value obj
        // or array?
        // all accept!
        bars: [
            {
                name: '左前轮',
                value: 1.7
            },
            {
                name: '右前轮',
                value: 1.45
            },
            {
                name:'左后轮',
                value: 1.68,
            },
            {
                name: '右后轮',
                value: 1.97
            }
        ]
    };

    window.initConfig = {
        // horizontal or vertical
        style: 'hor',
       
        value: {
            max: 1.9,
            min: 1.3,
            guide: 1.6
        },
        showGuideLine: true,
        classes: {
            more: 'normal',
            less: 'danger'
            // 暂时不支持between里 骚等..
            // between
        },
        // key - value obj
        // or array?
        // all accept!
        bars: [
            {
                name: '左前轮',
                value:0
            },
            {
                name: '右前轮',
                value: 0
            },
            {
                name:'左后轮',
                value: 0
            },
            {
                name: '右后轮',
                value: 0
            }
        ]
    };
})();