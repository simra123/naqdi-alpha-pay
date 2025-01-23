import React from "react";

interface SortingArrowProps {
  onClick: () => void;
}

const SortingArrow: React.FC<SortingArrowProps> = ({ onClick }) => (
  <button onClick={onClick} className="ml-2">
    {/* Placeholder for arrow */}
    <span className="inline-block">⇅</span>
  </button>
);

export default SortingArrow;
