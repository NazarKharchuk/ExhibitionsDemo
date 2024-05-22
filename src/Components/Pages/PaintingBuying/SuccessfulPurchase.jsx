import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setTitle, showAlert } from '../../../Store/headerSlice';
import { paintingBuingAPI } from '../../../API/paintingBuingAPI';
import { useSearchParams } from 'react-router-dom';

const SuccessfulPurchase = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("sessionId")

    useEffect(() => {
        const processSuccessfulPurchase = async (sessionId) => {
            try {
                dispatch(setLoading({ isLoading: true }));
                const res = await paintingBuingAPI.processSuccessfulBuying(sessionId);

                if (res.successfully === true) {
                    dispatch(showAlert({ message: "Дякуємо за покупку!", severity: 'success', hideTime: 6000 }));
                } else {
                    dispatch(showAlert({ message: res.message, severity: 'error', hideTime: 6000 }));
                }
            } catch (error) {
                console.error("Помилка під час збереження оновленого статусу картини:", error);
                dispatch(showAlert({ message: "Сталася помилка. Будь ласка, спробуйте ще раз.", severity: 'error', hideTime: 6000 }));
            } finally {
                dispatch(setLoading({ isLoading: false }));
            }
        };

        if (sessionId) {
            dispatch(setTitle({ title: "Ви успішно придбали картину" }));
            processSuccessfulPurchase(sessionId);
        }
    }, []);

    return (
        <>
            <div>
                <p>Дякуємо за покупку!</p>
                <p>Із Вами зв'яжеться наш адміністратор.</p>
            </div>
        </>
    );
};

export default SuccessfulPurchase;