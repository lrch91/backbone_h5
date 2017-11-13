define(['EFinancema/model', 'EFinancema/view','util'], function (Model, View, util) {

    var controller = function (pid) {
        var ss = $("html").css("font-size");
        // alert(ss);
        var ww = $(".header").css("width");
        // alert(ww);
        /* 登录 */
        $.ajax({
            type: 'POST',
            url: util.url.EFinancema_login,
            data: { j_username:'lushengde', j_password:'8888'},
            // dataType: 'json',
            timeout: 300,
            success: function(data){
                // alert('Ajax success!')
            },
            error: function(xhr, type){
                alert('Ajax error!')
            }
        })


        var model = new Model();
        name && model.set({
            name:name               //设置默认的属性值
        });
        // model.url = util.ip+"/api/articleDetail/"+pid;
        model.url = util.url.EFinancema_form;
        model.id= pid;
        var view = new View({model:model});
        view.loading();
        
        model.fetch({
        	success: function(model, response){
        		console.log("-----------请求成功时触发---------");
                console.log(model.toJSON());
                if(model.get('errFlag')!='N'){
                    alert(model.get('errMsg'));
                }else{
                    view.init();
                }
        	},
        	error: function(err, response){
                console.log("-----------请求失败时触发---------");
        		console.log(err);
                alert('调用接口失败');
        	}
        });
        
        controller.onRouteChange = function () {
            console.log('change');  //可以做一些销毁工作，例如view.undelegateEvents()
            $(".bottom_tab").html("").css("display", "none");
            view.undelegateEvents();
        };
    };
    return controller;
});