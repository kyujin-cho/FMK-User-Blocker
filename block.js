var reload_script = `
	function insert_comment(form) {
  var a = null
  a = legacy_filter('insert_comment', form, 'board', 'procBoardInsertComment', completeInsertComment, ['error', 'message', 'mid', 'document_srl', 'comment_srl', 'comment_page'], '', {})
  async_insert = function (form, callback) {
    if(a != null) {
      console.log('inserted')
      callback()
    }
    else
      async_insert(form)
  }
  async_insert(form, function () {
		console.log('reloading...')
    location.reload()
  })
  return a;
}
function delete_comment(params) {
  $.exec_json('board.procBoardDeleteComment', params, function(p){
    if(p.error) {
      alert( p.message);
      return;
    }
    comment.remove(params.comment_srl);
    navi(cpage, false);
    location.reload();
  });
}`
var delete_script = `$("#li.fdb_itm").on("remove", function () {
  location.reload();
})`


function block(nicks) {
	var target_post = $("table.bd_lst.bd_tb_lst.bd_tb > tbody > tr")
	var target_reply = $("ul.fdb_lst_ul  > li")
	var count = 0
	var nick_list = new Array()

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
			$('ul.fdb_lst_ul > li').eq(i).replaceWith('<li id="' + reply_id + '" class="' + reply_class + '" style= "' + reply_style + '">' +
							'<div class="meta" style="display: none;""><a>' + reply.text() + "</a></div>" +
							'<font color="red">차단된 댓글입니다.</font>' +
							'</li>')
		}
	}
}

function vote_patch() {
	var css = `.fm_vote .vote label {
	    position: absolute;
	    right: 0;
	    top: 2px;
	    width: 166px;
	    height: 24px;
	    overflow: hidden;
	    background: url(http://ext.fmkorea.com/modules/board/skins/sketchbook5_elkha/img/popular.png?a) no-repeat 100% -90px;
	    text-indent: -300px;
	    font-size: 0;
	    line-height: 0;
	    text-align: left;
	}

	.fm_vote .vote2 label {
	    left: 0;
	    right: auto;
	    width: 179px;
	    background-position: 0 -114px;
	}

	.fm_vote .vote {
	    position: relative;
	    display: inline-block;
	    padding-right: 166px;
	}

	.fm_vote .vote2 {
	    margin-left: 25px;
	    padding-left: 179px;
	    padding-right: 0;
	}
	.fm_vote .vote .btn_img:after {
			width: 161px;
	}`
	$('head').append('<style type="text/css">' + css + '</style>')
}

function egg_patch() {
	var images = $("table.bd_lst.bd_tb_lst.bd_tb > tbody > tr > td.author > span > a > img")
	var reply_images = $("div#cmtPosition > ul.fdb_lst_ul > li.fdb_itm.clear > div.meta > a > img")
	for(var i = 0; i < images.length; i++){
		if(images.eq(i).attr('src').startsWith('//image.fmkorea.com/modules/point/icons/fmkorea/')) {
			images.eq(i).attr('src', '//image.fmkorea.com/modules/point/icons/fmkorea/1.gif')
		}
	}
	for(var i = 0; i < reply_images.length; i++) {
		if(reply_images.eq(i).attr('src').startsWith('//image.fmkorea.com/modules/point/icons/fmkorea/'))
			reply_images.eq(i).attr('src', '//image.fmkorea.com/modules/point/icons/fmkorea/1.gif')
	}
}

function con_patch() {
	var images = $("table.bd_lst.bd_tb_lst.bd_tb > tbody > tr > td.author > span > a > img")
	var reply_images = $("div#cmtPosition > ul.fdb_lst_ul > li.fdb_itm.clear > div.meta > a > img")
	for(var i = 0; i < images.length; i++){
		if(images.eq(i).attr('src').startsWith('//image.fmkorea.com/filesn/member_extra_info/')) 
			images.eq(i).remove()
	}
	for(var i = 0; i < reply_images.length; i++) {
		if(reply_images.eq(i).attr('src').startsWith('//image.fmkorea.com/filesn/member_extra_info/'))
			reply_images.eq(i).remove()
	}
}

function image_patch() {
	var reply_contents = $("div#cmtPosition > ul.fdb_lst_ul > li.fdb_itm.clear > div > div.xe_content > a")
	
	for(var i = 0; i < reply_contents.length; i++) {
		if((reply_contents.eq(i).attr('href').startsWith('http://') ||
				reply_contents.eq(i).attr('href').startsWith('https://')) && 
			(reply_contents.eq(i).attr('href').endsWith('.jpg') ||
				reply_contents.eq(i).attr('href').endsWith('.png') ||
				reply_contents.eq(i).attr('href').endsWith('.gif') || 
				reply_contents.eq(i).attr('href').endsWith('.bmp'))) {
			reply_contents.eq(i).html('<p><a href="' + reply_contents.eq(i).attr('href') + '"><img src="' + reply_contents.eq(i).attr('href') + '" style="width: 80%;"></a></p>');
		}
	}
}
chrome.runtime.sendMessage({
	'serv' : 'all'
}, function(response) {
	if(response.success) {
		if(response.list != [])
			block(response.list);
		if(response.egg)
			egg_patch();
		if(response.con)
			con_patch();
		if(response.image)
			image_patch();
		if(response.vote)
			vote_patch();
		
	}
})