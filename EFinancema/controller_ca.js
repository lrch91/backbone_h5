define(['EFinancema/model', 'EFinancema/view_ca','util'], function (Model, View, util) {
    
        var controller = function (args) {
            var json = JSON.parse(args);
            var model = new Model();
            model.set(json);
            // model.set({
            //     id:pid,
            //     procType:"01",
            //     procId:"61282753",
            //     userId:"zhujinliang",
            //     system:"efinancema",
            //     processId:"5022487",
            //     commentType:"00",
            //     types:"资金划拨",
            //     j_username:"zhujinliang",
            //     j_password:"8888"
            // });
            
            var view = new View({model:model});
            view.loading();
            /* 登录 */
            $.ajax({
                type: 'POST',
                url: util.url.EFinancema_login,
                data: { j_username:model.get("j_username"), j_password:model.get("j_password")},
                success: function(data){
                    $(".hinter_title").html("登录成功");
					$(".hinter").css("display", "block").fadeOut(2000);
                    view.init();
                },
                error: function(xhr, type){
                    $(".hinter_title").html("登录失败");
					$(".hinter").css("display", "block").fadeOut(2000);
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