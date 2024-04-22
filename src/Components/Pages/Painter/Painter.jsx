import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setTitle } from '../../../Store/headerSlice';

const Painter = () => {
    var dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(setTitle({ title: "Painter" }));
    }, []);

    return (
        <>
            Painter page
        </>
    );
}

export default Painter;
