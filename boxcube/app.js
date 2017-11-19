var vertexShaderText =
[
    "precision mediump float;",
    "attribute vec3 vertPosition;",
    "attribute vec2 vertTexCoord;",
    "varying vec2 fragTexCoord;", // output from vertex
    "uniform mat4 mWorld;",
    "uniform mat4 mView;",
    "uniform mat4 mProj;",
    "void main() {",
    "    fragTexCoord = vertTexCoord;",
    "    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);", // operation from right to left. has to be this order. world > view > projection
    "}"
].join("\n");

var fragmentShaderText =
[
    "precision mediump float;",
    "varying vec2 fragTexCoord;",
    "uniform sampler2D sampler;",
    "void main() {",
    "    gl_FragColor = texture2D(sampler, fragTexCoord);",
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
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

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
    var boxVertices = 
    [ // X, Y, Z            u,v
        // Top
        -1.0, 1.0, -1.0,   0, 0,
        -1.0, 1.0, 1.0,    0, 1,
        1.0, 1.0, 1.0,     1, 1,
        1.0, 1.0, -1.0,    1, 0,

        // Left
        -1.0, 1.0, 1.0,    0, 0,
        -1.0, -1.0, 1.0,   1, 0,
        -1.0, -1.0, -1.0,  1, 1,
        -1.0, 1.0, -1.0,   0, 1,

        // Right
        1.0, 1.0, 1.0,     1, 1,
        1.0, -1.0, 1.0,    0, 1,
        1.0, -1.0, -1.0,   0, 0,
        1.0, 1.0, -1.0,    1, 0,

        // Front
        1.0, 1.0, 1.0,     1, 1,
        1.0, -1.0, 1.0,    1, 0,
        -1.0, -1.0, 1.0,   0, 0,
        -1.0, 1.0, 1.0,    0, 1,

        // Back
        1.0, 1.0, -1.0,    0, 0,
        1.0, -1.0, -1.0,    0, 1,
        -1.0, -1.0, -1.0,   1, 1,
        -1.0, 1.0, -1.0,    1, 0,

        // Bottom
        -1.0, -1.0, -1.0,   1, 1,
        -1.0, -1.0, 1.0,    1, 0,
        1.0, -1.0, 1.0,     0, 0,
        1.0, -1.0, -1.0,    0, 1,
    ];

    var boxIndices =
    [
        // Top
        0, 1, 2,
        0, 2, 3,

        // Left
        5, 4, 6,
        6, 4, 7,

        // Right
        8, 9, 10,
        8, 10, 11,

        // Front
        13, 12, 14,
        15, 14, 12,

        // Back
        16, 17, 18,
        16, 18, 19,

        // Bottom
        21, 20, 22,
        22, 20, 23
    ];

    var boxVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
    // bufferData will use whatever the active buffer is there, which means trangleVertexBufferObject for our code

    var boxIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    //tell vertex our triangleVertices
    var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    var texCoordAttribLocation = gl.getAttribLocation(program, "vertTexCoord");

    gl.vertexAttribPointer(
        positionAttribLocation, //attribute location
        3, // number of elements per attribute(x, y, z)
        gl.FLOAT, //Tyep of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,// Size of individule vertex
        0 // offset from beginning of  single vertex to this attribute
    );

    gl.vertexAttribPointer(
        texCoordAttribLocation, //attribute location
        2, // number of elements per attribute(r,g,b)
        gl.FLOAT, //Tyep of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,// Size of individule vertex
        3 * Float32Array.BYTES_PER_ELEMENT // offset from beginning of  single vertex to this attribute, skip two
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(texCoordAttribLocation);

    // create texture
    var boxTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE,
        document.getElementById("crate-image")
    );

    gl.bindTexture(gl.TEXTURE_2D, null);

    //tell OpenGL state machine which program to active
    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
    var matViewUniformLocation = gl.getUniformLocation(program, "mView");
    var matProjUniformLocation = gl.getUniformLocation(program, "mProj");

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);

    //identity, the normal matrix [1 0 0 0]
    //                            [0 1 0 0]
    //                            [0 0 1 0]
    //                            [0 0 0 1]
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -8], [0,0,0], [0,1,0]);
    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width/ canvas.height, 0.1, 1000);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    //main render loop
    var angle = 0;
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var loop = function() {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        //      ms since window started. -> s  2 rounds 

        mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        //                                              rotate on y axis
        mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
        mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);

        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        //clear bg before draw
        gl.clearColor(0.6, 0.6, 0.7, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.bindTexture(gl.TEXTURE_2D, boxTexture);
        gl.activeTexture(gl.TEXTURE0);

        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
};



