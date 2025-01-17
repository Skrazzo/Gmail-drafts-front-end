interface ApiResponse {
    success: boolean;
    error?: any;
}

interface SuccessResponse<T> {
    success: true;
    data: T;
}

interface ErrorResponse {
    success: false;
    error: any;
}

export type AxiosResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface CompanyExists extends ApiResponse {
    data: boolean;
}

export interface ListCompanies extends ApiResponse {
    data: {
        id: number;
        name: string;
        type: string;
    }[];
}

export interface Tag {
    id: number;
    name: string;
}

export type DecodedInputSource = Record<string, "manual" | "auto" | "excel" | undefined>;
