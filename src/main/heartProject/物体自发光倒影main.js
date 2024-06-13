import * as THREE from "three";

//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import vertexShader from './pointShader/vertexShader.glsl'
import fragmentShader from './pointShader/fragmentShader.glsl'

import { Reflector } from 'three/examples/jsm/objects/Reflector';

// import { addReflectorEffect } from 'three/examples/jsm/objects/Reflector'


function addReflectorEffect(mesh, options = { filter: [] }) {
    const material = mesh.material;

    // material.isReflector = true;

    // material.type = "Reflector";
    const camera = new PerspectiveCamera();

    const textureWidth = options.textureWidth || 512;
    const textureHeight = options.textureHeight || 512;
    const clipBias = options.clipBias || 0;
    const shader = options.shader || Reflector.ReflectorShader;
    const multisample =
        options.multisample !== undefined ? options.multisample : 4;

    const reflectorPlane = new Plane();
    const normal = new Vector3();
    const reflectorWorldPosition = new Vector3();
    const cameraWorldPosition = new Vector3();
    const rotationMatrix = new Matrix4();
    const lookAtPosition = new Vector3(0, 0, -1);
    const clipPlane = new Vector4();

    const view = new Vector3();
    const target = new Vector3();
    const q = new Vector4();

    const textureMatrix = new Matrix4();
    const virtualCamera = camera;

    const renderTarget = new WebGLRenderTarget(textureWidth, textureHeight, {
        samples: multisample,
        type: HalfFloatType,
    });

    const appendUniforms = {
        refDiffuse: { value: renderTarget.texture },
        // refOpacity: { value: options.opacity || 1 },
        refTextureMatrix: { value: textureMatrix },
    };

    material.onBeforeCompile = (shader) => {
        console.log(shader);
        Object.assign(shader.uniforms, appendUniforms);
        shader.vertexShader = shader.vertexShader.replace(
            "#include <common>",
            `
            #include <common>
            uniform mat4 refTextureMatrix;
            varying vec4 refUv;
        `
        );
        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <common>",
            `
            #include <common>
            uniform sampler2D refDiffuse;
            varying vec4 refUv;
        `
        );
        shader.vertexShader = shader.vertexShader.replace(
            "#include <begin_vertex>",
            `
            #include <begin_vertex>
            refUv = refTextureMatrix * vec4( position, 1.0 );
        `
        );
        shader.fragmentShader = shader.fragmentShader.replace(
            "#include <dithering_fragment>",
            `
            #include <dithering_fragment>
            
            gl_FragColor.rgb += texture2DProj( refDiffuse, refUv ).rgb;
			gl_FragColor.a =  ${options.opacity || "1.0"};

        `
        );
        // uniform sampler2D refDiffuse;
        // varying vec4 vUv;
        // console.log(shader.fragmentShader);
    };

    mesh.material.onBeforeRender = (renderer, scene, camera) => {
        reflectorWorldPosition.setFromMatrixPosition(mesh.matrixWorld);
        cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

        rotationMatrix.extractRotation(mesh.matrixWorld);

        normal.set(0, 0, 1);
        normal.applyMatrix4(rotationMatrix);

        view.subVectors(reflectorWorldPosition, cameraWorldPosition);

        // Avoid rendering when reflector is facing away

        if (view.dot(normal) > 0) return;

        view.reflect(normal).negate();
        view.add(reflectorWorldPosition);

        rotationMatrix.extractRotation(camera.matrixWorld);

        lookAtPosition.set(0, 0, -1);
        lookAtPosition.applyMatrix4(rotationMatrix);
        lookAtPosition.add(cameraWorldPosition);

        target.subVectors(reflectorWorldPosition, lookAtPosition);
        target.reflect(normal).negate();
        target.add(reflectorWorldPosition);

        virtualCamera.position.copy(view);
        virtualCamera.up.set(0, 1, 0);
        virtualCamera.up.applyMatrix4(rotationMatrix);
        virtualCamera.up.reflect(normal);
        virtualCamera.lookAt(target);

        virtualCamera.far = camera.far; // Used in WebGLBackground

        virtualCamera.updateMatrixWorld();
        virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

        // Update the texture matrix
        textureMatrix.set(
            0.5,
            0.0,
            0.0,
            0.5,
            0.0,
            0.5,
            0.0,
            0.5,
            0.0,
            0.0,
            0.5,
            0.5,
            0.0,
            0.0,
            0.0,
            1.0
        );
        textureMatrix.multiply(virtualCamera.projectionMatrix);
        textureMatrix.multiply(virtualCamera.matrixWorldInverse);
        textureMatrix.multiply(mesh.matrixWorld);

        // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
        // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
        reflectorPlane.setFromNormalAndCoplanarPoint(
            normal,
            reflectorWorldPosition
        );
        reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);

        clipPlane.set(
            reflectorPlane.normal.x,
            reflectorPlane.normal.y,
            reflectorPlane.normal.z,
            reflectorPlane.constant
        );

        const projectionMatrix = virtualCamera.projectionMatrix;

        q.x =
            (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) /
            projectionMatrix.elements[0];
        q.y =
            (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) /
            projectionMatrix.elements[5];
        q.z = -1.0;
        q.w =
            (1.0 + projectionMatrix.elements[10]) /
            projectionMatrix.elements[14];

        // Calculate the scaled plane vector
        clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

        // Replacing the third row of the projection matrix
        projectionMatrix.elements[2] = clipPlane.x;
        projectionMatrix.elements[6] = clipPlane.y;
        projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
        projectionMatrix.elements[14] = clipPlane.w;

        // Render
        // TODO : 于一体的反光 不能将自己隐去 只是不显示反射纹理
        mesh.visible = false;

        const currentRenderTarget = renderer.getRenderTarget();

        const currentXrEnabled = renderer.xr.enabled;
        const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

        renderer.xr.enabled = false; // Avoid camera modification
        renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

        renderer.setRenderTarget(renderTarget);

        renderer.state.buffers.depth.setMask(true); // make sure the depth buffer is writable so it can be properly cleared, see #18897

        if (renderer.autoClear === false) renderer.clear();

        // filter

        options.filter.forEach((name) => {
            const mesh = scene.getObjectByName(name);
            mesh.visible = false;
        });

        renderer.render(scene, virtualCamera);

        options.filter.forEach((name) => {
            const mesh = scene.getObjectByName(name);
            mesh.visible = true;
        });

        renderer.xr.enabled = currentXrEnabled;
        renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

        renderer.setRenderTarget(currentRenderTarget);

        // Restore viewport

        const viewport = camera.viewport;

        if (viewport !== undefined) {
            renderer.state.viewport(viewport);
        }

        mesh.visible = true;
    };
}



//导入动画库
import * as dat from 'dat.gui'
import {HalfFloatType, Matrix4, PerspectiveCamera, Plane, Vector3, Vector4, WebGLRenderTarget} from "three";
//初始化gui
const gui = new dat.GUI()
// 1、创建场景
const scene = new THREE.Scene();

//添加坐标辅助
const axesHepler = new THREE.AxesHelper( 5 )
scene.add(axesHepler)

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000)

//设置相机位置
camera.position.set(0,0,5)

//添加相机到场景
scene.add(camera)


//设置必要材质光照材质



//地板材质
const planeMaterial = new THREE.MeshStandardMaterial({
    transparent: true, // 透明度设置为 true
    opacity: 0.6, // 设置透明度
    roughness: 0,
    metalness: 0,
    envMapIntensity: 1,//需要搭配transparent
    transmission: 0.95, // 折射度，表示光线经过材料时的衰减程度
    clearcoat: 1,
    clearcoatRoughness: 0,
    refractionRatio: 1.5, // 折射率，控制光的折射程度
})
//物体材质
const geometryMaterial = new THREE.MeshStandardMaterial({
    color:new THREE.Color("rgb(47, 155, 237)"),
    emissive:new THREE.Color("rgb(47, 155, 237)")

});


// //创建平面
// const planeGeometry = new THREE.PlaneGeometry(200,200)
// const plane = new THREE.Mesh(planeGeometry,planeMaterial)
// plane.position.set(0,-1,0)
// plane.rotation.x = -Math.PI / 2
// // plane.receiveShadow = true
// scene.add(plane)
// addReflectorEffect(plane,{
//     clipBias:0.53,
//     textureWidth:1024,
//     textureHeight:1024,
//     opacity:0.4,
//     filter: []
// });


// 创建反射面
const reflector = new Reflector(new THREE.PlaneGeometry(100, 100), {
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: '#fff',
    strength: 0.001,
});
reflector.position.set(0,-1,0)
reflector.rotation.x = -Math.PI / 2
reflector.useDepthMaterial = true; // 使用深度材质
reflector.flipSided = false;
scene.add(reflector);





//创建球
const sphereGeometry = new THREE.SphereGeometry(1,40,40)
const sphere = new THREE.Mesh(sphereGeometry,geometryMaterial)
//开启物体投射阴影
sphere.castShadow = true
scene.add(sphere)






//添加环境光(e无方向)
const light = new THREE.AmbientLight(0x444444,0.5)
scene.add(light);

//设置平行光源
const directLight = new THREE.DirectionalLight(0xffffff,0.5)
directLight.position.set(0,10,10)

//开启光源阴影投射
directLight.castShadow = true


// //阴影的属性
//
// //设置阴影贴图的模糊度
// directLight.shadow.radius = 20
//
// //设置阴影贴图的分辨率
// directLight.shadow.mapSize.set(4096,4096)
//
// //设置平行光相机阴影投射的范围
// directLight.shadow.camera.near = 0.5
// directLight.shadow.camera.far = 500
// directLight.shadow.camera.top = 5
// directLight.shadow.camera.bottom = -5
// directLight.shadow.camera.left = -5
// directLight.shadow.camera.right = 5


// scene.add(directLight);



//初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })

renderer.shadowMap.enabled = true
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
controls.autoRotateSpeed = 2
// // 设置控制器角度
// controls.maxPolarAngle = Math.PI / 4 * 2.0
// controls.minPolarAngle = Math.PI / 4
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



