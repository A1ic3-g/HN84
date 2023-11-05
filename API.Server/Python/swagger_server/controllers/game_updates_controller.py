import connexion
import six

from swagger_server.models.update import Update  # noqa: E501
from swagger_server import util
from swagger_server.State import State


def update_get():  # noqa: E501
    """Get game updates

    Get game updates # noqa: E501


    :rtype: List[Update]
    """
    state = State()
    updates = state.updates
    state.updates = []
    return updates
