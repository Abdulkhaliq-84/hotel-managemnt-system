import type { FC } from 'react';
import './SimpleChart.css';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  title: string;
  data: ChartData[];
  type: 'bar' | 'line' | 'pie';
  height?: number;
  showLegend?: boolean;
  unit?: string;
}

const SimpleChart: FC<SimpleChartProps> = ({
  title, 
  data, 
  type, 
  height = 300,
  showLegend = false,
  unit = ''
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#64748b'];

  const renderBarChart = () => {
    return (
      <div className="chart-bars" style={{ height }}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100;
          const color = item.color || colors[index % colors.length];
          return (
            <div key={index} className="chart-bar-container">
              <div className="chart-bar-wrapper">
                <div 
                  className="chart-bar"
                  style={{ 
                    height: `${barHeight}%`,
                    backgroundColor: color
                  }}
                >
                  <span className="chart-bar-value">
                    {item.value}{unit}
                  </span>
                </div>
              </div>
              <div className="chart-bar-label">{item.label}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLineChart = () => {
    const width = 100 / (data.length - 1);
    const points = data.map((item, index) => ({
      x: index * width,
      y: 100 - (item.value / maxValue) * 100
    }));

    const pathData = points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${path} L ${point.x} ${point.y}`;
    }, '');

    return (
      <div className="chart-line" style={{ height }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill="#3b82f6"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        <div className="chart-line-labels">
          {data.map((item, index) => (
            <div key={index} className="chart-line-label">
              <span className="label-text">{item.label}</span>
              <span className="label-value">{item.value}{unit}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const slices = data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (percentage / 100) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      const color = item.color || colors[index % colors.length];

      // Calculate path for pie slice
      const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
      const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
      const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
      const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
      const largeArc = angle > 180 ? 1 : 0;

      const pathData = [
        `M 50 50`,
        `L ${x1} ${y1}`,
        `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
        `Z`
      ].join(' ');

      return {
        pathData,
        color,
        percentage: percentage.toFixed(1),
        label: item.label,
        value: item.value
      };
    });

    return (
      <div className="chart-pie" style={{ height }}>
        <div className="pie-container">
          <svg viewBox="0 0 100 100">
            {slices.map((slice, index) => (
              <path
                key={index}
                d={slice.pathData}
                fill={slice.color}
                stroke="#fff"
                strokeWidth="0.5"
                className="pie-slice"
              />
            ))}
          </svg>
        </div>
        {showLegend && (
          <div className="pie-legend">
            {slices.map((slice, index) => (
              <div key={index} className="legend-item">
                <span 
                  className="legend-color"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="legend-label">{slice.label}</span>
                <span className="legend-value">{slice.percentage}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="simple-chart">
      <h3 className="chart-title">{title}</h3>
      <div className="chart-content">
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {type === 'pie' && renderPieChart()}
      </div>
    </div>
  );
};

export default SimpleChart;
