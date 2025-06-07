package EcoRecicla.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Coordinates(@JsonProperty("lat") double latitude,@JsonProperty("lon")  double longitude) {
}
