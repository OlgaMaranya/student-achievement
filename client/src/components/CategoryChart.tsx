
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Учебная деятельность', value: 25, color: '#017870' },
  { name: 'Научная деятельность', value: 18, color: '#C42E6F' },
  { name: 'Спортивная деятельность', value: 12, color: '#FFDDAA' },
  { name: 'Культурно-творческая', value: 8, color: '#DDBBAF' },
  { name: 'Общественная деятельность', value: 3, color: '#AADDAA' },
];

export function CategoryChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value} баллов`, name]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
