package EcoRecicla.controller;

import EcoRecicla.model.dto.Coordinates;
import EcoRecicla.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/geocoding")
public class LocationController {
    @Autowired
    private LocationService locationService;

    @GetMapping("/getCoordinates")
    public ResponseEntity<?> getCoordinates(@RequestParam String address) {
        return ResponseEntity.ok(locationService.geocode(address));
    }

    @PostMapping("/saveLocation/{userId}")
    public ResponseEntity<?> saveLocation(@RequestBody Coordinates coordinates, @PathVariable Long userId) {
        return ResponseEntity.ok(locationService.saveLocation(coordinates,userId));
    }

    @DeleteMapping("/deleteLocation/{userId}")
    public ResponseEntity<?> deleteLocation(@PathVariable Long userId) {
        return ResponseEntity.ok(locationService.deleteLocation(userId));
    }
}
