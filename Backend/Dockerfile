# Sử dụng JDK 21
FROM eclipse-temurin:21-jdk-alpine

# Thư mục làm việc trong container
WORKDIR /app

# Copy file jar của backend vào
COPY scar/target/scar-0.0.1-SNAPSHOT.jar app.jar
COPY scar/.env /app/.env

# Expose port backend
EXPOSE 8080

# Command để chạy Spring Boot
ENTRYPOINT ["java","-jar","app.jar"]
