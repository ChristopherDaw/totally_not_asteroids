var ControlsManager = {
        /* TODO add an event handler to clamp the player location to remain in the screen space */

    init: function (self){
        //Handle all key strokes
        window.addEventListener("keydown", function (event) {
            var keyCode = event.keyCode;
            switch (keyCode) {
            case 68, 39: //d
                self.translateVector[0] = 1;
                break;
            case 65, 37: //a
                self.translateVector[0] = -1;
                break;
            case 87, 38: //w
                self.translateVector[1] = .05;
                break;
            }
        }, false);
        window.addEventListener("keyup", function (event) {
            var keyCode = event.keyCode;
        
            switch (keyCode) {
            case 68, 39: //d
                self.translateVector[0] = 0;
                break;
            case 65, 37: //a
                self.translateVector[0] = 0;
                break;
            case 87, 38: //w
                self.translateVector[1] = 0;
                break;
            }
        }
        , false);

        //Handle all phone buttons
        if(window.ismobile()){
            document.getElementById("right-button").addEventListener("touchstart", function (event) {
                self.translateVector[0] = 1;
            }
            , false);
            document.getElementById("left-button").addEventListener("touchstart", function (event) {
                self.translateVector[0] = -1;
            }
            , false);
            document.getElementById("up-button").addEventListener("touchstart", function (event) {
                self.translateVector[1] = .05;
            }
            , false);

            document.getElementById("right-button").addEventListener("touchend", function (event) {
                self.translateVector[0] = 0;
            }
            , false);
            document.getElementById("left-button").addEventListener("touchend", function (event) {
                self.translateVector[0] = 0;
            }
            , false);
            document.getElementById("up-button").addEventListener("touchend", function (event) {
                self.translateVector[1] = 0;
            }
            , false);
        }
    }
}