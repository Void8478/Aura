import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { EditorialFeed } from './pages/EditorialFeed';
import { CatalogBrowse } from './pages/CatalogBrowse';
import { ReleaseDetail } from './pages/ReleaseDetail';
import { RadioStation } from './pages/RadioStation';
import { UserLibrary } from './pages/UserLibrary';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<EditorialFeed />} />
          <Route path="browse" element={<CatalogBrowse />} />
          <Route path="release/:id" element={<ReleaseDetail />} />
          <Route path="radio" element={<RadioStation />} />
          <Route path="library" element={<UserLibrary />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
