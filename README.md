**Codew**
---
Full-stack JavaScript framework build on top of [Express](https://expressjs.com/) with [MySQL](https://www.mysql.com/) database support and [React](https://reactjs.org/) for the user interface.

* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Version](#version)
* [Async/await](#async-await)
* [Modules](#modules)
* [Services](#services)
* [Models](#models)
* [Controllers](#controllers)
* [Containers](#containers)
* [File upload](#file-upload)
* [Migrations](#migrations)
* [Webpack](#webpack)
* [Device detection](#device-detection)
* [Language](#language)

**Prerequisites**
---
Dependencies:

* [Node.js](https://nodejs.org/en/) >= 9.4.0
* [MySQL](https://www.mysql.com/)

If you are not familiar with [Express](https://expressjs.com/) their documentation will be a good starting point.

**Installation**
---

Clone the repository in folder `codew`
```
git clone git@github.com:Codenetz/codew.git codew
```

Running the project requires `node >= 9.4.0`.
You can download [NVM](https://github.com/creationix/nvm) and use it like this:

```
$ nvm install 9.4.0 
```

```
$ nvm use 9.4.0
```
 
or if you have already installed the required `node` version you can continue to the next step.

---

Setup the environment copying `dist.env` file to `.env`
`.env` file is excluded in `.gitignore` so that each environment will have it's own specific configurations.

```
$ cp dist.env .env
```

The test environment is used when running tests. For example you can have different database configurations if you don't want your tests to mess-up your application database.

```
$ cp dist.env.test .env.test
```

---

Read [Version](#version) section

```
$ cp dist.version .version
```

---

Install all needed dependencies.

```
$ npm install
```

---

This command will run the framework tests to make sure everything works correctly.

_You can skip this command if you like._

```
$ npm test
```

---

Fire it up

```
$ npm start
```

The application should now run with the configurations set in `.env`

---

This command will build front-end assets from `./src/client/`.
You can read more about it in [Webpack](#webpack) section below.

_You can skip this command if you don't need._

```
$ npm run webpack
```

**Version**
---

The `.version` file in the root directory of the project contains current application version using the following format `{major}.{minor}.{patch}`.

Used when:

* Modifying the assets file names using hash representation of the version number to avoid caching them in the browser after editing the code.

Can also be used for:

* Automatic git tagging.
A deploy script can be created to automatically increase the current version using the command `node bin/version.js` and also create a tag in the git repository based on the `.version` file.
* Keeping track of current application version.

---

Updating the application version can be done using the command `node bin/version.js` which takes one of the following arguments:

* `show` Prints current application version and it's hash
* `major` Updates the major version by "1"
* `minor` Updates the minor version by "1"
* `patch` Updates the patch version by "1"

Current version can be accessed using `app.get("VERSION")`, anywhere within your application.

**Async/await**
---
In order to keep the code simple & readable the framework is written with `async` and `await` Promise-based approach.


**Modules**
---
The application backend is built up from modules which gives those benefits:

* Reusable code
* Logic separation
* Better code organization
* Ability to enable modules easily
* Human readable source code
 
Example of such modules can be `User`, `Forum`, `ShoppingCart`, `Chat` etc. 


---

Creating a module.

Each module has its own structure of `controllers`, `services`, `models`, `migrations` and `routes`, so with its organized code it could easily be maintained and moved around different projects.

Basic module structure.
```
├── constants
│   └── tables.js
│
├── controller
│   └── itemController.js
│
├── migrations
│   ├── add_default_user.js
│   ├── add_field_name.js
│   └── create_user_table.js
│
├── model
│   └── itemModel.js
│
├── routing
│   └── routes.js
│
├── service
│   └── exampleService.js
│
├── models.js
├── example.js
└── services.js
```

* `/constants` - Keeps all your module constants in one place. For example it can contain `table names`, `endpoints`, `payment methods`, `error codes` and so on.
* `/controller` - Contains classes ([controllers](#controllers) handling the client request and server response.
* `/migrations` - Database [migration](#migrations) files.
* `/model` - Contains classes ([models](#models)) handling part of the business logic and interactions with the database.
* `/routing` - Describes all module specific endpoints.
* `/service` - Contains classes ([services](#service)) handling business logic.
* `models.js` - Used to declare modules' models.
* `services.js` - Used to declare modules' services.
* `example.js` - Entry file that must be declared in `src/server/modules.json` in order to load the module.

**Services**
---
A service is a useful object for example `MailService` which can be used for sending emails or `ImageService` for processing images.

A service registration can be made by using the `SERVICE` [container](#containers).
First a class instance must be made with all required arguments and then registered in the container.

```
app.get("SERVICE").set(new ImageService(app));
```

Service is accessed from the `SERVICE` container.

```
app.get("SERVICE").get("ImageService");
```

This will return `ImageService` object registered earlier.
No matter how much times a service is requested it will always return object from same reference.

```
app.get("SERVICE").get("ImageService"); //from ref 1
app.get("SERVICE").get("ImageService"); //from ref 1
app.get("SERVICE").get("ImageService"); //from ref 1
```

Benefits using services:

* No need to require additional modules in your files.
* Promotes good architecture.
* No need to instantiate a class everytime you need it. You already have it in the container ready for use.
* Easy access to your useful classes anywhere in the application.

**Models**
---
They are responsible for the database access and the business logic with the help of [services](#services).

A model registration can be made by using the `MODEL` [container](#containers).
First a class instance must be made with all required arguments and then registered in the container.

```
app.get("MODEL").set(new UserModel(app));
```

Model is accessed from the `MODEL` container.

```
app.get("MODEL").get("UserModel");
```

This will return `UserModel` object registered earlier.
No matter how much times a service is requested it will always return object from same reference.

Notice:

* Each application model must extend the base model class `src/server/core/model`.
* Use models from the `MODEL` [container](#containers) avoid doing model instantiation if not necessary, this must be done only on server boot time.
* Never pass not validated data to the model.

**Controllers**
---

Processing client request and returning appropriate response. A controller is composite from actions.

Each action takes 3 parameters.

*  req. Request object.
*  res. Response object.
*  next. Function for calling next middleware.


***Request***

Commonly used properties:

* req.file/s - Client uploaded files. See [files](#file-upload)
* req.query - Query parameters. `?example=1`
* req.body - Client POST/PUT data
* req.params - URL parameters. `/example/:id`

***Response***

After extending the base controller class a method called `response` will be available.
It is used for standardizing the response.

```
  /**
   * @var object res Action response object
   * @var object data Data to be send back to client. Default {}
   * @var integer status_code HTTP status code. Default 200
   */
  response(res, data, status_code)
```

The usage of it will be like this:

```
    return this.response(res, {
        items: []
    });
```

***Error***

The error response is standardized from a middleware located in `src/server/middlewares/error.js`
An error could be thrown by using the `next()` and passing a `Boom` error as an argument.

```
return next(Boom.forbidden());
```

Unhandled errors or errors thrown without `Boom` will be processed from the middleware passing `400 Bad Request.` to client and response data.

```
"statusCode": 400
```

***Validation***

Client input data validation is done in the routes file as a middleware using `Joi`.

```
let
  Joi = require('joi'),
  validation = require("./../../../middlewares/validation");

  /** ... */

  app.post(
  "/sign-in", 
  
  validation.bind(
    null,
    Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    }),
    "body"
  ),
  
  itemController.listAction);
```

When adding validation you are passing two arguments.

* Joi schema
* Where to look for the client data that must be validated.
  Possible values are: `body`, `query`, `params`

***Multiple validation***

Different type (`body`, `query`, `params`) validations can be set for a route.

```
let
  Joi = require('joi'),
  validation = require("./../../../middlewares/validation");

  /** ... */

  app.post(
  "/sign-in", 
  
  validation.bind(
    null,
    Joi.object().keys({
      sid: Joi.string().required()
    }),
    "query"
  ),
  
  validation.bind(
    null,
    Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    }),
    "body"
  ),
    
  itemController.listAction);
```

so in order to enter `listAction` first the request must have a query parameter `sid` and post data that have `username` and `password` in it.

```
[POST] /sign-in?sid=xxx
username=someone
password=passw0rD
```

**Containers**
---
Container is a registry for objects from a certain type under one domain and by using it you don't need to import and instantiate any modules.

***Usage***

By default the framework comes with 2 containers.

*  `MODEL` References of [models](#models).

Setting an object in `MODEL` is done by:
```
app.get("MODEL").set(new ExampleModel(app);
```

And getting an object from `MODEL`:
```
app.get("MODEL").get("ExampleModel");
```

*  `SERVICE` References of [services](#services)

Setting an object in `SERVICE` is done by:
```
app.get("SERVICE").set(new ExampleService(app);
```

And getting an object from `SERVICE`:
```
app.get("SERVICE").get("ExampleService");
```

***Creating a container***

Creating and setting up a container doesn't take much effort.

First you need to create your container class in `/src/server/containers/`:
```
let container = require("./container");

class ExampleContainer extends container {
  constructor(app) {
    super(app);
    this.container_name = "EXAMPLE";
  }
}

module.exports = ExampleContainer;
```

Extend the base container class and set `this.container_name` property with a name used later for accessing the container with `app.get("EXAMPLE")`.
Additionally you can implement your own methods and use them like that `app.get("EXAMPLE").myCustomMethod()`.

After the container is ready it is time to register it in `/src/server/containers.json`. 
The common way to use a container is in a module entry file.

**File upload**
---
Uploading is done using `https://www.npmjs.com/package/multer`.
Configuration can be found in `/boot/server.js`.

Enable file upload for specific route with multer middleware.
```
  app.post('/example-image',
    app.get("multer").single('image'),
    itemController.uploadItemAction
  );
```
___Be aware that the send request must be `multipart/form-data`.___

After the request is send the newly uploaded files are saved in `/public/uploads/` directory 
and multer adds an object (`file`/`files`) to current request containing info data for the file. 
See [request](#request)

**Migrations**
---

Keep database changes in control between environments.

Writing a migration:
```
module.exports = {
  up: "SQL COMMAND",
  down: "SQL ROLLBACK COMMAND"
};
```

`up` - SQL query for changing database
`down` - SQL query for undoing changes made to database
 
The `down` method is useful when after a broken deployment happen and you need to reverse the codebase and therefore the database to previous version.

***Keeping track of the migrations***

Registering a migration is done in `/src/server/migrations.json` after the latest executed migration or at the bottom of the file.
If you place it for example before the `latest` your new migration will be not executed automatically therefore you will need to run it manually.

Latest executed migration and history about all migration executions are kept in `/var/migration.json`

***Migration script***

Migrations are run through CLI.

 *  Automatically run all migrations `up` actions after the `latest` one.
```$ node bin/migration.js```

 *  Run `up` action of the next migration and set it as `latest`.
```$ node bin/migration.js up```

 *  Run exact migration and save it only in migration history, it will be not set as `latest`.
```$ node bin/migration.js up "/path/to/migration"```

 *  Run previous executed migration and sets the next previous as `latest`.
```$ node bin/migration.js down```

 *  Run exact migration and save it only in migration history, it will be not set as `latest`.
```$ node bin/migration.js down "/path/to/migration"```

***Migration script on test environment***

Tests are run on a test database so in order to keep it up to date you must tell the migration script which database to update.
This is done by passing `test` as a flag.

```$ node bin/migration.js --test```

**Webpack**
---
The framework comes with fully configured webpack for compiling the front-end.

Supports

* babel for supporting latest js & react
* stylus with nib support
* jsx
* minifications
* css class prefixes
* different environments

The configurations can be found in `webpack.config.js` & `.babelrc`
 
***React***

As a front-end framework is used react and the source files can be found in `/src/client/`.
They are two folders which represents the client environments `desktop` and `mobile`.

***Compiling***

CSS and JS files are compiled in `/public/assets/dist/`.
The file names are generated from the (client environment folder name) + (version hash).
If compiling is started in production environment a `minification` & `optimization` of the assets are done.

***Command***

webpack can be start from the command
```
$ npm run webpack
```

**Device detection**
---
Detecting client device is done by using the `clientDevice` middleware on any route you want.

For example:

```
app.get("/",
  clientDevice,
  homeController.homeAction
);
```

to the request will be passed:

* device. Response from [mobile-detect](https://www.npmjs.com/package/mobile-detect)
* is_mobile. Boolean that tells if client device is mobile. 

___Notice that tablets are considered mobile too.___
___This rule could be changed from `/src/server/middlewares/clientDevice.js`___

**Language**
---
Language support is available on every route by using the `language` middleware.
Before setting up the middleware you must know that by default language support is not enabled.

***Enable***

* Set `ENABLE_MULTILANGUAGE` to `true` in `.env` file.

* Setting up the available languages is done in `/boot/language.js`.
They could be dynamic too, for example if they are fetched from API.

* Set the `language` middleware on any route where multilanguage support is need it.

For example:

```
app.get("/",
  language,
  homeController.homeAction
);
```

***Default language***

You can set a default language by changing the `is_default` property to `true` for your specific language in `/boot/language.js`. 

___Note: Only one language can be set as default.___

When requesting the default language subdomain you will be redirected to the root domain.
Example: `en.example` (301 Moved Permanently) -> `example`

***Changing language***

You can change the language by passing the query parameter `lang` in the URL.
The value passed must be a language code (`code` property) from the available language codes in `/boot/language.js`.
Example: `example?lang=en_GB`

The language for new clients is determined by:
- accessing the root domain (`example`): The language is based on the ip geolocation of the client.
- accessing a subdomain (`es.example`): The language is based on the subdomain and will be used from here onwards.

---

https://github.com/Codenetz/codew