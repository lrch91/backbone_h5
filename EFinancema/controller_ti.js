define(['EFinancema/model', 'EFinancema/view_ti','util'], function (Model, View, util) {
    
        var controller = function (args) {
            console.log(args);
            var json = JSON.parse(args);
            var model = new Model();
            model.set(json);
            var view = new View({model:model});
            view.init();
            
            controller.onRouteChange = function () {
                console.log('change'); 
                $(".bottom_tab").html("").css("display", "none");
                view.undelegateEvents();
            };
        };
        return controller;
    });