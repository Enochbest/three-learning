import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 1、创建场景
const scene = new THREE.Scene();

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

//帧渲染
function render() {
    //使用渲染器通过相机将场景渲染出来
    renderer.render(scene,camera)
    //下一帧调用render函数
    requestAnimationFrame(render)
}

render()




