const GameState = {
    MENU: 'menu',
    GAME: 'game',
    END: 'End'
}

var Game = function (canvas, gl) {
    this.cameraAngle = 0;

    //Doing some testing, we can just use these as refrence to meshes and use the render function below multiple times
    //And get multiple renders of the same mesh
    this.sphereMesh = new ShadedTriangleMesh(gl, SpherePositions, SphereNormals, SphereTriIndices, LambertVertexSource, LambertFragmentSource);

    this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, LambertVertexSource, LambertFragmentSource);

    /*Initialize Controls of Player*/
    this.playerLocation = [0, 0, -6]; //starting location of the player, modified in runtime to hold current location
    this.playerRotation = 90; //starting angle of player in degrees (we only need one axis of rotation)
    this.translateVector = [0, 0, 0]; //Vector used to start what keys/buttons are being pressed the value stored is how much to move in next frame

    /*Initialize enemies*/
    this.enemies = []

    //Declare self for events since context switches to global inside of events
    var self = this;
    ControlsManager.init(self);

    //Initialize Game State

    this.state = GameState.MENU;

    gl.enable(gl.DEPTH_TEST);
}

//TODO: Edit shader code to allow for variable color (or textures??)
Game.prototype.render = function (canvas, gl, w, h) {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    switch (this.state) {
        case GameState.MENU:
            Menu();
            break;
        case GameState.GAME:
            var self = this;
            GameLogic(self, gl, w, h);
            break;
        case GameState.END:
            break;
    }
}

function Menu(){
    //If Menu not displayed, display menu
    //Hide controls
    if(document.getElementById("menu").style.display == "none"){
        document.getElementById("menu").style.display = "block";
        document.getElementById("controls").style.display = "none";
    }
}

function GameLogic(self, gl, w,h) {
    // now is in milliseconds
    var now = Date.now();

    var projection = SimpleMatrix.perspective(45, w / h, 0.1, 100);

    var view = SimpleMatrix.rotate(self.cameraAngle, 1, 0, 0).multiply(
        SimpleMatrix.translate(0, 0, 6));

    /* Player movement code */
    var angle = self.playerRotation + self.translateVector[0];
    var rotation = SimpleMatrix.rotate(angle, 0, 0, 1);

    //Calculate forward vector based on rotation
    //convert our angle to radians
    angle = angle * Math.PI / 180;
    var forwardVector = [Math.cos(angle) * self.translateVector[1], Math.sin(angle) * self.translateVector[1], 0]
    var playerTransform = SimpleMatrix.translate(self.playerLocation[0] + forwardVector[0], self.playerLocation[1] + forwardVector[1], self.playerLocation[2]).multiply(rotation);

    //Update player location and roation after transformation
    self.playerLocation[0] += forwardVector[0];
    self.playerLocation[1] += forwardVector[1];
    self.playerRotation += self.translateVector[0];


    //could add "momentum to movement" by removing key up/touch end events (ControlsManager)
    //and instead interpolating our translate vector to zero every frame here

    /* Enemy generation code */
    // spawn new enemy every 5 seconds (uses <= 15 because the render isn't called every millisecond)
    if (now % 5000 <= 15) {
        // New enemy
        //this.enemies.push(new Enemy([-10,0,-3], 0, [0,.1,0], now));
        //this.enemies.push(new Enemy([0,5,-3], 270, [0,.1,0], now));
        self.enemies.push(new Enemy(self.playerLocation, [0, .1, 0], now));
    }

    /* Enemy movement code */
    var enemyTransform;
    self.enemies.forEach(enemy => {
        // Delete enemies older than 10 seconds
        if (now - enemy.age > 5000) {
            //TODO: figure out a better way
            self.enemies.shift();
            //continue;
        }
        enemyTransform = enemy.translate;
        self.sphereMesh.render(gl, enemyTransform, view, projection);
    });

    //Create collision detection that we check every frame here

    //Implement game state that changes this whole render function depending on state

    self.cubeMesh.render(gl, playerTransform, view, projection);
}