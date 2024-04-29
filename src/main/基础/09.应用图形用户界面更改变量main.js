import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {gsap} from "gsap";

//导入dat.gui
import * as dat from 'dat.gui'


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


//初始化gui
const gui = new dat.GUI()

//添加更改的属性, position.x ,可更改最大值为0最小值为0,最小移动间距为0.01,重命名属性为x轴
gui.add(
    cube.position,
    "x")
    .min(0)
    .max(5)
    .step(0.01)
    .name("x轴")
    .onChange((value)=>{
        console.log("值被修改为:",value)
    })
    .onFinishChange((value)=>{
        console.log("完全停下来被修改的值",value)
    })

//修改物体的颜色
const params = {
    color:"#ffff00",
    fn:()=>{
        //让立方体运动起来
        gsap.to(cube.position,{x:5,duration:2,yoyo:true,repeat:-1})
    }
}
gui.addColor(params,'color').onChange((value)=>{
    console.log("颜色值被修改为:",value)
    //设置物体的颜色
    cube.material.color.set(value)
})

//控制物体的显示
gui.add(cube,"visible").name("是否显示物体")

//设置按钮触发事件
gui.add(params,'fn').name("点击开始运动")

//添加文件夹
const folder = gui.addFolder("设置立方体")

//是否显示线框
folder.add(cube.material,"wireframe")

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




