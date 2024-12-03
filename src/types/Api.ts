interface ApiResponse {
	success: boolean;
	error?: any;
}

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
