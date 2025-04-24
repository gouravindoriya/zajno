// Default fragment shader
precision mediump float;
uniform sampler2D uTexture;
uniform vec3 uColor;
varying vec2 vUv;
uniform vec2 uMouse;

void main() {
    float block=20.0;
    vec2 blockuV=floor(vUv*block)/block;
     vec2 mouse=vec2(0.5, 0.5);
    float distanse=length(blockuV-uMouse);
    float effect=smoothstep(0.4, 0., distanse);
    vec2 distortion=vec2(.03)*effect;
    vec4 texColor = texture2D(uTexture, vUv+distortion);
    gl_FragColor = texColor;
    // gl_FragColor = vec4(vUv+distortion, 0.0, 1.0);
}