var THREE = THREE || {}
var container
var renderer
var scene
var camera
var effect
var fov = 90
var material
var start = Date.now()
var numBlobs = 70

window.addEventListener('load', init)

function init () {
  container = document.getElementById('container')
  scene = new THREE.Scene()
  scene.position = new THREE.Vector3(0, 0, 0)
  camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.01, 100000)
  camera.target = new THREE.Vector3(0, 0, 0)

  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 0

  scene.add(camera)
  renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.autoClear = false
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.gammaInput = true
  renderer.gammaOutput = true
  renderer.physicallyBasedShading = true
  container.appendChild(renderer.domElement)

  window.addEventListener('resize', onWindowResize, false)

  material = new THREE.ShaderMaterial({
    uniforms: {
      textureMap: {
        type: 't',
        value: THREE.ImageUtils.loadTexture('img/magma.jpg')
      },
      normalMap: {
        type: 't',
        value: THREE.ImageUtils.loadTexture('img/bump.jpg')
      },
      normalScale: {
        type: 'f',
        value: 1
      },
      texScale: {
        type: 'f',
        value: 5
      },
      useSSS: {
        type: 'f',
        value: 1
      },
      useScreen: {
        type: 'f',
        value: 1
      },
      color: {
        type: 'c',
        value: new THREE.Color(1 / 255, 1 / 255, 1 / 255)
      }
    },
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    side: THREE.DoubleSide
  })
  material.uniforms.textureMap.value.wrapS = material.uniforms.textureMap.value.wrapT = THREE.ClampToEdgeWrapping
  material.uniforms.normalMap.value.wrapS = material.uniforms.normalMap.value.wrapT = THREE.RepeatWrapping

  effect = new THREE.MarchingCubes(70, material, true, true) // @arg resolution, material
  effect.scale.set(100, 100, 100)
  scene.add(effect)

  function goFullscreen (e) {
    container.onwebkitfullscreenchange = function (e) {
      container.onwebkitfullscreenchange = function () {}
    }
    container.onmozfullscreenchange = function (e) {
      container.onmozfullscreenchange = function () {}
    }
    if (container.webkitRequestFullScreen) container.webkitRequestFullScreen()
    if (container.mozRequestFullScreen) container.mozRequestFullScreen()
    e.preventDefault()
  }
  container.addEventListener('dblclick', goFullscreen)

  onWindowResize()
  render()
}

function updateCubes (object, time, numblobs, floor) {
  object.reset()
  var i, ballx, bally, ballz
  var subtract = 12
  var strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1)
  for (i = 0; i < numblobs; i++) {
    ballx = Math.sin(i + 1.26 * time * (1.003 + 0.5 * Math.cos(0.21 * i))) * 0.27 + 0.5
    bally = Math.cos(i + 1.22 * time * 1.001 * Math.sin((0.72 + 0.83 * i))) * 0.27 + 0.5
    ballz = Math.cos(i + 1.32 * time * 0.1 * Math.sin((0.92 + 0.53 * i))) * 0.1 + 0.5
    object.addBall(ballx, bally, ballz, strength, subtract)
  }
}

function onWindowResize () {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, camera.near, camera.far)
}

function render () {
  window.requestAnimationFrame(render)
  updateCubes(effect, 0.0001 * (Date.now() - start), numBlobs)
  camera.lookAt(scene.position)
  renderer.render(scene, camera)
}