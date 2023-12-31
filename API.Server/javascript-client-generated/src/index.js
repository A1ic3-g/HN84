/*
 * HackPac - OpenAPI 3.0
 * Pacman api server
 *
 * OpenAPI spec version: 1.0.11
 * Contact: apiteam@swagger.io
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 *
 * Swagger Codegen version: 3.0.50
 *
 * Do not edit the class manually.
 *
 */
import {ApiClient} from './ApiClient';
import {Controller} from './model/Controller';
import {DirectionUpdate} from './model/DirectionUpdate';
import {ControllerApi} from './api/ControllerApi';

/**
* Pacman_api_server.<br>
* The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
* <p>
* An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
* <pre>
* var HackPacOpenApi30 = require('index'); // See note below*.
* var xxxSvc = new HackPacOpenApi30.XxxApi(); // Allocate the API class we're going to use.
* var yyyModel = new HackPacOpenApi30.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
* and put the application logic within the callback function.</em>
* </p>
* <p>
* A non-AMD browser application (discouraged) might do something like this:
* <pre>
* var xxxSvc = new HackPacOpenApi30.XxxApi(); // Allocate the API class we're going to use.
* var yyy = new HackPacOpenApi30.Yyy(); // Construct a model instance.
* yyyModel.someProperty = 'someValue';
* ...
* var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
* ...
* </pre>
* </p>
* @module index
* @version 1.0.11
*/
export {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient,

    /**
     * The Controller model constructor.
     * @property {module:model/Controller}
     */
    Controller,

    /**
     * The DirectionUpdate model constructor.
     * @property {module:model/DirectionUpdate}
     */
    DirectionUpdate,

    /**
    * The ControllerApi service constructor.
    * @property {module:api/ControllerApi}
    */
    ControllerApi
};
