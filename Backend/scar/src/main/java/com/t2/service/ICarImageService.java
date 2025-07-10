package com.t2.service;

import com.t2.entity.Cars;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ICarImageService {

    void createNewCarImages(List<MultipartFile> carImages, Cars cars);
}
