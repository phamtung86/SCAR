package com.t2.images;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@Service
@Slf4j
public class ClarifaiService {

    private final String PAT = "e223ce4f6b9148d0a693d7c81cac5d24";

    public boolean areAllImagesValid(List<MultipartFile> files) throws IOException {
        if (files == null || files.isEmpty()) return false;

        OkHttpClient client = new OkHttpClient();
        JsonArray inputsArray = new JsonArray();

        for (MultipartFile file : files) {
            byte[] imageBytes = file.getBytes();
            String base64 = Base64.getEncoder().encodeToString(imageBytes);

            JsonObject imageData = new JsonObject();
            JsonObject image = new JsonObject();
            image.addProperty("base64", base64);
            imageData.add("image", image);

            JsonObject input = new JsonObject();
            input.add("data", imageData);

            inputsArray.add(input);
        }

        JsonObject requestBodyJson = new JsonObject();
        JsonObject userAppId = new JsonObject();
        userAppId.addProperty("user_id", "clarifai");
        userAppId.addProperty("app_id", "main");

        requestBodyJson.add("user_app_id", userAppId);
        requestBodyJson.add("inputs", inputsArray);

        Request request = new Request.Builder()
                .url("https://api.clarifai.com/v2/models/general-image-recognition/outputs")
                .post(RequestBody.create(requestBodyJson.toString(), MediaType.parse("application/json")))
                .addHeader("Authorization", "Key " + PAT)
                .build();

        try (Response response = client.newCall(request).execute()) {
            String json = response.body().string();
            log.info("Clarifai multi-image response: {}", json);

            if (!response.isSuccessful()) {
                log.error("Clarifai API error: {} - {}", response.code(), response.message());
                return false;
            }

            JsonObject root = JsonParser.parseString(json).getAsJsonObject();
            JsonArray outputs = root.getAsJsonArray("outputs");

            for (JsonElement outputElement : outputs) {
                JsonObject data = outputElement.getAsJsonObject().getAsJsonObject("data");
                if (data == null || !data.has("concepts")) return false;

                JsonArray concepts = data.getAsJsonArray("concepts");
                boolean foundCar = false;

                for (JsonElement concept : concepts) {
                    String name = concept.getAsJsonObject().get("name").getAsString().toLowerCase();
                    double confidence = concept.getAsJsonObject().get("value").getAsDouble();
                    log.info("name: " + name + " - confidence " + confidence);
                    if (isCarRelated(name) && confidence > 0.7) {
                        foundCar = true;
                        break;
                    }
                }

                if (!foundCar) return false;
            }

            return true;
        }
    }
    public boolean areAllImagesValidByUrls(List<String> imageUrls) throws IOException {
        if (imageUrls == null || imageUrls.isEmpty()) return false;

        OkHttpClient client = new OkHttpClient();
        JsonArray inputsArray = new JsonArray();

        for (String url : imageUrls) {
            JsonObject imageData = new JsonObject();
            JsonObject image = new JsonObject();
            image.addProperty("url", url);  // Thay vì "base64", dùng "url"
            imageData.add("image", image);

            JsonObject input = new JsonObject();
            input.add("data", imageData);

            inputsArray.add(input);
        }

        System.out.println(inputsArray);

        JsonObject requestBodyJson = new JsonObject();
        JsonObject userAppId = new JsonObject();
        userAppId.addProperty("user_id", "clarifai");
        userAppId.addProperty("app_id", "main");

        requestBodyJson.add("user_app_id", userAppId);
        requestBodyJson.add("inputs", inputsArray);

        Request request = new Request.Builder()
                .url("https://api.clarifai.com/v2/models/general-image-recognition/outputs")
                .post(RequestBody.create(requestBodyJson.toString(), MediaType.parse("application/json")))
                .addHeader("Authorization", "Key " + PAT)
                .build();

        try (Response response = client.newCall(request).execute()) {
            String json = response.body().string();
            log.info("Clarifai multi-image URL response: {}", json);

            if (!response.isSuccessful()) {
                log.error("Clarifai API error: {} - {}", response.code(), response.message());
                return false;
            }

            JsonObject root = JsonParser.parseString(json).getAsJsonObject();
            JsonArray outputs = root.getAsJsonArray("outputs");

            for (JsonElement outputElement : outputs) {
                JsonObject data = outputElement.getAsJsonObject().getAsJsonObject("data");
                if (data == null || !data.has("concepts")) return false;

                JsonArray concepts = data.getAsJsonArray("concepts");
                boolean foundCar = false;

                for (JsonElement concept : concepts) {
                    String name = concept.getAsJsonObject().get("name").getAsString().toLowerCase();
                    double confidence = concept.getAsJsonObject().get("value").getAsDouble();
                    log.info("name: " + name + " - confidence " + confidence);
                    System.out.println(isCarRelated(name));
                    if (isCarRelated(name) && confidence > 0.7) {
                        foundCar = true;
                        break;
                    }
                }

                if (!foundCar) return false;
            }

            return true;
        }
    }

    /**
     * Method để lấy user_id và app_id của tài khoản
     */
    public void getUserInfo() throws IOException {
        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
                .url("https://api.clarifai.com/v2/users/me")
                .get()
                .addHeader("Authorization", "Key " + PAT)
                .build();

        try (Response response = client.newCall(request).execute()) {
            String json = response.body().string();
            System.out.println("User info: " + json);
        }
    }

    /**
     * Alternative method sử dụng food-item-recognition model để test
     */
    public boolean testWithFoodModel(MultipartFile file) throws IOException {
        byte[] imageBytes = file.getBytes();
        String base64 = Base64.getEncoder().encodeToString(imageBytes);

        OkHttpClient client = new OkHttpClient();

        String requestBody = """
                {
                  "user_app_id": {
                    "user_id": "clarifai",
                    "app_id": "main"
                  },
                  "inputs": [
                    {
                      "data": {
                        "image": {
                          "base64": "%s"
                        }
                      }
                    }
                  ]
                }
                """.formatted(base64);

        Request request = new Request.Builder()
                .url("https://api.clarifai.com/v2/models/food-item-recognition/outputs")
                .post(RequestBody.create(requestBody, MediaType.parse("application/json; charset=utf-8")))
                .addHeader("Authorization", "Key " + PAT)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = client.newCall(request).execute()) {
            String json = response.body().string();
            System.out.println("Food model test response: " + json);
            return response.isSuccessful();
        }
    }

    private boolean isCarRelated(String label) {
        String lowerLabel = label.toLowerCase();
        return lowerLabel.equals("car") ||
                lowerLabel.equals("vehicle") ||
                lowerLabel.equals("automobile") ||
                lowerLabel.equals("sedan") ||
                lowerLabel.equals("suv") ||
                lowerLabel.equals("truck") ||
                lowerLabel.equals("transportation") ||
                lowerLabel.equals("motor") ||
                lowerLabel.equals("auto") ||
                lowerLabel.equals("bus") ||
                lowerLabel.equals("van") ||
                lowerLabel.equals("taxi") ||
                lowerLabel.equals("wheel") ||
                lowerLabel.equals("drive");
    }
}