import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setTitle } from '../../../Store/headerSlice';

const Home = () => {
    var dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(setTitle({ title: "Вебсервіс для онлайн-виставок картин" }));
    }, []);

    return (
        <>
            Home page
        </>
    );
}

export default Home;
