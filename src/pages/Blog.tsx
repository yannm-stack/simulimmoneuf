import { ArrowRight, Mail, Calendar as CalendarIcon, Clock } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function Blog() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsRes = await fetch("/api/news");
        const newsData = await newsRes.json();
        setArticles(newsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const heroArticle = Array.isArray(articles) && articles.length > 0 ? articles[0] : null;
  const otherArticles = Array.isArray(articles) ? articles.slice(1) : [];

  return (
    <div className="bg-white min-h-screen">
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Page Header */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4 font-headline uppercase">Actualités & Conseils</h1>
          <div className="flex items-center gap-2 text-gray-500 font-medium">
            <span className="text-sm uppercase tracking-widest opacity-60">Flux direct :</span>
            <span className="text-primary font-bold">MoneyVox.fr</span>
            <div className="h-px w-12 bg-gray-200 ml-4"></div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-16">
            {loading ? (
              <div className="flex flex-col gap-12 animate-pulse">
                <div className="aspect-[16/9] bg-gray-100 rounded-3xl"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {[1, 2, 4, 5].map(i => (
                    <div key={i} className="aspect-video bg-gray-100 rounded-2xl"></div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Hero Article */}
                {heroArticle && (
                  <motion.article 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="group cursor-pointer relative overflow-hidden rounded-3xl bg-gray-50 shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <a href={heroArticle.link} target="_blank" rel="noopener noreferrer">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          alt={heroArticle.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                          referrerPolicy="no-referrer"
                          src={heroArticle.image || `https://picsum.photos/seed/hero/1200/800`} 
                        />
                      </div>
                      <div className="p-8 lg:p-12">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg mb-6 uppercase tracking-wider">À LA UNE</span>
                        <h2 className="text-3xl lg:text-4xl font-extrabold leading-tight text-on-surface mb-6 group-hover:text-primary transition-colors font-headline">
                          {heroArticle.title}
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-8 line-clamp-3 italic">
                          {heroArticle.content}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <CalendarIcon size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 font-headline">Publié le</p>
                            <p className="text-xs text-gray-500">{new Date(heroArticle.pubDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </motion.article>
                )}

                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {otherArticles.map((article, index) => (
                    <motion.article 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex flex-col gap-6 group cursor-pointer"
                    >
                      <a href={article.link} target="_blank" rel="noopener noreferrer" className="flex flex-col h-full">
                        <div className="aspect-video overflow-hidden rounded-2xl bg-gray-100 mb-6">
                          <img 
                            alt={article.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            referrerPolicy="no-referrer"
                            src={article.image || `https://picsum.photos/seed/${index+20}/600/400`} 
                          />
                        </div>
                        <div className="space-y-3 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-primary font-bold text-[10px] uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded">Actualité</span>
                            <span className="text-[10px] text-gray-400 font-medium">{new Date(article.pubDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors font-headline line-clamp-2">{article.title}</h3>
                          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed italic flex-1">{article.content}</p>
                          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest pt-4 mt-auto">
                             Voir l'article <ArrowRight size={14} />
                          </div>
                        </div>
                      </a>
                    </motion.article>
                  ))}
                </div>
              </>
            )}
            
            {!loading && articles.length === 0 && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center text-gray-400">
                Aucun article disponible pour le moment.
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-10">
            {/* Trending Topics */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Populaire en ce moment</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Prêt à Taux Zéro", 
                  "LMNP", 
                  "Passoire thermique", 
                  "Vente en l'état futur", 
                  "Diagnostic"
                ].map((topic) => (
                  <a key={topic} className="px-4 py-2 bg-gray-100 rounded-full text-xs font-semibold text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors" href="#">
                    {topic}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
