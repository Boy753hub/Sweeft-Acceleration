import axios, { AxiosResponse } from "axios";
import { PhotoStatistics } from "../interface/photo.interface";

const BASE_PATH = 'https://api.unsplash.com/'


export const API = axios.create({
    baseURL: BASE_PATH,
    headers: {
        "Content-Type": "application/json",
        'Accept-Version': 'v1'
    }
});

export const getPhotoStatisticts = async (id: string, params: Record<string, any>): Promise<PhotoStatistics[]> => {
    try {
        const response: AxiosResponse<PhotoStatistics[]> = await API.get(`/photos/${id}/statistics`,{params});
        return response.data;
    } catch (error) {
        console.error("error fetching popular photos", error);
        throw error; 
    }
};
