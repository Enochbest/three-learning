import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



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




//单张纹理加载
let event = {}
event.onLoad = ()=>{
    console.log("图片加载完成!")
}
event.onProgress = (url,num,total)=>{
    console.log("图片加载数量",num)
    console.log("图片加载总数",total)
    console.log("图片加载进度",url)
}
event.onError = (error)=>{
    console.log("图片加载错误",error)
}

//设置纹理加载管理器

const loadingManager = new THREE.LoadingManager(
    event.onLoad,
    event.onProgress,
    event.onError,
)

//导入纹理加载器
const textureLoader = new THREE.TextureLoader(loadingManager)
//加载颜色纹理
const doorTexture =  textureLoader.load(
    './textures/door/color.jpg',
    // event.onLoad,
    // event.onProgress,
    // event.onError,
)




//加载灰度纹理
const alphaTexture =  textureLoader.load('./textures/door/alpha.jpg')

//加载环境遮挡贴图
const envTexture =  textureLoader.load('./textures/door/ambientOcclusion.jpg')

//加载置换贴图
const doorHeight = textureLoader.load('./textures/door/height.jpg')

//导入粗糙度贴图
const roughnessTexture = textureLoader.load('./textures/door/roughness.jpg')

//导入金属贴图
const metalnessTexture = textureLoader.load('./textures/door/metalness.jpg')

//导入发现贴图(描述光反射的方向)
const mormalTexture = textureLoader.load('./textures/door/normal.jpg')


//创建几何体对象
const geometry = new THREE.BoxGeometry( 1, 1, 1,200,200 )
//创建材质
const material = new THREE.MeshStandardMaterial( {
    map:doorTexture,
    alphaMap:alphaTexture,
    aoMap:envTexture,
    transparent:true,
    //设置两面渲染
    side:THREE.DoubleSide,
    //设置置换贴图
    displacementMap:doorHeight,
    //置换贴图影响程度 (默认为1)
    displacementScale:0.1,
    //粗糙度
    roughness:1,
    //粗糙度贴图
    roughnessMap:roughnessTexture,
    //金属度
    metalness:1,
    //金属贴图
    metalnessMap:metalnessTexture,
    //法线贴图
    normalMap:mormalTexture
} );
//创建物体
const cube = new THREE.Mesh( geometry, material );

scene.add(cube);
geometry.setAttribute('uv2',new THREE.BufferAttribute(geometry.attributes.uv.array,2))

//创建平面几何体
const planeGeometry = new THREE.PlaneGeometry(1,1,200,200)

const plane = new THREE.Mesh(
    planeGeometry,
    material
)

plane.position.set(2,0,0)
scene.add(plane);

//给平面设置第二组uv
planeGeometry.setAttribute('uv2',new THREE.BufferAttribute(planeGeometry.attributes.uv.array,2))

//添加环境光(e无方向)
const light = new THREE.AmbientLight(0xffffff,0.5)
scene.add(light);

//设置平行光源

const directLight = new THREE.DirectionalLight(0xffffff,0.5)
directLight.position.set(0,10,10)
scene.add(directLight);


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



