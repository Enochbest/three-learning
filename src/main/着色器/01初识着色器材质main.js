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

// const material = new THREE.MeshBasicMaterial({
//     color:"#00ff00"
// })

//创建着色器材质
const shaderMaterial = new THREE.ShaderMaterial({
    //顶点着色器
    vertexShader:`
        void main() {
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 ) ;
        }
    `,
    //片元着色器
    fragmentShader:`
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1);
        }
    `
})



const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(1,1,64,64),
    shaderMaterial
)
scene.add(floor)

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



