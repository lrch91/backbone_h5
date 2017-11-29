define(['text!EFinancema/tpl.html','text!EFinancema/form_item.html','text!EFinancema/form_item_attach.html','text!EFinancema/form_item_table.html','text!EFinancema/approve_opinion.html','text!EFinancema/bottom_button.html','text!EFinancema/article.html','EFinancema/model','router','util'], function (tpl, form_item, form_item_attach, form_item_table, approve_opinion, bottom_button, article, Model, appRouter, util) {

    var View = Backbone.View.extend({
        el: '#device_content',
		
        events: {
            'click #singleSubmit': 'save',    //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
        	'click .choice_one': 'tapOne',
        	'click .choice_two': 'tapTwo',
        	'click .choice_three': 'tapThree',
        	'click .back_button': 'backOpe',
        	'click .tofill_button': 'tofill',
        	'click .to_attachlist': 'to_attachlist',
        	'click .to_table': 'to_table',
        },
        initialize: function () {
//          this.model.on('nameEvent', this.render, this);      //监听事件
			this.listenTo(this.model,'change', this.render);
		},
        init: function () {
			var po = this.model;
			this.po = po;
			console.log('render=========');
        	$(".nav_title").html("流程审批");
			this.$el.html(_.template(tpl, {}));
			/* 初始化处理单信息 */
			var formModel = new Model();
			formModel.url = util.url.EFinancema_form;
			formModel.set({procType:po.get("procType"),procId:po.get("procId"),userId:po.get("userId"),system:po.get("system")});
			Backbone.sync("create", formModel, {
				success: function(mdl, response){
					po.formModel=mdl;
					console.log("-----------form请求成功时触发---------");
					console.log(mdl);
					if((!mdl) || mdl.errFlag!='N'){
						util.hint("表单数据错误");
					}else{
						util.hint("获取表单成功");
						/* 初始化表单 */
						var items = mdl.documentDataInfo;
						items.splice(0,3);
						var itemsTpl = "";
						var attachs;
						for(var item of items){
							if(item.colmName != '附件列表' && item.colmName != '费用明细列表'){
								var compiled = _.template(form_item);
								itemsTpl += compiled({key:item.colmName, content:item.colmValue});
							}else if(item.colmName == '附件列表'){
								attachs = mdl.attachDataInfo;
								if(attachs.length>0){
									var compiled = _.template(form_item_attach);
									itemsTpl += compiled({key:item.colmName, content:attachs[0].fileName});
								}
							}else if(item.colmName == '费用明细列表'){
								var compiled = _.template(form_item_table);
								itemsTpl += compiled({key:item.colmName});
							}
						}
						$("#form-items").html(itemsTpl);
						$("#form-items").append("<div class='fill98'></div>");
						/* 初始化表单 */
						/* 初始化正文信息 */
						var articles = mdl.bodyDataInfo;
						var articlesTpl ="";
						for(var art of articles){
							var compiled = _.template(article);
							articlesTpl += compiled({article: art});
						}
						$("#form_articles").html(articlesTpl);
						$("#form_articles").append("<div class='fill98'></div>");
						/* 初始化正文信息 */
						/* 附件展开 */
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
						/* 附件展开 */
					}
				},
				error: function(err, response){
					console.log(err);
					util.hint("获取表单失败");
					
				},
				complete: function(mdl, response){
				}
			})
			/* 初始化处理单信息 */

			/* 底部按钮初始化及绑定操作 */
			$(".bottom_tab").css("display","block").html(_.template(bottom_button,{}));
			$(".tofill_button").click(function(e){
				var can = e.currentTarget.getElementsByTagName("canvas")[0];
				canvas_draw(can, e.offsetX, e.offsetY, 0, "white", function(){
					var json={};
					json.procType = po.get("procType");
					json.procId = po.get("procId");
					json.userId = po.get("userId");
					json.system = po.get("system");
					json.processId = po.get("processId");
					json.commentType = po.get("commentType");
					json.types = po.get("types");
					json.j_username = po.get("j_username");
					json.j_password = po.get("j_password");
					// var str1 = encodeURI(JSON.stringify(json));
					// var str2 = encodeURIComponent(JSON.stringify(json));
					appRouter.navigate("EFinancema_writeOpinion/"+JSON.stringify(json), {trigger: true});
				});
			});
			$(".back_button").click(function(e){
				var can = e.currentTarget.getElementsByTagName("canvas")[0];
				canvas_draw(can, e.offsetX, e.offsetY, 0, "white", function(){
					window.history.back();
				});
			});
			/* 底部按钮初始化及绑定操作 */

			/* 初始化审批意见 */
			var opinionModel = new Model();
			opinionModel.url = util.url.EFinancema_opinions;
			opinionModel.set({procId:this.model.get("processId"), userId:this.model.get("userId"), system:this.model.get("system"), commentType:this.model.get("commentType")});
			Backbone.sync("create", opinionModel, {
				success: function(mdl, response){
					opinionModel.set(mdl);
					console.log("-----------opinions请求成功时触发---------");
					console.log(mdl);
					if((!mdl) || mdl.errFlag!='N'){
						util.hint("获取审批意见错误");
					}else{
						util.hint("获取审批意见成功");
						var opinions = opinionModel.get("commentInfo");
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

						// $(".util.hint_bar").html("加载成功");
						// $(".util.hint_bar").animate({top:"0.88rem"},function(){
						// 	setTimeout(function () {
						// 		$(".util.hint_bar").animate({top:"0.44rem"});
						// 	},1000);
						// })
					}
				},
				error: function(err, response){
					console.log(err);
					util.hint("获取审批意见失败");
				},
				complete: function(mdl, response){
				}
			})
			/* 初始化审批意见 */

			/* 初始化表格 */
			var tableModel = new Model();
			tableModel.url = util.url.EFinancema_table;
			//表格procId为processId
			tableModel.set({procId:this.model.get("procId"),userId:this.model.get("userId"), procType:this.model.get("procType"), system:this.model.get("system"), pageNum:"1", pageSize: "100", keyColmName:"all"});
			Backbone.sync("create", tableModel, {
				success: function(mdl, response){
					po.tableModel = mdl;
					console.log("-----------table请求成功时触发---------");
					console.log(mdl);
					util.hint("获取表格成功");
				},
				error: function(err, response){
					console.log(err);
					util.hint("获取表格失败");
					
				},
				complete: function(mdl, response){
				}
			})
			/* 初始化表格 */

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
        to_attachlist: function(e){
			var json={};
			var po = this.po;
			json.attachDataInfo = po.formModel.attachDataInfo;
			json.system = po.get("system");
			json.j_username = po.get("j_username");
			json.j_password = po.get("j_password");
			appRouter.navigate("EFinancema_checkAttach/"+JSON.stringify(json), {trigger: true});
		},
        to_table: function(e){
			var json={};
			var tm = this.po.tableModel;
			if('N'!=tm.errFlag){
				$('util.hinter_title').html('获取表格数据失败');
			}else{
				appRouter.navigate("EFinancema_tableInfo/"+JSON.stringify(tm), {trigger: true});
			}
		},
    });

    return View;
});