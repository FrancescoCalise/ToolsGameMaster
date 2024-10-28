export interface TableConfig {
    columns: string[];
    data: Array<{ [key: string]: any }>;
    notes?: { symbol: string; idml:string, description: string }[]; // Array di note con simbolo e descrizione
}