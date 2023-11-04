import connexion
import six

from swagger_server.models.controller import Controller  # noqa: E501
from swagger_server.models.direction_update import DirectionUpdate  # noqa: E501
from swagger_server import util


def controller_controller_id_direction_post(controller_id, body=None):  # noqa: E501
    """Set the direction

    Get control # noqa: E501

    :param controller_id: ID of the controller
    :type controller_id: int
    :param body: data to post
    :type body: dict | bytes

    :rtype: None
    """
    if connexion.request.is_json:
        body = DirectionUpdate.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def controller_get():  # noqa: E501
    """Get new controller

    Get new controller # noqa: E501


    :rtype: Controller
    """
    return 'do some magic!'