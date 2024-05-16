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

let cubeArr = []
const cubeGeometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial({
    wireframe:true
});
const redMaterial = new THREE.MeshBasicMaterial({
    color:"#ff0000"
});
for (let i = -5; i < 5; i++) {
    for (let j = -5; j < 5 ; j++) {
        for (let k = -5; k < 5; k++) {
            const cube = new THREE.Mesh( cubeGeometry, material );
            cube.position.set(i,j,k)
            scene.add( cube );
            cubeArr.push(cube)
        }
    }
}



//创建投射光线对象
const raycaster = new THREE.Raycaster();


//设置鼠标的二维对象
const mouse = new THREE.Vector2()

//监听鼠标的位置根据鼠标位置进行投射
// window.addEventListener("mousemove",(event)=>{
//     mouse.x = (event.clientX/window.innerWidth) * 2 - 1
//     mouse.y = -((event.clientY/window.innerHeight) * 2 - 1)
//     raycaster.setFromCamera(mouse,camera)
//     const results = raycaster.intersectObjects(cubeArr)
//     // results[0].object.material = redMaterial
//     results.forEach(item=>{
//         item.object.material = redMaterial
//     })
// })


window.addEventListener("click",(event)=>{
    mouse.x = (event.clientX/window.innerWidth) * 2 - 1
    mouse.y = -((event.clientY/window.innerHeight) * 2 - 1)
    raycaster.setFromCamera(mouse,camera)
    const results = raycaster.intersectObjects(cubeArr)
    // results[0].object.material = redMaterial
    results.forEach(item=>{
        item.object.material = redMaterial
    })
})

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



