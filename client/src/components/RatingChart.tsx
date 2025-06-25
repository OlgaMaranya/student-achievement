
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Янв', rating: 45 },
  { month: 'Фев', rating: 48 },
  { month: 'Мар', rating: 52 },
  { month: 'Апр', rating: 55 },
  { month: 'Май', rating: 58 },
  { month: 'Июн', rating: 60 },
  { month: 'Июл', rating: 62 },
  { month: 'Авг', rating: 59 },
  { month: 'Сен', rating: 63 },
  { month: 'Окт', rating: 65 },
  { month: 'Ноя', rating: 62 },
  { month: 'Дек', rating: 66 },
];

export function RatingChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => `Месяц: ${value}`}
            formatter={(value) => [`${value} баллов`, 'Рейтинг']}
          />
          <Line 
            type="monotone" 
            dataKey="rating" 
            stroke="#017870" 
            strokeWidth={3}
            dot={{ fill: '#017870', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#017870', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
