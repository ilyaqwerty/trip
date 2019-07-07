import React, {PureComponent} from 'react';
import map from 'lodash.map'
import {withScriptjs, withGoogleMap, GoogleMap, Circle, Marker, MarkerProps, InfoWindow} from 'react-google-maps'
import styled from 'styled-components'
import {Preloader} from '../primitives'
import {FormattedData as ListItemInterface} from '../../data';

const MapWrapper = styled.div`
  height: 100vh;
  width: 100%;
`;

const MapContainer = styled.div`
  height: 100%;
`;

interface MapInterface {
  googleMapURL: string,
  loadingElement: JSX.Element,
  containerElement: JSX.Element,
  mapElement: JSX.Element,
  active: number,
  items: {
    [index: number]: ListItemInterface
  },
}

interface MarkListInterface extends MarkerProps {
  items: {
    [index: number]: ListItemInterface
  },
}

interface MarkInterface extends MarkerProps {
  active?: boolean
}

//var goldStar = {
//     path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
//     fillColor: 'yellow',
//     fillOpacity: 0.8,
//     scale: 1,
//     strokeColor: 'gold',
//     strokeWeight: 14
//   };

const Mark = ({position, active}: MarkInterface) => (
  <Marker
    position={position}
    icon={{
      path: 'M 0 -15 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0',
      scale: active ? 2 : 1,
      strokeWeight: 0,
      fillColor: active ? '#ff0000' : '#000',
      fillOpacity: 1
    }}
  />
);


class Markers extends PureComponent<MarkListInterface>{
  render(){
    const {
      items
    } = this.props;
    console.log('LOOP', items);
    return map(items, (item, key) => {
      return <>
        <Mark
          key={item.time.start + key + item.time.end}
          position={{
            lat: item.startStation.lat,
            lng: item.startStation.lng
          }}
          label={item.startStation.name}
        />

        <Mark
          key={item.time.end + key + item.time.start}
          position={{
            lat: item.endStation.lat,
            lng: item.endStation.lng
          }}
          label={item.endStation.name}
        />
      </>
    })
  }
}


class MapComponent extends PureComponent<MapInterface> {
  render() {
    const {
      items,
      active
    } = this.props;

    const activeItem = items[active];

    return <GoogleMap
      defaultZoom={14}
      defaultCenter={{lat: items[0].startStation.lat, lng: items[0].startStation.lng}}
    >
      <Markers items={items} />

      <Mark
        position={{
          lat: activeItem.startStation.lat,
          lng: activeItem.startStation.lng
        }}
        label={activeItem.startStation.name}
        active
      />
      <Mark
        position={{
          lat: activeItem.endStation.lat,
          lng: activeItem.endStation.lng
        }}
        label={activeItem.endStation.name}
        active
      />
    </GoogleMap>
  }
}

const WrappedMap = withScriptjs(withGoogleMap(MapComponent));

const key = 'AIzaSyDS5nV5nNisxsr_kWTu-p8Lay7rfialZHw';

interface MapComponentInterface {
  items: {
    [index: number]: ListItemInterface
  },
  active: number
}

export default class Map extends PureComponent<MapComponentInterface> {
  render() {
    const {
      items,
      active
    } = this.props;
    console.log('MAP RENDER', active);

    return <WrappedMap
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${key}&libraries=drawing`}
      loadingElement={<div style={{height: `100%`}}><Preloader/></div>}
      containerElement={<MapWrapper/>}
      mapElement={<MapContainer/>}
      active={active}
      items={items}
    />
  }
}
