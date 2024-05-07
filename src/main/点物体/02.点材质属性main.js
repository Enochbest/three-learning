import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
camera.position.set(0,0,10)

//添加相机到场景
scene.add(camera)

const sphereGeometry = new THREE.SphereGeometry(3,20,20)


//点材质
const pointsMaterial = new THREE.PointsMaterial()

//点的大小,默认为1
pointsMaterial.size = 0.05

//设置点材质颜色
pointsMaterial.color.set(0xfff000)

//相机深度衰减 (近大远小)
pointsMaterial.sizeAttenuation = true

//载入纹理
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./textures/particles/1.png')

//设置点材质纹理
pointsMaterial.map = texture
pointsMaterial.alphaMap = texture
pointsMaterial.transparent = true

//渲染此材质是否对深度缓冲区有任何影响。默认为true。
pointsMaterial.depthWrite = false

//回合模式,叠加模式
pointsMaterial.blending = THREE.AdditiveBlending


const points = new THREE.Points(sphereGeometry,pointsMaterial)

scene.add(points)



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



