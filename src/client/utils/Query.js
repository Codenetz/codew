class Query {
  static createPath({ pathName, parameters }) {
    const buildSearch = parameters => {
      return Object.keys(parameters).reduce((search, param) => {
        return typeof parameters[param] !== 'undefined'
          ? search + param + '=' + parameters[param] + '&'
          : search;
      }, '');
    };

    return (
      pathName + (parameters ? '?' + buildSearch(parameters).slice(0, -1) : '')
    );
  }

  static getAllParameters(query) {
    if (!query) query = window.location.search;
    if (!query) return {};

    return query
      .substr(1)
      .split('&')
      .reduce((parameters, param) => {
        param = param.split('=');
        parameters[param[0]] = param[1];
        return parameters;
      }, {});
  }

  static getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);

    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}

export default Query;
