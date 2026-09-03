import {registerRootComponent} from 'expo';
import './layout-fix';
import './password-eye-fix';
import './image-zoom-fix';
import './diili-step-fix';
import './diili-rejected-step-fix';
import './oma-diili-v2';
import './profile-menu-tools';
import './restore-profile-sections';
import './support-screen-v2';
import './profile-edit-screen-v2';
import './map-crash-fix';
import './identity-verification';

const App = require('./App').default;

registerRootComponent(App);
