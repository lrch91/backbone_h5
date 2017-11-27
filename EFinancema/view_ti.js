define(['text!EFinancema/table_info_show.html','EFinancema/model','router','util'], function (table_info_show, Model, appRouter, util) {

    var View = Backbone.View.extend({
        el: '#device_content',
		
        events: {
			'change .select_opinion': 'fill_usual_opinion',
        },
        initialize: function () {
			this.listenTo(this.model,'change', this.render);
		},
        init: function () {
			$(".nav_title").html("费用明细");
			var inf =this.model.get("tableInfo")[0];
			var titles =inf.tableTitle;
			var tStr='';
			for(var title of titles){
				tStr += ('<th>'+title.titleName+'</th>');
			}
			tStr = '<tr>'+tStr+'</tr>';

			var contents = inf.tableBody;
			var cStr='';
			for(var content of contents){
				var subCStr='';
				for(var subC of content.rowBody){
					subCStr += ('<td>'+subC+'</td>');
				}
				subCStr = '<tr>'+subCStr+'</tr>';
				cStr += subCStr;
			}
			this.$el.html(_.template('<table border="1" cellspacing="0"; class="info_table">'+tStr+cStr+'</table>', {}));

		},
    });
    
    return View;
});