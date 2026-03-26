const EMeterScale = ({
  startAngle = 180,
  endAngle = 0
}) => {
  // E-meter specific configuration
  // Total 18 marks: 6 RISE + 3 SET + 9 FALL
  const riseMarks = 6;
  const setMarks = 3;
  const fallMarks = 9;
  const totalMarks = riseMarks + setMarks + fallMarks;

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

  // Generate colored section shapes (sectors)
  const generateSectionShapes = () => {
    const outerRadius = 35;
    const innerRadius = 33; // Inner radius for the sector shapes
    const shapes = [];
    
    // RISE section shape (green)
    const riseStartAngle = startAngle;
    const riseEndAngle = startAngle + (riseMarks / totalMarks) * (endAngle - startAngle);
    const riseStartRadian = ((riseStartAngle - 90) * Math.PI) / 180;
    const riseEndRadian = ((riseEndAngle - 90) * Math.PI) / 180;
    const riseStartXOuter = Math.cos(riseStartRadian) * outerRadius;
    const riseStartYOuter = Math.sin(riseStartRadian) * outerRadius;
    const riseEndXOuter = Math.cos(riseEndRadian) * outerRadius;
    const riseEndYOuter = Math.sin(riseEndRadian) * outerRadius;
    const riseStartXInner = Math.cos(riseStartRadian) * innerRadius;
    const riseStartYInner = Math.sin(riseStartRadian) * innerRadius;
    const riseEndXInner = Math.cos(riseEndRadian) * innerRadius;
    const riseEndYInner = Math.sin(riseEndRadian) * innerRadius;
    const riseLargeArc = (riseEndAngle - riseStartAngle) > 180 ? 1 : 0;
    
    shapes.push(
      <path
        key="rise-shape"
        d={`M ${riseStartXInner} ${riseStartYInner} 
            L ${riseStartXOuter} ${riseStartYOuter} 
            A ${outerRadius} ${outerRadius} 0 ${riseLargeArc} 1 ${riseEndXOuter} ${riseEndYOuter}
            L ${riseEndXInner} ${riseEndYInner}
            A ${innerRadius} ${innerRadius} 0 ${riseLargeArc} 0 ${riseStartXInner} ${riseStartYInner}
            Z`}
        fill="#22c55e"
        fillOpacity="1"
        stroke="none"
        className="rise-shape"
      />
    );
    
    // SET section shape (grey)
    const setStartAngle = riseEndAngle;
    const setEndAngle = startAngle + ((riseMarks + setMarks) / totalMarks) * (endAngle - startAngle);
    const setStartRadian = ((setStartAngle - 90) * Math.PI) / 180;
    const setEndRadian = ((setEndAngle - 90) * Math.PI) / 180;
    const setStartXOuter = Math.cos(setStartRadian) * outerRadius;
    const setStartYOuter = Math.sin(setStartRadian) * outerRadius;
    const setEndXOuter = Math.cos(setEndRadian) * outerRadius;
    const setEndYOuter = Math.sin(setEndRadian) * outerRadius;
    const setStartXInner = Math.cos(setStartRadian) * innerRadius;
    const setStartYInner = Math.sin(setStartRadian) * innerRadius;
    const setEndXInner = Math.cos(setEndRadian) * innerRadius;
    const setEndYInner = Math.sin(setEndRadian) * innerRadius;
    const setLargeArc = (setEndAngle - setStartAngle) > 180 ? 1 : 0;
    
    shapes.push(
      <path
        key="set-shape"
        d={`M ${setStartXInner} ${setStartYInner} 
            L ${setStartXOuter} ${setStartYOuter} 
            A ${outerRadius} ${outerRadius} 0 ${setLargeArc} 1 ${setEndXOuter} ${setEndYOuter}
            L ${setEndXInner} ${setEndYInner}
            A ${innerRadius} ${innerRadius} 0 ${setLargeArc} 0 ${setStartXInner} ${setStartYInner}
            Z`}
        fill="#6b7280"
        fillOpacity="1"
        stroke="none"
        className="set-shape"
      />
    );
    
    // FALL section shape (red)
    const fallStartAngle = setEndAngle;
    const fallEndAngle = endAngle;
    const fallStartRadian = ((fallStartAngle - 90) * Math.PI) / 180;
    const fallEndRadian = ((fallEndAngle - 90) * Math.PI) / 180;
    const fallStartXOuter = Math.cos(fallStartRadian) * outerRadius;
    const fallStartYOuter = Math.sin(fallStartRadian) * outerRadius;
    const fallEndXOuter = Math.cos(fallEndRadian) * outerRadius;
    const fallEndYOuter = Math.sin(fallEndRadian) * outerRadius;
    const fallStartXInner = Math.cos(fallStartRadian) * innerRadius;
    const fallStartYInner = Math.sin(fallStartRadian) * innerRadius;
    const fallEndXInner = Math.cos(fallEndRadian) * innerRadius;
    const fallEndYInner = Math.sin(fallEndRadian) * innerRadius;
    const fallLargeArc = (fallEndAngle - fallStartAngle) > 180 ? 1 : 0;
    
    shapes.push(
      <path
        key="fall-shape"
        d={`M ${fallStartXInner} ${fallStartYInner} 
            L ${fallStartXOuter} ${fallStartYOuter} 
            A ${outerRadius} ${outerRadius} 0 ${fallLargeArc} 1 ${fallEndXOuter} ${fallEndYOuter}
            L ${fallEndXInner} ${fallEndYInner}
            A ${innerRadius} ${innerRadius} 0 ${fallLargeArc} 0 ${fallStartXInner} ${fallStartYInner}
            Z`}
        fill="#ef4444"
        fillOpacity="1"
        stroke="none"
        className="fall-shape"
      />
    );
    
    return shapes;
  };

  // Generate E-meter specific scale markings
  const generateEMeterMarks = () => {
    return Array.from({ length: totalMarks + 1 }, (_, i) => {
      const angle = startAngle + (i / totalMarks) * (endAngle - startAngle);
      const adjustedAngle = angle - 90;
      const radian = (adjustedAngle * Math.PI) / 180;
      
      // Determine section boundaries for major marks
      let isSectionBoundary = false;
      let isMajorMark = false;
      
      if (i <= riseMarks) {
        isSectionBoundary = (i === 0 || i === riseMarks);
      } else if (i <= riseMarks + setMarks) {
        isSectionBoundary = (i === riseMarks + setMarks);
      } else {
        isSectionBoundary = (i === totalMarks);
      }
      
      // Major marks are at section boundaries
      isMajorMark = isSectionBoundary;
      
      // Styling for different mark types
      const innerRadius = isMajorMark ? 28 : 30;
      const outerRadius = 35;
      const strokeWidth = isMajorMark ? 1 : 0.5;
      // const strokeColor = isMajorMark ? "#2c3e50" : "#999";
      const strokeColor = "#2c3e50";
      
      const x1 = Math.cos(radian) * innerRadius;
      const y1 = Math.sin(radian) * innerRadius;
      const x2 = Math.cos(radian) * outerRadius;
      const y2 = Math.sin(radian) * outerRadius;
      
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
        </g>
      );
    });
  };

  // Generate arc paths for section labels
  const generateLabelArcPaths = () => {
    const labelRadius = 37; // About 5% outside the main arc (35 * 1.05)
    const paths = [];
    
    // RISE section arc path
    const riseStartAngle = startAngle;
    const riseEndAngle = startAngle + (riseMarks / totalMarks) * (endAngle - startAngle);
    const riseStartRadian = ((riseStartAngle - 90) * Math.PI) / 180;
    const riseEndRadian = ((riseEndAngle - 90) * Math.PI) / 180;
    const riseStartX = Math.cos(riseStartRadian) * labelRadius;
    const riseStartY = Math.sin(riseStartRadian) * labelRadius;
    const riseEndX = Math.cos(riseEndRadian) * labelRadius;
    const riseEndY = Math.sin(riseEndRadian) * labelRadius;
    const riseLargeArc = (riseEndAngle - riseStartAngle) > 180 ? 1 : 0;
    
    paths.push(
      <path
        key="rise-path"
        id="rise-arc-path"
        d={`M ${riseStartX} ${riseStartY} A ${labelRadius} ${labelRadius} 0 ${riseLargeArc} 1 ${riseEndX} ${riseEndY}`}
        fill="none"
        stroke="none"
      />
    );
    
    // SET section arc path
    const setStartAngle = riseEndAngle;
    const setEndAngle = startAngle + ((riseMarks + setMarks) / totalMarks) * (endAngle - startAngle);
    const setStartRadian = ((setStartAngle - 90) * Math.PI) / 180;
    const setEndRadian = ((setEndAngle - 90) * Math.PI) / 180;
    const setStartX = Math.cos(setStartRadian) * labelRadius;
    const setStartY = Math.sin(setStartRadian) * labelRadius;
    const setEndX = Math.cos(setEndRadian) * labelRadius;
    const setEndY = Math.sin(setEndRadian) * labelRadius;
    const setLargeArc = (setEndAngle - setStartAngle) > 180 ? 1 : 0;
    
    paths.push(
      <path
        key="set-path"
        id="set-arc-path"
        d={`M ${setStartX} ${setStartY} A ${labelRadius} ${labelRadius} 0 ${setLargeArc} 1 ${setEndX} ${setEndY}`}
        fill="none"
        stroke="none"
      />
    );
    
    // FALL section arc path
    const fallStartAngle = setEndAngle;
    const fallEndAngle = endAngle;
    const fallStartRadian = ((fallStartAngle - 90) * Math.PI) / 180;
    const fallEndRadian = ((fallEndAngle - 90) * Math.PI) / 180;
    const fallStartX = Math.cos(fallStartRadian) * labelRadius;
    const fallStartY = Math.sin(fallStartRadian) * labelRadius;
    const fallEndX = Math.cos(fallEndRadian) * labelRadius;
    const fallEndY = Math.sin(fallEndRadian) * labelRadius;
    const fallLargeArc = (fallEndAngle - fallStartAngle) > 180 ? 1 : 0;
    
    paths.push(
      <path
        key="fall-path"
        id="fall-arc-path"
        d={`M ${fallStartX} ${fallStartY} A ${labelRadius} ${labelRadius} 0 ${fallLargeArc} 1 ${fallEndX} ${fallEndY}`}
        fill="none"
        stroke="none"
      />
    );
    
    return paths;
  };

  // Generate section labels on arc paths
  const generateSectionLabels = () => {
    const labels = [];
    
    labels.push(
      <text
        key="rise"
        fontSize="3"
        letterSpacing="2"
        fill="#2c3e50"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        <textPath href="#rise-arc-path" startOffset="50%" textAnchor="middle">
          RISE
        </textPath>
      </text>
    );
    
    labels.push(
      <text
        key="set"
        fontSize="3"
        letterSpacing="2"
        fill="#2c3e50"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        <textPath href="#set-arc-path" startOffset="50%" textAnchor="middle">
          SET
        </textPath>
      </text>
    );
    
    labels.push(
      <text
        key="fall"
        fontSize="3"
        letterSpacing="2"
        fill="#2c3e50"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        <textPath href="#fall-arc-path" startOffset="50%" textAnchor="middle">
          FALL
        </textPath>
      </text>
    );
    
    return labels;
  };

  return (
    <>
      {/* Label arc paths (invisible paths for text to follow) */}
      <defs>
        {generateLabelArcPaths()}
      </defs>
      
      {/* Colored section shapes */}
      {generateSectionShapes()}
      
      {/* E-meter scale markings */}
      {generateEMeterMarks()}
      
      {/* Section labels on arc paths */}
      {generateSectionLabels()}
      
      {/* Main black arc outline */}
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

export default EMeterScale;
