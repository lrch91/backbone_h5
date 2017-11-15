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
            // contentType: 'application/json;charset=utf-8',
            data: { j_username:"zhujinliang", j_password:"8888"},
            timeout: 300,
            success: function(data){
                // console.log(data);
                // alert('Ajax success!')
            },
            error: function(xhr, type){
                alert('Ajax error!')
            }
        })

        // var json = { procType:"03",procId:"60022099",userId:"zhujinliang",system:"employeeperfyear"};
        // $.ajax({
        //     type: 'POST',
        //     url: util.url.EIP_MOA_Services_form,
        //     contentType: 'application/json;charset=utf-8',
        //     // data: JSON.stringify(json),
        //     data:{ procType:"03",procId:"60022099",userId:"zhujinliang",system:"employeeperfyear"},
        //     timeout: 300,
        //     dataType: 'json',
        //     success: function(data){
        //         alert('Ajax success!')
        //         console.log('EIP_MOA_Services_form_ajax');
        //         console.log(data);
        //     },
        //     error: function(xhr, type){
        //         alert('Ajax error!')
        //     }
        // })


        var model = new Model();
        name && model.set({
            name:name               //设置默认的属性值
        });
        // model.url = util.ip+"/api/articleDetail/"+pid;
        model.url = util.url.EIP_MOA_Services_form;
        model.set({id:pid,procType:"01",procId:"61280244",userId:"lushengde",system:"efinancema"});

        var view = new View({model:model});
        view.loading();
        //backbone.js中line980,line1017被注释，fetch默认使用{read:get}方法
        // model.fetch({
        // 	success: function(model, response){
        //         console.log("-----------请求成功时触发---------");
        //         console.log('EIP_MOA_Services_form');
        //         console.log(model.toJSON());
        //         if(model.get('errFlag')!='N'){
        //             alert(model.get('errMsg'));
        //         }else{
        //             view.init();
        //         }
        // 	},
        // 	error: function(err, response){
        //         console.log("-----------请求失败时触发---------");
        // 		console.log(err);
        //         alert('调用接口失败');
        // 	}
        // });

        Backbone.sync("create", model, {
        	success: function(mdl, response){
                console.log(JSON.stringify(mdl));
                model.set({name:"world", value:"874"});
                // for(var key in mdl){  
                //     var value = mdl[key];
                //     model.set(key,mdl[key]);
                // }  
                model.set(mdl);
                console.log("decode");
                console.log(decodeURIComponent(response));
                console.log("-----------请求成功时触发---------");
                console.log('EIP_MOA_Services_form');
                console.log(mdl);
                if(mdl.errFlag!='N'){
                    alert(mdl.errMsg);
                }else{
                    view.init();
                }
        	},
        	error: function(err, response){
                console.log("decodeURIComponent");
                console.log(decodeURIComponent(response));
                console.log("-----------请求失败时触发---------");
        		console.log(err);
                alert('调用接口失败');
            },
            complete: function(model, response){
                response = decodeURIComponent(response);
                alert('调用接口complete');
        	}
        })
        
        controller.onRouteChange = function () {
            console.log('change');  //可以做一些销毁工作，例如view.undelegateEvents()
            $(".bottom_tab").html("").css("display", "none");
            view.undelegateEvents();
        };
    };
    return controller;
});