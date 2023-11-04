id = -1;
addr = "http://localhost:8080/api/v1/";

function up() {
    console.log("Up");
    postDirection("up");
}

function down() {
    console.log("Down");
    postDirection("down");
}

function left() {
    console.log("Left");
    postDirection("left");
}

function right() {
    console.log("Right");
    postDirection("right");
}

function start() {
    url = addr + "controller";

    fetch(url).then((resp) => {
        return resp.json()
    }).then((data) =>
        id = data["id"]
    ).then(() => maintain());
}

function postDirection(direction) {
    url = addr + "controller/" + id + "/direction";
    data = {direction: direction};

    xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
}

async function maintain() {
    while (true) {
        url = addr + "controller/" + id + "/heartbeat";

        xhr = new XMLHttpRequest();
        xhr.open("POST", url, false);
        xhr.send(null);

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

start();