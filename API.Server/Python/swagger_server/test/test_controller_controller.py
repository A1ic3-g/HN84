# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.controller import Controller  # noqa: E501
from swagger_server.models.direction_update import DirectionUpdate  # noqa: E501
from swagger_server.test import BaseTestCase


class TestControllerController(BaseTestCase):
    """ControllerController integration test stubs"""

    def test_controller_controller_id_direction_post(self):
        """Test case for controller_controller_id_direction_post

        Set the direction
        """
        body = DirectionUpdate()
        response = self.client.open(
            '/api/v1/controller/{controllerId}/direction'.format(controller_id=56),
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_controller_get(self):
        """Test case for controller_get

        Get new controller
        """
        response = self.client.open(
            '/api/v1/controller',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
