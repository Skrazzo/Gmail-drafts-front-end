interface ApiResponse {
	success: boolean;
	error?: any;
}

export interface CompanyExists extends ApiResponse {
	data: boolean;
}
