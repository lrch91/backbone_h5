define(['text!EFinancema/write_opinion.html','text!EFinancema/general_manager_do.html','EFinancema/model','router','util'], function (tpl, general_manager_do, Model, appRouter, util) {

    var View = Backbone.View.extend({
        el: '#device_content',
		
        events: {
			'change .select_opinion': 'fill_usual_opinion',
			'click .opinion_submit': 'modal1_open',
			'click .opinion_sv': 'modal3_open',
			'click .opinion_cc': 'back',
			'click .modal1_item': 'modal1_choose',
			'click .modal1_oprt_y': 'modal1_y',
			'click .modal1_oprt_n': 'modal1_n',
			'click .modal2_item': 'modal2_choose',
			'click .modal2_oprt_y': 'modal2_y',
			'click .modal2_oprt_n': 'modal2_n',
        },
        initialize: function () {
//          this.model.on('nameEvent', this.render, this);      //监听事件
			this.listenTo(this.model,'change', this.render);
		},
        init: function () {
			var po = this.model;
			this.po = po;
        	$(".nav_title").html("填写意见");
			this.$el.html(_.template(tpl, {}));
			/* 获取路径 */
			var pathModel = new Model();
			pathModel.url = util.url.EFinancema_queryTpl;
			var qi = [{colmEnName:"NextStep", colmValue:"", reserve1:""}];
			pathModel.set({procId:po.get("procId"),userId:po.get("userId"), system:po.get("system"), queryItem:qi});
			Backbone.sync("create", pathModel, {
				success: function(mdl, response){
					po.model3=mdl;
					console.log("-----------queryTpl-1请求成功时触发---------");
					console.log(mdl);
					if((!mdl) || mdl.errFlag!='N'){
						util.hint("获取路径错误");
					}else{
						util.hint("获取路径成功");
						var tmplt='';
						for(var i=0;i<mdl.colmInfo.length;i++){
							/* modal_p1渲染 */
							if(i==0){
								var c3 = _.template("<div class='modal1_item' colmId=<%=colmId%> colmEnName=<%=colmEnName%> colmValue=<%=colmValue%> ><img src='/img/check_54.png' /><span><%=colmValue%></span></div>");
							}else{
								var c3 = _.template("<div class='modal1_item' colmId=<%=colmId%> colmEnName=<%=colmEnName%> colmValue=<%=colmValue%> ><img src='/img/uncheck_54.png' /><span><%=colmValue%></span></div>");
							}
							tmplt +=(c3({colmValue:mdl.colmInfo[i].colmValue,colmId:mdl.colmInfo[i].colmId,colmEnName:mdl.colmInfo[i].colmEnName}));
							/* modal_p1渲染 */
						}
						tmplt = "<div class='modal_title'><span class='title1_text'>路径选择</span></div><div class='modal1_items'>" + tmplt +"</div><div class='modal1_oprt'><span class='modal1_oprt_y'>确定</span><span class='modal1_oprt_n'>取消</span></div>";
						$(".modal_p1").html(tmplt);
					}
				},
				error: function(err, response){
					console.log(err);
					util.hint("获取路径失败");
				}
			})
			/* 获取路径 */
			
			/* 初始化常用可选意见 */
			var opinionModel = new Model();
			opinionModel.url = util.url.EFinancema_usualOpinionOptions;
			opinionModel.set({userId: po.get("userId"), flowName:encodeURI(po.get("types"))});
			console.log("====opinionModel===");
			console.log(JSON.stringify(opinionModel));
			Backbone.sync("create", opinionModel, {
				success: function(mdl, response){
					po.model2=mdl;
					console.log("-----------usualOpinionOptions请求成功时触发---------");
					console.log(mdl);
					if((!mdl) || mdl.errFlag!='N'){
						util.hint("获取常用意见错误");
					}else{
						util.hint("获取常用意见成功");
						var options = mdl.auditingCommentsInfo;
						var templt = "";
						for(var op of options){
							/* 渲染常用意见选项 */
							var c = _.template("<option value=<%=value%>><%=key%></option>");
							templt += c({key:op.auditingComments, value:op.sortNo})
							/* 渲染常用意见选项 */
						}
						$(".select_opinion").append(templt);
					}
				},
				error: function(err, response){
					console.log(err);
					util.hint("获取常用意见失败");
				}
			})
			/* 初始化常用可选意见 */

		},
		loading:function () {
			this.$el.html($('#h5_loader').html());
		},
		fill_usual_opinion:function(){
			var content = $(".select_opinion option:checked").html();
			$(".opinion_area").text(content);
		},
		modal1_open:function(e){
			wave(e, "grey", function(){
				var val = $(".select_opinion option:checked").val();
				if(val==''){
					util.hint("请选择处理意见");
					return false;
				}else{
					$(".modal_bg1").css("display","block");
				}
			})

		},
		save:function(e){
			wave(e, "grey", function(){
				alert("保存成功");
			})
		},
		back:function(e){
			wave(e, "grey", function(){
				appRouter.navigate("EFinancema_main/"+"idididididid", {trigger: true});
			})
		},
		modal1_choose:function(e){
			var t = e.currentTarget;
			$(".modal1_item img").attr("src", "/img/uncheck_54.png");
			$("img",$(t)).attr("src", "/img/check_54.png");
		},
		modal1_y:function(e){
			var po = this.po;
			$(".modal1_items .modal1_item").each(function(){
				if($("img",$(this)).attr("src")=="/img/check_54.png"){
					var itm = $(this);
					if(itm && itm.attr("colmId")){
						if(itm.attr("colmId")==0){
							//路径colmid为0时，结束流程
							var t = e.currentTarget;
							var path={};
							path.colmId = itm.attr("colmId");
							path.colmEnName = itm.attr("colmEnName");
							path.colmValue = itm.attr("colmValue");
							util.confirmer('是否进行"'+path.colmValue+'"',function(){
								util.oprtLoader();
								var submitModel = new Model();
								submitModel.url = util.url.EFinancema_submit;
								var colmInfo = [];
								var ciComment ={colmEnName:"Comment",colmId:"Comment",colmValue:encodeURI($(".opinion_area").html())};
								var ciStep ={colmEnName:path.colmEnName,colmId:path.colmId,colmValue:encodeURI(path.colmValue)};
								colmInfo.push(ciComment);
								colmInfo.push(ciStep);
								submitModel.set({procId:po.get("procId"),userId:po.get("userId"),system:po.get("system"),colmInfo:colmInfo});
								Backbone.sync("create", submitModel, {
									success: function(mdl, response){
										util.oprtLoader(0);
										console.log("-----------queryTpl-2请求成功时触发-----"+$(t).attr("colmId")+"----");
										console.log(mdl);
										if((!mdl) || mdl.errFlag!='N'){
											util.hint("提交审批失败");
										}else{
											util.hint("提交审批成功");
											$(".modal_bg1").css("display", "none");
											$(".modal_bg2").css("display", "none");
										}
									},
									error: function(err, response){
										util.oprtLoader(0);
										console.log(err);
										util.hint("提交审批失败");
									},
								})
							},function(){
								util.hint("已取消");
							});
						}else{
							//路径colmid不为0时，请求提交人
							var peopleModel = new Model();
							peopleModel.url = util.url.EFinancema_queryTpl;
							var qi = [{colmEnName:itm.attr("colmEnName"), colmValue:itm.attr("colmId"), reserve1:encodeURI(itm.attr("colmValue"))}];
							peopleModel.set({procId:po.get("procId"),userId:po.get("userId"), system:po.get("system"), queryItem:qi});
							/* 调取数据前，展示oprt_loader */
							util.oprtLoader();
							/* 调取数据前，展示oprt_loader */
							Backbone.sync("create", peopleModel, {
								success: function(mdl, response){
									util.oprtLoader(0);
									console.log("-----------queryTpl-2请求成功时触发-----"+itm.attr("colmId")+"----");
									console.log(mdl);
									if((!mdl) || mdl.errFlag!='N'){
										util.hint("获取提交人错误");
									}else{
										util.hint("获取提交人成功");
										var tmplt='';
										for(var j=0;j<mdl.colmInfo.length;j++){
											/* 渲染modal_p2列表 */
											if(j==0){
												var c4 = _.template("<div class='modal2_item' colmId=<%=colmId%> colmEnName=<%=colmEnName%> colmValue=<%=colmValue%> ><img src='/img/check_54.png' /><span><%=colmValue%></span></div>");
											}else{
												var c4 = _.template("<div class='modal2_item' colmId=<%=colmId%> colmEnName=<%=colmEnName%> colmValue=<%=colmValue%> ><img src='/img/uncheck_54.png' /><span><%=colmValue%></span></div>");
											}
											tmplt += c4({colmValue:mdl.colmInfo[j].colmValue,colmId:mdl.colmInfo[j].colmId,colmEnName:mdl.colmInfo[j].colmEnName});
											/* 渲染modal_p2列表 */
										}
										tmplt = "<div class='modal_title'><span class='title2_text'>提交人选择</span></div><div class='modal2_items'>" + tmplt +"</div><div class='modal2_oprt'><span class='modal2_oprt_y'>确定</span><span class='modal2_oprt_n'>取消</span></div>";;
										$(".modal_p2").html(tmplt);
										$(".modal_bg2").css("display","block");
									}
								},
								error: function(err, response){
									util.oprtLoader(0);
									console.log(err);
									util.hint("获取提交人失败");
								}
							})
						}
					}
					return true;
				}
			})
		},
		modal1_n:function(e){
			$(".modal_bg1").css("display", "none");
		},
		modal2_choose:function(e){
			var t = e.currentTarget;
			$(".modal2_item img").attr("src", "/img/uncheck_54.png");
			$("img",$(t)).attr("src", "/img/check_54.png");
		},
		modal2_y:function(e){
			var po=this.po;
			var path={};
			$(".modal1_items .modal1_item").each(function(){
				if($("img",$(this)).attr("src")=="/img/check_54.png"){
					path.colmId = $(this).attr("colmId");
					path.colmEnName = $(this).attr("colmEnName");
					path.colmValue = $(this).attr("colmValue");
					return true;
				}
			})
			var people={};
			$(".modal2_items .modal2_item").each(function(){
				if($("img",$(this)).attr("src")=="/img/check_54.png"){
					people.colmId = $(this).attr("colmId");
					people.colmEnName = $(this).attr("colmEnName");
					people.colmValue = $(this).attr("colmValue");
					return true;
				}
			})

			util.confirmer('是否提交给"'+people.colmValue+'"进行"'+path.colmValue+'"',function(){
				util.oprtLoader();
				var submitModel = new Model();
				submitModel.url = util.url.EFinancema_submit;
				var colmInfo = [];
				var ciComment ={colmEnName:"Comment",colmId:"Comment",colmValue:encodeURI($(".opinion_area").html())};
				var ciStep ={colmEnName:path.colmEnName,colmId:path.colmId,colmValue:encodeURI(path.colmValue)};
				var ciUser ={colmEnName:people.colmEnName,colmId:people.colmId,colmValue:encodeURI(people.colmValue)};
				colmInfo.push(ciComment);
				colmInfo.push(ciStep);
				colmInfo.push(ciUser);
				submitModel.set({procId:po.get("procId"),userId:po.get("userId"),system:po.get("system"),colmInfo:colmInfo});
				Backbone.sync("create", submitModel, {
					success: function(mdl, response){
						util.oprtLoader(0);
						console.log("-----------queryTpl-2请求成功时触发--"+path.colmId+"---"+people.colmId+"----");
						console.log(mdl);
						if((!mdl) || mdl.errFlag!='N'){
							util.hint.html("提交审批失败");
						}else{
							util.hint("提交审批成功");
						}
					},
					error: function(err, response){
						util.oprtLoader(0);
						console.log(err);
						util.hint("提交审批失败");
					},
				})
			},function(){
				util.hint("已取消");
			});
		},
		modal2_n:function(e){
			$(".modal_bg2").css("display", "none");
		},
		modal3_open:function(e){
			$(".modal_p3").animate({width:"100%"},function(){
				var c = _.template(general_manager_do);
				$(".modal_p3").html(c({}));
				$(".modal_p3 ul").append("<div class='fill98'></div>");
				$(".bottom_tab").html('<div class="general_btn"><button class="select_all">全选</button><button class="cancel_sel">取消选中</button><button class="confirm">确定</button></div>');
				$(".bottom_tab").css("display", "block");
			})
		}

    });
    
    return View;
});