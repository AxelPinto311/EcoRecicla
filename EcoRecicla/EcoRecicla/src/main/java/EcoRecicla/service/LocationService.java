package EcoRecicla.service;

import EcoRecicla.exceptions.UsernameAlreadyExistsException;
import EcoRecicla.model.dto.Coordinates;
import EcoRecicla.model.entity.Location;
import EcoRecicla.repository.LocationRepository;
import EcoRecicla.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class LocationService {

    private final WebClient webClient;

    @Autowired
    private  LocationRepository locationRepository;
    @Autowired
    private UserRepository userRepository;


    public LocationService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://nominatim.openstreetmap.org/search")
                .build();
    }

    public List<Coordinates> geocode(String direccion) {
        try {
            return webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("q", direccion)
                            .queryParam("format", "json")
                            .queryParam("limit", 1)
                            .build())
                    .retrieve()
                    .bodyToFlux(Coordinates.class)
                    .collectList()
                    .block();
        } catch (Exception e) {
            throw new RuntimeException("Error al buscar la dirección: " + e.getMessage());
        }
    }

    @Transactional
    public Coordinates saveLocation(Coordinates coordinates, Long userId) {
        if(!locationRepository.existsLocationByUser_Id(userId)){
            Location location = Location.builder()
                    .latitude(coordinates.latitude())
                    .longitude(coordinates.longitude())
                    .user(userRepository.findById(userId).get())
                    .build();

            locationRepository.save(location);
            return coordinates;
        }else {
            throw new UsernameAlreadyExistsException("Ya tienes una direccion registrada");
        }

    }

    @Transactional
    public boolean deleteLocation( Long userId) {
        if (locationRepository.existsLocationByUser_Id(userId)) {
            locationRepository.deleteLocationByUser_Id(userId);
            return true;
        }

        return false;
    }
}
