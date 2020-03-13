var FlatShadeSource = `#version 300 es

    uniform mat4 Model;
    uniform mat4 ModelViewProjection;
    uniform vec3 DisplayColor;

    in vec3 Position;
    in vec3 Normal;

    flat out vec3 Color;

    // Constants you should use to compute the final color
    const vec3 LightPosition = vec3(2, 2, -0.5);
    const vec3 LightIntensity = vec3(3);
    //const vec3 ka = 0.3*vec3(1, 0.5, 0.5);
    //const vec3 kd = 0.7*vec3(1, 0.5, 0.5);

    void main() {
        vec3 ka = 0.3*(1.0/255.0)*DisplayColor;
        vec3 kd = 0.7*(1.0/255.0)*DisplayColor;

        gl_Position = ModelViewProjection*vec4(Position,1.0);

        //Add ambient lighting to diffuse times light intensity (scaled by distance squared)
        //Multiplied by the max of the light direction dotted with our normal and 0.0 (no negative lights)

        //All model vectors are converted to world space using Model matrix
        Color = ka + kd * (LightIntensity / pow(distance(vec4(LightPosition,1.0), Model*vec4(Position,1.0)), 2.0)) 
        * max(dot(normalize(vec4(LightPosition,1.0) - Model*vec4(Position,1.0)), Model*vec4(Normal,0.0)), 0.0);
    }
`;
var FlatFragmentSource = `#version 300 es
    precision mediump  float;

    flat in vec3 Color;
    out vec4 fragColor;

    void main() {
        fragColor = vec4(Color[0], Color[1], Color[2], 1.0);
    }
`;

var LambertVertexSource = `
    uniform mat4 Model;
    uniform mat4 ModelViewProjection;
    uniform vec3 DisplayColor;

    attribute vec3 Position;
    attribute vec3 Normal;

    varying vec3 Color;

    // Constants you should use to compute the final color
    const vec3 LightPosition = vec3(0, 0, 0);
    const vec3 LightIntensity = vec3(40);
    //const vec3 ka = 0.3*vec3(1, 0.5, 0.5);
    //const vec3 kd = 0.7*vec3(1, 0.5, 0.5);
    vec3 ka = 0.3*(1.0/255.0)*DisplayColor;
    vec3 kd = 0.7*(1.0/255.0)*DisplayColor;

    void main() {
        gl_Position = ModelViewProjection*vec4(Position,1.0);

        //Add ambient lighting to diffuse times light intensity (scaled by distance squared)
        //Multiplied by the max of the light direction dotted with our normal and 0.0 (no negative lights)

        //All model vectors are converted to world space using Model matrix

        Color = ka + kd * (LightIntensity / pow(distance(vec4(LightPosition,1.0), Model*vec4(Position,1.0)), 2.0))
        * max(dot(normalize(vec4(LightPosition,1.0) - Model*vec4(Position,1.0)), Model*vec4(Normal,0.0)), 0.0);
    }
`;
var LambertFragmentSource = `
    precision highp float;

    varying vec3 Color;

    // TODO: Implement a fragment shader that copies Color into gl_FragColor
    // Hint: Color is RGB; you need to extend it with an alpha channel to assign it to gl_FragColor

    void main() {
        gl_FragColor = vec4(Color[0], Color[1], Color[2], 1.0);
    }
`;

function createShaderObject(gl, shaderSource, shaderType) {
    // Create a shader object of the requested type
    var shaderObject = gl.createShader(shaderType);
    // Pass the source code to the shader object
    gl.shaderSource(shaderObject, shaderSource);
    // Compile the shader
    gl.compileShader(shaderObject);

    // Check if there were any compile errors
    if (!gl.getShaderParameter(shaderObject, gl.COMPILE_STATUS)) {
        // If so, get the error and output some diagnostic info
        // Add some line numbers for convenience
        var lines = shaderSource.split("\n");
        for (var i = 0; i < lines.length; ++i)
            lines[i] = ("   " + (i + 1)).slice(-4) + " | " + lines[i];
        shaderSource = lines.join("\n");

        throw new Error(
            (shaderType == gl.FRAGMENT_SHADER ? "Fragment" : "Vertex") + " shader compilation error for shader '" + name + "':\n\n    " +
            gl.getShaderInfoLog(shaderObject).split("\n").join("\n    ") +
            "\nThe shader source code was:\n\n" +
            shaderSource);
    }

    return shaderObject;
}
function createShaderProgram(gl, vertexSource, fragmentSource) {
    // Create shader objects for vertex and fragment shader
    var   vertexShader = createShaderObject(gl,   vertexSource, gl.  VERTEX_SHADER);
    var fragmentShader = createShaderObject(gl, fragmentSource, gl.FRAGMENT_SHADER);

    // Create a shader program
    var program = gl.createProgram();
    // Attach the vertex and fragment shader to the program
    gl.attachShader(program,   vertexShader);
    gl.attachShader(program, fragmentShader);
    // Link the shaders together into a program
    gl.linkProgram(program);

    return program;
}

function createVertexBuffer(gl, vertexData) {
    // Create a buffer
    var vbo = gl.createBuffer();
    // Bind it to the ARRAY_BUFFER target
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    // Copy the vertex data into the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
    // Return created buffer
    return vbo;
//#endif
}
function createIndexBuffer(gl, indexData) {
    // Create a buffer
    var ibo = gl.createBuffer();
    // Bind it to the ELEMENT_ARRAY_BUFFER target
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    // Copy the index data into the buffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    // Return created buffer
    return ibo;
}

var ShadedTriangleMesh = function(gl, vertexPositions, vertexNormals, indices, vertexSource, fragmentSource) {
    this.indexCount = indices.length;
    this.positionVbo = createVertexBuffer(gl, vertexPositions);
    this.normalVbo = createVertexBuffer(gl, vertexNormals);
    this.indexIbo = createIndexBuffer(gl, indices);
    this.shaderProgram = createShaderProgram(gl, vertexSource, fragmentSource);
}

ShadedTriangleMesh.prototype.render = function(gl, model, view, projection, color) {

    gl.useProgram(this.shaderProgram);

    // Assemble a model-view-projection matrix from the specified matrices

    var modelViewProjection = new SimpleMatrix();
    modelViewProjection = SimpleMatrix.multiply(projection, SimpleMatrix.multiply(view.inverse(), model))

    gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "Model"), false, model.transpose().m);


    // Pass matrix to shader uniform
    // IMPORTANT: OpenGL has different matrix conventions than our JS program. We need to transpose the matrix before passing it
    // to OpenGL to get the correct matrix in the shader.
    gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "ModelViewProjection"), false, modelViewProjection.transpose().m);

    gl.uniform3fv(gl.getUniformLocation(this.shaderProgram, "DisplayColor"), color);

    // OpenGL setup beyond this point
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexIbo);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionVbo);
    var positionAttrib = gl.getAttribLocation(this.shaderProgram, "Position");
    if (positionAttrib >= 0) {
        gl.enableVertexAttribArray(positionAttrib);
        gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalVbo);
    var normalAttrib = gl.getAttribLocation(this.shaderProgram, "Normal");
    if (normalAttrib >= 0) {
        gl.enableVertexAttribArray(normalAttrib);
        gl.vertexAttribPointer(normalAttrib, 3, gl.FLOAT, false, 0, 0);
    }

    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
}
