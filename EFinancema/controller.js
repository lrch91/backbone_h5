define(['EFinancema/model', 'EFinancema/view','util'], function (Model, View, util) {

    var controller = function (pid) {
        var model = new Model();
        name && model.set({
            name:name               //设置默认的属性值
        });
        model.url = util.ip+"/api/articleDetail/"+pid;
        var view = new View({model:model});
        view.loading();
        
        model.fetch({
        	success: function(model, response){
        		console.log("-----------请求成功时触发---------");
        		console.log(model.toJSON());
        		view.render();
        		
        	},
        	error: function(err){
        		console.log("-----------请求失败时触发---------");
        		console.log(err);
        	}
        });
        
        controller.onRouteChange = function () {
            console.log('change');  //可以做一些销毁工作，例如view.undelegateEvents()
            view.undelegateEvents();
        };
    };
    return controller;
});