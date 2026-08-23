import {registerRootComponent} from 'expo';
import './layout-fix';
import './password-eye-fix';
import './image-zoom-fix';
import './oma-diili-v2';
import './settings-screen-fix';
import './map-crash-fix';

const App = require('./App').default;

registerRootComponent(App);
