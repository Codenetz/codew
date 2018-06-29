let path = require('path');
require("dotenv").config({path: path.resolve(process.cwd(), '.env.test')});

require('./lib/is');
require('./lib/controllerTest');

let app = require('./../boot/server').app;
require('./modules/user/actions/authentication')(app);
require('./modules/user/actions/signup')(app);