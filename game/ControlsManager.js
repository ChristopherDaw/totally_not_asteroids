var ControlsManager = {
        /* TODO add an event handler to clamp the player location to remain in the screen space */

    init: function (self){
        //Handle all key strokes
        window.addEventListener("keydown", function (event) {
            var keyCode = event.keyCode;
            switch (keyCode) {
            case 68, 39: //d
                self.translateVector[0] = 5;
                break;
            case 65, 37: //a
                self.translateVector[0] = -5;
                break;
            case 87, 38: //w
                self.translateVector[1] = -.08;
                break;
            }
        }, false);
        window.addEventListener("keyup", function (event) {
            var keyCode = event.keyCode;
        
            switch (keyCode) {
            case 68, 39: //d
                self.translateVector[0] = 4.85;
                break;
            case 65, 37: //a
                self.translateVector[0] = -4.85;
                break;
            case 87, 38: //w
                self.translateVector[1] = -0.075;
                break;
            }
        }
        , false);

        //Handle all phone buttons
        if(window.ismobile()){
            document.getElementById("right-button").addEventListener("touchstart", function (event) {
                self.translateVector[0] = 5;
            }
            , false);
            document.getElementById("left-button").addEventListener("touchstart", function (event) {
                self.translateVector[0] = -5;
            }
            , false);
            document.getElementById("up-button").addEventListener("touchstart", function (event) {
                self.translateVector[1] = -.08;
            }
            , false);

            document.getElementById("right-button").addEventListener("touchend", function (event) {
                self.translateVector[0] = 4.85;
            }
            , false);
            document.getElementById("left-button").addEventListener("touchend", function (event) {
                self.translateVector[0] = -4.85;
            }
            , false);
            document.getElementById("up-button").addEventListener("touchend", function (event) {
                self.translateVector[1] = -0.075;
            }
            , false);
        }
    
        //Add listener to Start Button on Menu
        document.getElementById("start-button").addEventListener("click", function (event) {
            document.getElementById("menu").style.display = "none"
            document.getElementById("controls").style.display = "block"

            self.state = GameState.GAME;
        }
        , false);

        //Add listener to Restart Button on Menu
        document.getElementById("restart-button").addEventListener("click", function (event) {
            document.getElementById("end").style.display = "none"
            document.getElementById("controls").style.display = "block"

            self.state = GameState.GAME;
        }
        , false);

        //Add listener to Restart Button on Menu
        document.getElementById("menu-button").addEventListener("click", function (event) {
            document.getElementById("end").style.display = "none"
            document.getElementById("menu").style.display = "block"

            self.state = GameState.MENU;
        }
        , false);
    }
}
