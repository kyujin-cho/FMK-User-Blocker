var db = openDatabase("BlockNickDB", "1.0", "Nickname Database", "5*1024*1024");

function load_list() {
    chrome.runtime.sendMessage({
        "serv": "ban",
        "cmd": "load"
    }, function(response) {
        console.log(response);
        if(response.success) {
            document.getElementById("bannednick").innerHTML = "";
            for (var i = 0; i < response.list.length; i++) {
                var component = document.createElement("li");
                component.className = "list-group-item";
                component.textContent = response.list[i] + "  ";
                var rem_button = document.createElement("button");
                rem_button.className = "btn btn-default remove-ban-button";
                rem_button.setAttribute("id", i + 1);
                rem_button.setAttribute("type", "button");
                rem_button.textContent = "차단 목록에서 제거";
                rem_button.addEventListener('click', function() {
                    var id = this.id;
                    console.log("rem button event listener, id=" + id);
                    chrome.runtime.sendMessage({
                        "serv" : "ban",
                        "cmd" : "delete",
                        "row_id" : id
                    }, function(response) {
                        if(response.success)
                            alert("성공적으로 제거되었습니다.");
                        else
                            alert("실패하였습니다.\n" + response.error);
                    });
                    load_list();
                });
                component.appendChild(rem_button);
                document.getElementById("bannednick").appendChild(component);
            }
        } else
            console.log("failed to access db\n" + response.error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var button = document.getElementById('submit');
    button.addEventListener('click', function() {
        var targetnick = document.getElementById('nicktext').value;
        if(targetnick == "!enable hidden feature for fmkorea.com!")
          chrome.runtime.sendMessage({
            "serv" : "easter", 
            "cmd" : "save"
          }, function(response) {
            if(!response.success)
              alert('실패하였습니다.');
          });
        else
          chrome.runtime.sendMessage({
              "serv" : "ban",
              "cmd" : "save",
              "user_id" : targetnick
          }, function(response) {
              if(response.success)
                  alert("저장되었습니다.");
              else
                  alert("실패하였습니다. \n" + error);
          });
        document.getElementById('nicktext').value = "";
        load_list();
    });
    var vote_patch = document.getElementById('vote_patch');
    chrome.runtime.sendMessage({
      "serv" : "patch",
      "cmd" : "load",
      "type" : "vote"
    }, function (response) {
      console.log('vote_patch : ' + response.enabled);
      $('input:checkbox[id=\"vote_patch\"]').prop('checked', response.enabled);
    })
    vote_patch.addEventListener('click', function () {
      chrome.runtime.sendMessage({
        "serv" : "patch",
        "cmd" : "save",
        "type" : "vote",
        "enabled" : vote_patch.checked
      }, function (response) {
        if(!response.success)
          alert("실패하였습니다.\n" + error);
      })
    })
    var egg_patch = document.getElementById('egg_patch');
    chrome.runtime.sendMessage({
      "serv" : "patch",
      "cmd" : "load",
      "type" : "egg"
    }, function (response) {
      console.log('egg_patch : ' + response.enabled);
      $('input:checkbox[id=\"egg_patch\"]').prop('checked', response.enabled);
    })
    egg_patch.addEventListener('click', function () {
      chrome.runtime.sendMessage({
        "serv" : "patch",
        "cmd" : "save",
        "type" : "egg",
        "enabled" : egg_patch.checked
      }, function (response) {
        if(!response.success)
          alert("실패하였습니다.\n" + error);
      })
    })
    var con_patch = document.getElementById('con_patch');
    chrome.runtime.sendMessage({
      "serv" : "patch",
      "cmd" : "load",
      "type" : "con"
    }, function (response) {
      if(response.enabled != null)
      console.log('con_patch : ' + response.enabled);
        $('input:checkbox[id=\"con_patch\"]').prop('checked', response.enabled);
      
    })
    con_patch.addEventListener('click', function () {
      chrome.runtime.sendMessage({
        "serv" : "patch",
        "cmd" : "save",
        "type" : "con",
        "enabled" : con_patch.checked
      }, function (response) {
        if(!response.success)
          alert("실패하였습니다.\n" + error);
      })
    })
    var image_patch = document.getElementById('image_patch');
    chrome.runtime.sendMessage({
      "serv" : "patch",
      "cmd" : "load",
      "type" : "image"
    }, function (response) {
      if(response.enabled != null)
      console.log('image_patch : ' + response.enabled);
        $('input:checkbox[id=\"image_patch\"]').prop('checked', response.enabled);
      
    })
    image_patch.addEventListener('click', function () {
      chrome.runtime.sendMessage({
        "serv" : "patch",
        "cmd" : "save",
        "type" : "image",
        "enabled" : image_patch.checked
      }, function (response) {
        if(!response.success)
          alert("실패하였습니다.\n" + error);
      })
    })

});

function onWindowLoad() {
  chrome.runtime.sendMessage({
    'serv' : 'easter',
    'cmd' : 'load'
  }, function(response) {
    console.log('easter: ' + response.enabled);
    if(!response.enabled) {
      $("p.easter").hide()
    }
  })
  load_list();
}

window.onload = onWindowLoad;
