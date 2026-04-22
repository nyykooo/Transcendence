import { api } from '../configs/api';
import type { FileListResponse, FileUploadResponse, RecipeImportResponse, FileUploadProgress } from '../props/fileManagement/fileProps';

async function getAuthToken(): Promise<string | null> {
    const auth = JSON.parse(localStorage.getItem('auth') || 'null');
    return auth?.token || null;
}

export async function listFiles(): Promise<FileListResponse> {
    const token = await getAuthToken();
    if (!token) throw new Error('Missing auth token');

    const response = await fetch(`${api.profile}/files`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to load files');
    }

    return response.json();
}

export async function uploadFile(
    file: File,
    onProgress?: (progress: FileUploadProgress) => void
): Promise<FileUploadResponse> {
    const token = await getAuthToken();
    if (!token) throw new Error('Missing auth token');

    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        if (onProgress) {
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentage = (e.loaded / e.total) * 100;
                    onProgress({
                        loaded: e.loaded,
                        total: e.total,
                        percentage,
                    });
                }
            });
        }

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (e) {
                    reject(new Error('Invalid response from server'));
                }
            } else {
                try {
                    const error = JSON.parse(xhr.responseText);
                    reject(new Error(error.error || 'Upload failed'));
                } catch {
                    reject(new Error('Upload failed'));
                }
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('Network error during upload'));
        });

        xhr.addEventListener('abort', () => {
            reject(new Error('Upload cancelled'));
        });

        xhr.open('POST', `${api.profile}/files`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
    });
}

export async function deleteFile(filename: string): Promise<{ message: string }> {
    const token = await getAuthToken();
    if (!token) throw new Error('Missing auth token');

    const response = await fetch(`${api.profile}/files/${filename}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to delete file');
    }

    return response.json();
}

export async function importRecipes(
    file: File,
    onProgress?: (progress: FileUploadProgress) => void
): Promise<RecipeImportResponse> {
    const token = await getAuthToken();
    if (!token) throw new Error('Missing auth token');

    const formData = new FormData();
    formData.append('file', file);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        if (onProgress) {
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentage = (e.loaded / e.total) * 100;
                    onProgress({
                        loaded: e.loaded,
                        total: e.total,
                        percentage,
                    });
                }
            });
        }

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (e) {
                    reject(new Error('Invalid response from server'));
                }
            } else {
                try {
                    const error = JSON.parse(xhr.responseText);
                    reject(new Error(error.error || 'Import failed'));
                } catch {
                    reject(new Error('Import failed'));
                }
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('Network error during import'));
        });

        xhr.addEventListener('abort', () => {
            reject(new Error('Import cancelled'));
        });

        xhr.open('POST', `${api.recipe}/import`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
    });
}
