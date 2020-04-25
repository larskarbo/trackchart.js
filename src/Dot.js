import Konva from "konva";

export default class Dot {
  constructor(opts) {
    this.x = opts.x
    this.y = opts.y
    this.shape = new Konva.Shape({
      x: opts.x,
      y: opts.y,
      fill: "#352E2E",
      width: 100,
      height: 50,
      progress: 0,
      value: 0,
      sceneFunc: function(ctx, shape) {
        ctx.beginPath();
        const progress = shape.getAttr("progress");
        const radius = (5) * progress;
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fillStrokeShape(shape);
      }
    });

    opts.layer.add(this.shape)
  }

  animate = () => {
    var tween = new Konva.Tween({
      node: this.shape,
      duration: 0.4,
      progress: 1,
      easing: Konva.Easings.StrongEaseInOut
    });
    tween.play();
  }
}
