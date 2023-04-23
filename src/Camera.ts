import { Point3 } from "./Point3.js";
import { Ray } from "./Ray.js";
import { Vector3 } from "./Vector3.js";

export class Camera {
    private origin: Point3;
    private lower_left_corner: Point3;
    private horizontal: Vector3;
    private vertical: Vector3;
    constructor() {
        const aspect_ratio = 16.0 / 9.0;
        // const image_width = 400;
        // const image_height = Math.floor(image_width / aspect_ratio);

        const viewport_height = 2.0;
        const viewport_width = aspect_ratio * viewport_height;
        const focal_length = 1.0;

        this.origin = new Point3(0, 0, 0);
        this.horizontal = new Vector3(viewport_width, 0, 0);
        this.vertical = new Vector3(0, viewport_height, 0);
        //origin - horizontal/2 - vertical/2 - Vector3(0, 0, focal_length);
        this.lower_left_corner = this.origin.subtract(this.horizontal.divide(2))
            .subtract(this.vertical.divide(2))
            .subtract(new Vector3(0, 0, focal_length));
    }

    getRay(u:number, v:number):Ray {
        return new Ray(this.origin,
            this.lower_left_corner.add(this.horizontal.multiply(u))
            .add(this.vertical.multiply(v))
            .subtract(this.origin));
    }
}