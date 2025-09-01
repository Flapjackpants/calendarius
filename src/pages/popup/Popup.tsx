// src/pages/popup/Popup.tsx
import React, { useState } from 'react';

const Popup = () => {
  const [token, setToken] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState<string>('');

  const handleLogin = () => {
  chrome.runtime.sendMessage({ action: 'login' }, (response) => {
    if (response?.success) {
      setToken(response.token);
      setEventStatus('Login successful');
    } else {
      setEventStatus('Login failed');
    }
  });
};

  const handleScreenshot = async () => {
    chrome.runtime.sendMessage({ action: 'take_screenshot' });
  };

  const handleCreateEvent = () => {
    if (!token) {
      setEventStatus('Please log in first');
      return;
    }

    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: 'AI-created Event from Screenshot',
        start: { dateTime: '2025-06-08T10:00:00-04:00' },
        end: { dateTime: '2025-06-08T11:00:00-04:00' },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Event created:', data);
        setEventStatus('Event created successfully');
      })
      .catch((err) => {
        console.error(err);
        setEventStatus('Error creating event');
      });
  };

  return (
    <div className="p-4 w-[300px]">
      <h1 className="text-lg font-bold mb-2">Calendarius</h1>
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded mb-2 w-full">
        Log in with Google
      </button>
      <button onClick={handleScreenshot} className="bg-green-600 text-white px-4 py-2 rounded mb-2 w-full">
        Take Screenshot
      </button>
      <button onClick={handleCreateEvent} className="bg-purple-600 text-white px-4 py-2 rounded w-full">
        Create Calendar Event
      </button>
      <p className="mt-2 text-sm text-gray-700">{eventStatus}</p>
    </div>
  );
};

export default Popup;
