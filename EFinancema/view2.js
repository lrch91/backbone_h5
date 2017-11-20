define(['text!EFinancema/check_attachment.html'], function (tpl) {

    var View2 = Backbone.View.extend({
        el: '#device_content',
        initialize: function () {
            console.log("’‚ «check_attachment");
        },
        render: function () {
            this.$el.html(_.template(tpl));
        }
    });
    return View2;
});