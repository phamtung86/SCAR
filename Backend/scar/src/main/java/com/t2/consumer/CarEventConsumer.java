package com.t2.consumer;

import com.t2.config.RabbitConfig;
import com.t2.dto.CarCreatedEvent;
import com.t2.entity.CarImages;
import com.t2.images.ClarifaiService;
import com.t2.service.ICarImageService;
import com.t2.service.ICarService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@Slf4j
public class CarEventConsumer {

    @Autowired
    private ICarService iCarService;

    @Autowired
    private ICarImageService iCarImageService;

    @Autowired
    private ClarifaiService clarifaiService;

    @RabbitListener(queues = RabbitConfig.CAR_QUEUE)
    public void handleCreateCar(CarCreatedEvent carCreatedEvent) {
        try {
            log.info("📢 Bắt đầu kiểm tra hình ảnh xe - Car ID: {}", carCreatedEvent.getCarId());

            // 1. Lấy danh sách hình ảnh từ database
            List<CarImages> carImages = iCarImageService.findByCarId(carCreatedEvent.getCarId());

            // 2. Kiểm tra có ảnh không
            if (carImages == null || carImages.isEmpty()) {
                log.warn("⚠️ Xe {} không có hình ảnh", carCreatedEvent.getCarId());
                iCarService.changeStatusCar(
                        carCreatedEvent.getCarId(),
                        "REJECTED",
                        "Xe chưa có hình ảnh"
                );
                return;
            }

            // 3. Validate hình ảnh bằng Clarifai AI
            log.info("🔍 Đang kiểm tra {} hình ảnh với Clarifai...", carImages.size());
            List<String> urlImages = carImages.stream().map(CarImages ::getImageUrl).filter(url -> url != null && !url.trim().isEmpty()).collect(Collectors.toList());
            boolean allValid = clarifaiService.areAllImagesValidByUrls(urlImages);

            // 4. Xử lý kết quả
            if (!allValid) {
                log.warn("❌ Hình ảnh xe {} không hợp lệ, từ chối tin đăng", carCreatedEvent.getCarId());
                iCarService.changeStatusCar(
                        carCreatedEvent.getCarId(),
                        "REJECTED",
                        "Hình ảnh xe không hợp lệ hoặc chứa nội dung không phù hợp"
                );
            } else {
                log.info("✅ Hình ảnh xe {} hợp lệ, chuyển sang trạng thái PENDING", carCreatedEvent.getCarId());
                iCarService.changeStatusCar(
                        carCreatedEvent.getCarId(),
                        "PENDING",
                        "Đang chờ admin duyệt"
                );
                // iCarService.changeStatusCar(carCreatedEvent.getCarId(), "APPROVED", "Tự động duyệt");
            }

        } catch (Exception e) {
            log.error("💥 Lỗi khi xử lý car.created event - Car ID: {}",
                    carCreatedEvent.getCarId(), e);

            // Đánh dấu xe có lỗi để admin review
            try {
                iCarService.changeStatusCar(
                        carCreatedEvent.getCarId(),
                        "ERROR",
                        "Lỗi hệ thống khi kiểm tra hình ảnh: " + e.getMessage()
                );
            } catch (Exception ex) {
                log.error("💥 Không thể update status cho xe {}", carCreatedEvent.getCarId(), ex);
            }

            // Throw lại exception để RabbitMQ retry
            throw new RuntimeException("Failed to process car validation", e);
        }
    }
}