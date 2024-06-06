import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//导入water
import {Water} from 'three/examples/jsm/objects/Water2'
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
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
camera.position.set(0,5,5)

//添加相机到场景
scene.add(camera)



//加载场景背景
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync('./assets/050.hdr').then((texture)=>{
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
})


//加载鱼缸
const gltfLoader = new GLTFLoader()
gltfLoader.load('./assets/model/yugang.glb',(gltf)=>{
    const yugang = gltf.scene.children[0]
    yugang.material.side = THREE.DoubleSide
    const waterGeometry = gltf.scene.children[1].geometry
    console.log(waterGeometry,'---waterGeometry---')


    const water = new Water(waterGeometry,{
        color:"#FFFFFF",
        scale:1,
        flowDirection:new THREE.Vector2(1,1),
        textureHeight:1024,
        textureWidth:1024,
    })
    scene.add(water)
    scene.add(yugang)
})

const directionLight = new THREE.DirectionalLight(0xfffff,0.5)
scene.add(directionLight)

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
    //阻尼效果更新
    controls.update();
    renderer.render(scene,camera)
    //下一帧调用render函数
    requestAnimationFrame(render)
}

render()



