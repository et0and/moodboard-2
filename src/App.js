import React, { Component } from "react";
import "./App.css";
import StackGrid from "react-stack-grid";
import ImageZoom from "react-medium-image-zoom";
import DropZone from "react-magic-dropzone";

const shuffleArray = arr =>
  arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);

function importAll(r) {
  return r.keys().map(r);
}

const gutter = 30;
const images = importAll(
  require.context("./Images/", false, /\.(png|jpe?g|svg)$/)
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: images,
      dragging: false
    };
    this.dropArea = React.createRef();
  }

  onDrop = (accepted, rejected, links) => {
    console.log(accepted); // Have fun
  };

  componentDidMount() {
    console.log(this.dropArea);
    this.dropArea.current.addEventListener("dragover", this.fileDrag, false);
    this.dropArea.current.addEventListener("dragenter", this.fileDrag, false);

    this.dropArea.current.addEventListener("drop", this.fileDrop, false);
    this.dropArea.current.addEventListener("dragleave", this.leaveDrag, false);
  }

  fileDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    // console.log("drag", e);
    if (!this.state.dragging) this.setState({ dragging: true });
  };

  leaveDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    // this.setState({ dragging: false });
    if (e.dataTransfer.files.length > 0)
      console.log("drop", e.dataTransfer.files);
  };

  fileDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files.length > 0)
      console.log("drop", e.dataTransfer.files);
    let images = [];
    [...e.dataTransfer.files].forEach(img => {
      images.push(URL.createObjectURL(img));
    });
    this.setState({
      dragging: false,
      images: [...this.state.images, ...images]
    });
  };

  uploadFile = file => {
    let url = "YOUR URL HERE";
    let formData = new FormData();

    formData.append("file", file);

    fetch(url, {
      method: "POST",
      body: formData
    })
      .then(() => {
        /* Done. Inform the user */
      })
      .catch(() => {
        /* Error. Inform the user */
      });
  };

  render() {
    const { dragging } = this.state;
    return (
      <div className="App">
        <div
          className="Gallery"
          ref={this.dropArea}
          style={{
            opacity: dragging ? 0.1 : 1
          }}
        >
          <StackGrid
            gridRef={grid => (this.grid = grid)}
            columnWidth={"30%"}
            gutterWidth={gutter}
            gutterHeight={gutter - 5}
            duration={0}
            appearDelay={30}
            monitorImagesLoaded={true}
          >
            {this.state.images.map((item, i) => (
              <div
                key={i}
                style={{
                  pointerEvents: dragging ? "none" : "auto"
                }}
              >
                <ImageZoom
                  image={{ src: item, className: "img", title: item }}
                  zoomImage={{ alt: "Golden Gate Bridge", src: item }}
                />
              </div>
            ))}
          </StackGrid>
        </div>
      </div>
    );
  }
}

export default App;
