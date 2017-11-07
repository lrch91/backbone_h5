define([], function () {
    var Model3 = Backbone.Model.extend({
        defaults: function () {
            return {
            	id: "",
                title:"t",
                content:"c",
                createDate:""
            };
        },
        events: {
        	'change title': 'nameEvent'
        }
    });

    return Model3;
});