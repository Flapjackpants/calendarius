chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FETCH_EVENTS") {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=50&singleEvents=true&orderBy=startTime",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          sendResponse({ events: data.items });
        })
        .catch((err) => {
          console.error("Error fetching events:", err);
          sendResponse({ events: [] });
        });
    });
    return true; // async
  }
});

