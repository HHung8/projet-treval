"use client"
import L from "leaflet";
import {MapContainer, Marker, TileLayer} from 'react-leaflet';

import "leaflet/dist/leaflet.css"; //Đây là các tệp CSS cần thiết để hiển thị các thành phần của Leaflet đúng cách.
//Import các hình ảnh cho biểu tượng (icon) và bóng của marker. Các biểu tượng này sẽ được sử dụng để tùy chỉnh giao diện của các điểm đánh dấu trên bản đồ.
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'; 
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

//@ts-ignore 
// 
delete L.Icon.Default.prototype._getIconUrl; // Xoá thuộc tính _getIconUrl khỏi prototype của đối tượng L.Icon.Default. Điều này được thực hiện để tránh lỗi cảnh báo trong môi trường TypeScript, nơi thuộc tính này không được định nghĩa
// Dòng này sử dụng phương thức 'mergeOptions' của đối tượng `L.Icon.Default` để ghi đè các tuỳ chọn mặc định của biểu tượng. 
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon.src, //Đường dẫn đến hình ảnh biểu tượng (icon) cho các điểm đánh dấu trên bản đồ.
    iconRetinaUrl: markerIcon2x.src, // Đường dẫn đến hình ảnh biểu tượng cho các điểm đánh dấu trên màn hình Retina
    shadowUrl: markerShadow.src, // Đường dẫn đến hình ảnh bóng của biểu tượng 
});

// Định nghĩa props cho component Map.
interface MapProps {
    center ?: number[] // Đây là một thuộc tính của giao diện, đặt tên là `center`, và nó được đặt trong dấu ? để cho biết rằng nó là một thuộc tính tuỳ chọn 
}

const Map:React.FC<MapProps> = ({center}) => {
  return (
    <MapContainer
        center={center as L.LatLngExpression || [51, -0.09]}
        zoom={center ? 4 : 2}
        scrollWheelZoom={false}
        className="h-[35vh] rounded-lg"
    >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {center && (
            <Marker 
                position={center as L.LatLngExpression}
            />
        )}
    </MapContainer>
  )
}

export default Map;