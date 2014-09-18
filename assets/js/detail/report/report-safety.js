define(['detail/report/histogram'], function(Histogram){




    var demoConfig = {
        y:{
            show: true,
            style: {
                width: '58px',
                dis: '20px'
            },

            axix: {
                style: {},
                className: 'y-axis'
            },
            scale: {
                style: {},
                className: 'y-scale-item',
                items: [
                    {text: '1.9mm', value: 1.9},
                    {text: '1.6mm<br/>警戒值', value: 1.6},
                    {text: '1.2mm', value: 1.2}
                ],
                valueStyleProp: 'top'
            }
        },
        bar: {
            style: {
                width: '50px',
                height: '215px',
                dis: '25px'
            },
            items: [
                {
                    // join name and value together and show as title
                    name: '左前轮',
                    value: 1.8
                },
                {
                    name: '左后轮',
                    value: 1.55
                },
                {
                    name: '右前轮',
                    value: 1.65
                },
                {
                    name: '右后轮',
                    value: 1.75
                }
            ],
            max: 1.9,
            min: 1.2,
            guide: 1.6,
            cond: {
                more: {
                    className: 'normal',
                    text: '安全'
                },
                less: {
                    className: 'danger',
                    text: '危险'
                }
            }
            // another version:
            // if guide is a array
            // classes can have a between porp
            // guide: [1.5, 1.7],
            // classes: {
            //     more: 'danger',
            //     less: 'danger',
            //     between: 'normal'
            // }
        },
        x: {
            show: true,
            axix: {
                className: 'x-axis'
            },
            scale: {
                className: 'x-scale-item',
                items: [
                    {text: '左前轮'},
                    {text: '左后轮'},
                    {text: '右前轮'},
                    {text: '右后轮'}
                ]
            }
        },
        ctn: $('.wheel-depth .safety-item-bd')
    };

    


    var safetyModule = {
        init: function(){
            var hist = new Histogram(demoConfig);
        }
    };
    



    return safetyModule;
});