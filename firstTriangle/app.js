var vertexShaderText =
[
    "precision mediump float;",
    "attribute vec2 vertPosition;",
    "attribute vec3 vertColor;",
    "varying vec3 fragColor;", // output from vertex
    "void main() {",
    "    fragColor = vertColor;",
    "    gl_Position = vec4(vertPosition, 0.0, 1.0);",
    "}"
].join("\n");

var fragmentShaderText =
[
    "precision mediump float;",
    "varying vec3 fragColor;",
    "void main() {",
    "    gl_FragColor = vec4(fragColor, 1.0);",
    "}"
].join("\n");

var initTrangle = function() {
    console.log("this is working");

    var canvas = document.getElementById("surface");
    var gl = canvas.getContext("webgl");
    // canvas.getContext(contextType, contextAttributes);
    // canvas.getContext('webgl', 
    //             { antialias: false,
    //               depth: false });

    if (!gl) {
        console.log("using experimental-webgl");
        canvas.getContext("experimental-webgl");
    }

    if (!gl) {
        alert("webgl not supported");
    }

    gl.clearColor(0.6, 0.6, 0.7, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // actual perfome the paint

    // create shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Error compile vertex shader", gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("Error compile fragment shader", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error link program", gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("Error validate program", gl.getProgramInfoLog(program));
        return;
    }

    // create buffer
    var triangleVertices = //trangle position
    [ // X, Y      R, G, B
        0.0, 0.5, 1.0, 1.0, 0.0,
        -0.5, -0.5, 0.7, 0.0, 1.0,
        0.5, -0.5, 0.1, 1.0, 0.6
    ];

    var trangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trangleVertexBufferObject);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW); 
    // bufferData will use whatever the active buffer is there, which means trangleVertexBufferObject for our code

    //tell vertex our triangleVertices
    var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    var colorAttribLocation = gl.getAttribLocation(program, "vertColor");

    gl.vertexAttribPointer(
        positionAttribLocation, //attribute location
        2, // number of elements per attribute(x, y)
        gl.FLOAT, //Tyep of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,// Size of individule vertex
        0 // offset from beginning of  single vertex to this attribute
    );

    gl.vertexAttribPointer(
        colorAttribLocation, //attribute location
        3, // number of elements per attribute(x, y)
        gl.FLOAT, //Tyep of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,// Size of individule vertex
        2 * Float32Array.BYTES_PER_ELEMENT // offset from beginning of  single vertex to this attribute, skip two
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    // main render loop
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};



