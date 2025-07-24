package com.t2.service;

import com.t2.entity.CarImages;
import com.t2.entity.Cars;
import com.t2.form.UploadImageForm;
import com.t2.repository.ICarImageRepository;
import com.t2.util.ImageUtils;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class CarImageService implements ICarImageService {

    @Autowired
    private ICarImageRepository iCarImageRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ImageUtils imageUtils;

    @Override
    public void createNewCarImages(List<MultipartFile> carImages, Cars cars) {
        try {
            List<CarImages> imageList = new ArrayList<>();
            for (MultipartFile f : carImages) {
                imageUtils.uploadFile(f).thenAccept(upload -> {
                    if (upload != null) {
                        CarImages c = new CarImages(null, cars, upload.getUrl(), upload.getPublicId(), false, new Date());
                        imageList.add(c);
                    }
                }).exceptionally(throwable -> {
                    System.err.println("Lỗi khi tải ảnh: " + throwable.getMessage());
                    return null;
                });
            }
            iCarImageRepository.saveAll(imageList);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
