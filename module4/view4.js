define(['text!module4/tpl.html','router','util'], function (tpl, appRouter, util) {

    var View4 = Backbone.View.extend({
        el: '#device_content',

        events: {
            'click .toSingle': 'clickSpan',     //使用代理监听交互，好处是界面即使重新rander了，事件还能触发，不需要重新绑定。如果使用zepto手工逐个元素绑定，当元素刷新后，事件绑定就无效了
        	'click .toDel': 'delOne',
        	'click .addOne': 'toAdd',
        	'click .toSingleItem': 'toSingleItem',
        },

        initialize: function () {
        	this.listenTo(this.collection, 'add', this.add1);
//		    this.listenTo(this.collection, 'reset', this.reset1);
//		    this.listenTo(this.collection, 'all', this.all1);
		    this.listenTo(this.collection, 'remove', this.remove1);
//          this.collection.models.on('nameEvent', this.render, this);      //监听事件
        },
        add1:function(){
        	console.log("add1");
        },
        reset1:function(){
        	console.log("reset1");
        },
        all1:function(){
        	console.log("all");
        },
        remove1:function(m){
        	console.log("remove");
        },
        init:function () {
			$(".nav_title").html("代  办");
        	this.$el.html($('#default_list').html());
        },
        render: function () {
			var data = this.collection.models;
			var listDom=document.getElementById("default_list");
			fragment = document.createDocumentFragment();
			for (var i = 0; i < data.length; i++) {
				var pd=data[i];
				var str = '<button class="toSingleItem" id="'+pd.get('id')+'"><p>'+pd.get('title')+'我是标题我是标题'+'</p><p class="new-content">'+pd.get('title')+'我是内容我是内容我是内容'+'</p></button>';
				var liDom=document.createElement("li");
				liDom.innerHTML=str;
				fragment.appendChild(liDom);
			}
			listDom.appendChild(fragment);
        },
        append: function (cols) {
        	if(cols && cols.models.length>0 && cols.models[0].id!='undefined'){
	        	var array;
	        	if(cols.models!='' && cols.models!='undefine' && cols.models.length!=0){
	        		array = cols.models;
	        	}
				var tempHtml = '';
	        	for(var i=0;i<array.length;i++){
	        		var compiled = _.template(tpl);
					tempHtml += compiled({title: array[i].get('title'), content: array[i].get('content')});
	        	}
	            $('#default_list').append(tempHtml);
        	}
        	
        },

        clickSpan: function(e){
        	appRouter.navigate("module3/"+e.currentTarget.id, {trigger: true});
        },
        
        delOne: function(e){
        	var view = this;
        	var tempc = this.collection;
        	var model = this.collection.get(e.currentTarget.id);
        	model.url = util.ip+"/api/articleDelete/"+e.currentTarget.id;
			model.destroy({
		        success: function(tempModel, response) {
		        	console.log("-----------请求成功时触发---------");
		        	alert('删除成功');
		        	view.render();
		        },
		        error: function (collection, resp) { 
					console.log("-----------请求失败时触发---------");
	        	} ,
		        wait:true
		    })
        },
        
        toAdd: function(e){
        	appRouter.navigate("module5", {trigger: true});
        },
        toSingleItem: function(e){
			wave(e, "grey", function(){
				$(".mescroll-totop").remove();
				appRouter.navigate("module3/"+e.currentTarget.id, {trigger: true});
			});
        },
        removeView: function(){
       		console.log('删除成功');
        }
    });

    return View4;
});