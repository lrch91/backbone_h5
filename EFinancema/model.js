define([], function () {
    var Model = Backbone.Model.extend({
        defaults: function () {
            return {
            	id: ""
            };
        },
        events: {
        	// 'change title': 'nameEvent'
        }
    });

    return Model;
});