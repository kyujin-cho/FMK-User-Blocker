function block(nicks) {
	var target_post = $("table.bd_lst.bd_tb_lst.bd_tb > tbody > tr")
	var target_reply = $("ul.fdb_lst_ul  > li")
	var count = 0
	var nick_list = new Array()

// 	var async_script = 'function async_call(func, form) {\n\
// 		func(form);\n\
// 		console.log(1)\n\

// 		console.log(2)\n\
// 	}'
// 	var reload_script = 'function procFilter(form, filter_func) {\n\
// 	console.log(\'function called\');\n\
// 	async_call(filter_func, form);\
// 	// filter_func(form);\n\
// 	// location.reload();\n\
// 	return false;\n\
// }'
//
// 	$('head').append('<script type="text/javascript">\n' + async_script + '\n</script>')
// 	$('head').append('<script type="text/javascript">\n' + reload_script + '\n</script>')
	var reload_script = 'function insert_comment(form) {\n\
		console.log(\'insert_comment fired\')\n\
		var a = legacy_filter(\'insert_comment\', form, \'board\', \'procBoardInsertComment\', completeInsertComment, [\'error\', \'message\', \'mid\', \'document_srl\', \'comment_srl\', \'comment_page\'], \'\', {})\n\
		location.reload();\n\
		return a;\n\
	}\n\
	function delete_comment(params) {\n\
		$.exec_json(\'board.procBoardDeleteComment\', params, function(p){\n\
			if( p.error )\n\
			{\n\
				alert( p.message);\n\
				return;\n\
			}\n\
			comment.remove(params.comment_srl);\n\
			navi(cpage, false);\n\
			location.reload();\n\
		});\n\
	}'
	var delete_script = '$("#li.fdb_itm").on("remove", function () {\n\
    location.reload();\n\
	})'

	$('head').append('<script type="text/javascript">\n' + reload_script + '\n</script>')
	$('head').append('<script type="text/javascript" src="http://code.jquery.com/ui/1.12.1/jquery-ui.js" />')
	console.log(nicks.length + "\n" + target_post.length + "\n" + target_reply.length)
	console.log(nicks)
	for (var i = 0; i < target_post.length; i++) {
		var row = $("table.bd_lst.bd_tb_lst.bd_tb > tbody > tr > td.author > span > a").eq(i)
		if(nicks.indexOf(row.text()) != -1) {
			console.log('found')
			$("table.bd_lst.bd_tb_lst.bd_tb > tbody > tr").eq(i).hide()
		}
	}
	for (var i = 0; i < target_reply.length; i++) {
		var obj = $('ul.fdb_lst_ul > li').eq(i)
		var reply = $("ul.fdb_lst_ul > li > div.meta > a").eq(i)
		if(nicks.indexOf(reply.text()) !== -1) {
			console.log(reply.text())
			console.log('found_reply')
			var reply_class = obj.attr('class')
			var reply_id = obj.attr('id')
			var reply_style = obj.attr('style')
			// console.log('<li id="' + reply_id + '" class="' + reply_class + '" style= "' + reply_style + '">' +
			// 			'<div class=\"meta\" style="display: none;\"\"><a>' + reply.text() + "</a></div>" +
			// 			'<font color="red">차단된 댓글입니다.</font>' +
			// 			'</li>')
			//
			$('ul.fdb_lst_ul > li').eq(i).replaceWith('<li id="' + reply_id + '" class="' + reply_class + '" style= "' + reply_style + '">' +
							'<div class="meta" style="display: none;""><a>' + reply.text() + "</a></div>" +
							'<font color="red">차단된 댓글입니다.</font>' +
							'</li>')
		}
	}
}


chrome.runtime.sendMessage({
	'serv' : 'ban',
	'cmd' : 'load'
}, function(response) {
	console.log('Message Fired');
	block(response.list)
})
