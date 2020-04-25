import Konva from "konva";
import delay from "delay"
import * as d3 from "d3";
import { findSuitableTickDivisor } from "./utils/findSuitableTickDivisor";
import { range } from "./utils/range";
export default class Axis {
  constructor(opts) {
    console.log('opts.data: ', opts.data);
    const {data} = opts
    const rangeY = [0, data.reduce((acc, cur) => cur.value > acc ? cur.value : acc, 0)]
    console.log('rangeY: ', rangeY);
    const spaceY = opts.stage.height() - 50
    const tick = findSuitableTickDivisor(rangeY[1])
    const howManyTicks = Math.ceil(rangeY[1] / tick) + 1
    const spaceBetweenEachTick = spaceY / (howManyTicks -1)
    console.log('howManyTicks: ', howManyTicks);

    this.shape = new Konva.Shape({
      x: 10,
      y: 10,
      progress: 0,
      stroke: 'black',
      strokeWidth: 4,
      sceneFunc: (ctx, shape) => {
        ctx.beginPath();
        ctx.moveTo(0, 0)
        ctx.lineTo(0, spaceY)
        console.log('drawing', range(4))
        range(howManyTicks).forEach(i => {
          console.log('i: ', i);
          ctx.moveTo(-5, spaceBetweenEachTick * i)
          ctx.lineTo(5, spaceBetweenEachTick * i)
        })


        ctx.fillStrokeShape(shape);

      }
    });

    opts.layer.add(this.shape)
  }

  animate = async () => {


    // sequential
    for (const dot of this.dots) {
      // const duration = 0.1
      dot.animate()
      // console.log('dot: ', dot);
      // await delay(300)
      // var tween = new Konva.Tween({
      //   node: this.shape,
      //   duration,
      //   progress: 1,
      //   // easing: Konva.Easings.EaseInOut
      // });
      // setTimeout(() => {
      //   tween.play();
      //   setTimeout(() => {
      //     tween.finish()
      //     this.shape.setAttr("progress", 0)
      //     this.endDotIndex++
      //   }, duration * 1000)

      // }, 200)
      // console.log(i)
      // await delay((duration * 1000));
    }
  }
}
