// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "../components/Layout"; // Layout component

// Pages
import HomeScreen from "../pages/HomeScreen";
import ProcessAudioScreen from "../pages/ProcessAudioScreen";
import ModifyVoiceScreen from "../pages/ModifyVoiceScreen";
import ChooseFaceScreen from "../pages/ChooseFaceScreen";
import AnimateRenderScreen from "../pages/AnimateRenderScreen";
import ResultScreen from "../pages/ResultScreen";

// Define route configs with showHeader and showFooter
const routeConfigs = [
  {
    path: "/",
    element: <HomeScreen />,
    showHeader: false,
    showFooter: false,
    isResultScreen: false,
  }, // Hide header and footer on HomeScreen
  {
    path: "/process-audio",
    element: <ProcessAudioScreen />,
    showHeader: true,
    showFooter: true,
    isResultScreen: false,
  }, // Show header and footer on ProcessAudioScreen
  {
    path: "/modify-voice",
    element: <ModifyVoiceScreen />,
    showHeader: true,
    showFooter: true,
    isResultScreen: false,
  }, // Show header and footer on ModifyVoiceScreen
  {
    path: "/choose-face",
    element: <ChooseFaceScreen />,
    showHeader: true,
    showFooter: true,
    isResultScreen: false,
  }, // Show header and footer on ChooseFaceScreen
  {
    path: "/animate-render",
    element: <AnimateRenderScreen />,
    showHeader: true,
    showFooter: true,
    isResultScreen: false,
  }, // Show header and footer on AnimateRenderScreen
  {
    path: "/result",
    element: <ResultScreen />,
    showHeader: true,
    showFooter: true,
    isResultScreen: true, // Set isResultScreen to true for ResultScreen
  }, // Show header and footer on ResultScreen
];

const AppRoutes = () => {
  const location = useLocation();

  // Get the current route's config
  const currentRouteConfig = routeConfigs.find(
    (route) => route.path === location.pathname
  );

  // If route exists, use its showHeader, showFooter and isResultScreen values
  const showHeader = currentRouteConfig ? currentRouteConfig.showHeader : true;
  const showFooter = currentRouteConfig ? currentRouteConfig.showFooter : true;
  const isResultScreen = currentRouteConfig
    ? currentRouteConfig.isResultScreen
    : false; // Check if the current route is ResultScreen

  return (
    <Layout
      showHeader={showHeader}
      showFooter={showFooter}
      isResultScreen={isResultScreen}
    >
      <Routes>
        {routeConfigs.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
