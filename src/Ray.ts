import { Point3 } from "./Point3.js";
import { Vector3 } from "./Vector3.js";

export class Ray {
    constructor(private _origin: Point3, private _direction: Vector3) {

    }

    get origin(): Point3 {
        return this._origin;
    }

    get direction(): Vector3 {
        return this._direction;
    }

    set origin(origin: Point3) {
        this._origin = origin;
    }

    set direction(direction: Vector3) {
        this._direction = direction;
    }

    at(t:number):Point3 {
        //origin + t * direction
       return this.origin.add(this.direction.multiply(t))
    }
}