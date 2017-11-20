define([], function () {
    var Model = Backbone.Model.extend({
        // idAttribute: "id",
        defaults: function () {
            return {
            };
        },
        events: {
        	// 'change title': 'nameEvent'
        }
    });

    return Model;
});