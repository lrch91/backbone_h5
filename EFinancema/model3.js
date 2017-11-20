define([], function () {
    var Model = Backbone.Model.extend({
        // idAttribute: "id",
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