const API_URL = 'http://localhost:3000'

export async function http<T>(
    endpoint: string,
    options?: RequestInit,
): Promise<T> {
    // 1. Obtener el token del localStorage de forma dinámica
    const token = localStorage.getItem('token');

    // 2. Preparar los headers base incorporando el Content-Type
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // 3. Si el token existe, inyectamos el Bearer Token automáticamente
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers: {
                ...headers,
                ...options?.headers, // Mantiene cualquier header extra que envíes manualmente
            },
        },
    )

    if (!response.ok) {
        throw new Error('Error en la petición');
    }

    return response.json()
}