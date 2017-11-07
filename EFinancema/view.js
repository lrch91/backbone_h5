define(['text!EFinancema/tpl.html','router','util'], function (tpl, appRouter, util) {

    var View = Backbone.View.extend({
        el: '#device_content',
		
        events: {
            'click #singleSubmit': 'save',    //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
        	'click .choice_one': 'tapOne',
        	'click .choice_two': 'tapTwo',
        	'click .back_button': 'backOpe',
        	'click .tofill_button': 'tofill'
        },
        initialize: function () {
//          this.model.on('nameEvent', this.render, this);      //监听事件
			this.listenTo(this.model,'change', this.render);
		},
        render: function () {
        	$(".nav_title").html("流程审批");
        	var newDate = getDate(Number(this.model.get("createDate")));
            this.$el.html(_.template(tpl, {title: this.model.get('title'),content: this.model.get('content'),createDate: newDate}));
		    $(".arrow").click(function(event){
		    	console.log($(this).attr("src"));
		    	if($(this).attr("src").search('/img/down_arrow_32.png')!=-1){
					$(this).attr("src", "/img/up_arrow_32.png");
					$(this).parents("li").animate({height:'11rem'},50);
		    	}else if($(this).attr("src").search('/img/up_arrow_32.png')!=-1){
					$(this).attr("src", "/img/down_arrow_32.png");
					$(this).parents("li").animate({height:'7.9rem'},50);
				}
			});

			$('#device_content').scroll(function () {
				var contentH = $(this).get(0).scrollHeight;
                var viewH = $('#device_content').height();
                var scrollTop = $(this).scrollTop();
                if (viewH + scrollTop +10 >= contentH) {
					$(".bottom_tab").css("display","none");
                }else if(viewH + scrollTop +20 < contentH){
                	$(".bottom_tab").css("display","block");
                }
            });
		},
		
		loading:function () {
			this.$el.html($('#h5_loader').html());
        },

        save: function (e) {
            var title = $.trim($('#title').val());
            var content = $.trim($('#content').val());
	        if (!title&&!content){
	        	alert("空");
	        	return;	
	        }
	        //直接调用model的save方法来与服务器进行同步
	        this.model.url = util.ip+"/api/articleUpdate/"+this.model.get("id");
	        this.model.set('title', $('#title').val());
	        this.model.set('content', $('#content').val());
	        this.model.save(null,{data:{'title':this.model.get('title'),'content':this.model.get("content")},
                              beforeSend:function(){
                              	alert("before");
                              },
                              parse: function (resp, options) {
					    		var list = resp.list;
					            return list;
					          },
                              success:function(model, response, options) {
                          		console.log("-----------请求成功时触发---------");
                          		window.history.back();
                              },
				        	  error: function(err){
				        	  	console.log("-----------请求失败时触发---------");
				        		console.log("error:");
				        		console.log(err);
				        	  },
				        	  wait: true
                            });
        },
        tapOne: function(e){
        	if($(".label_left").css("display")=='none'){
        		$(".label_left").css('display','block');
        		$(".label_right").css('display','none');
        		$(".tab_one").css('display','block');
        		$(".tab_two").css('display','none');
        		$(".choice_one a").css("color", "#11A9EB");
        		$(".choice_two a").css("color", "#C6C6C7");
        	}
        },
        tapTwo: function(e){
        	if($(".label_right").css("display")=='none'){
        		$(".label_right").css('display','block');
        		$(".label_left").css('display','none');
        		$(".tab_two").css('display','block');
        		$(".tab_one").css('display','none');
        		$(".choice_two a").css("color", "#11A9EB");
        		$(".choice_one a").css("color", "#C6C6C7");
        	}
        },
        backOpe: function(e){
			var can = e.currentTarget.getElementsByTagName("canvas")[0];
			canvas_draw(can, e.offsetX, e.offsetY, 0, "white", function(){
				window.history.back();
			});
        },
        tofill: function(e){
			var can = e.currentTarget.getElementsByTagName("canvas")[0];
			canvas_draw(can, e.offsetX, e.offsetY, 0, "white", function(){
				appRouter.navigate("module6/"+"idididididid", {trigger: true});
			});
        },
    });
    
    
   

	function getDate(tm){ 
		return new Date(parseInt(tm) * 1000).toLocaleString(); 
	} 

    return View;
});