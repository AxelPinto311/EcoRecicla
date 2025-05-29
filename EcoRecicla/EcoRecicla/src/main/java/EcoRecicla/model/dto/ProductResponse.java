package EcoRecicla.model.dto;

import EcoRecicla.model.entity.Product;
import org.springframework.data.domain.Page;

import java.util.List;

public record ProductResponse(
        List<Product> products,
        int currentPage,
        int totalPages,
        long totalElements,
        int pageSize,
        boolean hasNext,
        boolean hasPrevious,
        String searchTerm
) {

    public static ProductResponse from(Page<Product> page, String searchTerm) {
        return new ProductResponse(
                page.getContent(),
                page.getNumber(),
                page.getTotalPages(),
                page.getTotalElements(),
                page.getSize(),
                page.hasNext(),
                page.hasPrevious(),
                searchTerm
        );
    }

    public static ProductResponse from(Page<Product> page) {
        return from(page, null);
    }

}
