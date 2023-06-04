import * as os from 'os'
export const Config =  {
    samplesPerPixel : 500,
    maxDepth: 50,
    workerCount : Math.max(Math.floor(os.cpus().length * 0.8), 2),
}