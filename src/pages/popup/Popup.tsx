import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { EventClickArg } from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-modal";

// Define event type
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
}

// Modal styles
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "300px",
  },
};

const Popup: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // ✅ Set Modal app element after DOM exists
  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  // Fetch Google Calendar events from background
  useEffect(() => {
    chrome.runtime.sendMessage({ type: "FETCH_EVENTS" }, (response) => {
      if (response?.events) {
        const mappedEvents = response.events.map((event: any) => ({
          id: event.id,
          title: event.summary || "(No Title)",
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date,
          location: event.location,
          description: event.description,
        }));
        setEvents(mappedEvents);
      }
    });
  }, []);

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start?.toISOString() || "",
      end: event.end?.toISOString() || "",
      location: event.extendedProps.location,
      description: event.extendedProps.description,
    });
    setModalIsOpen(true);
  };

  return (
    <div style={{ width: "400px", height: "500px" }}>
      <h2>📅 My Google Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        height="auto"
      />

      {/* Event Details Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
        contentLabel="Event Details"
      >
        {selectedEvent && (
          <div>
            <h3>{selectedEvent.title}</h3>
            <p>
              <strong>Start:</strong>{" "}
              {new Date(selectedEvent.start).toLocaleString()}
            </p>
            <p>
              <strong>End:</strong>{" "}
              {new Date(selectedEvent.end).toLocaleString()}
            </p>
            {selectedEvent.location && (
              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>
            )}
            {selectedEvent.description && (
              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>
            )}
            <button onClick={() => setModalIsOpen(false)}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Popup;
