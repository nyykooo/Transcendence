export type FileUploadResponse = {
    message: string;
    file: {
        filename: string;
        originalName: string;
        size: number;
        type: string;
        url: string;
    };
};

export type FileInfo = {
    filename: string;
    size: number;
    uploadedAt: string;
    type: 'csv' | 'json';
};

export type FileListResponse = {
    files: FileInfo[];
};

export type RecipeImportResult = {
    name: string;
    ingredients: Array<{
        name: string;
        unit?: string;
        quantity?: number;
    }>;
    diet: string;
    cost?: number;
    portions?: number;
    prep_time?: number;
    cooking_time?: number;
    instructions?: string;
    url?: string;
    author?: string;
};

export type RecipeImportResponse = {
    message: string;
    stats: {
        total: number;
        imported: number;
        failed: number;
    };
    failures: {
        invalid: Array<{
            index: number;
            recipe: string;
            errors: string[];
        }>;
        insertErrors?: string[];
    };
};

export type FileUploadProgress = {
    loaded: number;
    total: number;
    percentage: number;
};
