package com.eventmanagement.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.folder}")
    private String folder;

    public String uploadImage(MultipartFile file) throws IOException {
        log.info("Starting image upload to Cloudinary: {}", file.getOriginalFilename());

        validateImage(file);

        String publicId = folder + "/" + UUID.randomUUID().toString();

        try {
            // Upload with transformations
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "folder", folder,
                            "resource_type", "image",
                            "transformation", new Transformation()
                                    .width(400)
                                    .height(400)
                                    .crop("fill")
                                    .gravity("face")
                                    .quality("auto")
                                    .fetchFormat("auto")));

            String url = (String) uploadResult.get("secure_url");
            log.info("Image uploaded successfully: {}", url);

            return url;

        } catch (Exception e) {
            log.error("Failed to upload image to Cloudinary: {}", e.getMessage());
            throw new IOException("Failed to upload image: " + e.getMessage());
        }
    }

    public void deleteImage(String imageUrl) {
        try {
            if (imageUrl == null || imageUrl.isEmpty()) {
                return;
            }

            String publicId = extractPublicId(imageUrl);
            if (publicId == null) {
                log.warn("Could not extract public_id from URL: {}", imageUrl);
                return;
            }

            log.info("Deleting image from Cloudinary: {}", publicId);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Image deleted successfully");

        } catch (Exception e) {
            log.error("Failed to delete image: {}", e.getMessage());
        }
    }

    private void validateImage(MultipartFile file) throws IOException {
        // Check if empty
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        long maxSize = 5 * 1024 * 1024; // 5MB
        if (file.getSize() > maxSize) {
            throw new IOException("File size exceeds 5MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IOException("Invalid file type");
        }

        String[] allowedTypes = {
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp"
        };

        boolean isValid = false;
        for (String type : allowedTypes) {
            if (type.equals(contentType)) {
                isValid = true;
                break;
            }
        }

        if (!isValid) {
            throw new IOException("Only JPEG, PNG, and WebP images are allowed");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null) {
            String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
            if (!extension.matches("jpg|jpeg|png|webp")) {
                throw new IOException("Invalid file extension");
            }
        }
    }

    private String extractPublicId(String imageUrl) {
        try {
            String[] parts = imageUrl.split("/upload/");
            if (parts.length < 2) {
                return null;
            }

            String path = parts[1];

            path = path.replaceFirst("v\\d+/", "");

            int lastDot = path.lastIndexOf('.');
            if (lastDot > 0) {
                path = path.substring(0, lastDot);
            }

            return path;

        } catch (Exception e) {
            log.error("Error extracting public_id: {}", e.getMessage());
            return null;
        }
    }
    // upload event banner for function create event
    public String uploadEventBanner(MultipartFile file) throws IOException {
        log.info("Starting event banner upload to Cloudinary: {}", file.getOriginalFilename());

        validateImage(file);

        String publicId = folder + "/events/" + UUID.randomUUID().toString();

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "resource_type", "image",
                            "transformation", new Transformation()
                                    .width(1200)
                                    .height(600)
                                    .crop("fill")
                                    .quality("auto")
                                    .fetchFormat("auto")));

            String url = (String) uploadResult.get("secure_url");
            log.info("Event banner uploaded successfully: {}", url);

            return url;

        } catch (Exception e) {
            log.error("Failed to upload event banner to Cloudinary: {}", e.getMessage());
            throw new IOException("Failed to upload event banner: " + e.getMessage());
        }
    }

    public String uploadCV(MultipartFile file) throws IOException {
        log.info("Starting document upload to Cloudinary: {}", file.getOriginalFilename());

        validateDocument(file);
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String publicId = folder + "/cv/" + UUID.randomUUID().toString() + extension;

        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "resource_type", "auto"
                    ));

            String url = (String) uploadResult.get("secure_url");
            log.info("Document uploaded successfully: {}", url);

            return url;

        } catch (Exception e) {
            log.error("Failed to upload document to Cloudinary: {}", e.getMessage());
            throw new IOException("Failed to upload document: " + e.getMessage());
        }
    }

    private void validateDocument(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }

        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new IOException("File size exceeds 5MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IOException("Invalid file type");
        }

        String[] allowedTypes = {
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
        };

        boolean isValid = false;
        for (String type : allowedTypes) {
            if (type.equals(contentType)) {
                isValid = true;
                break;
            }
        }

        if (!isValid) {
            throw new IOException("Only PDF and Word documents (DOC/DOCX) are allowed");
        }
    }

    public String uploadResource(MultipartFile file, UUID eventId) throws IOException {
        log.info("Starting resource upload to Cloudinary: {}", file.getOriginalFilename());

        validateResourceFile(file);

        String originalFilename = file.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String publicId = folder + "/events/" + eventId + "/resources/" + UUID.randomUUID().toString() + extension;

        try {
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "resource_type", "auto"
                    ));

            String url = (String) uploadResult.get("secure_url");
            log.info("Resource uploaded successfully: {}", url);

            return url;

        } catch (Exception e) {
            log.error("Failed to upload resource to Cloudinary: {}", e.getMessage());
            throw new IOException("Failed to upload resource: " + e.getMessage());
        }
    }

    private void validateResourceFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IOException("File is empty");
        }

        long maxSize = 10 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new IOException("File size exceeds 10MB limit");
        }

        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IOException("Invalid file type");
        }

        Set<String> allowedTypes = Set.of(
                "application/pdf",

                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

                "image/jpeg",
                "image/png"
        );

        if (!allowedTypes.contains(file.getContentType())) {
            throw new IOException(
                    "Only PDF, DOC, DOCX, XLS, XLSX, JPG, PNG files are allowed"
            );
        }
    }

}