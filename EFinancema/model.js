define([], function () {
    var Model = Backbone.Model.extend({
        // idAttribute: "id",
        defaults: function () {
            return {
                id: "",
                name:"ddddd"
            };
        },
        events: {
        	// 'change title': 'nameEvent'
        }
    });

    return Model;
});