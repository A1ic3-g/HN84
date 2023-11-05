import serial
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

ser = serial.Serial("/dev/ttyUSB0", 9600)
while True:
    try:
        data = ser.readline().decode("utf-8").encode().strip()
        if data == b"up":
            postDirection("up")
        if data == b"down":
            postDirection("down")
        if data == b"left":
            postDirection("left")
        if data == b"right":
            postDirection("right")

    except KeyboardInterrupt:
        ser.close()
        break

