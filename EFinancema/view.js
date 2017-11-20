define(['text!EFinancema/tpl.html','text!EFinancema/form_item.html','text!EFinancema/form_item_attach.html','text!EFinancema/approve_opinion.html','text!EFinancema/bottom_button.html','text!EFinancema/article.html','EFinancema/model2','EFinancema/model3','router','util'], function (tpl, form_item, form_item_attach, approve_opinion, bottom_button, article, Model2, Model3, appRouter, util) {

    var View = Backbone.View.extend({
        el: '#device_content',
		
        events: {
            'click #singleSubmit': 'save',    //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
        	'click .choice_one': 'tapOne',
        	'click .choice_two': 'tapTwo',
        	'click .choice_three': 'tapThree',
        	'click .back_button': 'backOpe',
        	'click .tofill_button': 'tofill'
        },
        initialize: function () {
//          this.model.on('nameEvent', this.render, this);      //监听事件
			this.listenTo(this.model,'change', this.render);
		},
        init: function () {
			console.log('render=========');
        	$(".nav_title").html("流程审批");
        	var newDate = getDate(Number(this.model.get("createDate")));
            this.$el.html(_.template(tpl, {title: this.model.get('title'),content: this.model.get('content'),createDate: newDate}));
			
			/* 初始化处理单信息 */
			var items = this.model.get("documentDataInfo");
			items.splice(0,3);
			var itemsTpl = "";
			var attachs;
			for(var item of items){
				if(item.colmName != '附件列表'){
					var compiled = _.template(form_item);
					itemsTpl += compiled({key:item.colmName, content:item.colmValue});
				}else{
					attachs = this.model.get("attachDataInfo");
					if(attachs.length>0){
						var compiled = _.template(form_item_attach);
						itemsTpl += compiled({key:item.colmName, content:attachs[0].fileName});
					}
				}
			}
			$("#form-items").html(itemsTpl);
			$("#form-items").append("<div class='fill98'></div>");
			/* 初始化处理单信息 */

			/* 初始化正文信息 */
			var articles = this.model.get("bodyDataInfo");
			var articlesTpl ="";
			for(var art of articles){
				var compiled = _.template(article);
				articlesTpl += compiled({article: art});
			}
			$("#form_articles").html(articlesTpl);
			$("#form_articles").append("<div class='fill98'></div>");
			/* 初始化正文信息 */

			/* 底部按钮初始化及绑定操作 */
			$(".bottom_tab").css("display","block").html(_.template(bottom_button,{}));
			$(".tofill_button").click(function(e){
				var can = e.currentTarget.getElementsByTagName("canvas")[0];
				canvas_draw(can, e.offsetX, e.offsetY, 0, "white", function(){
					appRouter.navigate("module6/"+"idididididid", {trigger: true});
				});
			});
			$(".back_button").click(function(e){
				var can = e.currentTarget.getElementsByTagName("canvas")[0];
				canvas_draw(can, e.offsetX, e.offsetY, 0, "white", function(){
					window.history.back();
				});
			});
			/* 底部按钮初始化及绑定操作 */

			var model2 = new Model2();
			model2.url = util.url.EFinancema_opinions;
			model2.set({id:this.model.id, procType:this.model.get("procType"),procId:this.model.get("procId"),userId:this.model.get("userId"), system:"efinancema", pageNum:1, pageSize:100, keyColmName:"all"});
			Backbone.sync("create", model2, {
				success: function(mdl, response){
					model2.set(mdl);
					console.log("-----------EIP_MOA_Services_table请求成功时触发---------");
					if(mdl.errFlag!='N'){
						alert(mdl.errMsg);
					}else{
						/* 初始化处理意见 */
						var opinions = model2.get("commentInfo");
						var opinionTpl ='';
						for(var opinion of opinions){
							var compiled = _.template(approve_opinion);
							var commentBody = opinion.commentBody;
							if(commentBody && commentBody.length>0){
								opinionTpl += compiled({opinionTitle: opinion.commentGroupName,handlerName: commentBody[0].userName,
									handleTime: commentBody[0].commentTime,opinionContent: commentBody[0].comment});
							}else{
								opinionTpl += compiled({opinionTitle: opinion.commentGroupName,handlerName: '',
									handleTime: '',opinionContent: ''});
							}
						}
						$("#opinion_items").html(opinionTpl);
						$("#opinion_items").append("<div class='fill98'></div>");
						/* 初始化处理意见 */

						$(".hint_bar").html("加载成功");
						$(".hint_bar").animate({top:"0.88rem"},function(){
							setTimeout(function () {
								$(".hint_bar").animate({top:"0.44rem"});
							},1000);
						})
					}
				},
				error: function(err, response){
					console.log(err);
					alert('调用接口失败');
				},
				complete: function(model, response){
				}
			})

			var model3 = new Model3();
			model3.url = util.url.EFinancema_queryTpl;
			var qi = [{colmEnName:"NextStep", colmValue:"", reserve1:""}];
			model3.set({procId:this.model.get("procId"),userId:this.model.get("userId"), system:"efinancema", queryItem:qi});
			Backbone.sync("create", model3, {
				success: function(mdl, response){
					model3.set(mdl);
					console.log("-----------EFinancema_queryTpl请求成功时触发---------");
					console.log(mdl);
				},
				error: function(err, response){
					console.log(err);
					alert('调用接口失败');
				},
				complete: function(model, response){
				}
			})

			// $(".attachs_open").click(function(event){
			// 	if($(this).attr("src").search('/img/d_arrow_2618.png')!=-1){
			// 		$(this).attr("src", "/img/u_arrow_2618.png");
			// 		$(this).parents("li").animate({height:'11rem'},50);
			// 	}else if($(this).attr("src").search('/img/u_arrow_2618.png')!=-1){
			// 		$(this).attr("src", "/img/d_arrow_2618.png");
			// 		$(this).parents("li").animate({height:'7.9rem'},50);
			// 	}
			// });

			$(".attachs_open").click(function(event){
				var li = $(this).parents("li");
				if(attachs&&attachs.length>1){
					li.css('height', (parseFloat(li.css('height')) + 0.8*(attachs.length-1))+"rem");
					$("label",li).each(function(){
						$(this).css('height', (parseFloat($(this).css('height')) + 0.8*(attachs.length-1))+"rem");
					})
					$(".attach-li",".attach-ul").remove();
					var itemsTpl= '';
					for(var item of attachs){
						var compiled = _.template("<div class='attach-li' style='width:4.88rem; height: 0.8rem;'><span style='width:4.68rem;vertical-align: middle;word-wrap: break-word;display: inline-block;line-height: 0.32rem;font-size: 0.3rem;white-space:normal;margin-left: 0.2rem;'> <%=content%> </span><i/></div>");
						itemsTpl += compiled({content:item.fileName});
					}
					$(".attach-ul").prepend(itemsTpl);
				}
				$(this).unbind('click');
			});

			/* 按拖动高度处理bottom_tab是否显示 
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
			 按拖动高度处理bottom_tab是否显示 */
			
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
        	if($(".tab_one").css("display")=='none'){
        		$(".tab_one").css('display','block');
        		$(".tab_two").css('display','none');
        		$(".tab_three").css('display','none');
        		$(".choice_one a").css("color", "#11A9EB");
        		$(".choice_two a").css("color", "#bdc5d1;");
        		$(".choice_three a").css("color", "#bdc5d1");
        	}
        },
        tapTwo: function(e){
        	if($(".tab_two").css("display")=='none'){
        		$(".tab_one").css('display','none');
        		$(".tab_two").css('display','block');
        		$(".tab_three").css('display','none');
        		$(".choice_one a").css("color", "#bdc5d1");
        		$(".choice_two a").css("color", "#11A9EB");
        		$(".choice_three a").css("color", "#bdc5d1");
        	}
		},
		tapThree: function(e){
        	if($(".tab_three").css("display")=='none'){
        		$(".tab_one").css('display','none');
        		$(".tab_two").css('display','none');
        		$(".tab_three").css('display','block');
        		$(".choice_one a").css("color", "#bdc5d1");
        		$(".choice_two a").css("color", "#bdc5d1");
        		$(".choice_three a").css("color", "#11A9EB");
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