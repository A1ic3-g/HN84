from swagger_server.models.update import Update
from swagger_server.models.direction_update import DirectionUpdate

class State:
    "State"
    _instance = None
    updates = []
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(State, cls).__new__(cls)
            cls._instance.next_controller_id = 0
        return cls._instance

    def GetNextControllerId(self) -> int:
        "Gets next controller ID"
        controller_id = self.next_controller_id
        self.next_controller_id += 1
        return controller_id

    def StoreDirectionUpdate(self, controller_id, direction):
        "Stores the direction update for a controller"
        

        self.updates.append(Update("direction", 
                                   direction));

    def StoreControllerConnectUpdate(self, controller):
        self.updates.append(Update("controller-connect", controller))