import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

//导入动画库
import {gsap} from "gsap";


// 1、创建场景
const scene = new THREE.Scene();

//添加坐标辅助
const axesHepler = new THREE.AxesHelper( 5 )
scene.add(axesHepler)

//创建相机
//几个参数
//fov — 摄像机视锥体垂直视野角度
// aspect — 摄像机视锥体长宽比
// near — 摄像机视锥体近端面
// far — 摄像机视锥体远端面
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

//设置相机位置
camera.position.set(0,0,10)

//添加相机到场景
scene.add(camera)

//创建几何体对象
const geometry = new THREE.BoxGeometry( 1, 1, 1 )
//创建材质
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
//创建物体
const cube = new THREE.Mesh( geometry, material );



//添加物体到场景中
scene.add(cube);

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


//帧渲染
function render() {

    //阻尼效果更新
    controls.update();
    renderer.render(scene,camera)
    //下一帧调用render函数
    requestAnimationFrame(render)
}

render()

//监听画面变化更新渲染画面

window.addEventListener("resize",()=>{
    console.log("画面变化")
    //更新摄像头视锥体长宽比
    camera.aspect = window.innerWidth / window.innerHeight
    //更新摄像机的投影矩阵
    camera.updateProjectionMatrix()
    //更新渲染器尺寸
    renderer.setSize(window.innerWidth,window.innerHeight)
    //设置渲染器的像素比,使不同设备的成像的大小尽量保存一致
    renderer.setPixelRatio(window.devicePixelRatio)
})

//双击控制屏幕
window.addEventListener("dblclick",()=>{
    const fullScreenEle = document.fullscreenElement;
    if(fullScreenEle){
        document.exitFullscreen()
    }else{
        renderer.domElement.requestFullscreen()
    }
})

