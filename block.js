
var target_post = $("table.bd_lst.bd_tb_lst.bd_tb > tbody > tr")
var target_reply = $("ul.fdb_lst_ul  > li")
var count = 0
var nick_list = new Array()

function block(nicks) {
	var document_id = $('input[name=\"document_srl\"]').attr('value')
	var script_r = 'val r = procFilterEx(this, insert_comment); location.reload(); return val; '
	var btn_script = '<script type="text/javascript">\
					jQuery(\'input.bd_btn\').click(function() {\
						if(jQuery(\'textarea#editor_' + document_id + '\').val() != \'\') location.reload();\n\});\
					</script>'
	var btn_fr_script = 'jQuery("input.bd_btn.fr").click(function() { \
		console.log(jQuery("textarea").eq(0).val());\
		if(jQuery("textarea").eq(0).val() != "")\
		location.reload();\
		else\
		console.log("nothing");\
		});'
	$('head').append(btn_script)
	$('head').append('<script type="text/javascript" id="inject_needed"></script>')
	$('head').append('<script type="text/javascript">\
		var btn_fr_script = \'' + btn_fr_script + '\';\n\
		jQuery(\'a.re_comment\').click(function() {\
	jQuery(\'head > script#inject_needed\').html(btn_fr_script)\
	});\
	</script>')
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
			console.log('<li id="' + reply_id + '" class="' + reply_class + '" style= "' + reply_style + '">' +
						'<div class=\"meta\" style="display: none;\"\"><a>' + reply.text() + "</a></div>" +
						'<font color="red">차단된 댓글입니다.</font>' +
						'</li>')

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
	block(response.list);
})
