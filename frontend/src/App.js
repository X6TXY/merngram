
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './AuthContext';
import { RouteList } from "./routes";

export const App = () => {
  return (
    <BrowserRouter>
    <AuthProvider>

      <RouteList/>
    </AuthProvider>
    </BrowserRouter>
    
  );
};