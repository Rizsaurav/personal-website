import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageTransitions from "@/components/transition/PageTransitions";
import Index from "./pages/Index";
const BlogIndex = lazy(() => import("./pages/blogs/index"));
import NotFound from "./pages/NotFound";
const BlogPost = lazy(() => import("./pages/blogs/[slug]"));

const App = () => (
  <>
    <BrowserRouter>
      <Suspense
        fallback={
          <p role="status" className="p-8 text-text-secondary">
            Loading page…
          </p>
        }
      >
        <PageTransitions>
          {(location) => (
            <Routes location={location}>
              <Route path="/" element={<Index />} />
              <Route path="/blogs" element={<BlogIndex />} />
              <Route path="/blogs/:slug" element={<BlogPost />} />

              {/* CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </PageTransitions>
      </Suspense>
    </BrowserRouter>
  </>
);

export default App;
