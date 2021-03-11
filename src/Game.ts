import * as BABYLON from 'babylonjs';

export class Game {
    private canvas: HTMLCanvasElement;

    private engine: BABYLON.Engine;

    private scene!: BABYLON.Scene;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(
            this.canvas, true, { preserveDrawingBuffer: true, stencil: true }, true
        );
    }

    createScene(): void {
        var engine = this.engine;
        var canvas = this.canvas;
        this.scene = new BABYLON.Scene(this.engine);
        var scene = this.scene;
        // this.scene = new BABYLON.Scene(this.engine);

        // var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene); 
        // camera.setTarget(BABYLON.Vector3.Zero()); 
        // camera.attachControl(this.canvas, true); 
        var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 4, 8, BABYLON.Vector3.Zero(), this.scene);
        camera.attachControl(this.canvas, true);

        var light0 = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        light0.intensity = 0.7;
        light0.diffuse = new BABYLON.Color3(1, 0, 0);
        light0.specular = new BABYLON.Color3(0, 1, 0);
        light0.groundColor = new BABYLON.Color3(0, 1, 0);

        var light1 = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), this.scene);
        light1.diffuse = new BABYLON.Color3(1, 1, 1);
        light1.specular = new BABYLON.Color3(1, 1, 1);
        light1.groundColor = new BABYLON.Color3(0, 0, 0);


        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.5, segments: 32 }, this.scene);
        sphere.position.y = 1;
        // var ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, this.scene);


        var spheres = [];
        for (var i = 0; i < 25; i++) {
            spheres[i] = sphere.clone("sphere" + i);
            spheres[i].position.x = -2 + i % 5;
            spheres[i].position.y = 2 - Math.floor(i / 5);
        }

        light0.excludedMeshes.push(spheres[7], spheres[18]);
        light1.includedOnlyMeshes.push(spheres[7], spheres[18])


        // Fountain object
        var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, scene);

        // Ground
        var ground = BABYLON.Mesh.CreatePlane("ground", 50.0, scene);
        ground.position = new BABYLON.Vector3(0, -10, 0);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

        ground.material = new BABYLON.StandardMaterial("groundMat", scene);
        ground.material.backFaceCulling = false;
        // ground.material.diffuseColor = new BABYLON.Color3(0.3, 0.3, 1);

        // Create a particle system
        var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

        //Texture of each particle
        particleSystem.particleTexture = new BABYLON.Texture("assets/textures/flare.png", scene);

        // Where the particles come from
        particleSystem.emitter = fountain; // the starting object, the emitter
        particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
        particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...

        // Colors of all particles
        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
        particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;

        // Emission rate
        particleSystem.emitRate = 1500;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        // Set the gravity of all particles
        particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
        particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);

        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.005;

        // Start the particle system
        particleSystem.start();

        // Fountain's animation
        var keys = [];
        var animation = new BABYLON.Animation("animation", "rotation.x", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        // At the animation key 0, the value of scaling is "1"
        keys.push({
            frame: 0,
            value: 0
        });

        // At the animation key 50, the value of scaling is "0.2"
        keys.push({
            frame: 50,
            value: Math.PI
        });

        // At the animation key 100, the value of scaling is "1"
        keys.push({
            frame: 100,
            value: 0
        });

        // Launch animation
        animation.setKeys(keys);
        fountain.animations.push(animation);
        scene.beginAnimation(fountain, 0, 100, true);


    }

    doRender(): void {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        this.canvas.addEventListener("pointerdown", (e) => {
            this.canvas.addEventListener("pointermove", this.evt);

            var pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY,
                () => true);
            if (pickInfo != null && pickInfo.hit) {
                // console.log(pickInfo.pickedPoint)
                let mesh = pickInfo.pickedMesh
                if (mesh) {
                    // console.log(mesh.parent?.name, mesh.parent?.position);
                }
            }
        });
        this.canvas.addEventListener("pointerup", (e) => {
            this.canvas.removeEventListener("pointermove", this.evt);
        });
    }

    evt(e: MouseEvent) {
        // console.log(e.clientX, e.clientY);
    }
}