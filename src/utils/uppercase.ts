export function uppercaseData<T extends Record<string, any>>(data: T): T {
    const skipKeys = ["id", "password", "email", "remember_token"];

    const newData: Record<string, any> = { ...data };

    Object.keys(newData).forEach((key) => {
        const lowerKey = key.toLowerCase();

        // Skip key yang harus dilewati
        if (
            skipKeys.includes(lowerKey) ||
            lowerKey.endsWith("_id")
        ) {
            return;
        }

        // Uppercase value string
        if (typeof newData[key] === "string") {
            newData[key] = newData[key].toUpperCase();
        }
    });

    return newData as T;
}
