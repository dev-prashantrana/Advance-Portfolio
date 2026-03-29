import { useState } from 'react';

const FlipCard = ({ name, icon, description }) => {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => setFlipped((prev) => !prev);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFlip();
    }
  };

  return (
    <div
      className={`flip-card${flipped ? ' flipped' : ''}`}
      onClick={toggleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
    >
      <div className={`flip-inner${flipped ? ' flipped' : ''}`}>
        <div className="flip-front">
          <img src={icon} alt={name} className={name === 'MongoDB' ? 'invert' : ''} />
          <h3>{name}</h3>
        </div>
        <div className="flip-back">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;