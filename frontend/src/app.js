import "./styles/style.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {Router} from "./router.js";

class App {
    constructor() {
        new Router();
    }
}

(new App());