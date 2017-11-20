define(['EFinancema/model', 'EFinancema/view','util'], function (Model, View, util) {

    var controller = function (pid) {
        var ss = $("html").css("font-size");
        // alert(ss);
        var ww = $(".header").css("width");
        // alert(ww);
        
        var model = new Model();
        name && model.set({
            name:name               //设置默认的属性值
        });
        // model.url = util.ip+"/api/articleDetail/"+pid;
        model.url = util.url.EFinancema_form;
        model.set({id:pid,procType:"01",procId:"61281027",userId:"lushengde",system:"efinancema"});
        
        var view = new View({model:model});
        view.loading();
        /* 登录 */
        $.ajax({
            type: 'POST',
            url: util.url.EFinancema_login,
            // contentType: 'application/json;charset=utf-8',
            data: { j_username:"lushengde", j_password:"8888"},
            // timeout: 300,
            success: function(data){
                // console.log(data);
                Backbone.sync("create", model, {
                    success: function(mdl, response){
                        // model.set({name:"world", value:"874"});
                        model.set(mdl);
                        console.log("-----------EIP_MOA_Services_form请求成功时触发---------");
                        console.log(mdl);
                        if(mdl.errFlag!='N'){
                            alert(mdl.errMsg);
                        }else{
                            view.init();
                        }
                    },
                    error: function(err, response){
                        console.log(err);
                        alert('调用接口失败');
                    },
                    complete: function(model, response){
                    }
                })
            },
            error: function(xhr, type){
                alert('Ajax error!')
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