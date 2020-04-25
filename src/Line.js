import Konva from "konva";
import delay from "delay"
export default class Line {
  constructor(opts) {
    this.dots = opts.dots
    this.startDotIndex = 0
    this.endDotIndex = opts.dots.length -1
    this.shape = new Konva.Shape({
      x: 0,
      y: 0,
      // fill: "#352E2E",
      // width: 1000,
      // height: 5000,
      progress: 0,
      stroke: 'black',
      strokeWidth: 4,
      showNumber: 1,
      value: 0,
      lineJoin: "round",
      sceneFunc: (ctx, shape) => {
        ctx.beginPath();
        const dots = this.dots
        const i0 = this.startDotIndex
        const i = this.endDotIndex
        ctx.moveTo(dots[i0].x, dots[i0].y)
        dots.slice(i0, i + 1).forEach(d => {
          ctx.lineTo(d.x, d.y)
        })

        if (this.endDotIndex < dots.length - 1) {
          const progress = shape.getAttr("progress")
            const diff = {
              x: dots[i + 1].x - dots[i].x,
              y: dots[i + 1].y - dots[i].y,
            }
            ctx.lineTo(dots[i].x + progress * diff.x, dots[i].y + progress * diff.y)
          
        }
        // ctx.lineTo(0, 0)
        ctx.fillStrokeShape(shape);
      }
    });

    console.log('this.shape.zIndex()', this.shape.zIndex())

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
