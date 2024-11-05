export interface TableConfig {
    title?:string;
    columns: string[];
    data: Array<{ [key: string]: any }>;
    notes?: { symbol: string; description: string }[]; // Array di note con simbolo e descrizione
}