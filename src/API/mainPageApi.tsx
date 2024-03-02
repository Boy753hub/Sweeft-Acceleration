import axios, { AxiosResponse } from "axios";
import { Photo, SearchedPhotos } from "../interface/photo.interface";

const BASE_PATH = 'https://api.unsplash.com/'


export const API = axios.create({
    baseURL: BASE_PATH,
    headers: {
        "Content-Type": "application/json",
        'Accept-Version': 'v1'
    }
});

export const getPopularPhotos = async (params: Record<string, any>): Promise<Photo[]> => {
    try {
        const response: AxiosResponse<Photo[]> = await API.get('/photos', { params });
        return response.data;
    } catch (error) {
        console.error("error fetching popular photos", error);
        throw error; 
    }
};

export const getPhotosBySearchTerm = async (params: Record<string, any>): Promise<SearchedPhotos> => {
    try {
        const response: AxiosResponse<SearchedPhotos> = await API.get('/search/photos', { params });
        return response.data;
    } catch (error) {
        console.error("error fetching photos by search term", error);
        throw error;
    }
}