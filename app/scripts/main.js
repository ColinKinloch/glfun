/*global require*/
/*jslint bitwise: true */
'use strict';
require.config({
  baseUrl: 'scripts',
  paths: {
    'gl-matrix': '../bower_components/gl-matrix/dist/gl-matrix',
    'jquery': '../bower_components/jquery/dist/jquery',
    'bootstrap': '../bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap',
    'text': '../bower_components/requirejs-text/text',
    'THREE': '../bower_components/threejs/build/three',
    'gltf': '../lib/gltf',
    'post': '../lib/postprocessing',
    'stats': '../bower_components/stats.js/build/stats.min',
    'OrbitControls': '../lib/OrbitControls'
  },
  shim: {
    bootstrap: ['jquery'],
    THREE: {
      exports: 'THREE'
    },
    'gltf/': {
      exports: 'THREE'
    },
    'gltf/glTFLoader': {
      exports: 'THREE',
      deps: [
        'THREE',
        'gltf/glTF-parser',
        'gltf/glTFLoaderUtils',
        'gltf/glTFAnimation'
      ]
    },
    'post/CopyShader': {
      exports: 'THREE',
      deps: [
        'THREE'
      ]
    },
    'post/RenderPass': {
      exports: 'THREE',
      deps: [
        'THREE'
      ]
    },
    'post/ShaderPass': {
      exports: 'THREE',
      deps: [
        'THREE'
      ]
    },
    'post/MaskPass': {
      exports: 'THREE',
      deps: [
        'THREE'
      ]
    },
    'post/EffectComposer': {
      exports: 'THREE',
      deps: [
        'THREE',
        'post/CopyShader',
        'post/ShaderPass',
        'post/MaskPass'
      ]
    },
    stats: {
      exports: 'Stats'
    },
    OrbitControls: {
      exports: 'THREE'
    }
  }
});
require([ 'jquery', 'stats', 'Shaders/one', 'Shaders/screen', 'THREE', 'post/CopyShader', 'post/EffectComposer', 'post/RenderPass', 'post/ShaderPass', 'OrbitControls', 'gltf/glTFLoader' ],
function(  $      ,  Stats ,  shadone     ,  shadscreen     ,  THREE )
{
  var renderStat = new Stats();
  document.body.appendChild( renderStat.domElement );
  
  var loopStat = new Stats();
  document.body.appendChild( loopStat.domElement );
  
  var canvas = $('#main');
  var scene = new THREE.Scene();
  
  
  var renderer = new THREE.WebGLRenderer({canvas:canvas[0], antialias: false});
  //renderer.setSize( window.innerWidth, window.innerHeight );
  //document.body.appendChild( renderer.domElement );
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  
  var composer = new THREE.EffectComposer(renderer);
  composer.addPass(new THREE.RenderPass(scene, camera));
  var screenShader = new THREE.ShaderPass(shadscreen);
  screenShader.renderToScreen = true;
  composer.addPass(screenShader);
  
  
  var control = new THREE.OrbitControls(camera, canvas[0]);
  //console.log(THREE.OrbitControls)
  //controls.target.z = 0;

  var light = new THREE.AmbientLight( 0x0f0 ); // soft white light
  scene.add( light );

  var light2 = new THREE.PointLight( 0xff0000, 1, 1000 );
  light2.position.set( 25, 50, 50 );
  scene.add( light2 );
  var light3 = new THREE.PointLight( 0x00ff00, 1, 1000 );
  light3.position.set( -25, -50, -50 );
  scene.add( light3 );

  var geometry = new THREE.BoxGeometry( 5, 5, 5 );
  var geometry = new THREE.SphereGeometry( 5, 20, 10 );
  var geometry2 = new THREE.BoxGeometry( 2, 2, 2 );
  
  var loader = new THREE.glTFLoader();
  var buddah = loader.load('./res/duck.gltf', function(data){
    
  });
  
  /*var shape = new THREE.Shape();
  shape.moveTo( 0,0 );
  shape.lineTo( 0, 1 );
  shape.lineTo( 3, 2 );
  shape.lineTo( 5, 0 );
  shape.lineTo( 0, 2 );
  var geometry = new THREE.ShapeGeometry(shape);*/
  //var geometry = new Shape(3,3);
  //geometry.faces.push(new THREE.Face3(0,1,2,3));

  var material2 = new THREE.MeshPhongMaterial( {
    ambient: 0xaaa,
    color: 0xdddddd,
    specular: 0x009900,
    shininess: 30,
    shading: THREE.FlatShading
  } );
  
  var material = new THREE.ShaderMaterial(shadone);
  //var material = new THREE.ShaderMaterial(THREE.ShaderLib['lambert']);
  //var material = new THREE.MeshLambertMaterial({wireframe: true});



  var cube = new THREE.Mesh( geometry, material );
  var cube2 = new THREE.Mesh( geometry2, material2 );
  scene.add( cube );
  scene.add( cube2 );
  //cube2.position.z =-2.5;
  cube2.rotation.z = 2;
  cube2.rotation.y = 2;
  cube2.rotation.x = 1;

  camera.position.z = 10;

  var width, height;
  var resize = function(e)
  {
    var w = e.target.innerWidth;
    var h = e.target.innerHeight;
    var r = w/h;
    renderer.setSize( w, h );
    camera.aspect = r;
    camera.updateProjectionMatrix();
    composer.setSize(w,h);
    width = w;
    height = h;
  };
  $(window).resize(resize);
  
  var mouse = new THREE.Vector2(0,0);
  var mold = new THREE.Vector2(0,0);
  var dm = new THREE.Vector2(0,0);
  var dmold = new THREE.Vector2(0,0);
  var drag = function(e)
  {
    mouse.set(e.pageX,e.pageY);
    dm.subVectors(mouse,mold);
    mold.copy(mouse);
  };
  canvas.mousemove(drag);
  
  var but = [];
  var click = function(e)
  {
    if(e.type==='mouseup')
    {
      but[e.which] = false;
    }
    else if(e.type==='mousedown')
    {
      but[e.which] = true;
    }
  }
  canvas.mousedown(click);
  canvas.mouseup(click);
  var dScroll = 0;
  var scroll = function(e)
  {
    dScroll += e.originalEvent.wheelDeltaY;
    e.stopPropagation();
    e.preventDefault();
  };
  canvas.bind('mousewheel', scroll);
  
  var cam = new THREE.Vector2(0,0);
  var dmold = new THREE.Vector2(0,0);
  
  $(window).resize();
  var t = window.performance.now();
  var time = window.performance.now();
  var loop = function(t, frame)
  {
    loopStat.begin();
    var dist = dScroll*0.001;
    
    if(but[1]===true)
    {
      dmold.copy(dm)
    }
    cam.add(dmold);
    //cube2.position.y = Math.cos(t*0.005)*(5);
    cube2.position.x = Math.cos(t*0.005)*(5);
    cube2.position.z = Math.sin(t*0.005)*(5);
    //cube2.position.y = dist;
    //camera.position.x = Math.sin((mouse.x-width/2)*0.005)*50;
    //camera.position.y = Math.sin((mouse.y-height/2)*0.005)*50;
    //camera.position.x = Math.sin(90+(mouse.y-height/2)*0.005)*(10+dist);
    //camera.position.y = (mouse.y-height/2)*0.01;
    //camera.position.x = Math.cos(90+(cam.x-width/2)*0.01)*(10+dist);
    //camera.position.z = Math.sin(90+(cam.x-width/2)*0.01)*(10+dist);
    //camera.lookAt(new THREE.Vector3(0,0,0));
    //cube.rotation.y = t*0.0005;
    //cube.rotation.x = t*0.0007;
    //cube.rotation.z = t*0.0011;
    dmold.multiplyScalar(0.99);
    dm.set(0,0);
    loopStat.end();
  };
  var main = function()
  {
    var now = window.performance.now();
    var frame = now - time;
    time = now;
    loop(t,frame);
    t += frame;
  };
  var draw = function()
  {
    renderStat.begin();
    
    composer.render(scene, camera);
    renderStat.end();
    window.requestAnimationFrame(draw);
  };
  draw();
  setInterval(main, 0);
});
