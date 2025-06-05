
import { Marker, Popup } from 'react-leaflet';


export default function MapPointer(position) {
    // const position = [51.505, -0.09]

    return (
            <Marker position={position}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
    )
}
