export interface CompanyForm {
    name: string;
    type: string;
    tags: number[];
    logo_url: string | null;
    company_website: string;
    address: string | null;
}
