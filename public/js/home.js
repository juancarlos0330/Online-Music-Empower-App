let playlist = [];
let currentSong = 0;
let currentOffset = 0;
let currentSongName = "";
var audioContext = window.webkitAudioContext || window.AudioContext;
let audioCTX = null;
let src = null;
let isLastSong = false;
let lastSongDuration = null;
let audio = null;
let isFadingOut = false;

const mainInterval = setInterval(() => {
  if (!audioCTX) return;

  if (
    isLastSong &&
    lastSongDuration &&
    audioCTX.currentTime > 66 * currentSong + lastSongDuration + currentOffset
  ) {
    clearInterval(mainInterval);
    goToCategoriesPage();
  }

  if (
    !isFadingOut &&
    !isLastSong &&
    audioCTX.currentTime > 66 * (currentSong + 1) + currentOffset - 4
  ) {
    songFadeOut();
  }

  if (
    audioCTX.currentTime > 66 * (currentSong + 1) + currentOffset &&
    !isLastSong
  ) {
    stopSong();

    currentSong += 1;

    playStockSound();

    setTimeout(() => {
      if (currentSong === playlist.length - 1) {
        startPlaying();

        isLastSong = true;
      } else {
        startPlaying();
      }
    }, 1000);
  }
}, 1000);

$("#play-button").on("click", () => {
  startCountdown();
});

$("#how-to-play").on("click", () => {
  bootbox.alert(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta quam sed faucibus euismod. Praesent eget finibus sem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque consequat rhoncus risus eu auctor. Ut mauris tortor, viverra id molestie convallis, lobortis id magna."
  );
});

$("#stop-song-button").on("click", () => {
  if (audioCTX.state === "running") {
    audioCTX.suspend().then(function () {
      document.querySelector("#main-audio").pause();
      $("#stop-song-button").text("Resume");
    });
  } else if (audioCTX.state === "suspended") {
    audioCTX.resume().then(function () {
      document.querySelector("#main-audio").play();
      $("#stop-song-button").text("Pause");
    });
  }
});

$("#go-back-button").on("click", () => {
  goToCategoriesPage();
});

function startPlaying() {
  currentSongName = playlist[currentSong]
    .split("/")
    [playlist[currentSong].split("/").length - 1].split(".mp3")[0];

  displayCurrentSong();

  resumeSong();

  playSong();
}

function playSong() {
  let plane,
    sphere,
    sphereLight,
    planeCount = 0,
    planeCountIncrement = 0.06,
    cameraCount = 1,
    cameraCountIncrement = Math.PI / 250,
    vert = [],
    initVerts = [],
    initAudio = false,
    analyser,
    frequencyData;

  audio = document.querySelector("audio");

  let VizCtrl = function () {
    this.song = "";
    this.song = playlist[currentSong];
    this.spread = 3;
    this.width = 40;
    this.sphereFrequency = 10;
    this.limit = 105;
    this.animSphere = true;
    this.animWave = true;
    this.animCrunch = true;
    this.resetPlane = () => {
      for (let x = 0; x < plane.geometry.vertices.length; x++) {
        let v = plane.geometry.vertices[x];
        v.x = initVerts[x];
        v.z = 0;
      }
      plane.geometry.computeFaceNormals();
      plane.geometry.normalsNeedUpdate = true;
      plane.geometry.verticesNeedUpdate = true;
    };
  };

  const Viz = new VizCtrl();

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene.add(camera);
  camera.rotation.x = (Math.PI / 180) * 90;
  buildScene();

  function buildScene() {
    buildPlane();
    buildSphere();
    buildLight();
  }

  function buildPlane() {
    console.log("buildplane");
    const g = new THREE.PlaneGeometry(200, 200, 40, 40);
    const m = new THREE.MeshStandardMaterial({
      flatShading: 1,
      wireframe: 1,
      color: 0x06414c,
      emissive: 0x03223d,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.5,
    });
    plane = new THREE.Mesh(g, m);
    plane.rotation.x = (Math.PI * 270) / 180;
    plane.position.y = -5;
    scene.add(plane);

    for (let x = 0; x < plane.geometry.vertices.length; x++) {
      let v = plane.geometry.vertices[x];
      let distanceFromCenterY = Math.abs(v.x) / 100;

      v.z +=
        distanceFromCenterY > 0.2
          ? (Math.random() * (20 - 0.15) + 0.15) * distanceFromCenterY * 2
          : Math.random() * (0.8 - 0.2) + 0.2 + distanceFromCenterY;

      vert[x] = v;
      initVerts[x] = v.x;
    }

    const wireframe = plane.clone();
    wireframe.material = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x00ffff,
    });
    wireframe.scale.multiplyScalar(1.001);
    scene.add(wireframe);
  }

  function buildSphere() {
    console.log("buildsphere");
    const g = new THREE.SphereGeometry(22, 20, 20);
    const m = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      wireframe: false,
    });
    sphere = new THREE.Mesh(g, m);
    sphere.position.z = -130;
    scene.add(sphere);

    // camera.position.z = -20;
    controls.target.set(0, 0, -100);
    controls.update();
  }

  function buildLight() {
    console.log("buildlight");
    sphereLight = new THREE.SpotLight(0xff00ff, 5, 150, 10, 0, 2);
    sphereLight.position.set(0, 50, -130);
    sphereLight.lookAt(sphere);
    scene.add(sphereLight);
  }

  function visualize() {
    console.log("vusiaulize");
    analyser.getByteFrequencyData(frequencyData);

    if (Viz.animSphere) {
      avg = frequencyData[Viz.sphereFrequency] / 200;
      avg = avg * avg + 0.001;

      sphere.scale.set(avg, avg, avg);
      sphereLight.intensity = avg * avg * 20;
    }

    if (Viz.animWave || Viz.animCrunch) {
      planeSine = Math.sin(planeCount);
      planeCount += planeCountIncrement;

      for (let x = 0; x < plane.geometry.vertices.length; x++) {
        let v = plane.geometry.vertices[x];

        if (Viz.animWave) {
          v.z =
            1 +
            Math.abs(
              Math.sin(v.z / Viz.width) *
                (frequencyData[Math.floor(x / Viz.spread)] *
                  (vert[x].x / 100) *
                  2 -
                  2)
            ) /
              3;
          v.z = clamp(v.z, 0, Viz.limit);
        }

        if (Viz.animCrunch)
          v.x += Math.sin(planeCount) * frequencyData[1] * 0.00005 * v.x;
      }

      plane.geometry.computeFaceNormals();
      plane.geometry.normalsNeedUpdate = true;
      plane.geometry.verticesNeedUpdate = true;
    }
  }

  // window.addEventListener('resize', onWindowResize, false);

  // function onWindowResize() {
  //   camera.aspect = window.innerWidth / window.innerHeight;
  //   camera.updateProjectionMatrix();
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  // }

  fetchSong();

  function fetchSong(mp3 = Viz.song) {
    fetch(mp3)
      .then(async (mp3) => {
        const blob = await mp3.blob();

        const arrayBuffer = await blob.arrayBuffer();

        const buffer = await audioCTX.decodeAudioData(arrayBuffer);

        return { blob, buffer };
      })
      .then((mp3) => {
        playMusic(mp3);
        render();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function playMusic({ blob, buffer }) {
    if (isLastSong) {
      audio.src = URL.createObjectURL(blob);
    } else {
      audio.src =
        URL.createObjectURL(blob) +
        `#t=${generateRandomNumber(0, buffer.duration - 66)}`;
    }

    // audio.addEventListener("canplaythrough", (event) => {
    //   audio.play();
    //   console.log("hello");
    // });

    audio.volume = 0;
    audio.play();

    songFadeIn();

    setTimeout(() => {
      if (isLastSong) {
        lastSongDuration = audio.duration;
      }
    }, 1000);

    var src = audioCTX.createMediaElementSource(audio);

    analyser = audioCTX.createAnalyser();

    src.connect(analyser);

    analyser.connect(audioCTX.destination);

    var bufferLength = analyser.frequencyBinCount;

    frequencyData = new Uint8Array(bufferLength);
  }

  function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }

  function render() {
    // camera.translateZ(Math.sin(cameraCount * .55) * .6);
    // cameraCount += cameraCountIncrement;
    visualize();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}

function resumeSong() {
  if (audioCTX) {
    audioCTX.resume();

    document.querySelector("#main-audio").play();
  }
}

function stopSong() {
  if (audioCTX) {
    audioCTX.suspend();

    document.querySelector("#main-audio").pause();
  }
}

function openFullscreen() {
  var elem = document.documentElement;

  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}

function playStockSound() {
  document.querySelector("#stock").play();
}

function displayCurrentSong() {
  $("#current-song").text(currentSongName);
}

function goToCategoriesPage() {
  $("#first-page-container").show();

  $("#second-page-container").hide();

  $("body").css({ background: "", "background-size": "" });

  exitFullscreen();

  stopSong();

  audio.src = "";

  currentSong = 0;

  currentOffset = audioCTX.currentTime;

  isLastSong = false;

  $("#first-page-container .content").show();

  $("#countdown").hide();

  $("#countdown").text(10);
}

function startCountdown() {
  let seconds = 10;

  openFullscreen();

  $("#first-page-container .content").hide();
  $("#countdown").show();

  const countdown = setInterval(() => {
    seconds--;

    $("#countdown").text(seconds);

    if (seconds === 0) {
      clearInterval(countdown);

      const category = $("#categories-input").val();

      playlist = categories[category];

      playlist = JSON.parse(JSON.stringify(playlist))
        .sort(() => 0.5 - Math.random())
        .slice(0, 60);

      $("#first-page-container").hide();

      $("#second-page-container").show();

      $("body").css({
        background: "linear-gradient(#07279b,#000,#000)",
        "background-size": "8px 8px",
      });

      if (!audioCTX) {
        audioCTX = new audioContext();
      }

      startPlaying();
    }
  }, 1000);
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function songFadeIn() {
  let volume = 0;

  const fadeIn = setInterval(() => {
    if (volume < 1) {
      volume += 0.025;

      if (volume > 1) {
        volume = 1;
      }

      audio.volume = volume;
    } else {
      clearInterval(fadeIn);
    }
  }, 100);
}

function songFadeOut() {
  isFadingOut = true;

  let volume = 1;

  const fadeOut = setInterval(() => {
    if (volume > 0) {
      volume -= 0.025;

      if (volume < 0) {
        volume = 0;
      }

      audio.volume = volume;
    } else {
      isFadingOut = false;
      clearInterval(fadeOut);
    }
  }, 100);
}
