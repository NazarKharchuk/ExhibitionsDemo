import { Container } from "@mui/material";
import * as React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import Home from '../Pages/Home/Home'
import Register from "../Pages/Auth/Register";
import Login from "../Pages/Auth/Login";
import Genre from "../Pages/Genre/Genre";
import Style from "../Pages/Style/Style";
import Material from "../Pages/Material/Material";
import PainterList from "../Pages/Painter/PainterList";
import Painter from "../Pages/Painter/Painter";
import ProfileList from "../Pages/Profiles/ProfileList";

const Content = () => {
    return (
        <Container>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/genres" element={<Genre />} />
                <Route path="/styles" element={<Style />} />
                <Route path="/materials" element={<Material />} />
                <Route path="/painters" element={<PainterList />} />
                <Route path="/painters/:painterId" element={<Painter />} />
                <Route path="/profiles" element={<ProfileList />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
        </Container>
    );
}

export default Content;
