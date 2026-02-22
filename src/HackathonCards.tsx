import React from "react";
import "./HackathonCards.css";

const HackathonCards = () => {
  const aboutData = {
    title: "About",
    description:
      "HackFit 4.0 is a 36-hour national-level hackathon bringing together innovative minds to solve real-world challenges using cutting-edge technology and creative problem-solving approaches.",
  };

  const tracksData = {
    title: "Tracks",
    items: ["GenAI", "Transformation", "Hugging", "Data Science"],
  };



  return (
    <div className="container">
      {/* About Card */}
      <div className="card-wrapper">
        <div className="card-glow"></div>
        <div className="card">
          <h2 className="card-title">{aboutData.title}</h2>
          <div className="card-underline"></div>
          <p className="card-description">
            {aboutData.description.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < aboutData.description.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
          <a href="#" className="learn-more">
            Learn More
          </a>
        </div>
      </div>

      {/* Tracks Card */}
      <div className="card-wrapper">
        <div className="card-glow"></div>
        <div className="card">
          <h2 className="card-title">{tracksData.title}</h2>
          <div className="card-underline"></div>
          <div className="track-list">
            {tracksData.items.map((track, index) => (
              <div key={index} className="track-item">
                <span className="track-hash">#</span>
                <span>{track}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

                  <div className="card-wrapper">
        <div className="card-glow"></div>
        <div className="card">
          <h2 className="card-title">Benefits</h2>
          <div className="card-underline"></div>
          <div className="track-list">
            {tracksData.items.map((track, index) => (
              <div key={index} className="track-item">
                <span className="track-hash">#</span>
                <span>{track}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default HackathonCards;
