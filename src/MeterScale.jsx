const MeterScale = ({
  min = 0,
  max = 100,
  startAngle = 180,
  endAngle = 0,
  numMarks = 11,
  highlightEveryNth = 2
}) => {
  // Generate dynamic arc path based on startAngle and endAngle
  const generateArcPath = () => {
    const radius = 35;
    const startRadian = ((startAngle - 90) * Math.PI) / 180;
    const endRadian = ((endAngle - 90) * Math.PI) / 180;
    const startX = Math.cos(startRadian) * radius;
    const startY = Math.sin(startRadian) * radius;
    const endX = Math.cos(endRadian) * radius;
    const endY = Math.sin(endRadian) * radius;
    const largeArcFlag = (endAngle - startAngle) > 180 ? 1 : 0;
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  // Generate scale markings
  const generateScaleMarks = (numMarks, highlightEveryNth = 10) => {    
    return Array.from({ length: numMarks }, (_, i) => {
      const angle = startAngle + (i / (numMarks - 1)) * (endAngle - startAngle);
      // Adjust angle by -90 degrees to align with galvanometer orientation (0° at top)
      const adjustedAngle = angle - 90;
      const radian = (adjustedAngle * Math.PI) / 180;
      
      const value = min + (i / (numMarks - 1)) * (max - min);
      
      // Determine if this is a highlighted mark (every nth mark OR first/last marks)
      const isHighlighted = (i % highlightEveryNth === 0) || (i === numMarks - 1);
      
      // Different radii and styling for highlighted vs normal marks
      const innerRadius = isHighlighted ? 28 : 30;
      const outerRadius = isHighlighted ? 37 : 35;
      const strokeWidth = isHighlighted ? 1 : 0.3;
      const strokeColor = isHighlighted ? "#2c3e50" : "#999";
      
      const x1 = Math.cos(radian) * innerRadius;
      const y1 = Math.sin(radian) * innerRadius;
      const x2 = Math.cos(radian) * outerRadius;
      const y2 = Math.sin(radian) * outerRadius;
      
      const textX = Math.cos(radian) * 41;
      const textY = Math.sin(radian) * 41;
      
      return (
        <g key={i}>
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          {/* Only show text labels on highlighted marks */}
          {isHighlighted && (
            <text
              x={textX}
              y={textY}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="5"
              fill="#2c3e50"
              fontWeight="bold"
            >
              {Math.round(value)}
            </text>
          )}
        </g>
      );
    });
  };

  return (
    <>
      {/* Scale markings */}
      {generateScaleMarks(numMarks, highlightEveryNth)}
      
      {/* Outer arc */}
      <path
        d={generateArcPath()}
        fill="none"
        stroke="#2c3e50"
        strokeWidth="2"
        className="arc"
      />
    </>
  );
};

export default MeterScale;
