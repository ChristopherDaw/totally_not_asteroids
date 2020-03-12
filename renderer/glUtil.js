function setupTask(canvasId, taskFunction, useGl) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.log("Could not find canvas with id", canvasId);
        return;
    }
    
    if (useGl) {
        try {
            var gl = canvas.getContext("webgl2") || canvas.getContext("experimental-webgl");
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


    var renderLoop = function() {
        task.render(canvas, gl, renderWidth, renderHeight);
        window.requestAnimationFrame(renderLoop);
    }
    window.requestAnimationFrame(renderLoop);

    return task;
}
