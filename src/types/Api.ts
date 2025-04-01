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

export interface Type extends Tag {}

export interface UnsubscribedData {
    person_name: string | null;
    email_id: string;
    email: string;
    reason: string;
    updated_at: string;
}

export type DecodedInputSource = Record<string, "manual" | "auto" | "excel" | undefined>;
