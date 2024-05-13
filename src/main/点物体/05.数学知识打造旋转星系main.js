import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import {lerp} from "three/src/math/MathUtils";

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

const textureLoader = new THREE.TextureLoader()

const texture = textureLoader.load(`./textures/particles/1.png`)

const params = {
    count:20000,
    size:0.1,
    radius:20,
    branches:12,
    color:"#ff6030",
    rotateScale:0.3,
    endColor:"#1b3984"
}

let geometry = null

let material = null

let points = null

const centerColor = new THREE.Color(params.color)
const endColor = new THREE.Color(params.endColor);
const generateGalaxy = ()=>{
    //生成顶点
    geometry = new THREE.BufferGeometry()
    //生成顶点位置
    const positions = new Float32Array(params.count * 3)
    //设置顶点颜色
    const colors = new Float32Array(params.count*3)

    //循环生成点
    for (let i = 0; i < params.count; i++) {

        //当前点在哪个分支的角度上
        const branchAngel = (i % params.branches) * ((2*Math.PI) / params.branches)
        const  distance = Math.random()*params.radius * Math.pow(Math.random(),3)
        const current = i * 3

        const ramdomX =( Math.pow(Math.random() * 2 -1,3) * (5-distance)) * 0.2
        const ramdomY =( Math.pow(Math.random() * 2 -1,3) * (5-distance)) * 0.2
        const ramdomZ =( Math.pow(Math.random() * 2 -1,3) * (5-distance)) * 0.2



        //当前点距离圆心的距离
        positions[current] = Math.cos(branchAngel + distance*params.rotateScale) * distance + ramdomX
        positions[current + 1] = 0 + ramdomY
        positions[current + 2] = Math.sin(branchAngel + distance*params.rotateScale) * distance +ramdomZ


        //混合颜色形成渐变色
        const mixColor = centerColor.clone()
        mixColor.lerp(endColor,distance/params.radius)
        colors[current] = mixColor.r
        colors[current + 1] = mixColor.g
        colors[current + 2] = mixColor.b
    }
    //添加顶点
    geometry.setAttribute("position",new THREE.BufferAttribute(positions,3))
    geometry.setAttribute("color",new THREE.BufferAttribute(colors,3))
    //设置点材质
    material = new THREE.PointsMaterial({
        // color:new THREE.Color(params.color),
        size:params.size,
        sizeAttenuation:true,
        depthWrite:false,
        blending:THREE.AdditiveBlending,
        map:texture,
        alphaMap:texture,
        transparent:true,
        vertexColors:true
    })
    points = new THREE.Points(geometry,material)
    scene.add(points)
}

generateGalaxy()






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

const clock = new THREE.Clock();

//帧渲染
function render() {
   let time = clock.getElapsedTime()
    //阻尼效果更新
    controls.update();
    renderer.render(scene,camera)
    //下一帧调用render函数
    requestAnimationFrame(render)
}

render()



