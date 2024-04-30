import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



// 1、创建场景
const scene = new THREE.Scene();

//添加坐标辅助
const axesHepler = new THREE.AxesHelper( 5 )
scene.add(axesHepler)

//创建相机
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

//设置相机位置
camera.position.set(0,0,10)

//添加相机到场景
scene.add(camera)

//导入纹理
const textureLoader = new THREE.TextureLoader()

const texture =  textureLoader.load('./textures/minecraft.png')


//创建几何体对象
const geometry = new THREE.BoxGeometry( 1, 1, 1 )
//创建材质
const material = new THREE.MeshBasicMaterial( { map:texture } );
//创建物体
const cube = new THREE.Mesh( geometry, material );

//纹理的算法
// texture.minFilter = THREE.NearestFilter
//
// texture.magFilter = THREE.NearestFilter

texture.minFilter = THREE.LinearFilter

texture.magFilter = THREE.LinearFilter


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



