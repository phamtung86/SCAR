package com.t2.specification;

import com.t2.entity.Brands;
import com.t2.entity.CarModels;
import com.t2.entity.CarType;
import com.t2.entity.Cars;
import com.t2.form.Car.CarFilterForm;
import jakarta.persistence.criteria.*;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.Objects;

public class CarSpecification {
    public static Specification<Cars> buildWhere(String search, CarFilterForm carFilterForm) {
        Specification<Cars> where = null;
        CarCustomSpecification init = new CarCustomSpecification("isSold", false);
        where = Specification.where(init);

        if (StringUtils.hasText(search)) {
            search = search.trim();
            CarCustomSpecification brandSearch = new CarCustomSpecification("brandSearch", search);
            CarCustomSpecification priceSearch = new CarCustomSpecification("priceSearch", search);
            CarCustomSpecification modelSearch = new CarCustomSpecification("modelSearch", search);
            where = where.and((brandSearch).or(priceSearch).or(modelSearch));
        }
        if (carFilterForm != null && carFilterForm.getMinPrice() != null) {
            CarCustomSpecification minPrice = new CarCustomSpecification("minPrice", carFilterForm.getMinPrice());
            where = where.and(minPrice);
        }

        if (carFilterForm != null && carFilterForm.getMaxPrice() != null) {
            CarCustomSpecification maxPrice = new CarCustomSpecification("maxPrice", carFilterForm.getMaxPrice());
            where = where.and(maxPrice);
        }

        if (carFilterForm != null && carFilterForm.getBrand() != null) {

            CarCustomSpecification brand = new CarCustomSpecification("brand", carFilterForm.getBrand());
            where = where.and(brand);
        }

        if (carFilterForm != null && carFilterForm.getYear() != null) {
            CarCustomSpecification year = new CarCustomSpecification("year", carFilterForm.getYear());
            where = where.and(year);
        }

        if (StringUtils.hasText(carFilterForm.getFuelType())) {
            CarCustomSpecification fuelType = new CarCustomSpecification("fuelType", carFilterForm.getFuelType());
            where = where.and(fuelType);
        }

        if (StringUtils.hasText(Objects.requireNonNull(carFilterForm).getTransmission())) {
            CarCustomSpecification transmission = new CarCustomSpecification("transmission", carFilterForm.getTransmission());
            where = where.and(transmission);
        }

        if (StringUtils.hasText(carFilterForm.getCondition())) {
            CarCustomSpecification condition = new CarCustomSpecification("condition", carFilterForm.getCondition());
            where = where.and(condition);
        }

        if (carFilterForm.getMinPrice() != null && carFilterForm.getMaxPrice() != null) {
            where = where.and((root, query, cb) ->
                    cb.between(root.get("price"),
                            carFilterForm.getMinPrice(),
                            carFilterForm.getMaxPrice()));
        }

        return where;
    }

    @RequiredArgsConstructor
    static
    class CarCustomSpecification implements Specification<Cars> {

        @NonNull
        private String field;

        @NonNull
        private Object value;

        private CarFilterForm carFilterForm;

        @Override
        public Predicate toPredicate(@NotNull Root<Cars> root, @NotNull CriteriaQuery<?> query, @NotNull CriteriaBuilder criteriaBuilder) {
            if (field.equalsIgnoreCase("init")) {
                return criteriaBuilder.equal(criteriaBuilder.literal(1), 1);
            }

            if (field.equalsIgnoreCase("isSold")) {
                return criteriaBuilder.equal(root.get("isSold"), value);
            }

            if (field.equalsIgnoreCase("brandSearch")) {
                Join<Cars, CarModels> carModelJoin = root.join("carModels");
                Join<CarModels, Brands> brandJoin = carModelJoin.join("brand");
                return criteriaBuilder.like(brandJoin.get("name"), "%" + value + "%");
            }

            if (field.equalsIgnoreCase("modelSearch")) {
                Join<Cars, CarModels> carModelJoin = root.join("carModels");
                Join<CarModels, CarType> carTypeJoin = carModelJoin.join("carType");
                return criteriaBuilder.like(carTypeJoin.get("name"), "%" + value + "%");
            }

            if (field.equalsIgnoreCase("minPrice")) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), value.toString());
            }

            if (field.equalsIgnoreCase("maxPrice")) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("price"), value.toString());
            }

            if (field.equalsIgnoreCase("brand")) {
                Join<Cars, CarModels> carModelJoin = root.join("carModels");
                Join<CarModels, Brands> brandJoin = carModelJoin.join("brand");
                return criteriaBuilder.equal(brandJoin.get("id"), value);
            }

            if (field.equalsIgnoreCase("year")) {
                return criteriaBuilder.equal(root.get("year"), value.toString());
            }

            if (field.equalsIgnoreCase("fuelType")) {
                return criteriaBuilder.equal(root.get("fuelType"), value.toString());
            }

            if (field.equalsIgnoreCase("transmission")) {
                return criteriaBuilder.equal(root.get("transmission"), value.toString());
            }

            if (field.equalsIgnoreCase("condition")) {
                return criteriaBuilder.equal(root.get("condition"), value.toString());
            }

            return null;
        }
    }
}
