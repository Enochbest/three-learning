import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vertexShader from './flyLightShader/vertexShader.glsl'
import fragmentShader from './flyLightShader/fragmentShader.glsl'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//导入动画库
import {gsap} from "gsap";

// 1、创建场景
const scene = new THREE.Scene();

//添加坐标辅助
const axesHepler = new THREE.AxesHelper( 5 )
scene.add(axesHepler)

const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync('./assets/2k.hdr').then((texture)=>{
    //设置环境映射方式
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
})

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

//设置相机位置
camera.position.set(0,0,10)

//添加相机到场景
scene.add(camera)


// 创建纹理加载器对象


//创建着色器材质
const rawShaderMaterial = new THREE.ShaderMaterial({
    //顶点着色器
    vertexShader:vertexShader,
    //片元着色器
    fragmentShader:fragmentShader,
    uniforms: {},
    side: THREE.DoubleSide,
   })

//初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })

renderer.outputEncoding = THREE.sRGBEncoding;
//场景色调渲染算法
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMapping = THREE.LinearToneMapping;
// renderer.toneMapping = THREE.ReinhardToneMapping;
// renderer.toneMapping = THREE.CineonToneMapping;
//设置环境曝光程度
renderer.toneMappingExposure = 0.2



const gltfLoader = new GLTFLoader();
let lightBox = null;
gltfLoader.loadAsync('./assets/model/flyLight.glb').then(gltf=>{
    //外部引入模型添加到场景中
    console.log(gltf);
    scene.add(gltf.scene);
    lightBox = gltf.scene.children[1]
    lightBox.material = rawShaderMaterial

    for (let i = 0; i < 150; i++) {
        //true 克隆  gltf.scene下的所有子元素
        let flyingLight = gltf.scene.clone(true)
        // -150  -  150
        let x = (Math.random() - 0.5) * 300
        // -150  -  150
        let z = (Math.random() - 0.5) * 300
        let y = Math.random()*60 + 25
        flyingLight.position.set(x,y,z)
        scene.add(flyingLight)
        gsap.to(flyingLight.rotation,{
            y:2*Math.PI,
            duration:10 + Math.random()*30,
            repeat:-1,
        })
        gsap.to(flyingLight.position,{
            x:"+=" + Math.random() * 10,
            y:"+=" + Math.random() * 20,
            duration:5 + Math.random()*30,
            repeat:-1,
            //往返运动
            yoyo:true,
        })
    }


})



//设置渲染尺寸的大小
renderer.setSize(window.innerWidth,window.innerHeight)

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener("resize", () => {
    //   console.log("resize");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比例
    renderer.setPixelRatio(window.devicePixelRatio);
});


//将WebGL渲染的canvas添加到元素上(body)
document.body.appendChild(renderer.domElement)


//创建轨道控制器
const controls = new OrbitControls(camera,renderer.domElement)

//设置控制器阻尼,增加真实感,必须在动画循环里调用update
controls.enableDamping = true

//设置控制器自动旋转
controls.autoRotate = true
controls.autoRotateSpeed = 0.5
//设置控制器角度
// controls.maxPolarAngle = Math.PI
// controls.minPolarAngle = Math.PI / 4* 3
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



