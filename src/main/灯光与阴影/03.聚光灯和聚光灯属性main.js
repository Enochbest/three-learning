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

//灯光与阴影满足条件
//1.材质要满足能够对光照有反应
//2.设置渲染器开启对阴影的计算 renderer.shadowMap.enabled = true
//3.设置光照投射阴影开启 directLight.castShadow = true
//4.设置物体投射阴影 sphere.castShadow = true
//5.设置物体接收阴影plane.receiveShadow = true

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

//设置相机位置
camera.position.set(0,0,10)

//添加相机到场景
scene.add(camera)




//创建球
const sphereGeometry = new THREE.SphereGeometry(1,20,20)
const material = new THREE.MeshStandardMaterial();
const sphere = new THREE.Mesh(sphereGeometry,material)
//开启物体投射阴影
sphere.castShadow = true
scene.add(sphere)

//创建平面
const planeGeometry = new THREE.PlaneGeometry(50,50)
const plane = new THREE.Mesh(planeGeometry,material)
plane.position.set(0,-1,0)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
scene.add(plane)

//添加环境光(e无方向)
const light = new THREE.AmbientLight(0xffffff,0.5)
scene.add(light);

//设置平行光源
const spotLight = new THREE.SpotLight(0xffffff,0.5)
spotLight.position.set(5,5,5)

//开启光源阴影投射
spotLight.castShadow = true


//阴影的属性

//设置阴影贴图的模糊度
spotLight.shadow.radius = 20

//设置阴影贴图的分辨率
spotLight.shadow.mapSize.set(4096,4096)

//设置聚光灯目标
spotLight.target = sphere

//设置聚光灯角度
spotLight.angle = Math.PI / 6

//设置聚光灯的衰减距离
spotLight.distance = 0

//设置聚光的半影衰减
spotLight.penumbra = 0

//设置聚光灯安装距离衰减量 renderer.physicallyCorrectLights = true 需要在物理渲染模式下进行
spotLight.decay = 0

//设置聚光灯强度
spotLight.intensity = 2
scene.add(spotLight);

gui.add(sphere.position,"x").min(-5).max(5).step(0.1)

gui.add(spotLight,"angle").min(0).max(Math.PI / 2).step(0.01)

gui.add(spotLight,"distance").min(0).max(1).step(0.001)

gui.add(spotLight,"penumbra").min(0).max(1).step(0.001)

gui.add(spotLight,"decay").min(0).max(5).step(0.01)

gui.add(spotLight,"intensity").min(0).max(5).step(0.01)


//初始化渲染器
const renderer = new THREE.WebGLRenderer()

//设置渲染尺寸的大小
renderer.setSize(window.innerWidth,window.innerHeight)

//开启场景中的阴影贴图
renderer.shadowMap.enabled = true

//设置物理渲染模式,改模式大量消耗性能
renderer.physicallyCorrectLights = true

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



