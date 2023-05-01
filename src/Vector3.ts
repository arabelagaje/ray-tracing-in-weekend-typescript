import { Utils } from "./Utils.js";

export class Vector3 {
    private _x: number;
    private _y: number;
    private _z: number;
    constructor(x: number, y: number, z: number) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get z(): number {
        return this._z;
    }

    set x(x: number) {
        this._x = x;
    }

    set y(y: number) {
        this._y = y;
    }

    set z(z: number) {
        this._z = z;
    }

    addTo(vector3: Vector3) {
        this._x += vector3.x;
        this._y += vector3.y;
        this._z += vector3.z;
    }

    subtractFrom(vector3: Vector3) {
        this._x -= vector3.x;
        this._y -= vector3.y;
        this._z -= vector3.z;
    }

    multiplyBy(iCount: number) {
        this._x *= iCount;
        this._y *= iCount;
        this._z *= iCount;
    }

    divideBy(iCount: number) {
        this._x /= iCount;
        this._y /= iCount;
        this._z /= iCount;
    }

    add(vector3: Vector3): Vector3 {
        return new Vector3(this._x + vector3.x, this._y + vector3.y, this._z + vector3.z);
    }

    subtract(vector3: Vector3): Vector3 {
        return new Vector3(this._x - vector3.x, this._y - vector3.y, this._z - vector3.z);
    }

    multiply(iCount: number): Vector3 {
        return new Vector3(this._x * iCount, this._y * iCount, this._z * iCount);
    }

    divide(iCount: number): Vector3 {
        return new Vector3(this._x / iCount, this._y / iCount, this._z / iCount);
    }

    length(): number {
        return Math.sqrt(this.squaredLength());
    }

    squaredLength(): number {
        return (this._x * this._x) + (this._y * this._y) + (this._z * this._z);
    }

    getNormalized(): Vector3 {
        return this.divide(this.length());
    }

    dot(vector3: Vector3): number {
        return (this._x * vector3.x) + (this._y * vector3.y) + (this._z * vector3.z);
    }

    clamp(min: number, max: number) {
        this._x = Utils.clamp(this._x, min, max);
        this._y = Utils.clamp(this._y, min, max);
        this._z = Utils.clamp(this._z, min, max);
    }

    static random() {
        return new Vector3(Math.random(), Math.random(), Math.random())
    }

    static randomRange(min: number, max: number) {
        return new Vector3(Utils.random(min, max), Utils.random(min, max), Utils.random(min, max));
    }

    static randomInUnitSphere() {
        while (true) {
            const p = Vector3.randomRange(-1, 1);
            if (p.squaredLength() >= 1) continue;
            return p;
        }
    }

    nearZero(): boolean {
        const s = 1e-8;
        return (Math.abs(this._x) < s) && (Math.abs(this._y) < s) && (Math.abs(this._z) < s);
    }

    static reflect(v: Vector3, n: Vector3) {
        var dotVN = v.dot(n);
        return v.subtract(n.multiply(2 * dotVN))
        // return n.multiply(2 * v.dot(n)).subtract(v);
    }
}