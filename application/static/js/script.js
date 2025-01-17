import UIManager from "./components/uiManager.js";
import Navbar from "./components/navbar.js";
class App{
    constructor(){
        this.uiManager = new UIManager()
        this.navbar = new Navbar(this.uiManager);
    }
    run(){
        this.uiManager.run();
        this.navbar.run();
    }
}
const app = new App()
app.run();