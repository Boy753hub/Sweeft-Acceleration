export interface Photo {
    id: string;
    width: number;
    height: number;
    description: string;
    urls: {
        raw: string;
        full: string;
        regular: string;
        small: string;
        thumb: string;
    };
    likes: number;
    views?: number;
    downloads?: number;
}