import Settings from 'utils/Settings';

export default () => {
  if (Settings.GOOGLE_ANALYTICS_KEY.length <= 0) {
    return;
  }

  var e = document.createElement('script');
  e.type = 'text/javascript';
  e.async = !0;
  e.src =
    'https://www.googletagmanager.com/gtag/js?id=' +
    Settings.GOOGLE_ANALYTICS_KEY;
  var n = document.getElementsByTagName('script')[0];
  n.parentNode.insertBefore(e, n);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', Settings.GOOGLE_ANALYTICS_KEY);
};
