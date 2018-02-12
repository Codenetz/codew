"use strict";

module.exports = (app) => {

  let sitemapService = new (require("./service/sitemapService"))(app);

  app.get("SERVICE").set(sitemapService);
};