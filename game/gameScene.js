var Game = function(canvas, gl) {
    this.cameraAngle = 0;
    //If we can only init this with a set num of objects we need to hide enemies off screen and cycle them in and out
    this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, LambertVertexSource, LambertFragmentSource);
    
    gl.enable(gl.DEPTH_TEST);
}

Game.prototype.render = function(canvas, gl, w, h) {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var projection = SimpleMatrix.perspective(45, w/h, 0.1, 100);
    
    var view = SimpleMatrix.rotate(this.cameraAngle, 1, 0, 0).multiply(
        SimpleMatrix.translate(0, 0, 6));
    
    //We need to add event handeling for these transformations to operate respective to input 
    var rotation = SimpleMatrix.rotate(Date.now()/25, 0, 1, 0);
    var cubeModel = SimpleMatrix.translate(0, 0, 0).multiply(rotation);

    //We also need to use a timer (like date about) and as time proceeds transform our enemy objects

    /*End of TODO before milestone*/

    //Create collision detection that we check every frame here

    //Implement game state that changes this whole render function depending on state

    this.cubeMesh.render(gl, cubeModel, view, projection);
}

