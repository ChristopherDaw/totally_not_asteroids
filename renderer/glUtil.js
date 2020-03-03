function setupTask(canvasId, taskFunction, useGl) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.log("Could not find canvas with id", canvasId);
        return;
    }
    
    if (useGl) {
        try {
            var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        } catch (e) {}
        if (!gl) {
            console.log("Could not initialise WebGL");
            return;
        }
    }

    if (window.ismobile()) {
        var buttonDiv = `
            <div id="controls">
                <button id="up-button" class="controls-button">↑</button>
                <button id="left-button" class="controls-button">←</button>
                <button id="right-button" class="controls-button">→</button>
            </div>
        `;
        document.getElementById("controls").innerHTML = buttonDiv;
    }

    var renderWidth, renderHeight;
    function computeCanvasSize() {
        renderWidth = window.innerWidth;
        renderHeight =  window.innerHeight;
        canvas.width = renderWidth;
        canvas.height = renderHeight;
        if (gl)
            gl.viewport(0, 0, renderWidth, renderHeight);
    }

    window.addEventListener('resize', computeCanvasSize);
    computeCanvasSize();

    var task = new taskFunction(canvas, gl);

    var mouseDown = false;
    var lastMouseY;
    var mouseMoveListener = function(event) {
        task.dragCamera(event.screenY - lastMouseY);
        lastMouseY = event.screenY;
    };
    canvas.addEventListener('mousedown', function(event) {
        if (!mouseDown && event.button == 0) {
            mouseDown = true;
            lastMouseY = event.screenY;
            document.addEventListener('mousemove', mouseMoveListener);
        }
        event.preventDefault();
    });
    document.addEventListener('mouseup', function(event) {
        if (mouseDown && event.button == 0) {
            mouseDown = false;
            document.removeEventListener('mousemove', mouseMoveListener);
        }
    });

    var renderLoop = function() {
        task.render(canvas, gl, renderWidth, renderHeight);
        window.requestAnimationFrame(renderLoop);
    }
    window.requestAnimationFrame(renderLoop);

    return task;
}
