package EcoRecicla.controller;

import EcoRecicla.model.dto.ProductCreationDto;
import EcoRecicla.model.dto.ProductDto;
import EcoRecicla.model.dto.ProductResponse;
import EcoRecicla.model.entity.Category;
import EcoRecicla.model.entity.Product;
import EcoRecicla.model.enums.CategoryEnum;
import EcoRecicla.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("find")
    public ResponseEntity<ProductResponse> getProduct(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.getAllProducts(page, size));
    }

    @GetMapping("findByName")
    public ResponseEntity<ProductResponse> getProductByName(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(defaultValue = "12") int size,
                                                            @RequestParam(defaultValue = "") String name) {
        return ResponseEntity.ok(productService.getProductByName(page, size, name));
    }

    @PostMapping("/findByCategories")
    public ResponseEntity<ProductResponse> getProductByCategories(@RequestParam(defaultValue = "0") int page,
                                                                  @RequestParam(defaultValue = "12")int size,
                                                                  @RequestBody Set<CategoryEnum> categories) {
        return ResponseEntity.ok(productService.getProductByCategory(page,size,categories));
    }

    @PostMapping("/create")
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductCreationDto productCreationDto) {
        ProductDto createdProduct = productService.createProduct(productCreationDto);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @GetMapping("/findByUser/{userId}")
    public ResponseEntity<List<ProductDto>> getProductByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(productService.getProductsByUser(userId));
    }

    @GetMapping("findById/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }


    @PatchMapping("/updatePrduct")
    public ResponseEntity<ProductDto> updateProduct(@RequestBody ProductDto productDto) {
        return ResponseEntity.ok(productService.updateProduct(productDto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if(productService.existsProduct(id)){
            productService.deleteProduct(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
