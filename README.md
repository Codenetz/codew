**Codew**
---
Full-stack JavaScript framework build on top of [Express](https://expressjs.com/) with [MySQL](https://www.mysql.com/) database support and [React](https://reactjs.org/) for the user interface.

**Prerequisites**
---
Dependencies:
- [Node.js](https://nodejs.org/en/) >= 9.4.0
- [MySQL](https://www.mysql.com/)

If you not familiar with [Express](https://expressjs.com/) it will be a good starting point to start from their documentation.

**Installation**
---

Clone repository in folder `codew`
```
git clone git@github.com:Codenetz/codew.git codew
```

Running the project requires `node >= 9.4.0`.
You could download [NVM](https://github.com/creationix/nvm) and use it like this:

```
$ nvm install 9.4.0 
```

```
$ nvm use 9.4.0
```
 
or if you have already installed required `node` you can continue to next step.

---

Setup environment with copying `dist.env` file to `.env`
`.env` file is marked in `.gitignore` so this way each environment will have it's own specific configurations.

```
$ cp dist.env .env
```

The test environment is used when running tests. For example you could have different database configurations if you don't want your tests to mess-up your application database.

```
$ cp dist.env.test .env.test
```

---

Read [Version](#version) section

```
$ cp dist.version .version
```

---

Install all need it dependencies.

```
$ npm install
```

---

This command will run the framework tests to make sure everything works correctly.

_You could skip this command if you like._

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

This command will build front-end assets from the example react source code in `./src/client`.
You could read more about it in [React](#react) section below.

_You could skip this command if you like._

```
$ npm run webpack
```

**Version**
---

`.version` holds current software version.

Used when
- building client side assets
- git tagging
- referencing

Format is `{major}.{minor}.{patch}`

Updating the version can be done from `node bin/version.js`

The version object can be accessed with `app.get("VERSION")` on server

**Modules**
---

The server is built up only from modules.
Advantages: 
- Code reuse between projects
- Logic separation
- More organized code
- Easy picking of which module to enable
 
Example of such modules could be:
- User
- Forum
- Shop
- Chat
- SEO

Each module has it's own MVC architecture and routes handler.

**Containers**
For organization purposes each container must hold class instances of same type.

Containers:

- `MODEL`
Holds all model objects from all modules. For example: UserModel, PersonModel, etc ...

- `SERVICE`
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

 - Automatically call up action of __all__ newly added migrations
```node bin/migration.js``` Top to bottom.

 - Call next up action from newly added migrations. Only 1 at a time is called. Top to bottom.
```node bin/migration.js up```

 - Call specific up action from added migrations.
```node bin/migration.js up "/path/to/migration"```

 - Call next down action from newly added migrations. Only 1 at a time is called. Bottom to top.
```node bin/migration.js down```

 - Call specific down action from added migrations.
```node bin/migration.js down "/path/to/migration"```

**Controllers**
---

_action_ 
Each action takes 3 parameters.
    - req. Request object.
    - res. Response object.
    - next. Call next middleware.

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

- latest
The last migration done when using the automatic, up or down methods alone.
When using the command with second argument (file path), the prop is not updated.

- history
Tracks all the migration history. It has props: action, query, migration_path, error, time

---

https://github.com/Codenetz/codew