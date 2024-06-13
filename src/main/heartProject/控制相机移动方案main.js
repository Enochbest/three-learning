import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import * as TWEEN from '@tweenjs/tween.js';
//初始化gui
const gui = new dat.GUI()

// 1、创建场景
const scene = new THREE.Scene();

//添加坐标辅助
const axesHepler = new THREE.AxesHelper( 20 )
scene.add(axesHepler)

//灯光与阴影满足条件
//1.材质要满足能够对光照有反应
//2.设置渲染器开启对阴影的计算 renderer.shadowMap.enabled = true
//3.设置光照投射阴影开启 directLight.castShadow = true
//4.设置物体投射阴影 sphere.castShadow = true
//5.设置物体接收阴影plane.receiveShadow = true

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

//设置相机位置
camera.position.set(0,2, 10)

//添加相机到场景
scene.add(camera)



//创建标准材质controls
const material = new THREE.MeshStandardMaterial();

const cubeGeometry = new THREE.BoxGeometry( 2, 1, 1 );
const cube = new THREE.Mesh( cubeGeometry, material );
cube.position.set(3,0,0)
cube.castShadow = true
scene.add(cube)
//创建球
const sphereGeometry = new THREE.SphereGeometry(1,20,20)
const sphere = new THREE.Mesh(sphereGeometry,material)
//开启物体投射阴影
sphere.castShadow = true
scene.add(sphere)

//创建平面
const planeGeometry = new THREE.PlaneGeometry(1024,1024)
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

//设置控制器自动旋转
// controls.autoRotate = true
controls.autoRotateSpeed = 2
// // 设置控制器角度
controls.maxPolarAngle = Math.PI / 4 * 2.0
controls.minPolarAngle = Math.PI / 4
const clock = new THREE.Clock();


window.addEventListener("dblclick",()=>{
    console.log("双击了平面")
    animateCamera()
})


function changeCameraPosition() {
    console.log(camera.position)
    //解除滑动限制. 如果你在创建模型的时候设置了滑动平移放大缩小等限制在这里需要解除限制，不然达不到你想要的结果。
    controls.minDistance = 0;
    controls.maxPolarAngle = Math.PI / 1;
    controls.enableRotate = false
    controls.enableZoom = false
    controls.update();
    // 相机从当前位置camera.position飞行三维场景中某个世界坐标附近
    new TWEEN.Tween({
        // 相机开始坐标
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        // 相机开始指向的目标观察点
        tx: 0,
        ty: 0,
        tz: 0,
    })
        .to({
            // 相机结束坐标
            x: 0,
            y: 2,
            z: -10,
            // 相机结束指向的目标观察点
            tx: 0,
            ty: 0,
            tz: 0,
        }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(function (e) {
            //小程序中使用e，H5中使用this，获取结束的位置信息
            // 动态改变相机位置
            camera.position.set(this.x, this.y, this.z);
            // 模型中心点
            controls.target.set(this.tx, this.ty, this.tz);
            controls.update();//内部会执行.lookAt()
        })
        .start();
}



// current1 相机当前的位置
// target1 相机的controls的target
// current2 新相机的目标位置
// target2 新的controls的target
var tween;


//单向移动
function animateCamera() {

    let positionVar = {
        x1: camera.position.x,
        y1: camera.position.y,
        z1: camera.position.z,
        x2: 0,
        y2: 0,
        z2: 0,
        rotation: 0
    };
    //关闭控制器
    controls.enabled = false;
    const tween1 = new TWEEN.Tween(positionVar);

    tween1.to({
        x1: 0,
        y1: 1,
        z1: -10,
        x2: 0,
        y2: 0,
        z2: 0,
        rotation: Math.PI
    }, 500);

    tween1.onUpdate(function() {
        camera.position.set(
            10 * Math.sin(positionVar.rotation),
            positionVar.y1,
            10 * Math.cos(positionVar.rotation)
        );
        controls.target.x = positionVar.x2;
        controls.target.y = positionVar.y2;
        controls.target.z = positionVar.z2;
        controls.update();
        console.log(positionVar);
    })

    tween1.onComplete(function() {
        ///开启控制器
        controls.enabled = true;
    })
    tween1.easing(TWEEN.Easing.Quadratic.Out);

    tween1.start();
}

// 初始化两个向量，并忽略Y轴的分量
const vector1 = new THREE.Vector3(0, 0, 10); // (0, 2, 10) -> (0, 0, 10)
const vector2 = new THREE.Vector3(0, 0, -10); // (0, 2, -10) -> (0, 0, -10)
const origin = new THREE.Vector3(0, 0, 0);

function calculateAngleInXZPlane(point1, point2, origin) {
    // 创建从原点到第一个点的向量
    const vector1 = new THREE.Vector3(point1.x - origin.x, 0, point1.z - origin.z);
    // 创建从原点到第二个点的向量
    const vector2 = new THREE.Vector3(point2.x - origin.x, 0, point2.z - origin.z);

    // 规范化向量
    const normalizedVector1 = vector1.clone().normalize();
    const normalizedVector2 = vector2.clone().normalize();

    // 计算点积
    const dotProduct = normalizedVector1.dot(normalizedVector2);

    // 确保点积值在有效范围内 [-1, 1]，以避免浮点数精度问题引起的错误
    const clampedDotProduct = Math.min(Math.max(dotProduct, -1), 1);

    // 计算两个向量之间的夹角（以弧度为单位）
    const angleInRadians = Math.acos(clampedDotProduct);

    return angleInRadians;
}


const angleInRadians = calculateAngleInXZPlane(vector1, vector2, origin);

console.log('Angle in radians:', angleInRadians);
console.log(Math.PI,'----Math------')

//弧形移动
function animateCameraHalfCircle(){
    // 定义半圆的路径参数
    const radius = 10;
    const startAngle = Math.PI / 2; // 90度，y=2处开始
    const endAngle = -Math.PI / 2; // -90度，y=2处结束

// 创建半圆路径上的点
    const arcPoints = [];
    const segments = 20; // 路径分段数量，越多越平滑
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = startAngle + t * (endAngle - startAngle);
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        arcPoints.push(new THREE.Vector3(0, 2, z));
    }


    // 创建Tween动画
    // 创建Tween动画
    let tween;
    for (let i = 0; i < arcPoints.length - 1; i++) {
        const to = arcPoints[i + 1];

        const nextTween = new TWEEN.Tween(camera.position)
            .to({ x: to.x, y: to.y, z: to.z }, 2000)
            .onUpdate(() => {
                camera.lookAt(new THREE.Vector3(0, 2, 0)); // 确保相机始终看向路径中心
            });

        if (!tween) {
            tween = nextTween;
        } else {
            tween.chain(nextTween);
            tween = nextTween;
        }
    }

    tween.start();


}

//帧渲染
function render() {
    TWEEN.update();
    //阻尼效果更新
    controls.update();
    renderer.render(scene,camera)
    //下一帧调用render函数
    requestAnimationFrame(render)
}

render()



