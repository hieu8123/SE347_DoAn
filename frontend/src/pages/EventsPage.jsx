import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import Footer from "../components/Layout/Footer";
import { FaSadTear } from "react-icons/fa"; // Import biểu tượng mặt buồn

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  // Kiểm tra xem có sự kiện nào hay không
  const hasEvents = allEvents && allEvents.length > 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          {hasEvents ? (
            allEvents.map((event) => (
              <EventCard key={event.id} active={true} data={event} />
            ))
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "80vh",
              }}>
              <span style={{ fontSize: "24px", marginBottom: "16px" }}>
                Không có sự kiện nào!
              </span>
              <FaSadTear style={{ fontSize: "48px", color: "#Ff3b00" }} />
            </div>
          )}
          <Footer />
        </div>
      )}
    </>
  );
};

export default EventsPage;
