"use strict";

const e = React.createElement;

var conicColors = ["#9b59b6", "#c0392b", "#f1c40f", "#2ecc71", "#3498db"];

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function shuffled_indices(n) {
  var indices = [];
  for (var i = 0; i < n; i++) {
    indices.push(i);
  }
  return shuffle(indices);
}

var indices = shuffled_indices(3264);

class AllRealsConics extends React.Component {
  constructor(props) {
    super(props);

    this.given_conics = [null, null, null, null, null];
    this.canvas = null;
    this.state = {
      canvasSetUp: false,
      conics: [],
      conic_index: 0,
      isRendering: false
    };

    this.renderRealConic = this.renderRealConic.bind(this);
    this.renderAllRealConics = this.renderAllRealConics.bind(this);
    this.renderGivenConics = this.renderGivenConics.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this.startStopRendering = this.startStopRendering.bind(this);
    this.setCanvasRef = this.setCanvasRef.bind(this);
  }
  componentDidMount() {
    window.setup_conics(
      {
        canvasName: "allReals",
        xMax: 25,
        drawAxis: false
      },
      function() {
        this.setState({ canvasSetUp: true });
      }.bind(this)
    );
  }

  componentDidUpdate(_, prevState) {
    if (this.state.canvasSetUp !== prevState.canvasSetUp) {
      this.renderGivenConics();
      this.startStopRendering();
    }
  }

  setCanvasRef(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.canvas.height = ctx.canvas.width;
    this.canvas = canvas;
  }

  renderGivenConics() {
    this.given_conics = data.given_conics.map(function(coeffs) {
      var rendered = window.draw_conic(coeffs, {
        strokeColor: "#42A5F5",
        opacity: 1.0
      });
      return { rendered: rendered, coeffs: coeffs };
    });
  }

  renderRealConic() {
    var conics = this.state.conics;
    if (conics.length === 3) {
      var conic = conics[0].rendered;
      window.remove_conic(conic);
      conics.shift();
      return;
    }

    var i = indices[this.state.conic_index];
    var coeffs = data.solutions[i].conic;
    var rendered = window.draw_conic(coeffs, {
      strokeColor: conicColors[5],
      opacity: 1.0,
      animate: true
    });
    conics.push({ rendered: rendered, coeffs: coeffs });
    this.setState({
      conics: conics,
      conic_index: (this.state.conic_index + 1) % 3264
    });
  }

  renderAllRealConics() {
    this.renderAllConicsIntervall = setInterval(this.renderRealConic, 500);
  }

  startStopRendering() {
    if (this.renderAllConicsIntervall) {
      clearInterval(this.renderAllConicsIntervall);
      this.renderAllConicsIntervall = undefined;
      this.setState({ isRendering: false });
    } else {
      this.renderAllRealConics();
      this.setState({ isRendering: true });
    }
  }

  renderButton() {
    return e(
      "button",
      { onClick: this.startStopRendering },
      this.state.isRendering ? "Pause Animation" : "Restart Animation"
    );
  }

  render() {
    return e(
      "div",
      {
        style: { width: "100%", display: "flex", justifyContent: "center" }
      },

      e(
        "div",
        { style: { width: "70%" } },
        e("canvas", {
          resize: "true",
          ref: this.setCanvasRef,
          id: "allReals",
          style: { width: "100%" }
        }),
        e(
          "div",
          { style: { display: "flex", justifyContent: "center" } },
          this.renderButton()
        )
      )
    );
  }
}

const domContainer = document.querySelector("#all_real_conics_container");
ReactDOM.render(e(AllRealsConics), domContainer);
