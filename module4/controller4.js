define(['module4/view4','module4/model4','util'], function (View, ModelList, util) {
    
    var controller = function (name) {
    	var modelList = new ModelList({id: "333333333",title: "1111111"});
    	var view = new View({collection: modelList});
		view.init();
    	//创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,重置列表数据;
		var mescroll = new MeScroll("mescroll", {
			up: {
				clearEmptyId: "default_list",
				callback: getListData, //上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
				// noMoreSize: 7,
				// outOffsetRate: 0.2,
				page: {
					//num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始, 此项不可配置 http://www.mescroll.com/qa.html#q7
					size: 10, //每页数据条数
					time: null //加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
				},
				toTop: {
					//回到顶部按钮,需配置src才显示
					src: "../img/mescroll-totop.png", //图片路径,默认null;
					offset: 1000, //列表滚动多少距离才显示回到顶部按钮,默认1000
					warpClass: "mescroll-totop", //按钮样式,参见mescroll.css
					showClass: "mescroll-fade-in", //显示样式,参见mescroll.css
					hideClass: "mescroll-fade-out", //隐藏样式,参见mescroll.css
					duration: 300 //回到顶部的动画时长,默认300ms
				}
			}
		});
		
		/*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
		function getListData(page){
			//联网加载数据
			console.log("page.num=="+page.num);
			getListDataFromNet(page.num, page.size, function(collection){
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				mescroll.endSuccess(collection.models.length);//传参:数据的总数; mescroll会自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
				//设置列表数据,因为配置了emptyClearId,第一页会清空dataList的数据,所以setListData应该写在最后;
				//获取数据后渲染页面
				// setListData(collection);
				view.render();
				$("#downloadTip").html("获取第"+page.num+"页数据成功!");
				$("#downloadTip").css("top","2.8rem");
				setTimeout(function () {
					$("#downloadTip").css("top","1.3rem");
				},1000);
				
			/* 	$("#downloadTip").animate({top:"2.8rem"},function(){
					$("#downloadTip").animate({top:"1.3rem"},1000);
				}) */
			}, function(){
				//联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                mescroll.endErr();
			});
		}
		
		function setListData(collection){
			var data = collection.models;
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
		}
		
		/*联网加载列表数据*/
		function getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
			modelList.url = util.ip+"/api/articlePage/"+pageNum;
			console.log(modelList.models[0].toJSON());
			modelList.fetch({
				data: { "pageSize": pageSize },
				add: true,
//				remove: false,
				success: function(collection, resp, options){
					console.log("-----------请求成功时触发---------");
					console.log(modelList.models.length);
					for(var i=0;i<modelList.models.length;i++){
						console.log(modelList.models[i].toJSON());
					}
					
					console.log(collection.models.length);
					for(var i=0;i<collection.models.length;i++){
						console.log(collection.models[i].toJSON());
					}
					successCallback(collection);
				},
				error: function (collection, resp) { 
					console.log("-----------请求失败时触发---------");
					errorCallback;
		        }
			});
		}

		//禁止PC浏览器拖拽图片,避免与下拉刷新冲突;如果仅在移动端使用,可删除此代码
		// document.ondragstart=function() {return false;}

        controller.onRouteChange = function () {
//          console.log('change');  //可以做一些销毁工作，例如view.undelegateEvents()
            view.undelegateEvents();
        };
    };

    return controller;
});