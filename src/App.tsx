import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, Link } from "react-router-dom";
import { ScrollTrigger } from "./motion/setup";
import { Loader } from "./components/Loader";
import { Header } from "./components/Header";
import { FloatingWhatsApp } from "./components/FloatingWhatsApp";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import TopicPage from "./pages/TopicPage";
import Privacy from "./pages/Privacy";

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(t);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <section className="grid min-h-[70svh] place-items-center bg-cream px-6 pt-32 text-center">
      <div>
        <h1 className="text-5xl">Página não encontrada</h1>
        <p className="mt-4 text-text">O endereço que você acessou não existe.</p>
        <Link to="/" className="u-link mt-6 inline-block text-forest">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <BrowserRouter>
      <ScrollReset />
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-forest focus:px-5 focus:py-3 focus:text-ivory"
      >
        Pular para o conteúdo
      </a>
      <Loader />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main id="conteudo" tabIndex={-1} className="outline-none">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terapia/:slug" element={<TopicPage />} />
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp menuOpen={menuOpen} />
    </BrowserRouter>
  );
}
