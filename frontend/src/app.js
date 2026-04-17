import "./styles/style.scss";
import "./styles/adaptive.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import 'vanillajs-datepicker/dist/css/datepicker-bs5.min.css'
// import 'vanillajs-datepicker/dist/js/datepicker.min.js'
// import 'vanillajs-datepicker/dist/js/locales/ru.js'

import {Router} from "./router.js";

class App {
    constructor() {
        new Router();
    }
}

(new App());