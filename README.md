**Express React boilerplate**
---

**Setup**
---

```
$ nvm install 9.4.0 
```

```
$ nvm use 9.4.0
```

```
$ cp dist.env .env
```

```
$ cp dist.env.test .env.test
```

Run tests
```
$ npm test
```

Run express server
```
$ npm start
```

**Includes**
---

- https://www.npmjs.com/package/express
- https://www.npmjs.com/package/helmet
- https://www.npmjs.com/package/eslint
- https://www.npmjs.com/package/eslint-plugin-react
- https://www.npmjs.com/package/morgan
- https://www.npmjs.com/package/dotenv
- https://www.npmjs.com/package/mysql2

**Architecture**
---

_/boot_
Holds modules for initialization the app.

_/public_
All public accessible resources like images, css, js, etc ...

_/src_
Frontend and backend source code of an application.

_/src/client/_
React frontend.

_/src/server/_
Application API.

_/src/server/modules/core/controller.js_
Each controller could extend it to get some extras.

Controllers that extends the base will have the server application instance available through `this.app` 
and all controller actions will have the current controller instance through `this`

_/test_
Test cases.

_/app.js_
Main app file

_/dist.env_
Default environment constants.
Must copy from dist.env to .env in order to work.
 
_/.env_
Environment file for describing environment specific constants.
It could contain different values on production/development/local server.

_/.eslintrc.js_
Configurations of eslint.

_/.eslintignore_
Ignore file of eslint.

_/var/migration.json_
Tracks migration activity.

Properties

- latest
The last migration done when using the automatic, up or down methods alone.
When using the command with second argument (file path), the prop is not updated.

- history
Tracks all the migration history. It has props: action, query, migration_path, error, time

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
For an example you can view `/src/server/Modules/Example` module

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

__Standardize response across actions.__

- response. Default status code 200.

res [object][required] - Express response object
data [object][optional] - Pass data back to client. Default "{}"
status_code [integer][optional] - Set HTTP status code. Default "200"

```
this.response(res, data, status_code);
```

- responseError. Default status code 400.

res [object][required] - Express response object
message [string][optional] - Error message. Default ""
errors [array][optional] - Array of error objects (see "createError"). Default "[]"
status_code [integer][optional]- Set HTTP status code. Default "400"

```
this.responseError(res, message, errors, status_code)
```

- responseBadRequest. Status code 400.

res [object][required] - Express response object
message [string][optional] - Error message. Default ""
errors [array][optional] - Array of error objects (see "createError"). Default "[]"

```
this.responseBadRequest(res, message, errors)
```

- responseUnauthorized. Status code 401.

res [object][required] - Express response object
message [string][optional] - Error message. Default ""
errors [array][optional] - Array of error objects (see "createError"). Default "[]"

```
this.responseBadRequest(res, message, errors)
```

- responseForbidden. Status code 403.

res [object][required] - Express response object
message [string][optional] - Error message. Default ""
errors [array][optional] - Array of error objects (see "createError"). Default "[]"


```
this.responseBadRequest(res, message, errors)
```

- responseNotFound. Status code 404.

res [required] - Express response object
message [optional] - Error message. Default ""
errors [optional] - Array of error objects (see "createError"). Default "[]"

```
this.responseBadRequest(res, message, errors)
```

- Create error objects.

prop [string][required] - Error property name
message [string][optional] - Error message. Default ""
reason [string][optional] - Error reason. Default ""

```
createError(prop, message, reason);
```

**TODO**
---
- Socket
- Tests
- JWT
- Docs how can be set with nginx
- Useful libs
- Clean the code in `/src/server/lib/migration.js` & `/bin/migration.js`
- Maybe think about a SQL query builder
- API documentator
-   // Remove memory-leak warning about max listeners
    // See: http://nodejs.org/docs/latest/api/events.html#events_emitter_setmaxlisteners_n
    this.setMaxListeners(0);