
//进行低精度计算
precision lowp float;

varying vec2 vUv;
//获取原始着色器材质传入的时间
uniform float uTime;

#define PI 3.1415926

//声明随机函数
float random (vec2 st) {
    return fract(sin(dot(st.xy,
    vec2(12.9898,78.233)))*
    43758.5453123);
}

vec2 rotate(vec2 uv , float rotation,vec2 mid){
    return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y-mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x-mid.x) + mid.y
    );
}


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
//    float strength = abs(vUv.x- 0.5);
//    gl_FragColor = vec4(strength, strength,strength,1);

    //16min函数打造十字
//    float strength = min(abs(vUv.x - 0.5),abs(vUv.y - 0.5));
//    gl_FragColor = vec4(strength, strength,strength,1);

    //17max函数打造十字
//    float strength =1.0 - max(abs(vUv.x - 0.5),abs(vUv.y - 0.5));
//    gl_FragColor = vec4(strength, strength,strength,1);


    //19max step
//    float strength =step(0.4,max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));
//    gl_FragColor = vec4(strength, strength,strength,1);

    //20max step 小正方形
//    float strength = 1.0-step(0.2,max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));
//    gl_FragColor = vec4(strength, strength,strength,1);

    //21利用取整函数实现阶段性条纹渐变
//    float strength = floor(vUv.x * 10.0)/10.0;
//    float strength = floor(vUv.y * 10.0)/10.0;
//    float strength = floor(vUv.y * 10.0)/10.0 * floor(vUv.x * 10.0)/10.0;
//    gl_FragColor = vec4(strength, strength,strength,1);


    //22利用取整函数实现阶段性条纹渐变相乘实现渐变格子
//    float strength = floor(vUv.y * 10.0)/10.0 * floor(vUv.x * 10.0)/10.0;
//    gl_FragColor = vec4(strength, strength,strength,1);


    //23利用向上取整函数实现阶段性条纹渐变相乘实现渐变格子
//    float strength = ceil(vUv.y * 10.0)/10.0 * ceil(vUv.x * 10.0)/10.0;
//    gl_FragColor = vec4(strength, strength,strength,1);

    //24随机操作
//    float strength = random(vUv);
//    gl_FragColor = vec4(strength, strength,strength,1);


    //25随机格子效果
//    float strength = ceil(vUv.y * 10.0)/10.0 * ceil(vUv.x * 10.0)/10.0;
//     strength = random(vec2(strength,strength));
//    gl_FragColor = vec4(strength, strength,strength,1);


    //26依据length返回向量长度
//    float strength = length(vUv);
//    gl_FragColor = vec4(strength, strength,strength,1);


    //27根据distance计算两个向量的距离
//    float strength = 1.0 - distance(vUv,vec2(0.5,0.5));
//    gl_FragColor = vec4(strength, strength,strength,1);

            //28根据相除实现闪亮星星
//        float strength = 0.15/distance(vUv,vec2(0.5,0.5)) - 1.0;
//        gl_FragColor = vec4(strength, strength,strength,1.0);


    //28设置vUv水平或者竖直变量
//            float strength = 0.15/distance(vec2(vUv.x,(vUv.y-0.5)*5.0),vec2(0.5,0.5)) - 1.0;
//            gl_FragColor = vec4(strength,strength,strength,strength);


    //实现十字交叉星星
//    float strength = 0.15/distance(vec2(vUv.x,(vUv.y-0.5)*5.0 + 0.5),vec2(0.5,0.5)) - 1.0;
//    strength+= 0.15/distance(vec2((vUv.x-0.5)*5.0 + 0.5,vUv.y),vec2(0.5,0.5)) - 1.0;
//    gl_FragColor = vec4(strength,strength,strength,strength);

    //旋转函数的应用,旋转飞镖

        //实际上就是旋转的uv坐标
//        vec2 rotateUv = rotate(vUv,3.14*0.25,vec2(0.5,0.5));

//    vec2 rotateUv = rotate(vUv,uTime*5.0,vec2(0.5,0.5));
//    float strength = 0.15/distance(vec2(rotateUv.x,(rotateUv.y-0.5)*5.0 + 0.5),vec2(0.5,0.5)) - 1.0;
//        strength+= 0.15/distance(vec2((rotateUv.x-0.5)*5.0 + 0.5,rotateUv.y),vec2(0.5,0.5)) - 1.0;
//        gl_FragColor = vec4(strength,strength,strength,strength);



    /*
    高级图案编写

    */

    //1.0画圆
//    float strength = 1.0 - step(0.5,distance(vUv,vec2(0.5))+0.25);
//    gl_FragColor = vec4(strength,strength,strength,1);

    //2绘制圆环
//    float strength = step(0.5,distance(vUv,vec2(0.5))+0.35);
//     strength *= (1.0-step(0.5,distance(vUv,vec2(0.5))+0.25));
//    gl_FragColor = vec4(strength,strength,strength,1);

        //4渐变圆环
//        float strength = abs(distance(vUv,vec2(0.5))-0.25);
//        gl_FragColor = vec4(strength,strength,strength,1);


    //5渐变环变圆环
//    float strength = step(0.1,abs(distance(vUv,vec2(0.5))-0.25));
//    gl_FragColor = vec4(strength,strength,strength,1);


    //6渐变环变圆环
//    float strength = 1.0-step(0.1,abs(distance(vUv,vec2(0.5))-0.25));
//    gl_FragColor = vec4(strength,strength,strength,1);

    //7波浪圆环
//    vec2 waveUv = vec2(
//        vUv.x,
//        vUv.y+sin(vUv.x * 60.0) * 0.1
//    );
//
//    float strength = 1.0-step(0.01,abs(distance(waveUv,vec2(0.5))-0.25));
//    gl_FragColor = vec4(strength,strength,strength,1);



    //8偏移波浪圆环
//        vec2 waveUv = vec2(
//            vUv.x+sin(vUv.y * 30.0) * 0.1,
//            vUv.y+sin(vUv.x * 30.0) * 0.1
//        );
//
//        float strength = 1.0-step(0.01,abs(distance(waveUv,vec2(0.5))-0.25));
//        gl_FragColor = vec4(strength,strength,strength,1);


    //9根据角度进行着色
//    float angle = atan(vUv.x,vUv.y);
//    float strength = angle;
//    gl_FragColor = vec4(strength,strength,strength,1);

    //10根据角度进行螺旋渐变
//        float angle = atan((vUv.x-0.5),(vUv.y-0.5));
//        float strength = (angle+3.14)/6.28;
//        gl_FragColor = vec4(strength,strength,strength,1);


    //11实现雷达扫射
//     float alpha =  1.0 - step(0.5,distance(vUv,vec2(0.5)));
//     float angle = atan(vUv.x-0.5,vUv.y-0.5);
//     float strength = (angle+3.14)/6.28;
//     gl_FragColor =vec4(strength,strength,strength,alpha);


    //12通过时间雷达扫描旋转
//    vec2 rotateUv = rotate(vUv,uTime*5.0,vec2(0.5,0.5));
//    float alpha =  1.0 - step(0.5,distance(rotateUv,vec2(0.5)));
//    float angle = atan(rotateUv.x-0.5,rotateUv.y-0.5);
//    float strength = (angle+3.14)/6.28;
//    gl_FragColor =vec4(strength,strength,strength,alpha);

    //13万花筒效果
//        float angle = atan(vUv.x-0.5,vUv.y-0.5) / PI;
//        float strength = mod(angle*20.0,1.0);
//        gl_FragColor =vec4(strength,strength,strength,1);

    //14光芒四射效果
    float angle = atan(vUv.x-0.5,vUv.y-0.5) / (2.0*PI);
    float strength = sin(angle*100.0);
    gl_FragColor =vec4(strength,strength,strength,1);


}