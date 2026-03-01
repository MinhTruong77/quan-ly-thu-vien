import Context from './Context';
import CryptoJS from 'crypto-js';

import cookies from 'js-cookie';

import { useEffect, useState } from 'react';
import { requestAuth, requestGetCart, requestGetCategory } from '../config/request';

export function Provider({ children }) {
    const [dataUser, setDataUser] = useState({});
    const [category, setCategory] = useState([]);

    const [dataCart, setDataCart] = useState([]);

    const fetchAuth = async () => {
        try {
            const res = await requestAuth();
            const bytes = CryptoJS.AES.decrypt(res.metadata.auth, import.meta.env.VITE_SECRET_CRYPTO);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);

            if (!originalText) {
                console.error('Failed to decrypt data');
                return;
            }
            const user = JSON.parse(originalText);
            setDataUser(user);
        } catch (error) {
            console.error('Auth error:', error);
        }
    };

    const fetchCategory = async () => {
        const res = await requestGetCategory();
        setCategory(res.metadata);
    };

    const fetchCart = async () => {
        try {
            const res = await requestGetCart();
            // Đảm bảo dataCart luôn là mảng, không phải null hoặc undefined
            setDataCart(Array.isArray(res.metadata) ? res.metadata : []);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setDataCart([]);
        }
    };

    useEffect(() => {
        const token = cookies.get('logged');
        fetchCategory();
        if (!token) {
            return;
        }
        fetchAuth();
        fetchCart();
    }, []);

    return (
        <Context.Provider
            value={{
                dataUser,
                fetchAuth,
                category,
                fetchCategory,
                dataCart,
                fetchCart,
            }}
        >
            {children}
        </Context.Provider>
    );
}
