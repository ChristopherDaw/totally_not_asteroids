const GameState = {
    MENU: 'menu',
    GAME: 'game',
    END: 'End'
}

var Game = function (canvas, gl) {
    this.cameraAngle = 0;

    readobj("bunny.obj");

    //Doing some testing, we can just use these as refrence to meshes and use the render function below multiple times
    //And get multiple renders of the same mesh
    this.sphereMesh = new ShadedTriangleMesh(gl, SpherePositions, SphereNormals, SphereTriIndices, LambertVertexSource, LambertFragmentSource);

    this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, LambertVertexSource, LambertFragmentSource);

    /*Initialize Controls of Player*/
    this.playerColor = [124, 254, 240];
    this.playerLocation = [0, 0, -6];       //starting location of the player, modified in runtime to hold current location
    this.playerRotation = 90;               //starting angle of player in degrees (we only need one axis of rotation)
    this.translateVector = [0, 0, 0];       //Vector used to start what keys/buttons are being pressed the value stored is how much to move in next frame

    this.playerCollisionBox = generateBoundingBox(CubePositions);  //Bounding box to detect collisions around player [min x, max x, min y, max y, min z, max z]
    //this.playerCollisionBox *= 0.7;                                //Scale the player bounding box to make it easier
    this.enemyCollisionBox = generateBoundingBox(SpherePositions); //Bounding box to detect collisions around enemy [min x, max x, min y, max y, min z, max z] 

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
            EndScreen();
            break;
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
    // spawn new enemy every 2.5 seconds (uses <= 15 because render isn't called every millisecond)
    if (now % 2500 <= 15) {
        // New enemy
        self.enemies.push(new Enemy(self.playerLocation, now));
    }

    /* Enemy movement code */
    var enemyTransform;
    self.enemies.forEach(enemy => {
        // Delete enemies older than 10 seconds
        if (now - enemy.age > 10000) {
            //TODO: figure out a better way
            self.enemies.shift();
            //continue;
        }
        enemyTransform = enemy.translate;
        
        self.sphereMesh.render(gl, enemyTransform, view, projection, enemy.color);

        //Detect if we are colliding with player
        if(BoxCollision(enemy.currentLocation, self.enemyCollisionBox, self.playerLocation, self.playerCollisionBox)){
            self.state = GameState.END;
            ResetGame(self);
        }
    });

    //Create collision detection that we check every frame here

    //Implement game state that changes this whole render function depending on state

    self.cubeMesh.render(gl, playerTransform, view, projection, self.playerColor);
}

function ResetGame (self){
    //Reset Player to defaults
    self.playerLocation = [0, 0, -6];       
    self.playerRotation = 90;               
    self.translateVector = [0, 0, 0];

    //Remove all enemies
    self.enemies = []
}
