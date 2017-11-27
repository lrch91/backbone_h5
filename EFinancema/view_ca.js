define(['text!EFinancema/check_attachment.html','EFinancema/model','router','util'], function (tpl, Model, appRouter, util) {

    var View = Backbone.View.extend({
        el: '#device_content',
		
        events: {
			'change .select_opinion': 'fill_usual_opinion',
        },
        initialize: function () {
			this.listenTo(this.model,'change', this.render);
		},
        init: function () {
			var po = this.model;
			this.po = po;
        	$(".nav_title").html("附件列表");
			this.$el.html(_.template(tpl, {}));
			var attachModel = new Model();
			attachModel.url = util.url.EFinancema_attachDownload;
			attachModel.set({fileId:po.get("attachDataInfo")[2].fileId,system:po.get("system")});
			Backbone.sync("create", attachModel, {
				success: function(mdl, response){
					po.attachModel = mdl;
					console.log("-----------attachDownload请求成功时触发---------");
					console.log(mdl);
				},
				error: function(err, response){
					console.log(err);
					alert('调用接口失败');
				},
				complete: function(mdl, response){
				}
			})
		},

    });
    
    return View;
});