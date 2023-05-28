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

console.time("Total time")

const R = Math.cos(Math.PI / 4);

const lookFrom = new Point3(3, 3, 2);
const lookAt = new Point3(0, 0, -1)
const dist_to_focus = lookFrom.subtract(lookAt).length();

const camera = new Camera(lookFrom, lookAt, new Vector3(0, 1, 0), 20, 2, dist_to_focus);

const aspect_ratio = 16.0 / 9.0;
const image_width = 400;
const image_height = Math.floor(image_width / aspect_ratio);


const world = new HitableList();

let ground = new Sphere(new Point3(0, -100.5, -1), 100, new Lambertian(new Color(0.8, 0.8, 0.0)));
let left = new Sphere(new Point3(-R, 0, -1), R, new Dielectric(1.5));
let center = new Sphere(new Point3(0, 0, -1), 0.5, new Lambertian(new Color(0.1, 0.2, 0.5)));
let right = new Sphere(new Point3(R, 0, -1), R, new Metal(new Color(0.8, 0.6, 0.2), 0.0));

world.add(ground);
world.add(left);
world.add(center);
world.add(right);

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
    })
}

function main() {
    let currentColumn = 0, currentRow = 0;
    let completedWorkers = 0;

    let callBackHandler = (data) => {
        let pixel_color = new Color(data._x, data._y, data._z)
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
                image.savePPM();
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
