class State:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(State, cls).__new__(cls)
            cls._instance.next_controller_id = 0
            cls._instance.updates = []
        return cls._instance

    def GetNextControllerId(self) -> int:
        controller_id = self.next_controller_id
        self.next_controller_id += 1
        return controller_id

    def StoreDirectionUpdate(self, controller_id, direction):
        "Stores the direction update for a controller"
        self.updates.append({controller_id, direction})
