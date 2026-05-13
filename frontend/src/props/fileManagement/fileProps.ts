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
    importedRecipes: Array<{
        id: number;
        name: string;
        author: string;
        status: string;
        createdAt: string;
        imageUrl: string | null;
    }>;
    importFile: {
        filename: string;
        originalName: string;
        uploadedAt: string;
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

export type AdminFileInfo = {
    filename: string;
    size: number;
    uploadedAt: string;
    modifiedAt: string;
    type: 'image' | 'data' | 'unknown';
    extension: string;
    previewUrl: string | null;
    canDelete: boolean;
};

export type AdminFilesListResponse = {
    files: AdminFileInfo[];
    total: number;
    storageUsed: number;
};

export type RecipeImageResponse = {
    message: string;
    recipe: {
        id: number;
        name: string;
        image_path: string | null;
    };
    imageUrl?: string;
};
