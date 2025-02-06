export interface CompanyForm {
    name: string;
    type: number[];
    tags: number[];
    logo_url: string | null;
    company_website: string;
    address: string | null;
    country: string | null;
    postal_code: string | null;
}
