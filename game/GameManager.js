const GameState = {
    MENU: 'menu',
    GAME: 'game',
    END: 'End'
}

var Game = function (canvas, gl) {
    this.scores = ['CJD10000', 'CCC7000', 'AJD50', 'SWW20', 'BJH10'];
    makeLeaderboard(this);

    this.cameraAngle = 0;

    var playerObj = readobj("player.obj");
    var playerPositions = playerObj[0];
    var playerNormals = playerObj[1];
    var playerTriIndices = playerObj[2];

    var enemyObj = readobj("enemy.obj");
    var enemyPositions = enemyObj[0];
    var enemyNormals = enemyObj[1];
    var enemyTriIndices = enemyObj[2];


    //Doing some testing, we can just use these as refrence to meshes and use the render function below multiple times
    //And get multiple renders of the same mesh
    this.enemyMesh = new ShadedTriangleMesh(gl, enemyPositions, enemyNormals, enemyTriIndices, FlatShadeSource, FlatFragmentSource);

    //this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, LambertVertexSource, LambertFragmentSource);
    this.playerMesh = new ShadedTriangleMesh(gl, playerPositions, playerNormals, playerTriIndices, FlatShadeSource, FlatFragmentSource);

    this.sphereMesh = new ShadedTriangleMesh(gl, SpherePositions, SphereNormals, SphereTriIndices, FlatShadeSource, FlatFragmentSource);

    /*Initialize Controls of Player*/
    this.playerScaleMatrix = SimpleMatrix.scale(0.5, 0.5, 0.5);
    this.playerColor = [255,255,255];
    this.playerLocation = [0, 0, -6]; //starting location of the player, modified in runtime to hold current location
    this.playerInitialRotation = 90;  //starting angle of player in degrees (we only need one axis of rotation)
    this.playerRotation = 0;
    this.translateVector = [0, 0, 0]; //Vector used to start what keys/buttons are being pressed the value stored is how much to move in next frame

    this.playerCollisionBox = generateBoundingBox(playerPositions, 0.5); //Bounding box to detect collisions around player [min x, max x, min y, max y, min z, max z]
    //Scale our player collision box to make easier for player
    for(var i = 0; i < this.playerCollisionBox.length; i++){
        this.playerCollisionBox[i] *= 0.6;
    }

    this.enemyCollisionBox = generateBoundingBox(enemyPositions, 1);    //Bounding box to detect collisions around enemy [min x, max x, min y, max y, min z, max z]
    //Scale our enemy collision box to make easier for player
    for(var i = 0; i < this.enemyCollisionBox.length; i++){
        this.enemyCollisionBox[i] *= 0.85;
    }

    this.screenBounds = [-9.75,9.75,-4.85,4.85]                          //[min x, max x, min y, max y] initizliaed for standard 1080p screen dimensions
    //Scale our bounds from 1080p dimensions to current screen dimensions
    for(var i = 0; i < this.screenBounds.length; i++){
        this.screenBounds[i] *= ((window.innerWidth/window.innerHeight)/ 2.049092849519744 )
    }

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
    gl.clearColor(0.025,0.025,0.04, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var self = this;
    RenderBG(self, gl, w, h);

    switch (this.state) {
        case GameState.MENU:
            Menu();
            break;
        case GameState.GAME:
            GameLogic(self, gl, w, h);
            break;
        case GameState.END:
            EndScreen();
            break;
    }
}

function RenderBG(self, gl, w, h){
    var projection = SimpleMatrix.perspective(45, w / h, 0.1, 100);

    var view = SimpleMatrix.rotate(self.cameraAngle, 1, 0, 0).multiply(
        SimpleMatrix.translate(0, 0, 6));

    var rotation = SimpleMatrix.rotate(Date.now()/200, 0, 1, 0);
    var sphereModel = SimpleMatrix.translate(0, 0, -15).multiply(rotation).multiply(SimpleMatrix.scale(7, 7, 7));

    self.sphereMesh.render(gl, sphereModel, view, projection, [226,156,103]);
}
function GameLogic(self, gl, w,h) {
    // now is in milliseconds
    var now = Date.now();
    var gameTime = now - self.startTime;

    var projection = SimpleMatrix.perspective(45, w / h, 0.1, 100);

    var view = SimpleMatrix.rotate(self.cameraAngle, 1, 0, 0).multiply(
        SimpleMatrix.translate(0, 0, 6));

    //Interpolate our translation values to zero if not pressed
    //this creates the illusion of momentum
    if( self.translateVector[0] != 5 && self.translateVector[0] > 0)
        self.translateVector[0] -= 0.25;
    else if( self.translateVector[0] != -5 && self.translateVector[0] < 0)
        self.translateVector[0] += 0.25;

    if( self.translateVector[1] != -0.08 && self.translateVector[1] < 0)
        self.translateVector[1] += 0.001;


    // Player movement code
    // This also updates the player location
    var playerTransform = MovePlayer(self);

    UpdateScore(self, gameTime);

    /* Enemy generation code */
    SpawnEnemies(self, gameTime);

    /* Enemy movement code */
    var enemyTransform;
    self.enemies.forEach(enemy => {
        // Delete enemies older than 10 seconds
        if (gameTime - enemy.age > 10000) {
            //TODO: figure out a better way
            self.enemies.shift();
            //continue;
        }

        //Detect if we are colliding with player
        if(BoxCollision(enemy.currentLocation, self.enemyCollisionBox, self.playerLocation, self.playerCollisionBox)){
            updateLeaderboard(self);
            self.state = GameState.END;
            ResetGame(self);
        }

        enemyTransform = enemy.translate;

        self.enemyMesh.render(gl, enemyTransform, view, projection, enemy.color);
    });

    self.playerMesh.render(gl, playerTransform, view, projection, self.playerColor);
}

function UpdateScore(self, gameTime) {
    var scoreText = document.getElementById("score");

    var fiveminutes = 1000*60*5;
    var multiplier = Math.tanh(gameTime/fiveminutes);
    var score = Math.round((gameTime / 100) * multiplier);
    self.score = score;

    scoreText.innerText = "Score: " + score;
}

function SpawnEnemies(self, gameTime) {
    // spawn new enemy starting every 2.5 seconds decreasing over five minutes
    // to every every 1 second
    var fivemins = 1000 * 60 * 5
    var spawnRate = 2500 - (1500 * Math.tanh(gameTime/fivemins));
    spawnRate = Math.round(spawnRate);
    if (gameTime % spawnRate <= 15) {
        // New enemy
        self.enemies.push(new Enemy(self.playerLocation, gameTime));
    }
}

function MovePlayer(self) {
    var flip = SimpleMatrix.rotate(180, 1, 0, 0);
    var initialRotation = flip.multiply(SimpleMatrix.rotate(self.playerInitialRotation, 1, 0, 0));
    var angle = self.playerRotation + self.translateVector[0];
    var rotation = initialRotation.multiply(SimpleMatrix.rotate(angle, 0, 1, 0));

    //Calculate forward vector based on rotation
    //convert our angle to radians
    angle = -(90 + angle) * Math.PI / 180;
    var forwardVector = [Math.cos(angle) * self.translateVector[1], Math.sin(angle) * self.translateVector[1], 0]

    //Clamp our x and y positions within the screen bounds
    var clampedPositon = [Math.min(Math.max(self.playerLocation[0] + forwardVector[0], self.screenBounds[0]), self.screenBounds[1]),
                          Math.min(Math.max(self.playerLocation[1] + forwardVector[1], self.screenBounds[2]), self.screenBounds[3])];

    var playerTransform = SimpleMatrix.translate(clampedPositon[0], clampedPositon[1], self.playerLocation[2]).multiply(rotation).multiply(self.playerScaleMatrix);

    //Update player location and roation after transformation
    self.playerLocation[0] = clampedPositon[0];
    self.playerLocation[1] = clampedPositon[1];
    self.playerRotation += self.translateVector[0];


    return playerTransform;
}

function ResetGame (self){
    //Reset Player to defaults
    self.playerLocation = [0, 0, -6];
    self.playerRotation = 0;
    self.translateVector = [0, 0, 0];

    //Remove all enemies
    self.enemies = []
    //Add a delay to ensure our game is reloaded
    //Solves a glitch with momentum calculations
    setTimeout(function(){
        //Reset Player to defaults
        self.playerLocation = [0, 0, -6];
        self.playerRotation = 0;
        self.translateVector = [0, 0, 0];
    }, 500);
}

function updateLeaderboard(self) {
    var curScore = self.score;
    var hiscore = false;
    for (var i = 0; i < self.scores.length; i++) {
        var toBeat = parseInt(self.scores[i].substring(3,));
        if (curScore > toBeat) {
            hiscore = true;
            break;
        }
    }
    if (!hiscore) {
        return;
    }

    // Add listener to input and get user's name
    var input = document.getElementById("hiscore");
    var scorediv = document.getElementById("scoreblock");
    scorediv.style.display = "block";
    input.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();

            var initials = input.value;
            if (initials.length <= 3) {
                switch(initials.length) {
                    case 1:
                        initials = initials + "  ";
                        break;
                    case 2:
                        initials = initials + " ";
                        break;
                }
                console.log(initials);

                newScore = initials + self.score.toString();
                console.log(newScore);
                updateScores(self, newScore);

                makeLeaderboard(self);

                scorediv.style.display = "none";
                input.value = "";
            }
        }
    });

}

function updateScores(self, newScore) {
    var initials = newScore.substring(0,3);
    var score = parseInt(newScore.substring(3,));
    var prevScore = 0;
    for (var i = 0; i < self.scores.length; i++) {
        prevScore = parseInt(self.scores[i].substring(3,));

        if (score > prevScore) {
            console.log("updating score");
            var topPart = self.scores.slice(0,i);
            var bottomPart = self.scores.slice(i,self.scores.length-1);

            topPart.push(newScore);

            self.scores = topPart.concat(bottomPart);
            break;
        }
    }
}

function makeLeaderboard(self) {
    var table = document.getElementById("leaderboard");
    table.innerHTML = "";

    for (var i = 0; i < self.scores.length; i++) {
        var name = self.scores[i].substring(0,3);
        var score = self.scores[i].substring(3,);
        table.innerHTML += "<tr><td>" + name + "</td><td>" + score + "</td></tr>";
    }
}
