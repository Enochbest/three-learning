import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as dat from 'dat.gui'
//初始化gui
const gui = new dat.GUI()
import * as TWEEN from '@tweenjs/tween.js';

const textureLoader = new THREE.TextureLoader()

// 1、创建场景
const scene = new THREE.Scene();

//添加坐标辅助
const axesHepler = new THREE.AxesHelper( 20 )
// scene.add(axesHepler)

const camera = new THREE.PerspectiveCamera(40,window.innerWidth/window.innerHeight,0.1,1000)

//设置相机位置
camera.position.set(4.25,1.4,-4.5)

//添加相机到场景
scene.add(camera)

//汽车

//车身材质
let bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00ff00,
    metalness: 1,
    roughness: 0.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.03
})

// 玻璃材质
let glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#793e3e',
    metalness: 0.25,
    roughness: 0,
    transmission: 1.0, // 透光性
    opacity:1.0
})

//线条颜色
let lineMaterial = new THREE.MeshPhysicalMaterial({
    color: '#f7fcfa',
    metalness: 1,
    roughness: 0.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.03
})

let wheelColor = new THREE.MeshPhysicalMaterial({
    color: '#f7fcfa',
})

let wheelInsideMaterial = new THREE.MeshPhysicalMaterial({
    color: '#f7fcfa',
    metalness: 0.8,
    roughness: 0.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.03
})

// 玻璃材质
let testMaterial = new THREE.MeshPhysicalMaterial({
    color: '#793e3e',

})


// "Object_14"  "Object_4"

//加载汽车模型
const gltfLoader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
// 门
let doors = []
// "Object_21"
let carModel = null
gltfLoader.load('./assets/model/Lamborghini.glb',(gltf)=>{
    carModel = gltf.scene
    carModel.rotation.y = Math.PI

    carModel.traverse((obj)=>{
        console.log(obj,'--obj--')
        if(obj.name === 'Object_103' || obj.name === 'Object_64' || obj.name === 'Object_77'){
            // 车身
            obj.material = bodyMaterial
        }else if(obj.name === 'Object_90'){
            // 玻璃
            obj.material = glassMaterial
        }else if(obj.name === 'Empty001_16' || obj.name === 'Empty002_20'){
            // 门
            doors.push(obj)
        }else if(obj.name==="Object_111"){
            //顶部线条
            obj.material = lineMaterial
        }
        else if(obj.name==="Object_21" || obj.name=== "Object_10"){
            //轮胎线条
            obj.material = wheelColor
        }
        else if(obj.name==="Object_14" || obj.name=== "Object_4"){
            //轮胎线条
            obj.material = wheelInsideMaterial
        }
        else{
            return true
        }
    })
    scene.add(carModel)

})




//生成地板
const floorGeometry = new THREE.PlaneGeometry(20,20)
const floorMaterial = new THREE.MeshPhysicalMaterial({
    side:THREE.DoubleSide,
    color:0x808080,
    metalness:0,//设置金属度
    roughness:0.1//设置粗擦度稍微光滑
})
const mesh = new THREE.Mesh(floorGeometry,floorMaterial)
mesh.rotation.x = Math.PI / 2
scene.add(mesh)


// 设置柱状展厅
const cylinder = new THREE.CylinderGeometry(12,12,20,32)
const cylinderMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x6c6c6c,
    side: THREE.DoubleSide,
})
const cylinderMesh = new THREE.Mesh(cylinder,cylinderMaterial)
scene.add(cylinderMesh)


//设置从上到下的聚光灯
const spotLight = new THREE.SpotLight('#fff',2)
spotLight.angle = Math.PI / 6   //散射角度 和水平线的夹角
spotLight.penumbra = 0.3// 横向，聚光锥的半影衰减百分比
spotLight.decay = 1 // 纵向，沿着光照距离的衰减量
spotLight.distance = 30
spotLight.shadow.radius = 20
spotLight.shadow.mapSize.set(4096,4096)
spotLight.position.set(0,10,0)
spotLight.target.position.set(0,0,0) // 光照射的方向
spotLight.castShadow = true
scene.add(spotLight)


//光源

// 设置环境光源
const ambientLight = new THREE.AmbientLight('#fff',0.5)
scene.add(ambientLight)


const params = {
    color:bodyMaterial.color.getHex(),
    glassColor:glassMaterial.color.getHex(),
    lineColor:lineMaterial.color.getHex(),
    wheelLineColor:wheelColor.color.getHex(),
    wheelInsideColor:wheelInsideMaterial.color.getHex()
}

//控制面板
const bodyChange = gui.addFolder("车身材质设置")
//车身颜色设置
bodyChange.addColor(params,'color').name('车身颜色').onChange(value=>{
    console.log(value,'---color--')
    bodyMaterial.color.set(value);
})
bodyChange.addColor(params,'wheelInsideColor').name('轮毂颜色').onChange(value=>{
    console.log(value,'---color--')
    wheelInsideMaterial.color.set(value);
})
//车身金属度设置
bodyChange.add(bodyMaterial,'metalness').min(0.0).max(1.0).step(0.001).name('金属度').onChange(value=>{
    bodyMaterial.metalness = value
})
//车身镜面反射
bodyChange.add(bodyMaterial,'roughness').min(0.0).max(1.0).step(0.001).name('镜面反射').onChange(value=>{
    bodyMaterial.roughness = value
})

bodyChange.add(bodyMaterial,'clearcoat').min(0.0).max(1.0).step(0.001).name('车身表面漆面半透明').onChange(value=>{
    bodyMaterial.clearcoat = value
})
bodyChange.add(bodyMaterial,'clearcoatRoughness').min(0.0).max(1.0).step(0.001).name('车身表面漆面粗糙度').onChange(value=>{
    bodyMaterial.clearcoatRoughness  = value
})
const glassChange = gui.addFolder("玻璃设置")
//玻璃颜色设置
glassChange.addColor(params,'glassColor').name('玻璃颜色').onChange(value=>{
    glassMaterial.color.set(value)
})
glassChange.add(glassMaterial,'metalness').min(0.0).max(1.0).step(0.001).name('玻璃金属度').onChange(value=>{
    glassMaterial.metalness = value
})
glassChange.add(glassMaterial,'roughness').min(0.0).max(1.0).step(0.001).name('玻璃粗糙度').onChange(value=>{
    glassMaterial.roughness = value
})
glassChange.add(glassMaterial,'transmission').min(0.0).max(1.0).step(0.001).name('玻璃透光性').onChange(value=>{
    glassMaterial.transmission = value
})

const lineChange = gui.addFolder("线条颜色设置")
lineChange.addColor(params,'lineColor').name('顶部线条颜色').onChange(value=>{
    lineMaterial.color.set(value)
})
lineChange.addColor(params,'wheelLineColor').name('轮毂线条颜色').onChange(value=>{
    wheelColor.color.set(value)
})

//添加控制动画和视角转移

let carStatus
// 打开左车门
const carLeftOpen = () => {
    carStatus = 'open'
    setAnimationDoor({ x: 0, z: 0 }, { x: Math.PI / 3, z: -Math.PI / 6 }, doors[1])
}
// 打开右车门
const carRightOpen = () => {
    carStatus = 'open'
    setAnimationDoor({ x: 0, z: 0 }, { x: Math.PI / 3, z: Math.PI / 6 }, doors[0])
}
// 关闭左车门
const carLeftClose = () => {
    carStatus = 'close'
    setAnimationDoor({ x: Math.PI / 3 , z: -Math.PI / 6 }, { x: 0,z: 0 }, doors[1])
}
// 关闭右车门
const carRightClose = () => {
    carStatus = 'close'
    setAnimationDoor({ x: Math.PI / 3 , z: Math.PI / 6 }, { x: 0,z: 0 }, doors[0])
}

// 车内视角
const carIn = () => {
    setAnimationCamera({ cx: camera.position.x, cy: camera.position.y, cz: camera.position.z, ox: 0, oy: 0, oz: 0 }, { cx: -0.27, cy: 0.83, cz: 0.60, ox: 0, oy: 0.5, oz: -3 });
}
// 车外视角
const carOut = () => {
    setAnimationCamera({ cx: -0.27, cy: 0.83, cz: 0.6, ox: 0, oy: 0.5, oz: -3 }, { cx: 4.25, cy: 1.4, cz: -4.5, ox: 0, oy: 0.5, oz: 0 });
}

const setAnimationDoor = (start, end, mesh) => {
    const tween = new TWEEN.Tween(start).to(end, 1000).easing(TWEEN.Easing.Quadratic.Out)
    tween.onUpdate((that) => {
        mesh.rotation.x = that.x
        mesh.rotation.z = that.z
    })
    tween.start()
}

const setAnimationCamera = (start, end) => {
    const tween = new TWEEN.Tween(start).to(end, 1000).easing(TWEEN.Easing.Quadratic.Out)
    tween.onUpdate((that) => {
        //  camera.postition  和 controls.target 一起使用
        camera.position.set(that.cx, that.cy, that.cz)
        controls.target.set(that.ox, that.oy, that.oz)
    })
    tween.start()
}

var obj = { carRightOpen,carLeftOpen,carRightClose,carLeftClose,carIn,carOut }
const doChange = gui.addFolder("动态操作设置")
doChange.add(obj, "carLeftOpen").name('打开左车门')
doChange.add(obj, "carRightOpen").name('打开右车门')
doChange.add(obj, "carLeftClose").name('关闭左车门')
doChange.add(obj, "carRightClose").name('关闭右车门')
doChange.add(obj, "carIn").name('车内视角')
doChange.add(obj, "carOut").name('车外视角')







//创建投射光线对象
const raycaster = new THREE.Raycaster();

//设置鼠标的二维对象
const mouse = new THREE.Vector2()
window.addEventListener("click",(event)=>{
    mouse.x = (event.clientX/window.innerWidth) * 2 - 1
    mouse.y = -((event.clientY/window.innerHeight) * 2 - 1)
    raycaster.setFromCamera(mouse,camera)
    const results = raycaster.intersectObjects(scene.children)
    console.log(results,'----6666-----')
    results.forEach((item) => {
        if (item.object.name === 'Object_64' || item.object.name === 'Object_77') {
            if (!carStatus || carStatus === 'close') {
                carLeftOpen()
                carRightOpen()
            } else {
                carLeftClose()
                carRightClose()
            }
        }
    })

})


//初始化渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })

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

//为了不缩放超出出圆柱体
controls.maxDistance = 10 // 最大缩放距离
controls.minDistance = 1 // 最小缩放距离
controls.minPolarAngle = 0 // 最小旋转角度
controls.maxPolarAngle = 85 / 360 * 2 * Math.PI // 最大旋转角度



window.addEventListener("resize",()=>{
    renderer.setSize(window.innerWidth,window.innerHeight)
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
})

//帧渲染
function render() {
    TWEEN.update();
    //阻尼效果更新
    controls.update();
    renderer.render(scene,camera)
    //下一帧调用render函数
    requestAnimationFrame(render)
    gui.updateDisplay();
}

render()



