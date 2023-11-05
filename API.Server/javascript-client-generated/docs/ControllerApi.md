# HackPacOpenApi30.ControllerApi

All URIs are relative to *http://172.17.0.2:8080/api/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**controllerControllerIdDirectionPost**](ControllerApi.md#controllerControllerIdDirectionPost) | **POST** /controller/{controllerId}/direction | Set the direction
[**controllerGet**](ControllerApi.md#controllerGet) | **GET** /controller | Get new controller

<a name="controllerControllerIdDirectionPost"></a>
# **controllerControllerIdDirectionPost**
> controllerControllerIdDirectionPost(controllerId, opts)

Set the direction

Get control

### Example
```javascript
import {HackPacOpenApi30} from 'hack_pac___open_api_30';

let apiInstance = new HackPacOpenApi30.ControllerApi();
let controllerId = 56; // Number | ID of the controller
let opts = { 
  'body': new HackPacOpenApi30.DirectionUpdate() // DirectionUpdate | data to post
};
apiInstance.controllerControllerIdDirectionPost(controllerId, opts, (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
});
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **controllerId** | **Number**| ID of the controller | 
 **body** | [**DirectionUpdate**](DirectionUpdate.md)| data to post | [optional] 

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

<a name="controllerGet"></a>
# **controllerGet**
> Controller controllerGet()

Get new controller

Get new controller

### Example
```javascript
import {HackPacOpenApi30} from 'hack_pac___open_api_30';

let apiInstance = new HackPacOpenApi30.ControllerApi();
apiInstance.controllerGet((error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
});
```

### Parameters
This endpoint does not need any parameter.

### Return type

[**Controller**](Controller.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

