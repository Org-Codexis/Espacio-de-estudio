const API_URL = 'http://localhost:3000'

export async function http<T>(
    endpoint: string,
    options?: RequestInit,
): Promise<T> {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options,
        },
    )

    if (!response.ok) {

        throw new Error(
            'Error en la petición',
        )

    }

    return response.json()

}