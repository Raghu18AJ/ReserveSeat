document.addEventListener("DOMContentLoaded", () => {
    const seatLayout = document.getElementById("seatLayout");
    const reserveForm = document.getElementById("reserveForm");
    const messageDiv = document.getElementById("message");
  
    // Fetch and display seats
    async function fetchSeats() {
      const response = await fetch("/seats");
      const seats = await response.json();
  
      seatLayout.innerHTML = "";
  
      seats.forEach((seat) => {
        const seatDiv = document.createElement("div");
        seatDiv.classList.add("seat");
        if (seat.is_booked) seatDiv.classList.add("booked");
  
        seatDiv.textContent = seat.seat_number;
  
        if (seat.row_number === 11) {
          seatDiv.classList.add("last-row");
        }
  
        seatLayout.appendChild(seatDiv);
      });
    }
  
    // Reserve seats
    reserveForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const numSeats = document.getElementById("numSeats").value;
  
      try {
        const response = await fetch("/reserve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ numSeats }),
        });
  
        const result = await response.json();
        messageDiv.textContent = result.message;
  
        if (result.seats) {
          messageDiv.textContent += ` Reserved seats: ${result.seats.join(", ")}`;
          messageDiv.style.color = "green";
        } else {
          messageDiv.style.color = "red";
        }
  
        fetchSeats();
      } catch (error) {
        messageDiv.textContent = "An error occurred. Please try again.";
        messageDiv.style.color = "red";
      }
    });
  
    fetchSeats();
  });
  