
//进行低精度计算
precision lowp float;

varying vec2 vUv;
//获取原始着色器材质传入的时间
uniform float uTime;
void main() {

    //1.通过顶点对应的UV,决定每一个像素在UV图像的位置,通过这个位置(x,y)决定每一个像素颜色
//    gl_FragColor = vec4(vUv, 0.0, 1);

    // 2 对第一种进行变形
//    gl_FragColor = vec4(vUv, 1, 1);

    //3 利用uv实现渐变效果从左到右
//    float strength = vUv.x;
//    gl_FragColor = vec4(strength, strength,strength,1);

    //4 利用uv实现渐变效果从下到上
//    float strength = vUv.y;
//    gl_FragColor = vec4(strength, strength,strength,1);

    //5 利用uv实现渐变效果从上到下
//    float strength = 1.0 - vUv.y;
//    gl_FragColor = vec4(strength, strength,strength,1);

    //6 通过取模达到反复渐变的效果
//    float strength = mod(vUv.y * 10.0,1.0);
//    gl_FragColor = vec4(strength, strength,strength,1);

    //7 通过step函数达到斑马条纹效果step(edge,x)如果 x < edge,返回0.0,否则返回1.0
//    float strength = mod(vUv.y * 10.0,1.0);// 0 - 1 的范围
//    strength = step(0.5,strength);
//    gl_FragColor = vec4(strength, strength,strength,1);

    //8 通过step函数达到斑马条纹效果step(edge,x)如果 x < edge,返回0.0,否则返回1.0
//    float strength = mod(vUv.y * 10.0,1.0);// 0 - 1 的范围
//    strength = step(0.8,strength);
//    gl_FragColor = vec4(strength, strength,strength,1);

    //9 通过step函数达到斑马条纹效果step(edge,x)如果 x < edge,返回0.0,否则返回1.0
//    float strength = mod(vUv.x * 10.0,1.0);// 0 - 1 的范围
//    strength = step(0.8,strength);
//    gl_FragColor = vec4(strength, strength,strength,1);


    //10 条纹相加
//        float strength = step(0.8,mod(vUv.x * 10.0,1.0));
//        strength += step(0.8,mod(vUv.y * 10.0,1.0));
//        gl_FragColor = vec4(strength, strength,strength,1);

    //11条纹相乘

//            float strength = step(0.8,mod(vUv.x * 10.0,1.0));
//            strength *= step(0.8,mod(vUv.y * 10.0,1.0));
//            gl_FragColor = vec4(strength, strength,strength,1);

//    //12条纹相减
//
//    float strength = step(0.8,mod(vUv.x * 10.0,1.0));
//    strength -= step(0.8,mod(vUv.y * 10.0,1.0));
//    gl_FragColor = vec4(strength, strength,strength,1);

    //13条纹方块
//    float strength = step(0.2,mod(vUv.x * 10.0,1.0));
//    strength *= step(0.2,mod(vUv.y * 10.0,1.0));
//    gl_FragColor = vec4(strength, strength,strength,1);

    //14T形图和移动
//    float barx = step(0.4,mod((vUv.x + uTime * 0.1)* 10.0,1.0)) * step(0.8,mod(vUv.y * 10.0,1.0));
//    float barx = step(0.4,mod(vUv.x * 10.0 - 0.2,1.0)) * step(0.8,mod(vUv.y * 10.0,1.0));
//    float bary = step(0.4,mod(vUv.y * 10.0,1.0)) * step(0.8,mod(vUv.x * 10.0,1.0));
//    float strength = barx + bary;
//    gl_FragColor = vec4(strength, strength,strength,1);
//    gl_FragColor = vec4(vUv,strength,1);


    //15利用绝对值打造镜像效果
    //    float barx = step(0.4,mod((vUv.x + uTime * 0.1)* 10.0,1.0)) * step(0.8,mod(vUv.y * 10.0,1.0));
    float strength = abs(vUv.x- 0.5);
    gl_FragColor = vec4(strength, strength,strength,1);
}