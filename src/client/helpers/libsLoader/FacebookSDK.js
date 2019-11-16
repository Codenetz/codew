import Settings from 'utils/Settings';

export default () => {
  if (Settings.FACEBOOK_APP_ID.length <= 0) {
    return;
  }

  window.fbAsyncInit = function() {
    // eslint-disable-next-line no-undef
    FB.init({
      appId: Settings.FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v4.0'
    });

    // eslint-disable-next-line no-undef
    FB.AppEvents.logPageView();
  };

  (function(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  })(document, 'script', 'facebook-jssdk');
};
