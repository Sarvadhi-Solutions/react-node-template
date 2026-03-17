import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes, type RouteConfig } from '@/routes/route';
import { AppUpdateBanner } from '@/components/shared/AppUpdateBanner';

function renderRoutes(routeConfigs: RouteConfig[]) {
  return routeConfigs.map((route) => {
    if (route.index) {
      return <Route key="index" index element={route.element} />;
    }
    return (
      <Route key={route.path} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    );
  });
}

function App() {
  return (
    <BrowserRouter>
      <Routes>{renderRoutes(routes)}</Routes>
      <AppUpdateBanner />
    </BrowserRouter>
  );
}

export default App;
