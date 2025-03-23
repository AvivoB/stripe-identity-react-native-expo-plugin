const { withPlugins } = require('@expo/config-plugins');
const { withStripeIdentity } = require('./plugin/withStripeIdentity');

module.exports = withPlugins(config => {
  return withStripeIdentity(config);
});