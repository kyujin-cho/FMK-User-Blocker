
var clickHandler = function(info) {
	var selected_nick = info.selectionText;
	var r = window.confirm('"' + selected_nick + '"(띄어쓰기 주의!) 를 정말 차단하시겠습니까?');
	if(r) {
		console.log('save')
		var list = JSON.parse(window.localStorage.getItem("nicklist"))
		list.push(selected_nick);
		window.localStorage.setItem('nicklist', JSON.stringify(list))
        alert("저장되었습니다.");
	}
}

chrome.contextMenus.create({
	title : "차단 추가",
	contexts : ["selection"],
	onclick : clickHandler
});

(function() {
    chrome.runtime.onMessage.addListener(
    	function(request, sender, sendResponse) {
    		console.log("Listener Caught");
    		if(request.serv == 'all') {
				var list = JSON.parse(window.localStorage.getItem("nicklist"));
				var egg = (window.localStorage.getItem("egg_patch") === "true");
				var con = (window.localStorage.getItem("con_patch") === "true");
				var image = (window.localStorage.getItem("image_patch") === "true");
				var vote = (window.localStorage.getItem("vote_patch") === "true");
				sendResponse({
					"success" : true,
					"list" : list,
					"egg" : egg,
					"con" : con,
					"image" : image,
					"vote" : vote
				});
    		} else if(request.serv == 'ban') {
    			console.log('ban');
				var list = JSON.parse(window.localStorage.getItem("nicklist"));
				if(list == null)
					window.localStorage.setItem("nicklist", JSON.stringify(new Array()));
    			switch(request.cmd) {
    				case 'load' :
	    				console.log('load');
    					if(list.length != 0) {
	    					console.log("ban, load success");
							sendResponse({
								"success" : true,
	    						"list" : list
	    					});
    					} else {
    						sendResponse({
    							"success" : true,
    							"list" : []
    						})
    					}
    					break;
    				case 'save' :
    					console.log('save');
	    				list.push(request.user_id);
	    				window.localStorage.setItem("nicklist", JSON.stringify(list));
	    				sendResponse({
							"success" : true
						});
						break;
					case 'delete' :
						console.log('delete');
	    				list.splice(request.row_id-1, 1);
	    				window.localStorage.setItem("nicklist", JSON.stringify(list));
	    				sendResponse({
							"success" : true
						});
						break;
				}
			} else if(request.serv == 'memo') {
				console.log('memo');
			} else if(request.serv == 'patch') {
				switch (request.cmd) {
					case 'save':
						window.localStorage.setItem(request.type + "_patch", request.enabled);
						sendResponse({
							"success" : true
						});
						break;
					case 'load' :
						sendResponse({
							"success" : true,
							"enabled" : (window.localStorage.getItem(request.type + "_patch") === "true")
						});
						break;
					}
			} else if(request.serv == 'easter') {
				switch(request.cmd) {
					case 'save' :
						var easter = (window.localStorage.getItem("easter_patch") === "true")
						window.localStorage.setItem("easter_patch", !easter);
						sendResponse({
							'success' : true
						});
						break;
					case 'load':
						sendResponse({
							'success' : true,
							'enabled' : (window.localStorage.getItem("easter_patch") === "true")
						});
						break;
				}
			}
    	});
    chrome.runtime.onMessageExternal.addListener(
		function (req, sender, sendResp) {
			console.log('onMessageExternal');
		    sendResp('Bye');
		}
	);
})();
