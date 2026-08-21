import {registerRootComponent} from 'expo';
import './layout-fix';
import './password-eye-fix';

const App = require('./App').default;

registerRootComponent(App);
