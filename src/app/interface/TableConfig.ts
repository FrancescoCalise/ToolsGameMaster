export interface TableConfig {
    id: string;
    title?:string;
    columns: string[];
    data: Array<{ [key: string]: any }>;
    notes?: { symbol: string; description: string }[]; // Array di note con simbolo e descrizione
}