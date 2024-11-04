export interface TableConfig {
    columns: string[];
    data: Array<{ [key: string]: any }>;
    notes?: { symbol: string; description: string }[]; // Array di note con simbolo e descrizione
}