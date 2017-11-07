define(['module5/addView5','util'], function (View, util) {
	
    var controller = function (param) {
		var Model5 = Backbone.Model.extend({
		    defaults: function () {
		        return {
		            title:"",
		            content:"",
		        };
		    },
		});
    	
        var model = new Model5();
        model.url = util.ip+"/api/articleCreate";
        var view = new View({model:model});
 		view.render();      //利用Model定义的默认属性初始化界面
        
        controller.onRouteChange = function () {
            console.log('change');  //可以做一些销毁工作，例如view.undelegateEvents()
            view.undelegateEvents();
        };
    };
    return controller;
});