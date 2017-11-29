define(['EFinancema/model', 'EFinancema/view','util'], function (Model, View, util) {

    var controller = function (args) {
        var ss = $("html").css("font-size");
        // alert(ss);
        var ww = $(".header").css("width");
        // alert(ww);
        
        var model = new Model();
        model.set({
            id:args,
            procType:"01",
            procId:"61286064",
            userId:"wangbo",
            system:"efinancema",
            processId:"5022487",
            commentType:"00",
            types:"资金划拨",
            j_username:"wangbo",
            j_password:"8888"
        });
        /* model.set({
            id:args,
            procType:"01",
            procId:"61282753",
            userId:"zhujinliang",
            system:"efinancema",
            processId:"5022487",
            commentType:"00",
            types:"资金划拨",
            j_username:"zhujinliang",
            j_password:"8888"
        }); */
        
        var view = new View({model:model});
        view.loading();
        /* 登录 */
        $.ajax({
            type: 'POST',
            url: util.url.EFinancema_login,
            // contentType: 'application/json;charset=utf-8',
            data: { j_username:model.get("j_username"), j_password:model.get("j_password")},
            // timeout: 300,
            success: function(data){
                console.log('=========EFinancema_login登录成功=========');
                util.hint("登录成功");
                view.init();
            },
            error: function(xhr, type){
                util.hint("登录失败");
            }
        })
        /* 登录 */
        
        controller.onRouteChange = function () {
            console.log('change');  //可以做一些销毁工作，例如view.undelegateEvents()
            $(".bottom_tab").html("").css("display", "none");
            view.undelegateEvents();
        };
    };
    return controller;
});