var Game = function(canvas, gl) {
    this.cameraAngle = 0;
    this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, LambertVertexSource, LambertFragmentSource);
    
    gl.enable(gl.DEPTH_TEST);
}

Game.prototype.render = function(canvas, gl, w, h) {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var projection = SimpleMatrix.perspective(45, w/h, 0.1, 100);
    
    var view = SimpleMatrix.rotate(this.cameraAngle, 1, 0, 0).multiply(
        SimpleMatrix.translate(0, 0, 6));
        
    var rotation = SimpleMatrix.rotate(Date.now()/25, 0, 1, 0);
    var cubeModel = SimpleMatrix.translate(0, 0, 0).multiply(rotation);

    this.cubeMesh.render(gl, cubeModel, view, projection);
}

