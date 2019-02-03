"use strict";

const COMPUTE_URL = location.protocol + "//localhost:3264/conics";

const e = React.createElement;
const conicColors = ["#9b59b6", "#c0392b", "#f1c40f", "#2ecc71", "#3498db"];

function random_conic_state() {
  var values = {
    a: random_number(),
    b: random_number(),
    c: random_number(),
    d: random_number(),
    e: random_number(),
    f: random_number()
  };

  return values;
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
          displayMode: props.displayMode
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
          style: {
            display: "flex",
            minWidth: 462,
            alignItems: "center",
            flex: 1
          }
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

    this.state = {
      conics: [null, null, null, null, null],
      given_conics: [1, 2, 3, 4, 5].map(random_conic_state),
      canvasSetUp: false,
      isComputing: false,
      computed: null,
      tangential_conics: [],
      tangential_conic_index: 0,
      isRendering: false
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
  }

  componentDidMount() {
    window.setup_conics(
      {
        canvasName: "CustomInput",
        xMax: 12,
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
    var rendered = window.draw_conic(values, { strokeColor: conicColors[4] });
    var conics = this.state.conics;
    conics[i] = { rendered: rendered, coeffs: values };
    this.setState({ conics: conics });

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
            minWidth: 462,
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
    var c = this.state.given_conics;
    var conics = [
      [
        c[0].a / c[0].f,
        c[0].b / c[0].f,
        c[0].c / c[0].f,
        c[0].d / c[0].f,
        c[0].e / c[0].f
      ],
      [
        c[1].a / c[1].f,
        c[1].b / c[1].f,
        c[1].c / c[1].f,
        c[1].d / c[1].f,
        c[1].e / c[1].f
      ],
      [
        c[2].a / c[2].f,
        c[2].b / c[2].f,
        c[2].c / c[2].f,
        c[2].d / c[2].f,
        c[2].e / c[2].f
      ],
      [
        c[3].a / c[3].f,
        c[3].b / c[3].f,
        c[3].c / c[3].f,
        c[3].d / c[3].f,
        c[3].e / c[3].f
      ],
      [
        c[4].a / c[4].f,
        c[4].b / c[4].f,
        c[4].c / c[4].f,
        c[4].d / c[4].f,
        c[4].e / c[4].f
      ]
    ];

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
          alert("Somethign went wrong :(");
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

    var rendered = window.draw_conic(coeffs, {
      strokeColor: conicColors[5],
      opacity: 1.0,
      animate: true
    });
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
            fontWeight: "bold"
          }
        },
        "Your five given conics:"
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
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              width: "100%"
            }
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
                className: "CustomInput-button",
                disabled: !this.allConicsRendered(),
                onClick: this.fetchTangentConics
              },
              "Compute tangent conics"
            ),

        this.state.computed
          ? e(
              "div",
              { style: { display: "inline-block", marginLeft: 4 } },
              "Of the 3264 conics are probably",
              e("strong", null, " ", this.state.computed.nreal, " "),
              "real."
            )
          : e(
              "div",
              { style: { display: "inline-block", marginLeft: 4 } },
              "Of the 3264 conics are probably",
              e("strong", null, " ? "),
              "real."
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
              null,
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
              )
            )
      )
    );
  }
}

const domContainer = document.querySelector("#do-it-yourself-container");
ReactDOM.render(e(CustomInput), domContainer);
