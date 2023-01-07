import React, {useRef, useState} from 'react';
import L from "leaflet";
import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css'

const MapMessage = (props: {
    item: any
}) => {


    console.log(props)

    let myIcon = L.icon({
        iconUrl: '/marker.png',
        iconSize: [55, 55],
        iconAnchor: [32, 55],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    });

    let mapRef = useRef(null);


    function MapEvent() {
        const [position, setPosition] = useState(null)
        const map = useMapEvents({
            click() {
                map.locate()
            },

            load() {
                // setMarkerX(map.getCenter().lat)
                // setMarkerY(map.getCenter().lng)
            },

            move() {

            },
            locationfound(e) {
                map.flyTo(e.latlng, map.getZoom())
            },
        })

        return position === null ? null : (
            <Marker position={position}>
                <Popup>You are here</Popup>
            </Marker>
        )
    }

    return (
        <div className={'max-w-[80%] w-full pb-1 bg-primary rounded-3xl '}>
            <MapContainer ref={mapRef} zoomAnimation={true}
                          className={'h-72 relative rounded-2xl mx-1.5 mt-1.5'}
                          center={[props.item.location.lat, props.item.location.lon]}
                          zoom={15} scrollWheelZoom={false}>
                <div
                    className={'absolute right-2 bottom-7 h-10 w-10 rounded-xl flex flex-col justify-center items-center bg-white shadow-2xl z-[999]'}
                    onClick={() => {

                    }}>
                    <img src="/assets/svgs/find-location.svg" className={'h-6 w-6'} alt=""/>
                </div>


                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker icon={myIcon} title={"Mokafela"} position={[props.item.location.lat, props.item.location.lon]}>
                    {/*<Popup>*/}
                    {/*    A pretty CSS3 popup. <br/> Easily customizable.*/}
                    {/*</Popup>*/}
                </Marker>
                <MapEvent/>
            </MapContainer>
            <div className={'px-3 w-full text-center text-white pt-2 pb-2 IranSans'}>{props.item.location.text}</div>
        </div>
    );
};

export default MapMessage;
