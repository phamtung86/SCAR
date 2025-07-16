import axios from "axios";
import axiosClient from "../axios-client";

const URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

const uploadImage = async (form: FormData) => {
    const response = await axiosClient.post(`${URL}/images`,
        form,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    return response
}

const ImageProcess = {
    uploadImage
}
export default ImageProcess;