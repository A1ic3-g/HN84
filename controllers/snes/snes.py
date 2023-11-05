import evdev
import requests
import json
import threading
from time import sleep

def getId():
    response = requests.get("http://localhost:8080/api/v1/controller")

    if response.status_code == 200:
        data = response.json()
        
        return data.get("id")
    
    return None

def postDirection(direction):
    requests.post("http://localhost:8080/api/v1/controller/"+str(id)+"/direction",
        data=json.dumps({"direction": direction}), headers={"Content-type": "application/json"})

def maintain():
    while True:
        requests.post("http://localhost:8080/api/v1/controller/"+str(id)+"/heartbeat",
            data=json.dumps({}), headers={"Content-type": "application/json"})
        sleep(5)


id = getId()
threading.Thread(target=maintain).start()

device = evdev.InputDevice('/dev/input/event16')

xPrev = -1
yPrev = -1

for event in device.read_loop():
    x = 0
    y = 0

    if event.type == evdev.ecodes.EV_ABS:
        if event.code == evdev.ecodes.ABS_X:
            if xPrev == -1:
                xPrev = event.value
            else:
                x = event.value
                if xPrev == 0:
                    print(str(id) + " left")
                    postDirection("left")
                else:
                    print(str(id) + " right")
                    postDirection("right")
                xPrev = -1
                
        if event.code == evdev.ecodes.ABS_Y:
            if yPrev == -1:
                yPrev = event.value
            else:
                y = event.value
                if yPrev == 0:
                    print(str(id) + " up")
                    postDirection("up")
                else:
                    print(str(id) + " down")
                    postDirection("down")
                yPrev = -1