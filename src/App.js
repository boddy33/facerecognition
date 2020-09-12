import React, {Component} from 'react';
import './App.css';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Rank from './components/rank/Rank';
import Clarifai from 'clarifai';
import FaceRecognition from './components/facerecognition/FaceRecognition';

const apiURL = 'http://localhost:3000';
const apiMode = false;

const app = new Clarifai.App(
  {
    apiKey: ''
  }
);

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: 'https://cdn.pocket-lint.com/r/s/1200x630/assets/images/142207-phones-feature-what-is-apple-face-id-and-how-does-it-work-image1-5d72kjh6lq.jpg',
      box: {}
    }
  }

  componentDidMount() {
    if (apiMode) {    
      fetch(apiURL)
      .then(response => response.json())
      .then(console.log);
    }
  }

 calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log('displayFaceBox(box):', box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
      console.log('submit: ' + this.state.input);
      this.setState({imageUrl : this.state.input});
      app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .then(() => {
        if (apiMode) {
          fetch(apiURL + '/action-logs', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              name: "New URL Submitted",
              message: "URL: " + this.state.input,
              severity: "INFO"
            })
          }).catch(err => console.log);
        }
      })
      .catch(err => console.err(err));
  }

  render () {
    return (
        <div className="App">
          {/*<Navigation />*/}
          <Logo />
          <Rank />
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div>
    )
  } 
}

export default App;
