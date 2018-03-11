module.exports = (req, res, next) => {
  return res.render('index', {
    assetFileName: "app" + req.app.get("VERSION").hash,
    version_hash: req.app.get("VERSION").hash
  });
};