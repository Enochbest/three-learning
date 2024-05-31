import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

import vertexShader from '../deepShader/raw/vertexShader.glsl'
import fragmentShader from '../deepShader/raw/fragmentShader.glsl'


//初始化gui
const gui = new dat.GUI()

// 1、创建场景
const scene = new THREE.Scene();

//添加坐标辅助
const axesHepler = new THREE.AxesHelper( 5 )
scene.add(axesHepler)

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

//设置相机位置
camera.position.set(0,0,2)

//添加相机到场景
scene.add(camera)


const params = {
    uFrequency:10,
    uScale:0.1
}

// 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./texture/da.jpeg");


//创建着色器材质
const rawShaderMaterial = new THREE.RawShaderMaterial({
    //顶点着色器
    vertexShader:vertexShader,
    //片元着色器
    fragmentShader:fragmentShader,
    uniforms:{
        uTime:{
            value:0,
        },
        uColor: {
            value: new THREE.Color("purple"),
        },
        // 波浪的频率
        uFrequency: {
            value: params.uFrequency,
        },
        // 波浪的幅度
        uScale: {
            value: params.uScale,
        },
        uTexture: {
            value: texture,
        },
    }})

gui
    .add(params, "uFrequency")
    .min(0)
    .max(50)
    .step(0.1)
    .onChange((value) => {
        rawShaderMaterial.uniforms.uFrequency.value = value;
    });
gui
    .add(params, "uScale")
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((value) => {
        rawShaderMaterial.uniforms.uScale.value = value;
    });

const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1,64,64),
    rawShaderMaterial,
)
console.log(floor)
scene.add(floor)

//初始化渲染器
const renderer = new THREE.WebGLRenderer()

//设置渲染尺寸的大小
renderer.setSize(window.innerWidth,window.innerHeight)


//将WebGL渲染的canvas添加到元素上(body)
document.body.appendChild(renderer.domElement)


//创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement)

//设置控制器阻尼,增加真实感,必须在动画循环里调用update
controls.enableDamping = true

const clock = new THREE.Clock();

//帧渲染
function render() {
    let time = clock.getElapsedTime()
    rawShaderMaterial.uniforms.uTime.value = time
    //阻尼效果更新
    controls.update();
    renderer.render(scene,camera)
    //下一帧调用render函数
    requestAnimationFrame(render)
}

render()



