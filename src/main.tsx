import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { i18nDefaultLanguage } from "@/i18n";

import AppLayout from '@/layout';
import Home from '@/pages/home';
import Quiz from '@/pages/quiz';
import Quiz2 from '@/pages/quiz2';
import Settings from '@/pages/settings';

import './global.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to={`/${i18nDefaultLanguage}`} replace />} />
                
                <Route path="/:locale" element={<AppLayout />}>
                    <Route index element={<Home />} />
                    <Route path="quiz" element={<Quiz />} />
                    <Route path="quiz2" element={<Quiz2 />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
                
                <Route path="*" element={<Navigate to={`/${i18nDefaultLanguage}`} replace />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
);
