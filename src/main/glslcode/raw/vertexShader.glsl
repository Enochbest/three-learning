//高精度 highp -2^16 - 2^16
//中精度 mediump -2^10 - 2^10
//低精度 lowp -2^8 - 2^8
//告诉gpu进行进度计算
precision lowp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;


varying vec2 vUv;

varying float vElevation;


void main() {
    //将uv从顶点着色器传递到片元着色器中 需要在片源着色器中 varying vec2 vUv;声明变量
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    modelPosition.z = sin(modelPosition.x*10.0) * 0.05;
    modelPosition.z += sin(modelPosition.y*10.0) * 0.05;
    //将顶点的z轴数据传递,也就是高度
    vElevation = modelPosition.z;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}