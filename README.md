**Codew**
---
Full-stack JavaScript framework build on top of [Express](https://expressjs.com/) with [MySQL](https://www.mysql.com/) database support and [React](https://reactjs.org/) for the user interface.

* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Version](#version)
* [Async/await](#async-await)
* [Modules](#modules)
* [Containers](#containers)


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
You can read more about it in [React](#react) section below.

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



**Containers**
---
For organization purposes each container must hold class instances of same type.

Containers:

*  `MODEL`
Holds all model objects from all modules. For example: UserModel, PersonModel, etc ...

*  `SERVICE`
Holds useful objects like siteMapService (generating sitemaps), mailService (sending emails), etc ...

_How to create custom container?_

1. Create container class in `/src/server/containers/`
2. Link the new class in `/src/server/containers.json`

That's all.

_How to add objects to containers?_

See how the model & service declarations for `example` module are done in `/src/server/modules/example/example.js` 


**Migrations**
---

Migration files must be created with this template:

```
module.exports = {
  up: "SQL COMMAND",
  down: "SQL COMMAND FOR REVERSE"
};
```

_Example_

```
let {USER_TABLE} = require("../constants/tables");

module.exports = {
  up: "ALTER TABLE " + USER_TABLE + " ADD COLUMN fname VARCHAR(30);",
  down: "ALTER TABLE " + USER_TABLE + " DROP COLUMN fname;"
};
```

_What is `/src/server/migrations.json`_ 
An array of migration file paths. The last item (at bottom) is the newest, so the queries will be executed from top to bottom.
 
_Usage of `/bin/migration.js`_

 *  Automatically call up action of __all__ newly added migrations
```node bin/migration.js``` Top to bottom.

 *  Call next up action from newly added migrations. Only 1 at a time is called. Top to bottom.
```node bin/migration.js up```

 *  Call specific up action from added migrations.
```node bin/migration.js up "/path/to/migration"```

 *  Call next down action from newly added migrations. Only 1 at a time is called. Bottom to top.
```node bin/migration.js down```

 *  Call specific down action from added migrations.
```node bin/migration.js down "/path/to/migration"```

**Controllers**
---

_action_ 
Each action takes 3 parameters.

    *  req. Request object.
    *  res. Response object.
    *  next. Call next middleware.

_response_ 

```
  /**
   * @var object res App response object
   * @var object data Data to be send back to client. Default {}
   * @var integer status_code HTTP status code. Default 200
   */
  response(res, data, status_code)
```

_errors_

Errors are thrown in `next()` using the `Boom` package.

```
return next(Boom.forbidden());
```

_validation_
Validations are done in `routes.js` using Joi and middleware for it.

```
let
  Joi = require('joi'),
  validation = require("./../../../middlewares/validation");

  /** ... */

  app.post("/example", validation.bind(null, Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
  })),
  itemController.listAction);
```

**File upload**
---
File upload is done using `https://www.npmjs.com/package/multer`

Example of how to use it.
```
  app.post('/example-image',
    app.get("multer").single('image'),
    itemController.uploadItemAction
  );
```

**Recommends**
- Usage of [async and await](#async-await)

**Some special paths**
---

_/public_
All public accessible resources like images, css, js, etc ...

_/src_
Frontend and backend source code of an application.

_/src/server/modules/core/controller.js_
Each controller could extend it to get some extras.

Controllers that extends the base will have the server application instance available through `this.app` 
and all controller actions will have the current controller instance through `this`

_/dist.env_
Default environment constants.
Must copy from dist.env to .env in order to work.
 
_/.env_
Environment file for describing environment specific constants.
It could contain different values on production/development/local server.

_/.env.test
Environment file for describing test environment specific constants.
It could contain different values on production/development/local server.

_/var/migration.json_
Tracks migration activity.

Properties

*  latest
The last migration done when using the automatic, up or down methods alone.
When using the command with second argument (file path), the prop is not updated.

*  history
Tracks all the migration history. It has props: action, query, migration_path, error, time

---

https://github.com/Codenetz/codew