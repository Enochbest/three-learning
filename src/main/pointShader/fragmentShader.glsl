uniform float uTime;
void main() {
    float strength = distance(gl_PointCoord,vec2(0.5));
    strength *= 2.0;
    strength = (1.0 - strength) * 1.5;
    gl_FragColor = vec4(1.0,0.0,0.0,strength*abs(sin(uTime * 2.0)));
}