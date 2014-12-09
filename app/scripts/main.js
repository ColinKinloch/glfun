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
    'THREE': '../bower_components/threejs/build/three'
  },
  shim: {
    bootstrap: ['jquery'],
    THREE: {
      exports: 'THREE'
    }
  }
});
require([ 'jquery', 'THREE', 'gl-matrix', 'Shape', 'text!shader.glslf', 'text!psx.glslv' ],
function(  $      ,  THREE ,  glm       ,  Shape ,  fragshad          ,  psxshad           )
{
  var canvas = $('#main');
  var scene = new THREE.Scene();

  var renderer = new THREE.WebGLRenderer({canvas:canvas[0], antialias: false});
  //renderer.setSize( window.innerWidth, window.innerHeight );
  //document.body.appendChild( renderer.domElement );
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

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
  
  
  var material = new THREE.ShaderMaterial({
    vertexColors:THREE.VertexColors,
    color: new THREE.Color(0xff0f00),
    uniforms: THREE.UniformsUtils.merge([
			THREE.UniformsLib[ 'common' ],
			THREE.UniformsLib[ 'lights' ],
			/*THREE.UniformsLib[ 'fog' ],
			THREE.UniformsLib[ 'shadowmap' ],*/
			{
				'color'  : { type: 'c', value: new THREE.Color( 0xff00aa ) },
				/*'emissive' : { type: 'c', value: new THREE.Color( 0x0f000f ) },
				'wrapRGB'  : { type: 'v3', value: new THREE.Vector3( 1, 1, 1 ) }*/
			}

		]),
    vertexShader:  [
      /*psxshad,
			'#define LAMBERT',

			"varying vec3 vLightFront;",

			"#ifdef DOUBLE_SIDED",

			"	varying vec3 vLightBack;",

			"#endif",*/

			/*THREE.ShaderChunk[ "map_pars_vertex" ],
			THREE.ShaderChunk[ "lightmap_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "lights_lambert_pars_vertex" ],*/
			THREE.ShaderChunk[ 'color_pars_vertex' ],
			/*
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],*/

			'void main() {',
				THREE.ShaderChunk[ 'color_vertex' ],
				/*
        'vec4 mvPosition;',
        '#ifdef USE_SKINNING',
        ' mvPosition = modelViewMatrix * skinned;',
        '#endif',
        '#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )',
        ' mvPosition = modelViewMatrix * vec4( morphed, 1.0 );',
        '#endif',
        '#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )',
        ' mvPosition = modelViewMatrix * vec4( position, 1.0 );',
        '#endif',
        'gl_Position = projectionMatrix * vec4(psx(vec3(mvPosition),11.0), 1.0);',*/
				THREE.ShaderChunk[ 'default_vertex' ],
				/*THREE.ShaderChunk[ "logdepthbuf_vertex" ],

				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "lights_lambert_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],*/

			'}'

		].join('\n'),
		fragmentShader: [

			/*"uniform vec3 diffuse;",
			"uniform float opacity;",*/

			THREE.ShaderChunk[ "color_pars_fragment" ],
			/*THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "alphamap_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "specularmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],*/

			"void main() {",

			/*"	gl_FragColor = vec4( diffuse, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "alphamap_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "specularmap_fragment" ],
				THREE.ShaderChunk[ "lightmap_fragment" ],*/
			  'gl_FragColor = vec4(vColor,1.0);',
				THREE.ShaderChunk[ "color_fragment" ],
				/*THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],*/
			//"	gl_FragColor = vec4( pointLightColor[0], 1.0 );",

			"}"

		].join("\n"),
    wireframe: true,
    lights: true,
  });
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
    width = w;
    height = h;
  };
  $(window).resize(resize);
  
  var mouse = new THREE.Vector2(0,0);
  var dm = new THREE.Vector2(0,0);
  var mold = new THREE.Vector2(0,0);
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
    camera.position.y = (mouse.y-height/2)*0.01;
    camera.position.x = Math.cos(90+(cam.x-width/2)*0.01)*(10+dist);
    camera.position.z = Math.sin(90+(cam.x-width/2)*0.01)*(10+dist);
    camera.lookAt(new THREE.Vector3(0,0,0));
    //cube.rotation.y = t*0.0005;
    //cube.rotation.x = t*0.0007;
    //cube.rotation.z = t*0.0011;
    dmold.multiplyScalar(0.99);
    dm.set(0,0);
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
    window.requestAnimationFrame(draw);
    renderer.render(scene, camera);
  };
  draw();
  setInterval(main, 0);
});
