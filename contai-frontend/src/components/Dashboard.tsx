import React from "react";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import type { MonthSummary, FilterState } from "../types/Transaction";

interface DashboardProps {
  summary: MonthSummary;
  filter: FilterState;
}

const Dashboard: React.FC<DashboardProps> = ({ summary, filter }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getFilterTitle = () => {
    if (filter.month && filter.year) {
      const monthNames = [
        "",
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      return `${monthNames[parseInt(filter.month)]} de ${filter.year}`;
    } else if (filter.year) {
      return `Ano de ${filter.year}`;
    } else if (filter.month) {
      const monthNames = [
        "",
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ];
      return `Mês de ${monthNames[parseInt(filter.month)]}`;
    }
    return "Todos os Períodos";
  };

  // Só exibe o dashboard quando há filtro ativo
  const shouldShowDashboard = filter.month || filter.year;

  if (!shouldShowDashboard) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-4">{getFilterTitle()}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-500 bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              <div>
                <p className="text-sm opacity-80">Créditos</p>
                <p className="text-xl font-bold">
                  {formatCurrency(summary.credits)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-500 bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingDown className="w-6 h-6 mr-2" />
              <div>
                <p className="text-sm opacity-80">Débitos</p>
                <p className="text-xl font-bold">
                  {formatCurrency(summary.debits)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500 bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 mr-2" />
              <div>
                <p className="text-sm opacity-80">Saldo</p>
                <p
                  className={`text-xl font-bold ${
                    summary.balance >= 0 ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {formatCurrency(summary.balance)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
