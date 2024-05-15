package Controllers;
import Domain.BookingRequest;
import Domain.Hotel;
import Domain.Room;
import Repositories.HotelRepository;
import Service.DistanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/hotels")
public class HotelController {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private DistanceService distanceService;

    @GetMapping("/nearby")
    public List<Hotel> getNearbyHotels(@RequestParam double latitude, @RequestParam double longitude, @RequestParam double radius) {
        List<Hotel> allHotels = hotelRepository.findAll();
        return allHotels.stream()
                .filter(hotel -> distanceService.calculateDistance(latitude, longitude, hotel.getLatitude(), hotel.getLongitude()) <= radius)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Hotel getHotelDetails(@PathVariable Long id) {
        return hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel not found"));
    }

    @PostMapping("/{id}/book")
    public ResponseEntity<?> bookRoom(@PathVariable Long id, @RequestBody BookingRequest bookingRequest) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new RuntimeException("Hotel not found"));
        Room room = hotel.getRooms().stream()
                .filter(r -> r.getRoomNumber() == bookingRequest.getRoomNumber() && r.isAvailable())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Room not available"));

        room.setAvailable(false);
        hotelRepository.save(hotel);

        return ResponseEntity.ok("Room booked successfully");
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, @RequestBody BookingRequest bookingRequest) {
        // Implement cancellation logic
        return ResponseEntity.ok("Booking canceled successfully");
    }

    @PostMapping("/{id}/feedback")
    public ResponseEntity<?> leaveFeedback(@PathVariable Long id, @RequestBody Feedback feedback) {
        // Implement feedback logic
        return ResponseEntity.ok("Feedback submitted successfully");
    }
}

