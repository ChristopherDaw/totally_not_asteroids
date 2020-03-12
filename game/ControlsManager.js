var ControlsManager = {
        /* TODO add an event handler to clamp the player location to remain in the screen space */

    init: function (self){
        //Handle all key strokes
        window.addEventListener("keydown", function (event) {
            var keyCode = event.keyCode;
            switch (keyCode) {
            case 39:
            case 68: //d or right
                self.translateVector[0] = 5;
                break;
            case 37:
            case 65: //a or left
                self.translateVector[0] = -5;
                break;
            case 38:
            case 87: //w or up
                self.translateVector[1] = -.08;
                break;
            }
        }, false);
        window.addEventListener("keyup", function (event) {
            var keyCode = event.keyCode;
        
            switch (keyCode) {
            case 39:
            case 68: //d or right
                self.translateVector[0] = 4.85;
                break;
            case 37:
            case 65: //a or left
                self.translateVector[0] = -4.85;
                break;
            case 38:
            case 87: //w or up
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
