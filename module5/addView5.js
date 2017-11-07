define(['text!module5/tpl.html','util'], function (tpl, util) {

    var View5 = Backbone.View.extend({
        el: '#device_content',

        events: {
            'click button': 'save'     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
        },

        initialize: function () {
			this.listenTo(this.model,'change', this.render);
        },

        render: function () {
            this.$el.html(_.template(tpl, {title: this.model.get('title'),content: this.model.get('content')}));     //类似java的DAO思想，一切通过get set操作
        },

        save: function (e) {
             var title = $.trim($('#title').val());
             var content = $.trim($('#content').val());
	        if (!title&&!content){
	        	alert("空");
	        	return;	
	        }
	        //直接调用model的save方法来与服务器进行同步
	        this.model.url = util.ip+"/api/articleCreate/";
	        this.model.set('title', title);
	        this.model.set('content', content);
	        this.model.save(null,{data:{'title':this.model.get('title'),'content':this.model.get("content")},
                              beforeSend:function(){
                              	console.log("before");
                              },
                              success:function(model, response, options) {
                              		console.log("-----------请求成功时触发---------");
                              		console.log(response);
//                            		window.history.back();
                              },
                              error: function (collection, resp) { 
								console.log("-----------请求失败时触发---------");
				        	  } ,
                            });   
        }
    });
    
    return View5;
});