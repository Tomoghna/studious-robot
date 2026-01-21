import React, {createContext, useCallback, useContext, useEffect, useState} from "react";

const CategoryContext = createContext({
    categories: [],
    loading: false,
    error: null,
    refreshCategories: () => {},
});

export function CategoryProvider({children}) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch();
            if (!res.ok)
                throw new Error(`Failed to fetch: ${res.status}`);
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        }
        catch (err) {
            setCategories([]);
            setError(err?.message ?? String(err));
        }
        finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return (
        <CategoryContext.Provider
            value={{ categories, loading, error, refreshCategories: fetchCategories }}
        >
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategories() {
    return useContext(CategoryContext);
}