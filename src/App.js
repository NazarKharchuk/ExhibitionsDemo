import s from "./App.module.css";
import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Header from "./Components/Header/Header";
import Content from "./Components/Content/Content";
import { GetAccessToken, RemoveAccessToken } from "./Helper/TokenFunctions";
import { useDispatch } from "react-redux";
import { setLoading } from "./Store/headerSlice";
import { userLogin } from "./Store/userSlice";
import { instance } from "./API/api";

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchData = async () => {
      const accessToken = GetAccessToken();
      if (accessToken) {
        dispatch(setLoading({ isLoading: true }))
        try {
          const res = await instance.get("get_info", {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (res.data.successfully === true) {
            console.log("Токен доступу перевірено успішно");
            dispatch(userLogin(res.data.data));
            instance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;
          } else {
            RemoveAccessToken();
            console.log("Токен доступу не пройшов перевірку");
          }
        } catch (error) {
          RemoveAccessToken();
          console.error("Помилка під час валідації збереженого токена доступу:", error);
        } finally {
          dispatch(setLoading({ isLoading: false }))
        }
      }
    };

    fetchData();
  }, []);

  return (
    <BrowserRouter>
      <div className={s.App}>
        <Header>
          <Content />
        </Header>
      </div>
    </BrowserRouter>
  );
}

export default App;
