package EcoRecicla.model.dto;

import java.time.LocalDateTime;

public record ErrorDetails(LocalDateTime timestamp, String message, String description,int status) {
}
