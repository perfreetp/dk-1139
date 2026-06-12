import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout";
import {
  HomePage,
  EntryDetailPage,
  CategoryPage,
  SearchPage,
  EditorPage,
  ReviewPage,
  AdminPage,
} from "./pages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="entry/:id" element={<EntryDetailPage />} />
          <Route path="category" element={<CategoryPage />} />
          <Route path="category/:id" element={<CategoryPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="editor" element={<EditorPage />} />
          <Route path="editor/:id" element={<EditorPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
