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
					console.log(JSON.stringify(mdl));
					po.attachModel = mdl;
					console.log("-----------attachDownload请求成功时触发---------");
					console.log(mdl);
					$(".hinter_title").html("获取附件成功");
					$(".hinter").css("display", "block").fadeOut(2000);
				},
				error: function(err, response){
					console.log(err);
					$(".hinter_title").html("获取附件失败");
					$(".hinter").css("display", "block").fadeOut(2000);
				},
				complete: function(mdl, response){
				}
			})
		},
		loading:function () {
			this.$el.html($('#h5_loader').html());
        },

    });
    
    return View;
});