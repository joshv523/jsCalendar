let nav = 0; //tracks current month
let clicked = null; //tracks current day
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');

function openModal(date) {
  clicked = date;

  const eventForDay = events.find(e => e.date == clicked);

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
}

//display calendar
function load() {
  const dt = new Date(); //date object

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  } //gets new month number if user changes from current month

  const day = dt.getDate(); //current day
  const month = dt.getMonth(); //current month
  const year = dt.getFullYear(); //current year
  console.log('current date', day, month, year);

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month+1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });

  // emptyDays gets the number of days from previous month in same calendar
  const emptyDays = weekdays.indexOf(dateString.split(', ')[0]);

  let displayMonth = document.getElementById('displayMonth');
  displayMonth.innerText = `${dt.toLocaleDateString('en-us', {month:'long'})} ${year}`;

  calendar.innerHTML = '';
  
  for(let i = 1; i <= emptyDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day'); //adds a class to the days

    const dayString = `${month + 1}/${i - emptyDays}/${year}`;

    if (i > emptyDays) {
      daySquare.innerText = i - emptyDays;

      const eventForDay = events.find(e => e.date === dayString);

      if(i - emptyDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('empty'); //adds empty class to empty days
    }

    calendar.appendChild(daySquare);
  }

}

function closeModal() {
  eventTitleInput.classList.remove('error');
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
}

function saveEvent() {
  if (eventTitleInput.value) {
    //remove error class from event
    eventTitleInput.classList.remove('error');
    //push event to events array
    events.push({
      date: clicked,
      title: eventTitleInput.value
    });
    //save the event onto local storage
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}

function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

function initButtons() {
  let nextButton = document.getElementById('nextButton');
  nextButton.addEventListener('click', () => {
    nav++;
    load();
  });
  let backButton = document.getElementById('backButton');
  backButton.addEventListener('click', () => {
    nav--;
    load();
  })

  let saveButton = document.getElementById('saveButton');
  saveButton.addEventListener('click', saveEvent);
  let cancelButton = document.getElementById('cancelButton');  
  cancelButton.addEventListener('click', closeModal);

  let deleteButton = document.getElementById('deleteButton');  
  deleteButton.addEventListener('click', deleteEvent);
  let closeButton = document.getElementById('closeButton');  
  closeButton.addEventListener('click', closeModal);

}

initButtons();
load();













