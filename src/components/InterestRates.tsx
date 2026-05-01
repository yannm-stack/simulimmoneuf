import { useEffect, useState } from "react";

export default function InterestRates() {
  const [rates, setRates] = useState<any[]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/rates")
      .then(res => res.json())
      .then(data => {
        // Sort rates by years and filter common durations
        const filtered = (data || [])
          .filter((r: any) => [7, 10, 15, 20, 25].includes(r.years))
          .sort((a: any, b: any) => a.years - b.years);
        setRates(filtered);
      })
      .catch(err => console.error("Error fetching rates:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="taux" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-12 gap-16 items-center">
        <div className="md:col-span-5">
          <h2 className="text-4xl font-extrabold tracking-tight mb-6">LES TAUX D'INTÉRÊT ACTUELS</h2>
          <p className="text-on-surface-variant leading-relaxed mb-8">
            Suivez l'évolution du marché en temps réel pour optimiser votre financement dans le neuf. Nos taux sont mis à jour quotidiennement en direct de MoneyVox.
          </p>
          <div className="p-6 bg-gray-50 rounded-xl border-l-4 border-primary">
            <p className="text-sm font-semibold text-primary mb-1">CONSEIL D'EXPERT</p>
            <p className="text-sm text-on-surface italic">
              "Le prêt à taux zéro (PTZ) peut financer jusqu'à 40% de votre achat dans certaines zones."
            </p>
          </div>
        </div>
        <div className="md:col-span-7">
          <div className="overflow-hidden rounded-xl bg-white shadow-xl shadow-primary/5 border border-gray-100 min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Actualisation des barèmes...</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-4 font-bold text-xs">DURÉE</th>
                    <th className="p-4 font-bold text-xs text-right whitespace-nowrap">BON TAUX</th>
                    <th className="p-4 font-bold text-xs text-right whitespace-nowrap">TRÈS BON</th>
                    <th className="p-4 font-bold text-xs text-right whitespace-nowrap">EXCELLENT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(rates || []).map((r) => (
                    <tr key={r.years} className="hover:bg-primary-fixed/20 transition-colors">
                      <td className="p-4 font-bold text-sm">{r.years} ans</td>
                      <td className="p-4 text-right text-sm">{r.avgRate.toFixed(2)}%</td>
                      <td className="p-4 text-right text-sm font-semibold text-gray-600">{r.midRate.toFixed(2)}%</td>
                      <td className="p-4 text-right text-sm font-bold text-primary">{r.topRate.toFixed(2)}%</td>
                    </tr>
                  ))}
                  {(!rates || rates.length === 0) && (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-gray-400 italic">Données temporairement indisponibles</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
