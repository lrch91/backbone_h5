'use strict';

(function (win) {
    //配置baseUrl
    var baseUrl = document.getElementById('main').getAttribute('data-baseurl');

    /*
     * 文件依赖
     */
    var config = {
        baseUrl: baseUrl,           //依赖相对路径
        paths: {                    //如果某个前缀的依赖不是按照baseUrl拼接这么简单，就需要在这里指出
            zepto: 'libs/zepto.min',
            jquery: 'libs/zepto.min',
            meScroll: 'libs/mescroll.min',
            underscore: 'libs/underscore',
            backbone: 'libs/backbone',
            text: 'libs/text'             //用于requirejs导入html类型的依赖
        },
        shim: {                     //引入没有使用requirejs模块写法的类库。backbone依赖underscore
            'underscore': {
                exports: '_'
            },
            'jquery': {
                exports: '$'
            },
            'zepto': {
                exports: '$'
            },
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },
            'meScroll' :{
            	exports: 'MeScroll'
            }
        }
    };

    require.config(config);

    //Backbone会把自己加到全局变量中
    require(['backbone', 'underscore', 'router', 'meScroll'], function(){
        Backbone.emulateHTTP = true;
        //设置Backbone.emulateJSON = true;
        // 将导致JSON根据模型参数进行序列化， 并通过application/x-www-form-urlencoded MIME类型来发送一个伪造HTML表单请求
	    // Backbone.emulateJSON = true;
        Backbone.history.start();   //开始监控url变化
        // Backbone.history.start({pushState : true});
    });

})(window);