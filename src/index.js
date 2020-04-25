import Konva from "konva";
import Dot from "./Dot";
import Line from "./Line";
import Axis from "./Axis";
import moment from "moment";
import Color from "color";
import * as d3 from "d3";

const PADDING = 10;
export default class StreamChart {
  options = {
    color: "#219653"
  };
  dots = [];
  texts = [];

  constructor(divref, options = {}) {
    console.log("options: ", options);
    this.options = {
      ...this.options,
      ...options
    };

    // first we need to create a stage

    var stage = (this.stage = new Konva.Stage({
      container: divref, // id of container <div>
      width: divref.offsetWidth,
      height: 400
    }));

    this.layer = new Konva.Layer();

      

    var xaxis = new Konva.Line({
      points: [
        PADDING,
        stage.height() - PADDING,
        stage.width() - PADDING,
        stage.height() - PADDING
      ],
      stroke: "#373737",
      strokeWidth: 1,
      lineCap: "round",
      lineJoin: "round",
      dash: [0, 2000]
    });

    this.leftText = new Konva.Text({
      x: PADDING,
      y: stage.height() - PADDING - 20,
      text: "startDate",
      fontSize: 20,
      fontFamily: "system-ui",
      fill: "black"
      // wrap: "none"
    });

    this.rightText = this.leftText.clone({
      x: stage.width() - PADDING - 100,
      text: "endDate"
    });

    // var connector = new Konva.Shape({
    //   x: -100,
    //   y: 200,
    //   fill: "#352E2E",
    //   width: 100,
    //   height: 50,
    //   progress: 0,
    //   sceneFunc: function(ctx, shape) {
    //     ctx.beginPath();

    //     ctx.arc(0, 0, 5 * shape.getAttr("progress"), 0, Math.PI * 2);

    //     ctx.fillStrokeShape(shape);
    //   }
    // });

    // add the shape to the layer
    this.layer.add(xaxis);
    this.layer.add(this.rightText);
    this.layer.add(this.leftText);

    // add the this.layer to the stage
    stage.add(this.layer);

    // draw the image
    this.layer.draw();

    // var anim = new Konva.Animation(function(frame) {
    //   var time = frame.time
    //   if (time > 4000) {
    //     shape.setAttr("progress", 1);
    //     return anim.stop();
    //   }
    //   shape.setAttr("progress", time / 1000);
    // }, this.layer);

    // anim.start();

    // var tween = new Konva.Tween({
    //   node: shape,
    //   duration: 0.2,
    //   progress: 1,
    //   easing: Konva.Easings.EaseInOut
    // });

    var tween2 = new Konva.Tween({
      node: xaxis,
      duration: 1,
      dash: [2000, 0],
      easing: Konva.Easings.EaseInOut
    });

    // tween.play();
    tween2.play();

    // requestAnimationFrame(this.loop);

    this.window = {
      startDate: moment().subtract(3, "months"),
      endDate: moment()
    };
  }

  data = data => {


    


    this.sortedData = data
      .map(a => {
        return {
          ...a,
          date: moment(a.date)
        };
      })
      .sort((a, b) => a.date.diff(b.date));
    this.window.startDate = moment(this.sortedData[0].date);
    const calcedData = this.sortedData.map(this.calc);

    const dots = calcedData.map(d => {
      return new Dot({
        x: d.pos.x,
        y: d.pos.y,
        stage: this.stage,
        layer: this.layer,
      })
    })

    const line = new Line({
      dots,
      stage: this.stage,
      layer: this.layer,
    })

    line.animate()


    const axis = new Axis({
      data: calcedData,
      stage: this.stage,
      layer: this.layer,
    })

    return

    // create our shape
    this.polyLine = new Konva.Line({
      points: calcedData.reduce((acc, cur) => {
        return [...acc, cur.pos.x, cur.pos.y];
      }, []),
      stroke: "#373737",
      strokeWidth: 1,
      lineCap: "round",
      lineJoin: "round",
      /*
       * line segments with a length of 29px with a gap
       * of 20px followed by a line segment of 0.001px (a dot)
       * followed by a gap of 20px
       */
      dash: [0, 2000]
    });

    this.layer.add(this.polyLine);

    var tween = new Konva.Tween({
      node: this.polyLine,
      duration: 4,
      dash: [2000, 0],
      easing: Konva.Easings.EaseInOut
    });
    tween.play();

    calcedData.forEach((d, i) => {
      const s = this.baseShape.clone({
        ...d.pos,
        value: d.value,
        fill: tweenColor("#352E2E", this.options.color, d.value / 106)
      });
      this.dots.push(s);
      this.layer.add(s);
      var tween = new Konva.Tween({
        node: s,
        duration: 0.5,
        progress: 1,
        easing: Konva.Easings.EaseInOut
      });
      const text = new Konva.Text({
        ...d.pos,
        text: d.value,
        fontSize: 10,
        fontFamily: "system-ui",
        fill: "white",
        align: "center",
        verticalAlign: "middle"
        // wrap: "none"
      });
      this.texts.push(text);
      text.y(text.y() - text.getHeight() / 2);
      text.x(text.x() - text.getWidth() / 2);
      // console.log(text.getHeight())

      // align text to right
      // text.align("right");

      this.layer.add(text);
      setTimeout(() => {
        tween.play();
      }, i * 50);
    });
  };

  setPeriod = (number, period) => {
    if (number == "all-time") {
      this.setWindow(moment(this.sortedData[0].date), moment());
    } else {
      this.setWindow(moment().subtract(number, period), moment());
    }
  };

  setWindow = (startDate, endDate) => {
    this.window = {
      startDate,
      endDate
    };
    console.log("this.window: ", this.window);
    this.leftText.text(startDate.format("MMMM Do YYYY"));
    this.rightText.text(endDate.format("MMMM Do YYYY"));

    const calcedData = this.sortedData.map(this.calc);

    this.dots.forEach((d, i) => {
      var tween = new Konva.Tween({
        node: d,
        duration: 0.2,
        x: calcedData[i].pos.x,
        y: calcedData[i].pos.y,
        easing: Konva.Easings.EaseInOut
      });
      tween.play();
      const text = this.texts[i];

      const y = calcedData[i].pos.y - text.getHeight() / 2;
      const x = calcedData[i].pos.x - text.getWidth() / 2;
      var tween = new Konva.Tween({
        node: text,
        duration: 0.2,
        x,
        y,
        easing: Konva.Easings.EaseInOut
      });
      tween.play();
    });
    var tween = new Konva.Tween({
      node: this.polyLine,
      duration: 0.2,
      points: calcedData.reduce((acc, cur) => {
        return [...acc, cur.pos.x, cur.pos.y];
      }, []),
      easing: Konva.Easings.EaseInOut
    });
    tween.play();
  };

  loop = () => {
    requestAnimationFrame(this.loop);
  };

  calc = d => {
    return {
      ...d,
      pos: {
        x:
          10 + (this.stage.width() - 20) *
          tweenDate(this.window.startDate, this.window.endDate, d.date),
        y: this.stage.height() - (this.stage.height() * d.value) / 130
      }
    };
  };
}

function tweenDate(startDate, endDate, myDate) {
  const whole = endDate.diff(startDate, "days");

  const my = moment(myDate).diff(startDate, "days");

  return my / whole;
}

function tweenColor(color1, color2, progress) {
  var c1 = Color(color1)
    .rgb()
    .array();
  var c2 = Color(color2)
    .rgb()
    .array();
  const diff = c2.map((v, i) => v - c1[i]);

  const newColor = c1.map((v, i) => v + diff[i] * progress);
  return Color.rgb(newColor).hex();
}
