import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Contact.css";
import "../HackathonCards.css";
import logo2 from "../assets/logo2.png";


const createLogoMarkerIcon = () => {
  return L.icon({
    iconUrl: logo2,
    iconSize: [60, 60],
    iconAnchor: [30, 60],
    popupAnchor: [0, -60],
    className: "custom-logo-marker",
  });
};


function RetargetButton({
  position,
  zoom,
}: {
  position: [number, number];
  zoom: number;
}) {
  const map = useMap();

  const handleRetarget = () => {
    map.setView(position, zoom, {
      animate: true,
      duration: 0.5,
    });
  };

  useEffect(() => {
    const RetargetControl = L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create(
          "div",
          "leaflet-bar leaflet-control leaflet-control-custom",
        );
        const button = L.DomUtil.create(
          "a",
          "leaflet-control-retarget",
          container,
        );
        button.innerHTML = "⌖";
        button.title = "Reset to original location";
        button.href = "#";
        button.role = "button";
        button.setAttribute("aria-label", "Reset map view");

        L.DomEvent.on(button, "click", (e) => {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          handleRetarget();
        });

        return container;
      },
    });

    const control = new RetargetControl({ position: "topleft" });
    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map, position, zoom]);

  return null;
}

export default function ContactSection() {
  useEffect(() => {
    
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "",
      iconUrl: "",
      shadowUrl: "",
    });
  }, []);

  const fisatPosition: [number, number] = [10.230845071755535, 76.40833693];
  const handleMarkerClick = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${fisatPosition[0]},${fisatPosition[1]}`;
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-header">
          <p className="contact-kicker">REACH OUT</p>
          <h2 className="contact-title hack-text">Contact</h2>
          <p className="contact-desc">
            Questions about HackFit? Get in touch with our coordinators.
          </p>
        </div>

        <div className="contact-main-grid">
          {/* Contact Cards - 2x2 Grid */}
          <div className="contact-cards-container">
            <div className="card-wrapper">
              <div className="file-tab"></div>
              <div className="card-glow" />
              <div className="card">
                <h3 className="card-title">Hisham Haskar</h3>
                <div className="card-underline" />
                <p className="person-role">Chairperson, ACM</p>
                <p className="person-phone">+91 8078313514</p>
              </div>
            </div>

            <div className="card-wrapper">
              <div className="file-tab"></div>
              <div className="card-glow" />
              <div className="card">
                <h3 className="card-title">Abhijay Prakash</h3>
                <div className="card-underline" />
                <p className="person-role">Chairperson, FHC</p>
                <p className="person-phone">+91 7356252747</p>
              </div>
            </div>

            
          </div>

          {/* Map Section */}
          <div className="map-section">
            <div className="map-container">
              <MapContainer
                center={fisatPosition}
                zoom={25}
                scrollWheelZoom={false}
                className="leaflet-map"
                zoomControl={true}
                attributionControl={false}
              >
                <TileLayer
                  attribution=""
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <Marker
                  position={fisatPosition}
                  icon={createLogoMarkerIcon()}
                  eventHandlers={{
                    click: handleMarkerClick,
                  }}
                >
                  <Popup>
                    <div className="custom-popup">
                      <strong>HackFit 4.0</strong>
                      <br />
                      FISAT, Angamaly
                    </div>
                  </Popup>
                </Marker>
                <RetargetButton position={fisatPosition} zoom={25} />
              </MapContainer>
            </div>

            <div className="location-info">
              <h3 className="location-title">LOCATE US</h3>
              <p className="location-address">
                Federal Institute of Science And Technology (FISAT)
                <br />
                Hormis Nagar, Mookkannoor, Angamaly, Kerala 683577
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
