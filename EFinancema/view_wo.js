define(['text!EFinancema/write_opinion.html','EFinancema/model2','EFinancema/model3','router','util'], function (tpl, Model2, Model3, appRouter, util) {

    var View = Backbone.View.extend({
        el: '#device_content',
		
        events: {
			'change .select_opinion': 'fill_usual_opinion',
			'click .opinion_submit': 'onsubmit',
			'click .opinion_sv': 'save',
			'click .opinion_cc': 'back',
        },
        initialize: function () {
//          this.model.on('nameEvent', this.render, this);      //监听事件
			this.listenTo(this.model,'change', this.render);
		},
        init: function () {
        	$(".nav_title").html("填写意见");
			this.$el.html(_.template(tpl, {}));
			/* 获取路径 */
			var model3 = new Model3();
			model3.url = util.url.EFinancema_queryTpl;
			var qi = [{colmEnName:"NextStep", colmValue:"", reserve1:""}];
			model3.set({procId:this.model.get("procId"),userId:this.model.get("userId"), system:this.model.get("system"), queryItem:qi});
			console.log(JSON.stringify(model3));
			Backbone.sync("create", model3, {
				success: function(mdl, response){
					model3.set(mdl);
					console.log("-----------queryTpl请求成功时触发---------");
					console.log(mdl);
					if(mdl.errFlag!='N'){
						alert(mdl.errMsg);
					}else{
						
					}
				},
				error: function(err, response){
					console.log(err);
					alert('调用接口失败');
				},
				complete: function(mdl, response){
				}
			})
			/* 获取路径 */
			
			/* 初始化常用可选意见 */
			var model2 = new Model2();
			model2.url = util.url.EFinancema_usualOpinionOptions;
			model2.set({userId: this.model.get("userId"), flowName:encodeURI(this.model.get("types"))});
			Backbone.sync("create", model2, {
				success: function(mdl, response){
					model2.set(mdl);
					console.log("-----------usualOpinionOptions请求成功时触发---------");
					console.log(mdl);
					if(mdl.errFlag!='N'){
						alert(mdl.errMsg);
					}else{
						var options = model2.get("auditingCommentsInfo");
						var templt = "";
						for(var op of options){
							var c = _.template("<option value=<%=value%>><%=key%></option>");
							templt += c({key:op.auditingComments, value:op.sortNo})
						}
						$(".select_opinion").append(templt);
					}
				},
				error: function(err, response){
					console.log(err);
					alert('调用接口失败');
				},
				complete: function(mdl, response){
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
		onsubmit:function(e){
			wave(e, "grey", function(){
				var val = $(".select_opinion option:checked").val();
				if(val==''){
					alert("请选择处理意见");
					return false;
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
		}

    });
    
    return View;
});