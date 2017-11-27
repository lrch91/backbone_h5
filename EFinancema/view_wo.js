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
					if(mdl.errFlag!='N'){
						alert(mdl.errMsg);
					}else{
						for(var i=0;i<mdl.colmInfo.length;i++){
							/* modal_p1渲染 */
							var c3 = _.template("<div class='modal1_item' colmId=<%=colmId%> colmEnName=<%=colmEnName%> colmValue=<%=colmValue%> ><span><%=colmValue%></span><img src='/img/check_54.png' /></div>");
							$(".modal_p1").append(c3({colmValue:mdl.colmInfo[i].colmValue,colmId:mdl.colmInfo[i].colmId,colmEnName:mdl.colmInfo[i].colmEnName}));
							/* modal_p1渲染 */
						}
					}
				},
				error: function(err, response){
					console.log(err);
					alert('调用接口失败');
				}
			})
			/* 获取路径 */
			
			/* 初始化常用可选意见 */
			var model2 = new Model();
			model2.url = util.url.EFinancema_usualOpinionOptions;
			model2.set({userId: po.get("userId"), flowName:encodeURI(po.get("types"))});
			Backbone.sync("create", model2, {
				success: function(mdl, response){
					po.model2=mdl;
					console.log("-----------usualOpinionOptions请求成功时触发---------");
					console.log(mdl);
					if(mdl.errFlag!='N'){
						alert(mdl.errMsg);
					}else{
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
					alert('调用接口失败');
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
					if(mdl.errFlag!='N'){
						alert(mdl.errMsg);
					}else{
						for(var j=0;j<mdl.colmInfo.length;j++){
							/* 渲染modal_p2列表 */
							var c4 = _.template("<div class='modal2_item' colmId=<%=colmId%> colmEnName=<%=colmEnName%> colmValue=<%=colmValue%> ><span><%=colmValue%></span><img src='/img/check_54.png' /></div>");
							$(".modal_p2").append(c4({colmValue:mdl.colmInfo[j].colmValue,colmId:mdl.colmInfo[j].colmId,colmEnName:mdl.colmInfo[j].colmEnName}));
							/* 渲染modal_p2列表 */
						}
						$(".modal_p2").css("display","block");
					}
				},
				error: function(err, response){
					console.log(err);
					alert('调用接口失败');
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
					$(".confirmer").css("display", "none");
					$(".hinter_title").html("确认成功");
					$(".hinter").css("display", "block").fadeOut(1500);
				})
				$(".confirmer").css("display", "block");
			});

			var submitModel = new Model();
			submitModel.url = util.url.EFinancema_submit;
			// procId userId comment nextUser nextStep nextStepName 
			submitModel.set({procId:this.po.get("procId"),userId:this.po.get("userId"),comment:encodeURI($(".opinion_area").html()),nextUser:people.colmId,nextStep:path.colmId,nextStepName:path.colmValue});
			Backbone.sync("create", submitModel, {
				success: function(mdl, response){
					console.log("-----------queryTpl-2请求成功时触发-----"+$(t).attr("colmId")+"----");
					console.log(mdl);
					if(mdl.errFlag!='N'){
						alert(mdl.errMsg);
					}else{
						for(var j=0;j<mdl.colmInfo.length;j++){
							/* 渲染modal_p2列表 */
							var c4 = _.template("<div class='modal2_item' colmId=<%=colmId%> colmEnName=<%=colmEnName%> colmValue=<%=colmValue%> ><span><%=colmValue%></span><img src='/img/check_54.png' /></div>");
							$(".modal_p2").append(c4({colmValue:mdl.colmInfo[j].colmValue,colmId:mdl.colmInfo[j].colmId,colmEnName:mdl.colmInfo[j].colmEnName}));
							/* 渲染modal_p2列表 */
						}
						$(".modal_p2").css("display","block");
					}
				},
				error: function(err, response){
					console.log(err);
					alert('调用接口失败');
				},
			})
		},
		close_modal2:function(e){
			$(".modal_p2").css("display", "none");
			$(".modal2_item").remove();
		},

    });
    
    return View;
});