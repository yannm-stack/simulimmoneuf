import { MoveRight, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Blog() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.error("Error fetching news:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight uppercase">Actualités & Conseils</h2>
            <p className="text-on-surface-variant mt-2">Suivez les dernières tendances du marché immobilier en temps réel.</p>
          </div>
          <Link to="/blog" className="text-primary font-bold flex items-center gap-1 hover:underline group">
            Tout voir sur le blog <MoveRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse bg-gray-50 rounded-xl h-96 border border-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {Array.isArray(articles) && articles.slice(0, 3).map((article, idx) => (
              <article key={idx} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center relative">
                  <img 
                    src={article.image || `https://picsum.photos/seed/${idx + 10}/600/400`} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {!article.image && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                      Actualité
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <Calendar size={10} /> {article.pubDate ? new Date(article.pubDate).toLocaleDateString('fr-FR') : 'Récemment'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-4 line-clamp-3 italic flex-1">
                    {article.content}
                  </p>
                  <a 
                    href={article.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all mt-auto"
                  >
                    Lire l'article <MoveRight size={14} />
                  </a>
                </div>
              </article>
            ))}
            {articles.length === 0 && (
              <div className="col-span-3 p-12 text-center text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                Impossible de charger les actualités pour le moment.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
