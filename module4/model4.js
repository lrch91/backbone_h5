define([], function () {
    var Model = Backbone.Model.extend({
//  	urlRoot: "/api/articleHandle",
        //模型默认的数据
        idAttribute: "id",
        defaults: function () {
            return {
            	id: "",
                title:"",
                content:"",
                createDate:"",
                status:"",
                version:0
            };
        }
    });
    
    var ModelList = Backbone.Collection.extend({
    	model: Model,
    	initialize: function(){
    		this.on("reset", function(render){
    			console.log("========reset事件触发=========");
    			for(var i=0;i<render.models.length;i++){
    				console.log(render.models[i].toJSON());
    			}
    		});
    	},
    	url: "",
    	parse: function (resp, options) {
    		return resp.rows;
        }
    })

    return ModelList;
});