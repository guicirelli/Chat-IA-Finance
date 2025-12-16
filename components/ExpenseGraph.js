import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function ExpenseGraph({ chartData }) {
  const data = useMemo(() => chartData || { labels: [], datasets: [] }, [chartData]);
  const hasData = data?.datasets?.[0]?.data?.length > 0;

  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h3 className="text-sm font-semibold mb-2">Despesas por categoria</h3>
      {hasData ? (
        <Doughnut
          data={data}
          options={{
            responsive: true,
            plugins: {
              title: { display: true, text: "Expense Distribution" },
              legend: { position: "bottom" },
            },
          }}
        />
      ) : (
        <p className="text-gray-500 text-sm">Not enough data to display the chart.</p>
      )}
    </div>
  );
}
