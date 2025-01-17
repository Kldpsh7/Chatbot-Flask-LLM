class Navbar {
    constructor(UIManager) {
        this.uiManager = UIManager;
        this.menu = this.uiManager.menu;
        this.hamburger = this.uiManager.hamburger;
        this.container = this.uiManager.container;
        this.state = true; // true = open, false = closed
        this.menuWidth = 0;
        this.containerWidth = this.container.clientWidth;
        this.NAV_AREA_LARGE = 20; // % of window width
        this.NAV_AREA_MEDIUM = 25; // % of window width
        this.NAV_AREA_SMALL = 60; // % of window width
        this.ANIMATION_STEP = 5; // pixels per frame
    }

    calculateNavArea() {
        if (window.innerWidth > 785) {
            return window.innerWidth < 1100 
                ? window.innerWidth * (this.NAV_AREA_MEDIUM / 100)
                : window.innerWidth * (this.NAV_AREA_LARGE / 100);
        }
        return window.innerWidth * (this.NAV_AREA_SMALL / 100);
    }

    toggleState() {
        if (this.state) {
            this.nav.close();
        } else {
            this.nav.open();
        }
        this.state = !this.state;
    }

    animateNav(action) {
        if (action === 'open' && this.menuWidth < this.navArea) {
            this.menuWidth += this.ANIMATION_STEP;
        } else if (action === 'close' && this.menuWidth > 0) {
            this.menuWidth -= this.ANIMATION_STEP;
        } else {
            return; // Stop animation
        }

        this.menu.style.width = `${this.menuWidth}px`;
        if(window.innerWidth>775){
            this.container.style.width = `${this.containerWidth - this.menuWidth}px`;
            this.container.style.left = `${this.menuWidth}px`;
        }
        requestAnimationFrame(() => this.animateNav(action));
    }

    run() {
        this.navArea = this.calculateNavArea();
        this.nav = {
            open: () => this.animateNav('open'),
            close: () => this.animateNav('close'),
        };

        if (window.innerWidth <= 785) {
            this.state = false;
        } else {
            this.nav.open();
        }

        this.hamburger.addEventListener('click', () => this.toggleState());
    }
}

export default Navbar