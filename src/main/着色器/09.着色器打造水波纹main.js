import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vertexShader from './waterShader/vertexShader.glsl'
import fragmentShader from './waterShader/fragmentShader.glsl'
//导入动画库
import * as dat from 'dat.gui'
//初始化gui
const gui = new dat.GUI()
// 1、创建场景
const scene = new THREE.Scene();

//添加坐标辅助
const axesHepler = new THREE.AxesHelper( 5 )
scene.add(axesHepler)

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

//设置相机位置
camera.position.set(0,1,2)

//添加相机到场景
scene.add(camera)

const params = {
    uWaresFrequency:14.0,
    uScale:0.03,
    uNoiseFrequency:10.0,
    uNoiseScale:1.5,
    uXzScale:1.5,
    uTime:0.0,
    uLowColor:"#ff0000",
    uHighColor:"#ffff00",
    uXSpeed:1.0,
    uZSpeed:1.0,
    uNoiseSpeed:1.0,
    uOpacity:1.0
}


const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader:vertexShader,
    fragmentShader:fragmentShader,
    uniforms:{
        uWaresFrequency:{
            value:params.uWaresFrequency
        },
        uScale:{
            value:params.uScale
        },
        uNoiseFrequency:{
            value:params.uNoiseFrequency
        },
        uNoiseScale:{
            value:params.uNoiseScale
        },
        uXzScale:{
            value:params.uXzScale
        },
        uTime:{
            value:params.uTime
        },
        uLowColor:{
            value: new THREE.Color(params.uLowColor)
        },
        uHighColor:{
            value: new THREE.Color(params.uHighColor)
        },
        uXSpeed:{
            value:params.uXSpeed
        },
        uZSpeed:{
            value:params.uZSpeed
        },
        uNoiseSpeed:{
            value:params.uNoiseSpeed
        },
        uOpacity:{
            value:params.uOpacity
        },

    },
    side:THREE.DoubleSide,
    transparent:true

})

gui.add(params,"uWaresFrequency")
    .min(1.0)
    .max(100.0)
    .step(0.1)
    .onChange((value)=>{
    shaderMaterial.uniforms.uWaresFrequency.value = value
})
gui.add(params,"uScale")
    .min(0)
    .max(0.2)
    .step(0.001)
    .name('uScale频率')
    .onChange((value)=>{
        shaderMaterial.uniforms.uScale.value = value
    })

gui.add(params,"uNoiseFrequency")
    .min(1.0)
    .max(100.0)
    .step(0.1)
    .name('噪声频率')
    .onChange((value)=>{
        shaderMaterial.uniforms.uNoiseFrequency.value = value
    })

gui.add(params,"uNoiseScale")
    .min(0)
    .max(5.0)
    .step(0.01)
    .name('uNoiseScale')
    .onChange((value)=>{
        shaderMaterial.uniforms.uNoiseScale.value = value
    })

gui.add(params,"uXzScale")
    .min(0)
    .max(5.0)
    .step(0.1)
    .name('uXzScale')
    .onChange((value)=>{
        shaderMaterial.uniforms.uXzScale.value = value
    })

gui.addColor(params,"uLowColor").onFinishChange((value)=>{
    shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value)
})

gui.addColor(params,"uHighColor").onFinishChange((value)=>{
    shaderMaterial.uniforms.uHighColor.value = new THREE.Color(value)
})

gui.add(params,"uXSpeed")
    .min(1.0)
    .max(5.0)
    .step(0.1)
    .name('uXSpeed')
    .onChange((value)=>{
        shaderMaterial.uniforms.uXSpeed.value = value
    })

gui.add(params,"uZSpeed")
    .min(1.0)
    .max(5.0)
    .step(0.1)
    .name('uZSpeed')
    .onChange((value)=>{
        shaderMaterial.uniforms.uZSpeed.value = value
    })

gui.add(params,"uNoiseSpeed")
    .min(1.0)
    .max(5.0)
    .step(0.1)
    .name('uNoiseSpeed')
    .onChange((value)=>{
        shaderMaterial.uniforms.uNoiseSpeed.value = value
    })


gui.add(params,"uOpacity")
    .min(0.0)
    .max(1.0)
    .step(0.01)
    .name('uOpacity')
    .onChange((value)=>{
        shaderMaterial.uniforms.uOpacity.value = value
    })


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1,512,512),
    shaderMaterial
)
plane.rotation.x = -Math.PI / 2
scene.add(plane)


//初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })


//设置渲染尺寸的大小
renderer.setSize(window.innerWidth,window.innerHeight)

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {
    //   console.log("resize");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比例
    renderer.setPixelRatio(window.devicePixelRatio);
});


//将WebGL渲染的canvas添加到元素上(body)
document.body.appendChild(renderer.domElement)


//创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement)

//设置控制器阻尼,增加真实感,必须在动画循环里调用update
controls.enableDamping = true

//设置控制器自动旋转
// controls.autoRotate = true
// controls.autoRotateSpeed = 0.5
//设置控制器角度
// controls.maxPolarAngle = Math.PI
// controls.minPolarAngle = Math.PI / 4* 3
const clock = new THREE.Clock();

//帧渲染
function render() {
    let time = clock.getElapsedTime()
    shaderMaterial.uniforms.uTime.value = time
    //阻尼效果更新
    controls.update();
    renderer.render(scene,camera)
    //下一帧调用render函数
    requestAnimationFrame(render)
}

render()



