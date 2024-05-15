import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [hotels, setHotels] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingRoomNumber, setBookingRoomNumber] = useState('');

  const fetchNearbyHotels = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/hotels/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching nearby hotels:', error);
    }
  };

  const handleHotelClick = async (hotelId) => {
    try {
      const response = await axios.get(`http://localhost:8080/hotels/${hotelId}`);
      setSelectedHotel(response.data);
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    }
  };

  const handleBooking = async () => {
    try {
      await axios.post(`http://localhost:8080/hotels/${selectedHotel.id}/book`, { roomNumber: bookingRoomNumber });
      alert('Room booked successfully');
    } catch (error) {
      console.error('Error booking room:', error);
    }
  };

  return (
      <div>
        <h1>Hotel Reservation Management</h1>
        <div>
          <label>Latitude: </label>
          <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
          <label>Longitude: </label>
          <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
          <label>Radius (km): </label>
          <input type="text" value={radius} onChange={(e) => setRadius(e.target.value)} />
          <button onClick={fetchNearbyHotels}>Search Hotels</button>
        </div>
        <div>
          <h2>Nearby Hotels:</h2>
          <ul>
            {hotels.map(hotel => (
                <li key={hotel.id} onClick={() => handleHotelClick(hotel.id)}>{hotel.name}</li>
            ))}
          </ul>
        </div>
        {selectedHotel && (
            <div>
              <h2>{selectedHotel.name}</h2>
              <p>Available Rooms:</p>
              <ul>
                {selectedHotel.rooms.map(room => (
                    <li key={room.roomNumber}>{room.roomNumber} - ${room.price} - {room.isAvailable ? 'Available' : 'Not Available'}</li>
                ))}
              </ul>
              <input type="text" placeholder="Enter room number to book" value={bookingRoomNumber} onChange={(e) => setBookingRoomNumber(e.target.value)} />
              <button onClick={handleBooking}>Book Room</button>
            </div>
        )}
      </div>
  );
}

export default App;
