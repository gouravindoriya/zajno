// Default Vertex Shader
// precision highp float;


// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;

// varying vec3 vNormal;
varying vec2 vUv;

void main() {
    // vNormal = normal;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}