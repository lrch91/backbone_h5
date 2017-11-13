define(['text!module6/tpl.html','util'], function (tpl, util) {

    var View3 = Backbone.View.extend({
        el: '#device_content',
		
        events: {
            'click #singleSubmit': 'save',    //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
        	'click .choice_one': 'tapOne',
        	'click .choice_two': 'tapTwo',
        	'click .back_button': 'backOpe',
			'click .tofill_button': 'tofill',
			'click .to_next_handle': 'popPanel',
			'click div.tree_ul_div': 'toggle_ul',
			'click button.panel_cancel': 'close_panel',
			'click button.panel_submit': 'submit_panel',
        },

        initialize: function () {
//          this.model.on('nameEvent', this.render, this);      //监听事件
			this.listenTo(this.model,'change', this.render);
        },

        render: function () {
            this.$el.html(_.template(tpl, {}));
			$(".nav_title").html("填写审批意见");
			$("div.tree_ul_div").click(function(event){
				$(this).siblings("li").fadeToggle(100);
				if($("img.oc_img",this).attr("src").search('/img/minus_32.png')!=-1){
					$("img.oc_img",this).attr("src","/img/plus_32.png");
				}else{
					$("img.oc_img",this).attr("src","/img/minus_32.png");
				}
			});

			$("li.tree_li").click(function(event){
				$("li.tree_li",$("div.pop_panel")).each(function(){
					if($("img.cu_img",this).attr("src").search('/img/checked_32.png')!=-1){
						$("img.cu_img",this).attr("src","/img/unchecked_32.png");
					}
				});
				if($("img.cu_img",this).attr("src").search('/img/unchecked_32.png')!=-1){
					$("img.cu_img",this).attr("src","/img/checked_32.png");
				}else{
					$("img.cu_img",this).attr("src","/img/unchecked_32.png");
				}
			});

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
        backOpe: function(){
        	window.history.back();
        },
        tofill: function(e){
        	appRouter.navigate("module6/"+"idididididid", {trigger: true});
		},
		popPanel: function(e){
			var can = e.currentTarget.getElementsByTagName("canvas")[0];
			canvas_draw(can, e.offsetX, e.offsetY, 0, "#0BA2FE", function(){
				$(".pop_panel_bg").css("display","block");
			});
		},
		toggle_ul: function(e){
			 
		},
		close_panel: function(e){
			// var color = $(e.currentTarget).css("background-color");
			// var can = e.currentTarget.childNodes[1];
			var can = e.currentTarget.getElementsByTagName("canvas")[0];
			canvas_draw(can, e.offsetX, e.offsetY, 0, "white", function(){
				$("div.pop_panel_bg").css("display","none");
			});
			
			$("li.tree_li",$("div.pop_panel")).each(function(){
				if($("img.cu_img",this).attr("src").search('/img/checked_32.png')!=-1){
					$("img.cu_img",this).attr("src","/img/unchecked_32.png");
				}
			});
		},
		submit_panel: function(e){
			var can = e.currentTarget.getElementsByTagName("canvas")[0];
			canvas_draw(can, e.offsetX, e.offsetY, 0, "white", function(){
				$(".hint_bar").html("已选中");
				$(".hint_bar").animate({top:"0.88rem"},function(){
					setTimeout(function () {
						$(".hint_bar").animate({top:"0.44rem"});
					},1000);
				})
				$("div.pop_panel_bg").css("display","none");
			});
		}

    });
    
    

	function getDate(tm){ 
		return new Date(parseInt(tm) * 1000).toLocaleString(); 
	} 

    return View3;
});