import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

const CategoryContext = createContext({
    categories: [],
    loading: false,
    error: null,
    refreshCategories: () => {},
});

export function CategoryProvider({children})
{
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_SERVER_URL;

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_URL}/api/categories`);

            if(!res.ok) {
                throw new Error(`Failed to fetch: ${res.status}`);
            }

            const data = await res.json();

            setCategories(data.categories || []);
        }
        catch(err) {
            setError(err?.message ?? "Something went wrong");
            setCategories([]);
        }
        finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <CategoryContext.Provider
            value={{
                categories,
                loading,
                error,
                refreshCategories: fetchCategories,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategories() {
    return useContext(CategoryContext);
}