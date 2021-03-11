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
        this.scene = new BABYLON.Scene(this.engine);

        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene); 
        camera.setTarget(BABYLON.Vector3.Zero()); 
        camera.attachControl(this.canvas, true); 
        var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
    
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;
 
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, this.scene); 
        sphere.position.y = 1; 
        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, this.scene);
 
        
    }

    doRender(): void {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        this.canvas.addEventListener("pointerdown", (e)=>{ 
            this.canvas.addEventListener("pointermove", this.evt);

            var pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY,
                 ()=>true);
                 if (pickInfo != null &&  pickInfo.hit) {
                     console.log(pickInfo.pickedPoint)
                     let mesh = pickInfo.pickedMesh
                     if(mesh) {
                     console.log(mesh.parent?.name,mesh.parent?.position);
                     }
                 }
        });
        this.canvas.addEventListener("pointerup", (e)=>{
            this.canvas.removeEventListener("pointermove", this.evt); 
        });
    }

    evt(e:MouseEvent) { 
        console.log(e.clientX,e.clientY);
    }
}