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

//创建几何体对象
//描述：BufferGeometry是一个没有任何形状的空几何体，通过定义顶点数据将BufferGeometry自定义为任何几何形状。每个几何体可以看作是由多个顶点构成的图案。

//循环出50个三角形
for (let i = 0; i < 50; i++) {
    const geometry = new THREE.BufferGeometry()
    const position = new Float32Array(9);
    //每个三角形需要是哪个顶点,每个顶点需要三个值
    for (let j = 0; j < 9; j++) {
        position[j] = Math.random() * 10 -5
    }
    geometry.setAttribute( 'position', new THREE.BufferAttribute( position, 3 ) );

    let color =new THREE.Color(Math.random(),Math.random(),Math.random())

    const material = new THREE.MeshBasicMaterial( {color: color,transparent:true,opacity:0.5});

    const cube = new THREE.Mesh( geometry, material );

    console.log(geometry)

    scene.add(cube);
}






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

//双击控制屏幕
window.addEventListener("dblclick",()=>{
    const fullScreenEle = document.fullscreenElement;
    if(fullScreenEle){
        document.exitFullscreen()
    }else{
        renderer.domElement.requestFullscreen()
    }
})




