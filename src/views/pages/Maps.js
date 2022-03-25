import React,{Component} from 'react';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({text}) => <div>{text}</div>

export class Maps extends Component {
  constructor(props) {
    super(props);
  }

  static defaultProps = {
    center: {
      lat: 37.751,
      lng: -97.822,
    },
    zoom: 11
  };

  render() {
  return (
    <div style={{height: '100vh', width: '100%'}}>
      <GoogleMapReact
        bootstrapURLKeys={{key:'AIzaSyCzv8XGVIaZKTTIiOVRgR04KK7grpxdSmg'}}
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
        />
        <AnyReactComponent
          lat={37.751}
          lng={-97.822}
          text="My Marker"
          />
    </div>
  );
  }
}

const mapStyles = {
  width: '100%',
  height: '100%',
};

export default Maps;
