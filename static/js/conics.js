window.setup_conics = function(args, is_setup_cb) {
  var canvasName = args.canvasName;
  var XMAX = args.xMax;
  var drawAxis = args.drawAxis || false;
  var canvas = document.getElementById(canvasName);
  // Create an empty project and a view for the canvas:
  paper.setup(canvas);
  // var XMAX = 30;
  var YMAX = XMAX;
  var XMIN = -XMAX;
  var YMIN = -YMAX;

  var width = paper.view.size.width;
  var height = paper.view.size.height;
  var centerX = paper.view.center.x;
  var centerY = paper.view.center.y;
  var scale = width / (XMAX - XMIN);

  var MSF = 5; // We compute values in at most MSF * XMAX

  function rotated_conic(a, c, d, e, f) {
    // Parabola resolved to y = ...
    if (Math.abs(a) < 1e-14) {
      var u1 = e / (2 * c);
      var u2 = -d / c;
      var u3 = -f / c;

      var segments1 = [];
      var segments2 = [];
      var N = 100;
      var x_0 = (-u3 - u1 * u1) / u2;
      for (var k = 0; k <= N; k++) {
        var x = x_0 + (k * 10) / N;
        var v = Math.sqrt(Math.max(u1 * u1 + u2 * x + u3, 0));
        var y1 = v - u1;
        var y2 = -v - u1;

        if (
          MSF * XMIN <= x &&
          x <= MSF * XMAX &&
          MSF * YMIN <= y1 &&
          y1 <= MSF * YMAX
        ) {
          segments1.push(new paper.Point(x, y1));
        }
        if (
          MSF * XMIN <= x &&
          x <= MSF * XMAX &&
          MSF * YMIN <= y1 &&
          y1 <= MSF * YMAX
        ) {
          segments2.push(new paper.Point(x, y2));
        }
      }
      var path1 = new paper.Path(segments1);
      var path2 = new paper.Path(segments2);
      var group = new paper.Group({
        children: [path1, path2]
      });

      return group;
    }
    // Parabola resolved to x = ...
    if (Math.abs(c) < 1e-14) {
      var u1 = e / (2 * a);
      var u2 = -d / a;
      var u3 = -f / a;

      var segments1 = [];
      var segments2 = [];
      var N = 100;
      var y_0 = (-u3 - u1 * u1) / u2;
      for (var k = 0; k <= N; k++) {
        var y = y_0 + (k * 10) / N;
        var v = Math.sqrt(Math.max(u1 * u1 + u2 * y + u3, 0));
        var x1 = v - u1;
        var x2 = -v - u1;

        if (
          MSF * XMIN <= x1 &&
          x1 <= MSF * XMAX &&
          MSF * YMIN <= y &&
          y <= MSF * YMAX
        ) {
          segments1.push(new paper.Point(x1, y));
        }
        if (
          MSF * XMIN <= x2 &&
          x2 <= MSF * XMAX &&
          MSF * YMIN <= y &&
          y <= MSF * YMAX
        ) {
          segments2.push(new paper.Point(x2, y));
        }
      }
      var path1 = new paper.Path(segments1);
      var path2 = new paper.Path(segments2);
      var group = new paper.Group({
        children: [path1, path2]
      });

      return group;
    }

    // apply scaling to account for 'f'
    var r = ((0.25 * d * d) / a + (0.25 * e * e) / c - f) / (a * c);
    a *= r;
    c *= r;
    d *= r;
    e *= r;

    // Parabola
    // Ellipse
    if (-a * c < 0) {
      var A = Math.sqrt(Math.abs(c));
      var B = Math.sqrt(Math.abs(a));
      var C1 = -d / (2 * a);
      var C2 = -e / (2 * c);

      var ellipse = new paper.Shape.Ellipse({
        position: [C1, C2],
        radius: [A, B]
      });

      return ellipse;
    }
    // Hyperbola
    else if (-a * c > 0) {
      var A = Math.sqrt(Math.abs(c));
      var B = Math.sqrt(Math.abs(a));
      var C1 = -d / (2 * a);
      var C2 = e / (2 * -c);

      var segments1 = [];
      var segments2 = [];
      maximum = Math.max(
        Math.acosh((XMAX + Math.abs(C1)) / A),
        Math.asinh((YMAX + Math.abs(C2)) / B)
      );
      var N = 50;

      for (var k = -N; k <= N; k++) {
        var t = (k * maximum) / N;
        var Acosh_t = A * Math.cosh(t);
        var Bsinh_t = B * Math.sinh(t);
        var x1 = Acosh_t + C1;
        var x2 = -Acosh_t + C1;
        var y = Bsinh_t + C2;
        if (
          MSF * XMIN <= x1 &&
          x1 <= MSF * XMAX &&
          MSF * YMIN <= y &&
          y <= MSF * YMAX
        ) {
          segments1.push(new paper.Point(x1, y));
        }
        if (
          MSF * XMIN <= x2 &&
          x2 <= MSF * XMAX &&
          MSF * YMIN <= y &&
          y <= MSF * YMAX
        ) {
          segments2.push(new paper.Point(x2, y));
        }
      }
      var path1 = new paper.Path(segments1);
      var path2 = new paper.Path(segments2);
      var group = new paper.Group({
        children: [path1, path2]
      });

      return group;
    }
  }

  function conic(A, B, C, D, E, F) {
    // We apply a change of coordinates such that in the end B = 0.
    // By this we remove any rotation component.
    var iscircle =
      Math.abs(C - A) < 1e-15 && Math.abs(D) < 1e-15 && Math.abs(E) < 1e-15;
    var theta = iscircle
      ? 0
      : Math.abs(C - A) < 1e-15
      ? Math.PI / 4
      : 0.5 * Math.atan(B / (A - C));

    var sin = Math.sin(theta);
    var cos = Math.cos(theta);
    var a = C * sin * sin + B * sin * cos + A * cos * cos;
    var b = 0;
    var c = A * sin * sin - B * sin * cos + C * cos * cos;
    var d = E * sin + D * cos;
    var e = -D * sin + E * cos;
    var f = F;

    return rotated_conic(a, c, d, e, f).rotate(
      (theta * 360) / (2 * Math.PI),
      new paper.Point(0, 0) // rotate around origin
    );
  }

  function enter(event) {
    this.opacity = 1.0;
  }

  function leave(event) {
    this.opacity = 1.0;
    // 0.4;
  }

  function leave_timeout(event) {
    window.setTimeout(leave.bind(this), 300);
  }

  function draw_conic(coeffs, options) {
    if (options === undefined) {
      options = {};
    }
    var c = conic(coeffs.a, coeffs.b, coeffs.c, coeffs.d, coeffs.e, coeffs.f);
    c.strokeColor = options.strokeColor || "#CB4335";
    c.strokeWidth = options.strokeWidth || 1;
    c.strokeScaling = false;
    c.opacity = options.opacity || 1.0;
    var animate = options.animate || false;

    var c = c
      .transform(new paper.Matrix(1, 0, 0, -1, centerX, centerY))
      .scale(scale, paper.view.center);

    if (animate) {
      c.opacity = 0.0;
      c.tweenTo({ opacity: 1.0 }, 600);
    }
    return c;
  }

  function remove_conic(conic) {
    // conic.remove();

    conic.tweenTo({ opacity: 0.0 }, 600);
    setTimeout(function() {
      conic.remove();
    }, 600);
    // conic.tweenTo({ opacity: 0.0 }, 500).then(function() {
    //   conic.remove();
    // });
  }

  window.remove_conic = remove_conic;
  window.draw_conic = draw_conic;
  window.project = paper.project;

  if (drawAxis) {
    // marks and ticks
    var marks = [];
    var ticks = [];
    for (var k = 5; k < YMAX; k += 5) {
      marks.push(
        new paper.PointText({
          point: [-5, -k * scale + 3],
          justification: "right",
          content: String(k)
        }),
        new paper.PointText({
          point: [-5, k * scale + 3],
          justification: "right",
          content: String(-k)
        }),
        new paper.PointText({
          point: [k * scale, 12],
          justification: "center",
          content: String(k)
        }),
        new paper.PointText({
          point: [-k * scale, 12],
          justification: "center",
          content: String(-k)
        })
      );

      ticks.push(new paper.Path([-2, k * scale], [2, k * scale]));
      ticks.push(new paper.Path([-2, -k * scale], [2, -k * scale]));
      ticks.push(new paper.Path([k * scale, -2], [k * scale, 2]));
      ticks.push(new paper.Path([-k * scale, -2], [-k * scale, 2]));
    }
    var marksGroup = new paper.Group({
      children: marks,
      fontWeight: 400,
      fontSize: 12,
      fillColor: "black",
      opacity: 0.7
    }).translate(0.5 * width, 0.5 * height);

    var ticksGroup = new paper.Group({
      children: ticks,
      strokeColor: "black",
      opacity: 0.7
    }).translate(0.5 * width, 0.5 * height);

    var xAxis = new paper.Path([0, -0.5 * width], [0, 0.5 * width]).translate(
      0.5 * width,
      0.5 * height
    );
    var yAxis = new paper.Path([-0.5 * height, 0], [0.5 * height, 0]).translate(
      0.5 * width,
      0.5 * height
    );
    var axisGroup = new paper.Group({
      children: [xAxis, yAxis],
      // Set the stroke color of all items in the group:
      strokeScaling: false,
      strokeColor: "black",
      opacity: 0.7
    });
  }

  if (is_setup_cb !== undefined) {
    is_setup_cb();
  }
};
