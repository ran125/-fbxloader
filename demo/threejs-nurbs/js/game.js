import * as THREE from '../libs/threejs/three.min'


import Params from './params'

import '../libs/threejs/controls/OrbitControls'
import '../libs/threejs/loader/FBXLoader.js'


// 网格数量
const length = 20
let instance;
let mixer;
let clock = new THREE.Clock();
// 游戏参数
let GameParams = new Params();
/**
 * 统一游戏管理
 */
export default class Game {
  constructor(renderer) {
    if (instance) {
      return instance
    }
    instance = this

    // 渲染器
    this.renderer = renderer;

    // 游戏场景  
    this.scene = new THREE.Scene();
  
    this.scene.add(new THREE.PointLight(0x8A8A8A))

    this.scene.add(new THREE.AmbientLight(0xFFFFFF))
    this.scene.background = new THREE.Color(0xa0a0a0);
    this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    // 使用透视相机绘制3D
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 2000)
    this.camera.position.set(100, 200, 300);

    // 摄像机控制器
    this.controls = new THREE.OrbitControls(this.camera)
    this.controls.target.set(0, 100, 0);
    this.controls.update();
    // this.controls.addEventListener('change', () => {
    //   this.renderer.render(this.scene, this.camera)
    // })
    this.light = new THREE.DirectionalLight(0xffffff);
    this.light.position.set(0, 200, 100);
    this.light.castShadow = true;
    this.light.shadow.camera.top = 180;
    this.light.shadow.camera.bottom = - 100;
    this.light.shadow.camera.left = - 120;
    this.light.shadow.camera.right = 120;
    this.scene.add(this.light);

    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    var grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add(grid);
    // 初始化
    this.boxs = []
    this.boxBodys = []
    this.models = []
    this.modelBodys = []

    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
  }
  /**
   * 创建网格
   */
  loaderModels() {
    return new Promise((resolve, reject) => {
      new THREE.FBXLoader().load('./models/Samba Dancing.fbx',
        (object) => {
          console.log(object);
             mixer = new THREE.AnimationMixer(object);
            // var action = mixer.clipAction(object.animations[0]);
            // action.play();
            // object.traverse(function (child) {
            //   if (child.isMesh) {
            //     child.castShadow = true;
            //     child.receiveShadow = true;
            //   }
            // });
            this.scene.add(object);
            resolve();
          },
          // 进度条 小游戏内无效
          xhr => {
            console.log(`${(xhr.loaded / xhr.total * 100)}% 已载入`)
          },
          // 载入出错
          error => {
            console.log(`载入出错: ${error}`)
            reject(error)
          }
        )
    })
  }
  /**
   * 更新游
   */
  update() {
    var delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * 渲染游戏
   */
  render() {
    this.update()
    this.renderer.render(this.scene, this.camera)
  }
}
