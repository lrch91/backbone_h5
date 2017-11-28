define(['text!EFinancema/write_opinion.html','EFinancema/model','router','util'], function (tpl, Model, appRouter, util) {

    var View = Backbone.View.extend({
        el: '#device_content',
		
        events: {
			'change .select_opinion': 'fill_usual_opinion',
			'click .opinion_submit': 'open_modal1',
			'click .opinion_sv': 'save',
			'click .opinion_cc': 'back',
			'click .modal1_item': 'open_modal2',
			'click .title1_back': 'close_modal1',
			'click .modal2_item': 'to_submit',
			'click .title2_back': 'close_modal2',
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
						$(".hinter_title").html("获取路径错误");
						$(".hinter").css("display", "block").fadeOut(5000);
					}else{
						$(".hinter_title").html("获取路径成功");
						$(".hinter").css("display", "block").fadeOut(5000);
						var tmplt='';
						for(var i=0;i<mdl.colmInfo.length;i++){
							/* modal_p1渲染 */
							var c3 = _.template("<div class='modal1_item' colmId=<%=colmId%> colmEnName=<%=colmEnName%> colmValue=<%=colmValue%> ><span><%=colmValue%></span><img src='/img/check_54.png' /></div>");
							tmplt +=(c3({colmValue:mdl.colmInfo[i].colmValue,colmId:mdl.colmInfo[i].colmId,colmEnName:mdl.colmInfo[i].colmEnName}));
							/* modal_p1渲染 */
						}
						tmplt = " <div class='modal_title'><span class='title1_text'>1.请选择提交路径</span><span class='title1_back'>返回</span></div>" + tmplt;
						$(".modal_p1").html(tmplt);
					}
				},
				error: function(err, response){
					console.log(err);
					$(".hinter_title").html("获取路径失败");
					$(".hinter").css("display", "block").fadeOut(5000);
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
						$(".hinter_title").html("获取常用意见错误");
						$(".hinter").css("display", "block").fadeOut(5000);
					}else{
						$(".hinter_title").html("获取常用意见成功");
						$(".hinter").css("display", "block").fadeOut(5000);
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
					$(".hinter_title").html("获取常用意见失败");
					$(".hinter").css("display", "block").fadeOut(5000);
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
		open_modal1:function(e){
			wave(e, "grey", function(){
				var val = $(".select_opinion option:checked").val();
				if(val==''){
					alert("请选择处理意见");
					return false;
				}else{
					$(".modal_bg").css("display","block");
					$(".modal_p1").css("display","block");
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
		open_modal2:function(e){
			var t = e.currentTarget;
			$(".modal1_item img").css("display", "none");
			$("img",$(t)).css("display", "block");

			var peopleModel = new Model();
			peopleModel.url = util.url.EFinancema_queryTpl;
			var qi = [{colmEnName:$(t).attr("colmEnName"), colmValue:$(t).attr("colmId"), reserve1:encodeURI($(t).attr("colmValue"))}];
			peopleModel.set({procId:this.po.get("procId"),userId:this.po.get("userId"), system:this.po.get("system"), queryItem:qi});
			
			/* 调取数据前，展示oprt_loader */
			$(".oprt_loader").css("display", "block");
			/* 调取数据前，展示oprt_loader */
			Backbone.sync("create", peopleModel, {
				success: function(mdl, response){
					console.log("-----------queryTpl-2请求成功时触发-----"+$(t).attr("colmId")+"----");
					console.log(mdl);
					if((!mdl) || mdl.errFlag!='N'){
						$(".hinter_title").html("获取提交人错误");
						$(".hinter").css("display", "block").fadeOut(5000);
					}else{
						$(".hinter_title").html("获取提交人成功");
						$(".hinter").css("display", "block").fadeOut(5000);
						var tmplt='';
						for(var j=0;j<mdl.colmInfo.length;j++){
							/* 渲染modal_p2列表 */
							var c4 = _.template("<div class='modal2_item' colmId=<%=colmId%> colmEnName=<%=colmEnName%> colmValue=<%=colmValue%> ><span><%=colmValue%></span><img src='/img/check_54.png' /></div>");
							tmplt += c4({colmValue:mdl.colmInfo[j].colmValue,colmId:mdl.colmInfo[j].colmId,colmEnName:mdl.colmInfo[j].colmEnName});
							/* 渲染modal_p2列表 */
						}
						tmplt = "<div class='modal_title'><span class='title2_text'>2.请选择提交人</span><span class='title2_back'>返回</span></div>" + tmplt;
						$(".modal_p2").html(tmplt);
						$(".modal_p2").css("display","block");
					}
				},
				error: function(err, response){
					console.log(err);
					$(".hinter_title").html("获取提交人失败");
					$(".hinter").css("display", "block").fadeOut(5000);
				},
				complete: function(mdl, response){
					/* 调取数据后，关闭oprt_loader */
					$(".oprt_loader").css("display", "none");
					/* 调取数据后，关闭oprt_loader */
				}
			})
		},
		close_modal1:function(e){
			$(".modal_p1").css("display", "none");
			$(".modal_bg").css("display", "none");
			$(".modal1_item", $(".modal_p1")).each(function(){
				if($("img",$(this)).css("display")=="block"){
					$("img",$(this)).css("display", "none");
				}
			})
		},
		to_submit:function(e){
			var po=this.po;
			var t = e.currentTarget;
			var path={};
			$(".modal_p1 .modal1_item").each(function(){
				if($("img",$(this)).css("display")=="block"){
					path.colmId = $(this).attr("colmId");
					path.colmEnName = $(this).attr("colmEnName");
					path.colmValue = $(this).attr("colmValue");
					return true;
				}
			})
			
			var people={};
			people.colmId = $(t).attr("colmId");
			people.colmEnName = $(t).attr("colmEnName");
			people.colmValue = $(t).attr("colmValue");
			$("img",$(t)).animate({display:"block"},function(){
				$(".confirmer_title").html('是否提交给"'+people.colmValue+'"进行"'+path.colmValue+'"');
				$(".confirmer_n").click(function(){
					$(".confirmer").css("display", "none");
					$(".modal2_item",$(".modal_p2")).each(function(){
						$("img",$(this)).css("display", "none");
					})
					$(".hinter").css("display", "block").fadeOut(1500);
				})
				$(".confirmer_y").click(function(){
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
							console.log("-----------queryTpl-2请求成功时触发-----"+$(t).attr("colmId")+"----");
							console.log(mdl);
							if((!mdl) || mdl.errFlag!='N'){
								$(".confirmer").css("display", "none");
								$(".hinter_title").html("提交审批失败");
								$(".hinter").css("display", "block").fadeOut(5000);
							}else{
								$(".confirmer").css("display", "none");
								$(".hinter_title").html("提交审批成功");
								$(".hinter").css("display", "block").fadeOut(5000);
							}
						},
						error: function(err, response){
							console.log(err);
							$(".confirmer").css("display", "none");
							$(".hinter_title").html("提交审批失败");
							$(".hinter").css("display", "block").fadeOut(5000);
						},
					})
				})
				$(".confirmer").css("display", "block");
			});

		},
		close_modal2:function(e){
			$(".modal_p2").css("display", "none");
			$(".modal2_item").remove();
		},

    });
    
    return View;
});