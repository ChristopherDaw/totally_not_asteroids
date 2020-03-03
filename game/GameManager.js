var Game = function(canvas, gl) {
    this.cameraAngle = 0;

    //Doing some testing, we can just use these as refrence to meshes and use the render function below multiple times
    //And get multiple renders of the same mesh
    this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, LambertVertexSource, LambertFragmentSource);
    
    /*Initialize Controls of Player*/
    this.playerLocation = [0,0,-3]; //starting location of the player, modified in runtime to hold current location
    this.playerRotation = 90;       //starting angle of player in degrees (we only need one axis of rotation)
    this.translateVector = [0,0,0]; //Vector used to start what keys/buttons are being pressed the value stored is how much to move in next frame
    //Declare self for events since context switches to global inside of events
    var self = this;

    ControlsManager.init(self);
    
    gl.enable(gl.DEPTH_TEST);
}

Game.prototype.render = function(canvas, gl, w, h) {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var projection = SimpleMatrix.perspective(45, w/h, 0.1, 100);
    
    var view = SimpleMatrix.rotate(this.cameraAngle, 1, 0, 0).multiply(
        SimpleMatrix.translate(0, 0, 6));
    
        /* Player movement code */
    var angle = this.playerRotation + this.translateVector[0];
    var rotation = SimpleMatrix.rotate(angle, 0, 0, 1);

    //Calculate forward vector based on rotation
    //convert our angle to radians
    angle = angle * Math.PI / 180;
    var forwardVector= [Math.cos(angle) * this.translateVector[1], Math.sin(angle) * this.translateVector[1],0]
    var playerTransform = SimpleMatrix.translate(this.playerLocation[0] + forwardVector[0], this.playerLocation[1] + forwardVector[1], this.playerLocation[2]).multiply(rotation);
    
    //Update player location and roation after transformation
    this.playerLocation[0] += forwardVector[0];
    this.playerLocation[1] += forwardVector[1];
    this.playerRotation += this.translateVector[0];

    /* Todo before milestone */

    //could add "momentum to movement" by removing key up/touch end events (ControlsManager) 
    //and instead interpolating our translate vector to zero every frame here

    //We also need to use a timer (like date above) and as time proceeds transform our enemy objects/render new ones

    /*End of TODO before milestone*/
    
    
    //Create collision detection that we check every frame here

    //Implement game state that changes this whole render function depending on state

    this.cubeMesh.render(gl, playerTransform, view, projection);
}

