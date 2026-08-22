const appJson = require('./app.json');

module.exports = () => {
  const config = JSON.parse(JSON.stringify(appJson.expo));
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  config.android = config.android || {};
  config.android.config = config.android.config || {};
  config.android.config.googleMaps = {
    apiKey: googleMapsApiKey,
  };

  return config;
};
