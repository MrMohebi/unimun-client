import React, {useEffect, useRef, useState} from 'react';
import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import Input from "../../view/Input/Input";
import Button from "../../view/Button/Button";
import {EditBookData} from "../../../store/books";


const LocationBottomSheet = (props: {
    onSubmit: Function
    onLatChanged: Function
    onLngChanged: Function
    onTextChanged: Function
    onClose: Function
    defaultText?: string
    defaultLat?: string
    defaultLon?: string

}) => {


    let myIcon = L.icon({
        iconUrl: '/marker.png',
        iconSize: [55, 55],
        iconAnchor: [32, 55],
        popupAnchor: [-3, -76],
        // shadowUrl: 'my-icon-shadow.png',
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
                try {
                    let lat = map.getCenter().lat
                    let lon = map.getCenter().lng

                    console.log(map.getCenter())
                    props.onLatChanged(lat)
                    setMarkerX(lat)
                    props.onLngChanged(lon)
                    setMarkerY(lon)
                } catch (e) {
                    console.log(e)
                }


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


    let [markerX, setMarkerX] = useState(30.287415)
    let [markerY, setMarkerY] = useState(57.052425)

    useEffect(() => {
        if (props.defaultLat)
            setMarkerX(parseFloat(props.defaultLat))
        if (props.defaultLon)
            setMarkerY(parseFloat(props.defaultLon))

        if (props.defaultText) {
            console.log('there is default text')
            props.onTextChanged(props.defaultText)
            props.onLatChanged(props.defaultLat)
            props.onLngChanged(props.defaultLon)
        }


    }, []);

    const BottomSheetInputRef = useRef<HTMLInputElement>(null);
    return (
        <div
            className={'fixed top-0 left-0 h-full bg-blue-300 w-full z-[45] bg-black/40 overflow-scroll flex flex-col-reverse  items-center '}
            style={{}}>
            <div className={'w-full rounded-t-2xl  overflow-hidden shrink-0 bg-white  relative'}>
                <MapContainer ref={mapRef} zoomAnimation={true}
                              className={'h-72 relative rounded-2xl mx-1.5 mt-1.5'}
                              center={props.defaultLat ? [parseFloat(props.defaultLat), (parseFloat(props.defaultLon ?? '0'))] : [markerX, markerY]}
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
                    <Marker icon={myIcon} title={"Mokafela"} position={[markerX, markerY]}>
                        {/*<Popup>*/}
                        {/*    A pretty CSS3 popup. <br/> Easily customizable.*/}
                        {/*</Popup>*/}
                    </Marker>
                    <MapEvent/>
                </MapContainer>

                <Input defaultValue={props.defaultText ?? ""} inputRef={BottomSheetInputRef} id={'inpt'}
                       multiLine={true}
                       wrapperClassName={' mt-3 px-2 max-h-32 h-0 min-h-[2.7rem]'}
                       inputClassName={'pt-2'}
                       placeHolder={"توضیحات آدرس"} numOnly={false}
                       onChange={(e: any) => {
                           let div = e.currentTarget as HTMLDivElement
                           let parentDiv = div.parentElement ?? document.createElement('div');
                           parentDiv.style.setProperty("height", 0 + "px", 'important');
                           parentDiv.style.setProperty("height", div.scrollHeight + "px", 'important');
                           props.onTextChanged(e.target.value)
                       }}/>
                <span
                    className={'IranSansMedium text-textDark mr-3 text-[0.7rem]'}>آدرس دقیق محل تحویل کتاب را بنویسید</span>
                <div className={'IranSans text-textDark w-full bg-background h-3 mt-2 mb-20'}/>
                <div
                    className={'absolute w-full border bottom-0 left-1/2 -translate-x-1/2 h-12 flex flex-row justify-start items-center'}>
                    <Button className={'mr-2 rounded-2xl active:scale-75 transition-all'} onClick={() => {
                        props.onSubmit()
                    }}>
                        <img src="/assets/svgs/send.svg" className={'w-8 h-8 '} alt=""/>

                    </Button>
                </div>
            </div>

            <div onClick={() => {
                props.onClose()
            }} className={'h-[30%] opacity-0 border border-4 bg-red-900 w-full shrink-0'}></div>

        </div>
    );


};

export default LocationBottomSheet;