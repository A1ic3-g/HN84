id = -1;
api = "http://172.17.0.2:8080/api/v1/";

function up() {
    console.log("Up");
    post("up");
}

function down() {
    console.log("Down");
    post("down");
}

function left() {
    console.log("Left");
    post("left");
}

function right() {
    console.log("Right");
    post("right");
}

function getId() {
    url = api + "controller";

    xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.setRequestHeader("accept", "application/json");
    xhr.send(null);
    console.log(xhr.responseText);

    /*
    fetch(url, {
        method: "GET",
        headers: {"accept": "application/json"}
    }).then((resp) => {
        data = resp.json();
        id = data["id"];
        console.log(data);
    });
    */
}

function post(direction) {
    data = {direction: direction};

    fetch(url, {
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify(data)
    }).then((resp) => console.log(resp.json()));
}

getId();
console.log(id);