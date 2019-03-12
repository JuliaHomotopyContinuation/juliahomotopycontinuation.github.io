"use strict";

const COMPUTE_URL = "https://c107-250.cloud.gwdg.de/conics";
const e = React.createElement;
const tangentialConicColor = "#FB5B5B";
const givenConicColor = "#25A9CC";
const XMAX = 20;

function even(x) {
  return x % 2 == 0 ? x : x + 1;
}

function conicHasNoSolutions(A, B, C, D, E, F) {
  // Check whether the conic has no real solutions
  // by checking that the associated matrix is neither
  // positive definite nor negative definite
  // using Sylvester's criterion
  var m1 = 2 * A;
  var m2 = 4 * A * C - B * B;
  var m3 =
    8 * A * C * F -
    2 * A * E * E -
    2 * B * B * F +
    2 * B * D * E -
    2 * C * D * D;

  return (m1 > 0 && m2 > 0 && m3 > 0) || (m1 < 0 && m2 < 0 && m3 < 0);
}

function random_conic_state() {
  var a = random_number();
  var b = random_number();
  var c = random_number();
  var d = random_number();
  var e = random_number();
  var f = random_number();

  while (window.conicHasNoSolutions(a, b, c, d, e, f)) {
    a = random_number();
    b = random_number();
    c = random_number();
    d = random_number();
    e = random_number();
    f = random_number();
  }
  return { a: a, b: b, c: c, d: d, e: e, f: f };
}

function random_number() {
  var x = Math.round((Math.random() * 10 - 5) * 10) / 10;
  while (x === 0.0) {
    x = Math.round((Math.random() * 10 - 5) * 10) / 10;
  }
  return x;
}

function random_conic_input_state() {
  var values = {
    a: random_number(),
    b: random_number(),
    c: random_number(),
    d: random_number(),
    e: random_number(),
    f: random_number()
  };

  return {
    fields: {
      a: String(values.a),
      b: String(values.b),
      c: String(values.c),
      d: String(values.d),
      e: String(values.e),
      f: String(values.f)
    },
    values: values
  };
}

function coeffsToString(coeffs) {
  return (
    coeffs.a +
    " x^2 " +
    (coeffs.b < 0 ? coeffs.b : " + " + coeffs.b) +
    " xy " +
    (coeffs.c < 0 ? coeffs.c : " + " + coeffs.c) +
    " y^2 " +
    (coeffs.d < 0 ? coeffs.d : " + " + coeffs.d) +
    " x " +
    (coeffs.e < 0 ? coeffs.e : " + " + coeffs.e) +
    " y " +
    (coeffs.f < 0 ? coeffs.f : " + " + coeffs.f)
  );
}

function round(x) {
  return Math.round(x * 100) / 100;
}

function coeffsToStringRounded(coeffs) {
  var a = round(coeffs.a);
  var b = round(coeffs.b);
  var c = round(coeffs.c);
  var d = round(coeffs.d);
  var e = round(coeffs.e);
  var f = round(coeffs.f);
  return (
    round(coeffs.a) +
    " x^2 " +
    (b < 0 ? b : " + " + b) +
    " xy " +
    (c < 0 ? c : " + " + c) +
    " y^2 " +
    (d < 0 ? d : " + " + d) +
    " x " +
    (e < 0 ? e : " + " + e) +
    " y " +
    (f < 0 ? f : " + " + f)
  );
}

function postData(url, data) {
  // Default options are marked with *
  return fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, cors, *same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow", // manual, *follow, error
    // referrer: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  }).then(
    function(response) {
      return response.json();
    }.bind(this)
  ); // parses response to JSON
}

function conicsToString(given_conics, conics) {
  var str =
    "# A conic is represented by a single line. The coefficients are in the order a,b,c,d,e,f where ax^2+bxy+cy^2+dx+ey+f=0 separeted by a tab (\\t).  The first block are the 5 given conics and the second block are the real conics tangent to those 5 conics.\n";
  str += "\n";

  str +=
    given_conics[0].a +
    "\t" +
    given_conics[0].b +
    "\t" +
    given_conics[0].c +
    "\t" +
    given_conics[0].d +
    "\t" +
    given_conics[0].e +
    "\t" +
    given_conics[0].f +
    "\n";
  str +=
    given_conics[1].a +
    "\t" +
    given_conics[1].b +
    "\t" +
    given_conics[1].c +
    "\t" +
    given_conics[1].d +
    "\t" +
    given_conics[1].e +
    "\t" +
    given_conics[1].f +
    "\n";
  str +=
    given_conics[2].a +
    "\t" +
    given_conics[2].b +
    "\t" +
    given_conics[2].c +
    "\t" +
    given_conics[2].d +
    "\t" +
    given_conics[2].e +
    "\t" +
    given_conics[2].f +
    "\n";
  str +=
    given_conics[3].a +
    "\t" +
    given_conics[3].b +
    "\t" +
    given_conics[3].c +
    "\t" +
    given_conics[3].d +
    "\t" +
    given_conics[3].e +
    "\t" +
    given_conics[3].f +
    "\n";
  str +=
    given_conics[4].a +
    "\t" +
    given_conics[4].b +
    "\t" +
    given_conics[4].c +
    "\t" +
    given_conics[4].d +
    "\t" +
    given_conics[4].e +
    "\t" +
    given_conics[4].f +
    "\n";

  str += "\n";
  for (var i = 0; i < conics.length; i++) {
    str +=
      conics[i][0] +
      "\t" +
      conics[i][1] +
      "\t" +
      conics[i][2] +
      "\t" +
      conics[i][3] +
      "\t" +
      conics[i][4] +
      "\t1\n";
  }

  return str;
}

function complexToString(re, im) {
  return im < 0 ? re + " - " + Math.abs(im) + "i" : re + "+ " + im + "i";
}
function complexToStringCoeff(re, im) {
  return "(" + complexToString(re, im) + ")";
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

class InlineMath extends React.Component {
  constructor(props) {
    super(props);
    var math = props.math ? props.math : props.children;
    this.state = {
      math: window.katex.renderToString(math, {
        displayMode: props.displayMode || false
      })
    };
  }

  componentDidUpdate(prevProps) {
    var math = this.props.math ? this.props.math : this.props.children;
    var oldMath = prevProps.math ? prevProps.math : prevProps.children;
    if (math !== oldMath) {
      this.setState({
        math: window.katex.renderToString(math, {
          displayMode: this.props.displayMode
        })
      });
    }
  }

  render() {
    return e("span", { dangerouslySetInnerHTML: { __html: this.state.math } });
  }
}

class ConicInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = random_conic_input_state();

    this.updateCoeff = this.updateCoeff.bind(this);
    this.inputStyle = this.inputStyle.bind(this);
    this.fieldIsValid = this.fieldIsValid.bind(this);
    this.allFieldsValid = this.allFieldsValid.bind(this);
    this.addConic = this.addConic.bind(this);
  }

  componentDidMount() {
    var values = this.state.values;
    if (this.props.initialCoeffs) {
      values = this.props.initialCoeffs;
    }
    this.setState({
      fields: {
        a: String(values.a),
        b: String(values.b),
        c: String(values.c),
        d: String(values.d),
        e: String(values.e),
        f: String(values.f)
      },
      values: values
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.initialCoeffs && this.props.initialCoeffs) {
      if (prevProps.random_id !== this.props.random_id) {
        var values = this.props.initialCoeffs;
        this.setState({
          fields: {
            a: String(values.a),
            b: String(values.b),
            c: String(values.c),
            d: String(values.d),
            e: String(values.e),
            f: String(values.f)
          },
          values: values
        });
      }
    }
  }

  updateCoeff(coeff, event) {
    var values = Object.assign({}, this.state.values, {
      [coeff]: parseFloat(event.target.value)
    });
    var fields = Object.assign({}, this.state.fields, {
      [coeff]: event.target.value
    });
    this.setState({
      fields: fields,
      values: values
    });
    if (this.props.onChange) {
      this.props.onChange(values);
    }
  }

  fieldIsValid(coeff) {
    var field = this.state.fields[coeff];
    if (field.endsWith(".")) {
      field = field.slice(0, -1);
    }
    return String(this.state.values[coeff]) === field;
  }

  inputStyle(coeff) {
    return this.fieldIsValid(coeff)
      ? {}
      : { backgroundColor: "rgba(203, 67, 53, 0.8)" };
  }

  allFieldsValid() {
    return (
      this.fieldIsValid("a") &&
      this.fieldIsValid("b") &&
      this.fieldIsValid("c") &&
      this.fieldIsValid("d") &&
      this.fieldIsValid("e") &&
      this.fieldIsValid("f")
    );
  }

  addConic() {
    this.props.onAdd(Object.assign({}, this.state.values));
    this.setState(random_conic_state());
    return;
  }

  render() {
    return e(
      "div",
      {
        style: {
          marginTop: 4,
          marginBottom: 4,
          height: 32,
          display: "flex",
          alignItems: "center"
        }
      },
      e(
        "div",
        {
          className: "ConicInput-container"
        },
        e("input", {
          className: "ConicInput-input",
          value: this.state.fields.a,
          style: this.inputStyle("a"),
          onChange: function(ev) {
            return this.updateCoeff("a", ev);
          }.bind(this)
        }),
        e(InlineMath, { math: "x^2+" }),
        e("input", {
          className: "ConicInput-input",
          value: this.state.fields.b,
          style: this.inputStyle("b"),
          onChange: function(ev) {
            return this.updateCoeff("b", ev);
          }.bind(this)
        }),
        e(InlineMath, { math: "xy+" }),
        e("input", {
          className: "ConicInput-input",
          value: this.state.fields.c,
          style: this.inputStyle("c"),
          onChange: function(ev) {
            return this.updateCoeff("c", ev);
          }.bind(this)
        }),
        e(InlineMath, { math: "y^2+" }),
        e("input", {
          className: "ConicInput-input",
          value: this.state.fields.d,
          style: this.inputStyle("d"),
          onChange: function(ev) {
            return this.updateCoeff("d", ev);
          }.bind(this)
        }),
        e(InlineMath, { math: "x+" }),
        e("input", {
          className: "ConicInput-input",
          value: this.state.fields.e,
          style: this.inputStyle("e"),
          onChange: function(ev) {
            return this.updateCoeff("e", ev);
          }.bind(this)
        }),
        e(InlineMath, { math: "y+" }),
        e("input", {
          className: "ConicInput-input",
          value: this.state.fields.f,
          style: this.inputStyle("f"),
          onChange: function(ev) {
            return this.updateCoeff("f", ev);
          }.bind(this)
        })
      ),
      e("div", { className: "ConicInput-plus", onClick: this.addConic })
    );
  }
}

class CustomInput extends React.Component {
  constructor(props) {
    super(props);

    var random_conics = [1, 2, 3, 4, 5].map(random_conic_state);
    var random_id = Math.random();
    this.state = {
      conics: [null, null, null, null, null],
      random_id: random_id,
      given_conics: random_conics,
      canvasSetUp: false,
      isComputing: false,
      computed: null,
      tangential_conics: [],
      tangential_conic_index: 0,
      isRendering: false,
      inputKey: 0
    };

    this.canvas = null;

    this.setCanvasRef = function(canvas) {
      var ctx = canvas.getContext("2d");
      ctx.canvas.height = ctx.canvas.width;
      this.canvas = canvas;
    }.bind(this);

    this.onConicRendered = function(allConicsRendered) {
      this.setState({ allConicsRendered: allConicsRendered });
    }.bind(this);

    this.addConic = this.addConic.bind(this);
    this.renderConic = this.renderConic.bind(this);
    this.removeConic = this.removeConic.bind(this);
    this.changeInputConic = this.changeInputConic.bind(this);
    this.allConicsRendered = this.allConicsRendered.bind(this);
    this.fetchTangentConics = this.fetchTangentConics.bind(this);
    this.renderTangentialConic = this.renderTangentialConic.bind(this);
    this.renderAllTangentialConics = this.renderAllTangentialConics.bind(this);
    this.startStopRendering = this.startStopRendering.bind(this);
    this.removeOldData = this.removeOldData.bind(this);
    this.downloadRealData = this.downloadRealData.bind(this);
    this.downloadComplexData = this.downloadComplexData.bind(this);
  }

  componentDidMount() {
    window.setup_conics(
      {
        canvasName: "CustomInput",
        xMax: XMAX,
        drawAxis: true
      },
      function() {
        this.setState({ canvasSetUp: true });
      }.bind(this)
    );
  }

  removeOldData() {
    if (this.state.computed) {
      for (var i = 0; i < this.state.tangential_conics.length; i++) {
        var conic = this.state.tangential_conics[i].rendered;
        window.remove_conic(conic);
      }
      this.state.tangential_conics = [];
      this.state.tangential_conics_index = 0;
      this.state.computed = null;
      this.startStopRendering();
    }
  }

  allConicsRendered() {
    for (var k = 0; k < 5; k++) {
      if (this.state.conics[k] === null) {
        return false;
      }
    }
    return true;
  }

  addConic(values, i) {
    var rendered = window.draw_conic(values, {
      strokeColor: givenConicColor,
      opacity: 0.7,
      strokeWidth: 2
    });

    if (rendered !== null) {
      var conics = this.state.conics;
      conics[i] = { rendered: rendered, coeffs: values };
      this.setState({ conics: conics });
    } else {
      alert("The given conic has no real solutions!");
    }

    return;
  }

  removeConic(i) {
    var conics = this.state.conics;
    conics[i].rendered.remove();
    conics[i] = null;
    this.setState({ conics: conics });
  }

  renderConic(conic, i) {
    var coeffs = conic.coeffs;
    var str = coeffsToString(coeffs);
    return e(
      "div",
      {
        key: str,
        style: {
          marginTop: 4,
          marginBottom: 4,
          height: 32,
          display: "flex",
          alignItems: "center"
        }
      },
      e(
        "div",
        {
          style: {
            justifyContent: "center",
            display: "flex",
            flex: 1
          }
        },
        e(InlineMath, { math: str })
      ),
      e("div", {
        className: "InputConics-minus",
        onClick: function() {
          this.removeConic(i);
          this.removeOldData();
        }.bind(this)
      })
    );
  }

  changeInputConic(i, coeffs) {
    var given_conics = this.state.given_conics.slice();
    given_conics[i] = coeffs;

    this.setState({ given_conics: given_conics });
  }

  fetchTangentConics() {
    var conics = this.state.given_conics;
    postData(COMPUTE_URL, { conics: conics })
      .then(
        function(data) {
          this.removeOldData();
          this.setState({ computed: data }, this.startStopRendering);
        }.bind(this)
      ) // JSON-string from `response.json()` call
      .catch(
        function(error) {
          console.error(error);
          alert("Something went wrong :(");
        }.bind(this)
      )
      .then(
        function() {
          this.setState({ isComputing: false });
        }.bind(this)
      );

    this.setState({ isComputing: true });
  }

  renderTangentialConic() {
    var conics = this.state.tangential_conics;

    if (conics.length === 2) {
      var conic = conics[0].rendered;
      window.remove_conic(conic);
      conics.shift();
      return;
    }

    var i = this.state.tangential_conic_index;
    var coeffs_array = this.state.computed.tangential_conics[i];
    var coeffs = {
      a: coeffs_array[0],
      b: coeffs_array[1],
      c: coeffs_array[2],
      d: coeffs_array[3],
      e: coeffs_array[4],
      f: 1
    };

    var rendered = window.draw_conic_with_tangential_points(
      coeffs,
      this.state.computed.tangential_points[i],
      {
        strokeColor: tangentialConicColor,
        strokeWidth: 2,
        opacity: 1.0,
        animate: true
      }
    );
    conics.push({ rendered: rendered, coeffs: coeffs });
    this.setState({
      tangential_conics: conics,
      tangential_conic_index:
        (this.state.tangential_conic_index + 1) %
        this.state.computed.tangential_conics.length
    });
  }

  renderAllTangentialConics() {
    this.renderAllConicsIntervall = setInterval(
      this.renderTangentialConic,
      1500
    );
  }

  startStopRendering() {
    if (this.renderAllConicsIntervall) {
      clearInterval(this.renderAllConicsIntervall);
      this.renderAllConicsIntervall = undefined;
      this.setState({ isRendering: false });
    } else if (
      this.state.computed &&
      this.state.computed.tangential_conics.length
    ) {
      this.renderAllTangentialConics();
      this.setState({ isRendering: true });
    }
  }

  downloadRealData() {
    var str = conicsToString(
      this.state.given_conics,
      this.state.computed.tangential_conics
    );
    download("real_data.txt", str);
  }

  downloadComplexData() {
    var complexConics = [];
    var real = this.state.computed.complex_solutions.real;
    var imag = this.state.computed.complex_solutions.imag;
    for (var i = 0; i < real.length; i++) {
      complexConics.push([
        complexToString(real[i][0], imag[i][0]),
        complexToString(real[i][1], imag[i][1]),
        complexToString(real[i][2], imag[i][2]),
        complexToString(real[i][3], imag[i][3]),
        complexToString(real[i][4], imag[i][4]),
        complexToString(real[i][5], imag[i][5])
      ]);
    }
    var str = conicsToString(this.state.given_conics, complexConics);
    download("complex_data.txt", str);
  }

  render() {
    return e(
      "div",
      {},
      e(
        "div",
        {
          style: {
            marginLeft: 2,
            marginBottom: 4,
            textAlign: "left",
            fontWeight: "bold",
            display: "flex"
          }
        },
        "Your five given conics:",
        e(
          "button",
          {
            className: "button outline",
            style: {
              marginLeft: "auto"
            },
            onClick: function() {
              var given_conics = [1, 2, 3, 4, 5].map(random_conic_state);
              var conics = [null, null, null, null, null];
              this.state.conics.forEach(function(el) {
                if (el !== null) {
                  el.rendered.remove();
                }
              });
              var random_id = Math.random();
              this.setState({
                given_conics: given_conics,
                conics: conics,
                random_id: random_id
              });
              this.removeOldData();
            }.bind(this)
          },
          "New random conics."
        )
      ),
      e(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }
        },
        e(
          "div",
          {
            className: "RenderedInputConics-container"
          },
          [0, 1, 2, 3, 4].map(
            function(i) {
              if (this.state.conics[i] === null) {
                return e(ConicInput, {
                  key: i,
                  onChange: function(coeffs) {
                    this.changeInputConic(i, coeffs);
                  }.bind(this),
                  onAdd: function(v) {
                    this.addConic(v, i);
                  }.bind(this),
                  random_id: this.state.random_id,
                  initialCoeffs: this.state.given_conics[i]
                });
              } else {
                return this.renderConic(this.state.conics[i], i);
              }
            }.bind(this)
          )
        ),

        this.state.isComputing
          ? e(
              "button",
              { className: "CustomInput-button computing" },

              "Computing",
              e("span", null, "."),
              e("span", null, "."),
              e("span", null, ".")
            )
          : e(
              "button",
              {
                className: this.allConicsRendered()
                  ? "CustomInput-button"
                  : "CustomInput-button-disabled",
                onClick: this.allConicsRendered()
                  ? this.fetchTangentConics
                  : function() {
                      alert(
                        "You need to add all 5 conics by pressing the + buttons."
                      );
                    }
              },
              "Compute tangent conics"
            ),

        this.state.computed
          ? e(
              "div",
              { style: { display: "inline-block", marginLeft: 4 } },
              e(
                "strong",
                null,
                " ",
                this.state.computed.complex_solutions.real.length,
                " "
              ),
              "complex solutions found in",
              e("strong", null, " ", this.state.computed.compute_time, " "),
              "seconds.",
              e(
                "div",
                null,
                e("strong", null, " ", even(this.state.computed.nreal), " "),
                "solutions are real: ",
                e("strong", null, " ", this.state.computed.nellipses, " "),
                "ellipses and ",
                e("strong", null, " ", this.state.computed.nhyperbolas, " "),
                "hyperbolas."
              )
            )
          : e(
              "div",
              { style: { display: "inline-block", marginLeft: 4 } },
              e("strong", null, " ? "),
              "complex solutions found in",
              e("strong", null, " ? "),
              "seconds.",
              e(
                "div",
                null,
                e("strong", null, " ? "),
                "solutions are real: ",
                e("strong", null, " ? "),
                "ellipses and ",
                e("strong", null, " ? "),
                "hyperbolas."
              )
            ),
        e(
          "div",
          {
            style: {
              fontSize: 14,
              color: tangentialConicColor,
              marginBottom: 12,
              marginLeft: "auto",
              marginTop: 12,
              minHeight: 32
            }
          },
          this.state.tangential_conics.length
            ? e(InlineMath, {
                math: coeffsToStringRounded(
                  this.state.tangential_conics[
                    this.state.tangential_conics.length - 1
                  ].coeffs
                )
              })
            : null
        ),
        e("canvas", {
          resize: "true",
          ref: this.setCanvasRef,
          id: "CustomInput",
          className: "CustomInput-canvas"
        }),
        this.state.computed === null
          ? null
          : e(
              "div",
              { style: { width: "100%" } },
              e(
                "div",
                { style: { display: "flex", justifyContent: "center" } },
                e(
                  "button",
                  { onClick: this.startStopRendering },
                  this.state.isRendering
                    ? "Pause Animation"
                    : "Restart Animation"
                )
              ),
              e("hr", { style: { marginTop: 10 } }),
              e(
                "div",
                {
                  style: {
                    marginTop: 10,
                    display: "flex",
                    justifyContent: "space-evenly"
                  }
                },
                e(
                  "button",
                  {
                    onClick: this.downloadRealData,
                    style: { marginRight: 10 }
                  },
                  "Download real conics"
                ),
                e(
                  "button",
                  {
                    onClick: this.downloadComplexData,
                    style: { marginLeft: 10 }
                  },
                  "Download all conics"
                )
              ),
              e("hr", { style: { marginTop: 16, marginBottom: 6 } }),
              !this.state.computed.looks_most_like_a_circle
                ? null
                : e(
                    "div",
                    // { style: { marginTop: 12 } },
                    null,
                    e(
                      "strong",
                      null,
                      "The conic which looks most like a circle:"
                    ),
                    e(
                      "div",
                      {
                        style: {
                          // display: "inline-block",
                          fontSize: 12,
                          marginLeft: 8
                        }
                      },
                      e(InlineMath, {
                        displayMode: true,
                        math: coeffsToStringRounded({
                          a: this.state.computed.looks_most_like_a_circle[0],
                          b: this.state.computed.looks_most_like_a_circle[1],
                          c: this.state.computed.looks_most_like_a_circle[2],
                          d: this.state.computed.looks_most_like_a_circle[3],
                          e: this.state.computed.looks_most_like_a_circle[4],
                          f: 1
                        })
                      })
                    )
                  ),
              e(
                "div",
                null,
                e("strong", null, "The conic furthest away from being real:"),
                e(
                  "div",
                  {
                    style: {
                      // display: "inline-block",
                      fontSize: 12,
                      marginLeft: 8
                    }
                  },
                  e(InlineMath, {
                    displayMode: true,
                    math: coeffsToString({
                      a: complexToStringCoeff(
                        round(this.state.computed.is_most_complex.real[0]),
                        round(this.state.computed.is_most_complex.imag[0])
                      ),
                      b: complexToStringCoeff(
                        round(this.state.computed.is_most_complex.real[1]),
                        round(this.state.computed.is_most_complex.imag[1])
                      ),
                      c: complexToStringCoeff(
                        round(this.state.computed.is_most_complex.real[2]),
                        round(this.state.computed.is_most_complex.imag[2])
                      ),
                      d: complexToStringCoeff(
                        round(this.state.computed.is_most_complex.real[3]),
                        round(this.state.computed.is_most_complex.imag[3])
                      ),
                      e: complexToStringCoeff(
                        round(this.state.computed.is_most_complex.real[4]),
                        round(this.state.computed.is_most_complex.imag[4])
                      ),
                      f: 1
                    })
                  })
                )
              ),
              e(
                "div",
                null,
                e(
                  "strong",
                  null,
                  "The conic which is furthest away from being degenerate:"
                ),
                e(
                  "div",
                  {
                    style: {
                      // display: "inline-block",
                      fontSize: 12,
                      marginLeft: 8
                    }
                  },
                  e(InlineMath, {
                    displayMode: true,
                    math: coeffsToString({
                      a: complexToStringCoeff(
                        round(this.state.computed.most_nondeg.real[0]),
                        round(this.state.computed.most_nondeg.imag[0])
                      ),
                      b: complexToStringCoeff(
                        round(this.state.computed.most_nondeg.real[1]),
                        round(this.state.computed.most_nondeg.imag[1])
                      ),
                      c: complexToStringCoeff(
                        round(this.state.computed.most_nondeg.real[2]),
                        round(this.state.computed.most_nondeg.imag[2])
                      ),
                      d: complexToStringCoeff(
                        round(this.state.computed.most_nondeg.real[3]),
                        round(this.state.computed.most_nondeg.imag[3])
                      ),
                      e: complexToStringCoeff(
                        round(this.state.computed.most_nondeg.real[4]),
                        round(this.state.computed.most_nondeg.imag[4])
                      ),
                      f: 1
                    })
                  })
                )
              )
            )
      )
    );
  }
}

const domContainer = document.querySelector("#do-it-yourself-container");
ReactDOM.render(e(CustomInput), domContainer);
