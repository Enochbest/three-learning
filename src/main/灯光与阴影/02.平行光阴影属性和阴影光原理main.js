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
const planeGeometry = new THREE.PlaneGeometry(10,10)
const plane = new THREE.Mesh(planeGeometry,material)
plane.position.set(0,-1,0)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
scene.add(plane)

//添加环境光(e无方向)
const light = new THREE.AmbientLight(0xffffff,0.5)
scene.add(light);

//设置平行光源
const directLight = new THREE.DirectionalLight(0xffffff,0.5)
directLight.position.set(0,10,10)

//开启光源阴影投射
directLight.castShadow = true


//阴影的属性

//设置阴影贴图的模糊度
directLight.shadow.radius = 20

//设置阴影贴图的分辨率
directLight.shadow.mapSize.set(4096,4096)

//设置平行光相机阴影投射的范围
directLight.shadow.camera.near = 0.5
directLight.shadow.camera.far = 500
directLight.shadow.camera.top = 5
directLight.shadow.camera.bottom = -5
directLight.shadow.camera.left = -5
directLight.shadow.camera.right = 5


scene.add(directLight);

gui.add(directLight.shadow.camera,"near").min(0).max(20).step(0.1).onChange(()=>{
    console.log('666666')
    directLight.shadow.camera.updateProjectionMatrix()
})


//初始化渲染器
const renderer = new THREE.WebGLRenderer()

//设置渲染尺寸的大小
renderer.setSize(window.innerWidth,window.innerHeight)

//开启场景中的阴影贴图
renderer.shadowMap.enabled = true


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



