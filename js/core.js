const root = document.querySelector("#root");

const canvas  = document.createElement("canvas");
canvas.width  = 400;
canvas.height = 400;

const gl = canvas.getContext("webgl");

if (!gl) {
    alert("WebGL Not supported");
}
root.appendChild(canvas);


/*
This vectex data will be passed over to one of the buffers in the GPU
*/
const vertexData = [
    0,  1, 0,   // Top Side of triangle [x,y,z] coordinates
    1, -1, 0,  //  Bottom Right  side of the triangle [x,y,z] coordinates
   -1, -1, 0  //   Bottom Left  side of the triangle [x,y,z] coordinates
];

const colorData = [
    1, 0, 0,  //v1.color
    0, 1, 0, // v2.color
    0, 0, 1 //  v3.color

];


//Creating and binding vertex buffer
const positionBuffer = gl.createBuffer();
//Binding the above newly created buffer to ARRAY buffer
//This is basically telling openGL that the buffer contains array data
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

//Now pushing our vertex data into the binded buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);



//Creating and binding colorData Buffer
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);





//Creating shaders

//Vertex Shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;

varying vec3 vColor;


void main(){
    vColor = color;
    gl_Position = vec4(position,1); 
}
`);
gl.compileShader(vertexShader);


//Fragment Shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 vColor;
void main(){
    gl_FragColor = vec4(vColor, 1.0);
}    
`);
gl.compileShader(fragmentShader);


//Creating a progrma to be executed on the GPU
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);


//Enabling attributes, These attributes includes position, color or any other related important data
const positionLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//After enabling the attribute, we tell webGL how it should retrieve/load data from the currently bound buffer
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);



//Enabling attributes, These attributes includes position, color or any other related important data
const colorLocation = gl.getAttribLocation(program, "color");
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
//After enabling the attribute, we tell webGL how it should retrieve/load data from the currently bound buffer
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);



//let openGL know which program to use
gl.useProgram(program);

gl.drawArrays(gl.TRIANGLES,0, 3);