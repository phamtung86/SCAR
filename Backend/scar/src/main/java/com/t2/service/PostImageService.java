package com.t2.service;

import com.t2.dto.PostImageDTO;
import com.t2.entity.PostImage;
import com.t2.entity.Posts;
import com.t2.form.UploadImageForm;
import com.t2.repository.PostImageRepository;
import com.t2.util.ImageUtils;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class PostImageService implements IPostImageService{

    @Autowired
    private PostImageRepository postImageRepository;
    @Autowired
    private ImageUtils imageUtils;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public void uploadImage(MultipartFile file, Posts post) throws IOException {
        UploadImageForm uploadImageForm = imageUtils.uploadFile(file);
        String urlImage = uploadImageForm.getUrl();
        String publicId = uploadImageForm.getPublicId();
        PostImage postImage = new PostImage();
        postImage.setName(post.getContent());
        postImage.setPost(post);
        postImage.setImageUrl(urlImage);
        postImage.setPublicImageId(publicId);
        postImageRepository.save(postImage);
    }

    @Override
    public List<PostImageDTO> findPostImageByPostId(Integer postId) {
        List<PostImage> postImages = postImageRepository.findByPostId(postId);
        List<PostImageDTO> postImageDTOS = modelMapper.map(postImages, new TypeToken<List<PostImageDTO>>(){}.getType());
        return postImageDTOS;
    }

}
