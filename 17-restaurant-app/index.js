/**
 * @format
 */

import { AppRegistry, LogBox } from 'react-native';

// In development we may see deprecation warnings coming from transitive
// dependencies (e.g. InteractionManager). To avoid noisy logs during
// development we disable all yellow box warnings here. This is a dev-only
// workaround — prefer updating the offending packages in the long term.
LogBox.ignoreAllLogs(true);

import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
