import { Container } from "@mui/material";
import * as React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import Home from '../Pages/Home/Home'
import Register from "../Pages/Auth/Register";
import Login from "../Pages/Auth/Login";
import Genre from "../Pages/Genre/Genre";
import Style from "../Pages/Style/Style";

const Content = () => {
    return (
        <Container>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/genres" element={<Genre />} />
                <Route path="/styles" element={<Style />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </Container>
    );
}

export default Content;
