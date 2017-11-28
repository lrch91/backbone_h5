define(['EFinancema/model', 'EFinancema/view_wo','util'], function (Model, View, util) {
    
        var controller = function (args) {
            var json = JSON.parse(args);
            // alert(JSON.stringify(json));
            var model = new Model();
            model.set(json);
            var view = new View({model:model});
            view.loading();
            /* 登录 */
            $.ajax({
                type: 'POST',
                url: util.url.EFinancema_login,
                data: { j_username:model.get("j_username"), j_password:model.get("j_password")},
                success: function(data){
                    view.init();
                    $(".hinter_title").html("登录成功");
					$(".hinter").css("display", "block").fadeOut(2000);
                },
                error: function(xhr, options, error){
                    console.log("=============ajax============");
                    console.log(xhr);
                    console.log(options);
                    console.log(error);
                    console.log("=============ajax============");
                    $(".hinter_title").html("登录失败");
					$(".hinter").css("display", "block").fadeOut(2000);
                    view.init();
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