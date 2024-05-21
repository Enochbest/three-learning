
//进行低精度计算
precision lowp float;

varying vec2 vUv;
varying float vElevation;

uniform sampler2D uTexture;

void main() {
//    float height = vElevation + 0.05 * 10.0;
//    //利用传过来的z轴数据改变颜色明暗
//    gl_FragColor = vec4(1.0 *height,0.0, 0.0, 1);

    //根据Uv对传过来的纹理图片进行采样
    vec4 textureColor = texture2D(uTexture,vUv);
    float height = vElevation + 0.05 * 20.0;
    textureColor.rgb *= height;
    gl_FragColor = textureColor;
}