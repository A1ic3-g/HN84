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

    fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        });
}

async function maintain() {
    while (true) {
        url = addr + "controller/" + id + "/heartbeat";

        fetch(url, {
                    method: "POST",
                    body: "",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                    });


        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

document.addEventListener("keydown", function(event) {
    // Check which arrow key was pressed
    if (event.key === "ArrowUp") {
      // Arrow Up key was pressed
      console.log("Arrow Up key pressed");
      up();
    } else if (event.key === "ArrowDown") {
      // Arrow Down key was pressed
      console.log("Arrow Down key pressed");
      down();
    } else if (event.key === "ArrowLeft") {
      // Arrow Left key was pressed
      console.log("Arrow Left key pressed");
      left();
    } else if (event.key === "ArrowRight") {
      // Arrow Right key was pressed
      console.log("Arrow Right key pressed");
      right();
    }
  });

start();