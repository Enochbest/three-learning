import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vertexShader from './pointShader/vertexShader.glsl'
import fragmentShader from './pointShader/fragmentShader.glsl'

import { Reflector } from 'three/examples/jsm/objects/Reflector';

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
camera.position.set(0,0,5)

//添加相机到场景
scene.add(camera)


//设置必要材质光照材质



//地板材质
// const planeMaterial = new THREE.MeshPhysicalMaterial({
//     color: 0x30cff8,
//     roughness:0,
//     metalness:0.58,
// })
//物体材质
const geometryMaterial = new THREE.MeshStandardMaterial({
    color:new THREE.Color("rgb(47, 155, 237)"),
    emissive:new THREE.Color("rgb(47, 155, 237)")

});


// //创建平面
// const planeGeometry = new THREE.PlaneGeometry(200,200)
// const plane = new THREE.Mesh(planeGeometry,planeMaterial)
// plane.position.set(0,-3,0)
// plane.rotation.x = -Math.PI / 2
// plane.receiveShadow = true
// scene.add(plane)


//地板材质
const planeMaterial = new THREE.MeshBasicMaterial({
    transparent:true,
    opacity:0
})

// 创建反射面
const reflector = new Reflector(new THREE.PlaneGeometry(100, 100), {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    material:planeMaterial
});
reflector.position.set(0,-1,0)
reflector.rotation.x = -Math.PI / 2
reflector.useDepthMaterial = true; // 使用深度材质
reflector.flipSided = false;
scene.add(reflector);





//创建球
const sphereGeometry = new THREE.SphereGeometry(1,40,40)
const sphere = new THREE.Mesh(sphereGeometry,geometryMaterial)
//开启物体投射阴影
sphere.castShadow = true
scene.add(sphere)






//添加环境光(e无方向)
const light = new THREE.AmbientLight(0x444444,0.5)
scene.add(light);

//设置平行光源
const directLight = new THREE.DirectionalLight(0xffffff,0.5)
directLight.position.set(0,10,10)

//开启光源阴影投射
directLight.castShadow = true


// //阴影的属性
//
// //设置阴影贴图的模糊度
// directLight.shadow.radius = 20
//
// //设置阴影贴图的分辨率
// directLight.shadow.mapSize.set(4096,4096)
//
// //设置平行光相机阴影投射的范围
// directLight.shadow.camera.near = 0.5
// directLight.shadow.camera.far = 500
// directLight.shadow.camera.top = 5
// directLight.shadow.camera.bottom = -5
// directLight.shadow.camera.left = -5
// directLight.shadow.camera.right = 5


scene.add(directLight);



//初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })

renderer.shadowMap.enabled = true
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
controls.autoRotate = true
controls.autoRotateSpeed = 2
// 设置控制器角度
controls.maxPolarAngle = Math.PI / 4 * 2.0
controls.minPolarAngle = Math.PI / 4
const clock = new THREE.Clock();

//帧渲染
function render() {
    let time = clock.getElapsedTime()

    //阻尼效果更新
    controls.update();
    renderer.render(scene,camera)
    //下一帧调用render函数
    requestAnimationFrame(render)
}

render()



