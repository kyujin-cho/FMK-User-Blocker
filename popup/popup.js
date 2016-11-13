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
});

function onWindowLoad() {
    load_list();
}

window.onload = onWindowLoad;
