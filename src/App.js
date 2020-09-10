import React, {Component} from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import Rank from './components/rank/Rank';
import Clarifai from 'clarifai';
import FaceRecognition from './components/facerecognition/FaceRecognition';

const app = new Clarifai.App(
  {
    apiKey: '63e6be29c4c6495c9dca68ff2ceaba99'
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
      .catch(err => console.err(err));
  }

  render () {
    return (
        <div className="App">
          <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div>
    )
  } 
}

export default App;
