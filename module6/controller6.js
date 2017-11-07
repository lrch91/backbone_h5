define(['module6/model6', 'module6/view6', 'util'], function (Model, View, util) {

    var controller = function (pid) {
        var model = new Model();
        name && model.set({
            name:name               //设置默认的属性值
        });
        model.url = util.ip+"/api/articleDetail/"+pid;
        var view = new View({model:model});
 		view.render();      //利用Model定义的默认属性初始化界面
        
        controller.onRouteChange = function () {
            console.log('change');  //可以做一些销毁工作，例如view.undelegateEvents()
            view.undelegateEvents();
        };
    };
    return controller;
});