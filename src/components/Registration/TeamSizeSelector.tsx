import "./Registration.css";

// Reuse the same PRICES object from RegistrationWizard.tsx
const PRICES: Record<number, number> = { 
  2: 1099,
  3: 1099,
  4: 1349,
  5: 1599 
};

interface TeamSizeSelectorProps {
  teamSize: number;
  setTeamSize: (size: number) => void;
}

export default function TeamSizeSelector({
  teamSize,
  setTeamSize,
}: TeamSizeSelectorProps) {
  const MIN_SIZE = 2;
  const MAX_SIZE = 5;

  const decrease = () => {
    if (teamSize > MIN_SIZE) setTeamSize(teamSize - 1);
  };

  const increase = () => {
    if (teamSize < MAX_SIZE) setTeamSize(teamSize + 1);
  };

  return (
    <div className="team-size-section">
      {/* Left double-chevron arrow */}
      <button
        className={`chevron-arrow chevron-left ${teamSize <= MIN_SIZE ? "chevron-disabled" : ""}`}
        onClick={decrease}
        disabled={teamSize <= MIN_SIZE}
        aria-label="Decrease team size"
      >
        <svg width="40" height="56" viewBox="0 0 40 56" fill="none">
          <defs>
            <linearGradient id="chevronGradL" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#84cc16" />
            </linearGradient>
          </defs>
          <path
            d="M22 6L8 28L22 50"
            stroke="url(#chevronGradL)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M34 6L20 28L34 50"
            stroke="url(#chevronGradL)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      <div className="ts-card-wrapper">
        <div className="ts-card-glow"></div>
        <div className="ts-card">
          {/* Title */}
          <h2 className="ts-card-title">TEAM SIZE: {teamSize}</h2>
          <div className="ts-card-underline"></div>

          {/* Group Icon */}
          <div className="ts-group-icon" key={`team-${teamSize}`}>
            {Array.from({ length: teamSize }).map((_, i) => (
              <svg
                key={i}
                className="ts-person-icon"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="url(#iconGrad)"
              >
                <defs>
                  <linearGradient id="iconGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#84cc16" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            ))}
          </div>

          {/* Pricing - now using the correct PRICES object */}
          <div className="ts-pricing">
            <p className="ts-price-total">TOTAL PER TEAM: ₹{PRICES[teamSize]}</p>
            <p className="ts-price-extra">
              {teamSize > 3
                ? `Each additional member: +₹250`
                : teamSize === 3
                ? "Same price as 2-member team"
                : "Base price for team"}
            </p>
          </div>
        </div>
      </div>

      {/* Right double-chevron arrow */}
      <button
        className={`chevron-arrow chevron-right ${teamSize >= MAX_SIZE ? "chevron-disabled" : ""}`}
        onClick={increase}
        disabled={teamSize >= MAX_SIZE}
        aria-label="Increase team size"
      >
        <svg width="40" height="56" viewBox="0 0 40 56" fill="none">
          <defs>
            <linearGradient id="chevronGradR" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#84cc16" />
            </linearGradient>
          </defs>
          <path
            d="M6 6L20 28L6 50"
            stroke="url(#chevronGradR)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M18 6L32 28L18 50"
            stroke="url(#chevronGradR)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>
    </div>
  );
}