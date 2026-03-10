// src/services/apiService.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper: reads a binary response and triggers a browser file download
const handleFileDownload = async (response: Response): Promise<void> => {
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Try to get filename from Content-Disposition header, fallback to default
    const disposition = response.headers.get('Content-Disposition');
    const filenameMatch = disposition?.match(/filename=([^;]+)/);
    a.download = filenameMatch ? filenameMatch[1].trim() : 'Reformatted-Document.docx';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export interface ApiCallParams {
    mode: string;
    textInput?: string;
    contentFile?: File | null;
    themeFile?: File | null;
}

export interface ApiDocument {
    topic: string;
    content: string;
}

export const callApi = async ({
    mode,
    textInput,
    contentFile,
    themeFile,
}: ApiCallParams): Promise<ApiDocument[] | 'file_download'> => {

    // Each feature now explicitly maps to its own separate route on the backend
    const endpoint = `${API_BASE_URL}/${mode}`;

    const formData = new FormData();

    if (textInput) formData.append('textInput', textInput);
    if (contentFile) formData.append('contentFile', contentFile);
    if (themeFile) formData.append('themeFile', themeFile);

    const response = await fetch(endpoint, { method: 'POST', body: formData });

    if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
        } catch {
            // response wasn't JSON
        }
        throw new Error(errorMessage);
    }

    if (mode === 'reformatter') {
        await handleFileDownload(response);
        return 'file_download';
    }

    const data = await response.json();
    return data.documents as ApiDocument[];
};