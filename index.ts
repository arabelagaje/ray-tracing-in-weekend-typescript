import { Worker } from 'worker_threads'
import ESSerializer from 'esserializer';
import { Vector3 } from './src/Vector3.js';
import { Color } from './src/Color.js';
import { Point3 } from './src/Point3.js';
import { HitableList } from './src/HitableList.js';
import { Sphere } from './src/Sphere.js';
import { Camera } from './src/Camera.js';
import { Lambertian } from './src/Material/Lambertian.js';
import { Metal } from './src/Material/Metal.js';
import { Dielectric } from './src/Material/Dielectric.js';
import { Image } from './src/Image.js';
import { Config } from './src/Config.js';
import { Utils } from './src/Utils.js';
import { perPixel } from './src/rayColor.js';

console.time("Total time")

const R = Math.cos(Math.PI / 4);

const lookFrom = new Point3(13, 2, 3);
const lookAt = new Point3(0, 0, 0)
const dist_to_focus = 10.0;

const camera = new Camera(lookFrom, lookAt, new Vector3(0, 1, 0), 20, 0.1, dist_to_focus);

const aspect_ratio = 3.0 / 2.0;
const image_width = 1200;
const image_height = Math.floor(image_width / aspect_ratio);


const world = randomScene();

const image = new Image(image_width, image_height);


const camData = ESSerializer.serialize(camera)
const worldData = ESSerializer.serialize(world)
const workers: Array<Worker> = [];
for (let i = 0; i < Config.workerCount; i++) {
    const worker = new Worker("./dist/src/rayColor.js", {
        workerData: {
            image_width, image_height,
            camera: camData,
            world: worldData
        }
    })
    workers.push(worker)
}

function workerAbstract(row: number, column: number, workerIndex: number) {
    return new Promise((resolve, reject) => {
        workers[workerIndex].postMessage({ i: row, j: column })
        workers[workerIndex].once('message', (data) => {
            data.row = row;
            data.column = column;
            data.workerIndex = workerIndex;
            resolve(data)
        })
        // to debug without worker
        // let pixel: any = perPixel(row, column, camera, world, image_width, image_height);
        // pixel.row = row;
        // pixel.column = column;
        // pixel.workerIndex = workerIndex;
        // resolve(pixel)
    })
}

function main() {
    let currentColumn = 0, currentRow = 0;
    let completedWorkers = 0;

    let callBackHandler = (data) => {
        let pixel_color = new Color(data._x, data._y, data._z)
        if(isNaN(pixel_color.r) || isNaN(pixel_color.g) || isNaN(pixel_color.b)) {
            console.log("NaN detected", data.row, data.column);
            process.exit(1);
        }
        image.setColor(data.row, data.column, pixel_color);
        currentColumn++;

        if (currentColumn >= image_width) {
            console.log("Scanlines completed: ", currentRow, " of ", image_height);
            currentColumn = 0;
            currentRow++;
        }

        if (currentRow >= image_height) {
            workers[data.workerIndex].terminate();
            completedWorkers++;
            if (completedWorkers == Config.workerCount) {
                image.savePNG();
                console.timeEnd("Total time")
            }
            return;
        }

        workerAbstract(currentColumn, currentRow, data.workerIndex).then(callBackHandler)
    }

    for (let k = 0; k < Config.workerCount; k++) {
        workerAbstract(currentColumn, currentRow, k).then(callBackHandler)
        currentColumn++;
        if (currentColumn >= image_width) {
            currentColumn = 0;
            currentRow++;
        }
    }

}
main();

function randomScene() : HitableList {
    let world = new HitableList();
    let groundMaterial = new Lambertian(new Color(0.5, 0.5, 0.5));
    world.add(new Sphere(new Point3(0,-1000,0), 1000, groundMaterial));

    for (let a = -11; a < 11; a++) {
        for (let b = -11; b < 11; b++) {
            let chooseMat = Math.random();
            let center = new Point3(a + 0.9 * Math.random(), 0.2, b + 0.9 * Math.random());

            if (center.subtract(new Point3(4, 0.2, 0)).length() > 0.9) {
                if (chooseMat < 0.8) { // diffuse
                    let albedo = new Color(Math.random() * Math.random(), Math.random() * Math.random(), Math.random() * Math.random());
                    world.add(new Sphere(center, 0.2, new Lambertian(albedo)));
                }
                else if (chooseMat < 0.95) { // metal
                    let albedo = Color.randomRange(0.5, 1);
                    let fuzz = Utils.random(0, 0.5);
                    world.add(new Sphere(center, 0.2, new Metal(Color.fromVector3(albedo), fuzz)));
                }
                else { // glass
                    world.add(new Sphere(center, 0.2, new Dielectric(1.5)));
                }
            }
        }
    }

    let material1 = new Dielectric(1.5);
    world.add(new Sphere(new Point3(0, 1, 0), 1.0, material1));
    
    let material2 = new Lambertian(new Color(0.4, 0.2, 0.1));
    world.add(new Sphere(new Point3(-4, 1, 0), 1.0, material2));

    let material3 = new Metal(new Color(0.7, 0.6, 0.5), 0.0);
    world.add(new Sphere(new Point3(4, 1, 0), 1.0, material3));

    return world;
}