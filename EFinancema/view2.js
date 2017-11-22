define(['text!EFinancema/check_attachment.html','text!EFinancema/general_manager_do.html','text!EFinancema/write_opinion.html'],
    function (tpl,general,write) {

    var View2 = Backbone.View.extend({
        el: '#device_content',
        initialize: function () {
            console.log("’‚ «check_attachment");
        },
        render: function () {
            console.log(general);
            this.$el.html(general);
            var c = _.template(general);
            this.$el.html(c({name:"lingxiao"}));
        }
    });
    return View2;
});