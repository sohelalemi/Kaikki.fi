import {registerRootComponent} from 'expo';
import './layout-fix';
import './password-eye-fix';
import './image-zoom-fix';
import './diili-fix';

const App = require('./App').default;

registerRootComponent(App);
