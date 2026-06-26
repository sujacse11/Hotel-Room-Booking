// State Management for Hotel Management System (HMS)
let state = {
  rooms: [],
  bookings: [],
  services: [],
  orders: [],
  activities: []
};

// Room Type Capacities mapping for validation
const ROOM_CAPACITIES = {
  "Standard Single": 1,
  "Double Deluxe": 2,
  "Executive Suite": 4,
  "Presidential Suite": 5
};

// Redirection helper
function switchToPanel(panelName) {
  const menuItem = document.querySelector(`.menu-item[data-panel="${panelName}"]`);
  if (menuItem) {
    menuItem.click();
  }
}

// Safety wrapper for Lucide icons rendering
function createIconsSafe() {
  if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
    try {
      lucide.createIcons();
    } catch (e) {
      console.warn("Failed to create Lucide icons:", e);
    }
  }
}

// Default Mock Data
const DEFAULT_STATE = {
  rooms: [
    // Floor 1
    { id: "101", number: 101, type: "Standard Single", rate: 80, floor: 1, status: "Available", housekeeping: "Clean" },
    { id: "102", number: 102, type: "Standard Single", rate: 80, floor: 1, status: "Occupied", housekeeping: "Clean" },
    { id: "103", number: 103, type: "Double Deluxe", rate: 150, floor: 1, status: "Available", housekeeping: "Dirty" },
    { id: "104", number: 104, type: "Double Deluxe", rate: 150, floor: 1, status: "Reserved", housekeeping: "Clean" },
    { id: "105", number: 105, type: "Standard Single", rate: 80, floor: 1, status: "Maintenance", housekeeping: "Dirty" },
    // Floor 2
    { id: "201", number: 201, type: "Double Deluxe", rate: 150, floor: 2, status: "Available", housekeeping: "Clean" },
    { id: "202", number: 202, type: "Double Deluxe", rate: 150, floor: 2, status: "Occupied", housekeeping: "Clean" },
    { id: "203", number: 203, type: "Executive Suite", rate: 250, floor: 2, status: "Reserved", housekeeping: "Clean" },
    { id: "204", number: 204, type: "Executive Suite", rate: 250, floor: 2, status: "Available", housekeeping: "Cleaning in Progress" },
    { id: "205", number: 205, type: "Double Deluxe", rate: 150, floor: 2, status: "Available", housekeeping: "Clean" },
    // Floor 3
    { id: "301", number: 301, type: "Presidential Suite", rate: 450, floor: 3, status: "Occupied", housekeeping: "Clean" },
    { id: "302", number: 302, type: "Presidential Suite", rate: 450, floor: 3, status: "Available", housekeeping: "Clean" },
    { id: "303", number: 303, type: "Executive Suite", rate: 250, floor: 3, status: "Available", housekeeping: "Dirty" },
    { id: "304", number: 304, type: "Executive Suite", rate: 250, floor: 3, status: "Occupied", housekeeping: "Clean" }
  ],
  bookings: [
    {
      id: "BK-1001",
      roomNumber: 102,
      guestName: "Aarav Sharma",
      guestEmail: "aarav@sharma.in",
      guestPhone: "+91 98765 43210",
      checkIn: "2026-06-24T12:00",
      checkOut: "2026-06-28T11:00",
      guestsCount: 1,
      bookingType: "Walk-In",
      status: "Checked-In",
      roomCharges: 400, // 5 nights * ₹80 (adjusted during checkout dynamically)
      paid: false
    },
    {
      id: "BK-1002",
      roomNumber: 104,
      guestName: "Priyanka Patel",
      guestEmail: "priyanka@patel.co.in",
      guestPhone: "+91 99887 76655",
      checkIn: "2026-06-27T14:00",
      checkOut: "2026-06-30T12:00",
      guestsCount: 2,
      bookingType: "Reservation",
      status: "Reserved",
      roomCharges: 600, // 4 nights * ₹150
      paid: false
    },
    {
      id: "BK-1003",
      roomNumber: 202,
      guestName: "Aditi Rao",
      guestEmail: "aditi@rao.org.in",
      guestPhone: "+91 88776 65544",
      checkIn: "2026-06-23T15:00",
      checkOut: "2026-06-27T10:00",
      guestsCount: 2,
      bookingType: "Walk-In",
      status: "Checked-In",
      roomCharges: 600, // 4 nights * ₹150
      paid: false
    },
    {
      id: "BK-1004",
      roomNumber: 203,
      guestName: "Rohan Mehta",
      guestEmail: "rohan@mehta.net",
      guestPhone: "+91 77665 54433",
      checkIn: "2026-06-28T12:00",
      checkOut: "2026-06-30T12:00",
      guestsCount: 1,
      bookingType: "Reservation",
      status: "Reserved",
      roomCharges: 1000,
      paid: false
    },
    {
      id: "BK-1005",
      roomNumber: 301,
      guestName: "Vikram Singh",
      guestEmail: "vikram@singh.co.in",
      guestPhone: "+91 91234 56789",
      checkIn: "2026-06-22T14:00",
      checkOut: "2026-06-27T12:00",
      guestsCount: 3,
      bookingType: "Walk-In",
      status: "Checked-In",
      roomCharges: 2250, // 5 nights * ₹450
      paid: false
    },
    {
      id: "BK-1006",
      roomNumber: 304,
      guestName: "Kiran Reddy",
      guestEmail: "kiran@reddy.in",
      guestPhone: "+91 98480 22338",
      checkIn: "2026-06-25T12:00",
      checkOut: "2026-06-29T11:00",
      guestsCount: 1,
      bookingType: "Walk-In",
      status: "Checked-In",
      roomCharges: 750,
      paid: false
    },
    {
      id: "BK-1007",
      roomNumber: 201,
      guestName: "Sanjay Singhania",
      guestEmail: "sanjay@singhania.com",
      guestPhone: "+91 91234 98765",
      checkIn: "2026-06-20T10:00",
      checkOut: "2026-06-24T12:00",
      guestsCount: 2,
      bookingType: "Reservation",
      status: "Completed",
      roomCharges: 600,
      servicesTotal: 32,
      taxes: 76,
      deposit: 100,
      grandTotal: 608,
      paidOrders: [
        { id: "ORD-9001", roomNumber: 201, itemName: "Premium Club Sandwich", category: "Food & Dining", quantity: 1, price: 18, status: "Delivered", timestamp: "2026-06-22T08:15:00Z" },
        { id: "ORD-9002", roomNumber: 201, itemName: "Classic Caesar Salad", category: "Food & Dining", quantity: 1, price: 14, status: "Delivered", timestamp: "2026-06-22T10:05:00Z" }
      ],
      paymentMethod: "UPI / QR Code",
      paid: true
    }
  ],
  services: [
    { id: "S-1", name: "Premium Club Sandwich", category: "Food & Dining", price: 18, desc: "Smoked turkey, bacon, cheddar, lettuce, tomato, toasted brioche.", icon: "🍔" },
    { id: "S-2", name: "Classic Caesar Salad", category: "Food & Dining", price: 14, desc: "Romaine lettuce, garlic croutons, parmesan, classic caesar dressing.", icon: "🥗" },
    { id: "S-3", name: "Filet Mignon Steak", category: "Food & Dining", price: 38, desc: "8oz grass-fed beef, roasted asparagus, garlic mashed potatoes, red wine reduction.", icon: "🥩" },
    { id: "S-4", name: "Full English Breakfast", category: "Food & Dining", price: 16, desc: "Eggs, bacon, sausage, baked beans, grilled tomatoes, mushrooms, toast.", icon: "🍳" },
    { id: "S-5", name: "Double Espresso", category: "Beverages", price: 5, desc: "Rich, aromatic double shot of organic arabica beans.", icon: "☕" },
    { id: "S-6", name: "Fresh Squeezed Orange Juice", category: "Beverages", price: 6, desc: "Cold pressed daily, 100% natural, no added sugar.", icon: "🍹" },
    { id: "S-7", name: "Mineral Sparkling Water", category: "Beverages", price: 4, desc: "750ml bottle, chilled with lemon slice.", icon: "🥤" },
    { id: "S-8", name: "Swedish Body Massage", category: "Wellness & Spa", price: 90, desc: "60 mins full body relaxation therapy with essential oils.", icon: "💆" },
    { id: "S-9", name: "Express Dry Cleaning", category: "Laundry Services", price: 25, desc: "Same-day wash, iron, and folded delivery.", icon: "👔" },
    { id: "S-10", name: "Private Airport Shuttle", category: "Transportation", price: 50, desc: "One-way luxury sedan pickup or drop-off service.", icon: "🚗" }
  ],
  orders: [
    { id: "ORD-5001", roomNumber: 102, itemName: "Premium Club Sandwich", category: "Food & Dining", quantity: 1, price: 18, status: "Delivered", timestamp: "2026-06-23T08:15:00Z" },
    { id: "ORD-5002", roomNumber: 102, itemName: "Double Espresso", category: "Beverages", quantity: 2, price: 5, status: "Delivered", timestamp: "2026-06-23T08:20:00Z" },
    { id: "ORD-5003", roomNumber: 301, itemName: "Swedish Body Massage", category: "Wellness & Spa", quantity: 1, price: 90, status: "In Preparation", timestamp: "2026-06-23T09:45:00Z" },
    { id: "ORD-5004", roomNumber: 304, itemName: "Classic Caesar Salad", category: "Food & Dining", quantity: 1, price: 14, status: "Pending", timestamp: "2026-06-23T10:05:00Z" }
  ],
  activities: [
    { id: "ACT-001", text: "Guest Aarav Sharma checked in to Room 102", time: "2026-06-20T14:10:00Z", type: "check-in" },
    { id: "ACT-002", text: "Room 105 set to Maintenance mode due to plumbing audit", time: "2026-06-21T09:00:00Z", type: "maintenance" },
    { id: "ACT-003", text: "Order ORD-5001 for Room 102 delivered", time: "2026-06-23T08:35:00Z", type: "service" },
    { id: "ACT-004", text: "New booking BK-1004 created for Rohan Mehta (Room 203)", time: "2026-06-23T09:12:00Z", type: "booking" }
  ]
};

// LocalStorage Handlers
function initStorage() {
  try {
    let localData = localStorage.getItem('hms_state');
    if (localData && (localData.includes('Marcus Aurelius') || localData.includes('Ada Lovelace') || !localData.includes('BK-1007'))) {
      localStorage.removeItem('hms_state');
      localData = null;
    }
    
    if (!localData) {
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      localStorage.setItem('hms_state', JSON.stringify(state));
    } else {
      state = JSON.parse(localData);
    }
  } catch (e) {
    console.error("Error reading localStorage, resetting state.", e);
    state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    localStorage.setItem('hms_state', JSON.stringify(state));
  }
}

function saveState() {
  localStorage.setItem('hms_state', JSON.stringify(state));
  // Re-render components dynamically based on which panel is active
  updateCurrentPanel();
}

// Toast System
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '<i class="lucide-check-circle"></i>';
  if (type === 'warning') icon = '<i class="lucide-alert-triangle"></i>';
  if (type === 'danger') icon = '<i class="lucide-x-circle"></i>';
  
  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.add('show');
    createIconsSafe();
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Activity Logging Helper
function logActivity(text, type = 'info') {
  const newAct = {
    id: 'ACT-' + Date.now(),
    text: text,
    time: new Date().toISOString(),
    type: type
  };
  state.activities.unshift(newAct);
  // Keep only last 50 activities
  if (state.activities.length > 50) {
    state.activities.pop();
  }
}

// Router & Tab switching
function initNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPanel = item.getAttribute('data-panel');
      
      // Update UI active states
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      const panels = document.querySelectorAll('.panel');
      panels.forEach(p => p.classList.remove('active'));
      
      const target = document.getElementById(`${targetPanel}Panel`);
      if (target) {
        target.classList.add('active');
      }
      
      // Update page header
      const headerTitle = document.querySelector('.header-bar h1');
      headerTitle.textContent = item.textContent.trim();
      
      updateCurrentPanel();
    });
  });
}

function updateCurrentPanel() {
  const activePanel = document.querySelector('.panel.active');
  if (!activePanel) return;
  
  const panelId = activePanel.id;
  if (panelId === 'dashboardPanel') renderDashboard();
  else if (panelId === 'roomsPanel') renderRooms();
  else if (panelId === 'bookingsPanel') renderBookings();
  else if (panelId === 'housekeepingPanel') renderHousekeeping();
  else if (panelId === 'servicesPanel') renderServices();
  else if (panelId === 'billingPanel') renderBilling();
  
  // Re-instantiate icons
  createIconsSafe();
}

// Date calculation helpers
function calculateNights(checkInStr, checkOutStr) {
  const start = new Date(checkInStr);
  const end = new Date(checkOutStr);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return isNaN(diffDays) ? 0 : diffDays;
}

// ==========================================
// 1. DASHBOARD PANEL RENDER
// ==========================================
function renderDashboard() {
  // Calculators
  const totalRooms = state.rooms.length;
  const occupiedCount = state.rooms.filter(r => r.status === 'Occupied').length;
  const reservedCount = state.rooms.filter(r => r.status === 'Reserved').length;
  const dirtyCount = state.rooms.filter(r => r.housekeeping === 'Dirty' || r.housekeeping === 'Cleaning in Progress').length;
  const availableCount = state.rooms.filter(r => r.status === 'Available').length;
  
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedCount / totalRooms) * 100) : 0;
  
  // Count today's check-ins
  const todayStr = new Date().toISOString().split('T')[0];
  const checkinsToday = state.bookings.filter(b => b.checkIn === todayStr && b.status === 'Reserved').length;
  const activeOrders = state.orders.filter(o => o.status !== 'Delivered').length;
  
  // Calculate Revenue (Checked-out paid amount + current occupied roomCharges + active orders prices)
  let totalRevenue = 0;
  // Paid bookings
  state.bookings.forEach(b => {
    if (b.status === 'Completed' || b.paid) {
      totalRevenue += b.roomCharges;
    }
  });
  // Service orders
  state.orders.forEach(o => {
    totalRevenue += (o.price * o.quantity);
  });
  
  // Update dashboard values in DOM
  document.getElementById('dashOccupancyValue').textContent = `${occupancyRate}%`;
  document.getElementById('dashCheckinsValue').textContent = checkinsToday;
  document.getElementById('dashOrdersValue').textContent = activeOrders;
  document.getElementById('dashRevenueValue').textContent = `₹${totalRevenue}`;
  
  // Update circular chart
  const circleOffset = 402 - (402 * occupancyRate / 100);
  const valCircle = document.querySelector('.radial-progress .val-circle');
  if (valCircle) {
    valCircle.style.strokeDashoffset = circleOffset;
  }
  document.querySelector('.radial-progress .percentage-text').textContent = `${occupancyRate}%`;
  
  // Update legend counts
  document.getElementById('legendAvailable').textContent = availableCount;
  document.getElementById('legendOccupied').textContent = occupiedCount;
  document.getElementById('legendReserved').textContent = reservedCount;
  document.getElementById('legendDirty').textContent = dirtyCount;
  
  // Render Activities Feed
  const feed = document.getElementById('recentActivityFeed');
  if (feed) {
    if (state.activities.length === 0) {
      feed.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 20px;">No recent activity</p>';
    } else {
      feed.innerHTML = state.activities.slice(0, 5).map(act => {
        let typeIcon = '🔔';
        if (act.type === 'check-in') typeIcon = '🔑';
        if (act.type === 'check-out') typeIcon = '💳';
        if (act.type === 'booking') typeIcon = '📅';
        if (act.type === 'service') typeIcon = '🍔';
        if (act.type === 'maintenance') typeIcon = '🔧';
        
        const timeFormatted = new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return `
          <div class="activity-item">
            <div class="activity-text">
              <span style="font-size: 1.1rem;">${typeIcon}</span>
              <span>${act.text}</span>
            </div>
            <span class="activity-time">${timeFormatted}</span>
          </div>
        `;
      }).join('');
    }
  }
  
  // Render Floor Summaries on Dashboard (Small indicators)
  const floorSum = document.getElementById('dashboardFloorGrid');
  if (floorSum) {
    // Group rooms by floor
    const floorGroups = {};
    state.rooms.forEach(r => {
      if (!floorGroups[r.floor]) floorGroups[r.floor] = [];
      floorGroups[r.floor].push(r);
    });
    
    floorSum.innerHTML = Object.keys(floorGroups).map(floor => {
      const rooms = floorGroups[floor];
      const avail = rooms.filter(r => r.status === 'Available' && r.housekeeping === 'Clean').length;
      return `
        <div style="background-color: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="font-size: 0.95rem; font-weight: 600;">Floor ${floor}</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">${rooms.length} Rooms Total</p>
          </div>
          <div style="text-align: right;">
            <span class="badge ${avail > 0 ? 'badge-success' : 'badge-danger'}">${avail} Avail / Clean</span>
          </div>
        </div>
      `;
    }).join('');
  }
}

// ==========================================
// 2. ROOMS GRID PANEL RENDER
// ==========================================
function renderRooms() {
  const gridContainer = document.getElementById('roomsFloorList');
  if (!gridContainer) return;
  
  const filterType = document.getElementById('roomFilterType').value;
  const filterStatus = document.getElementById('roomFilterStatus').value;
  const searchQuery = document.getElementById('roomSearchQuery').value.trim();
  
  // Group rooms by floor
  const floors = {};
  state.rooms.forEach(room => {
    if (!floors[room.floor]) floors[room.floor] = [];
    
    // Apply filters
    const matchesType = !filterType || room.type.includes(filterType);
    const matchesStatus = !filterStatus || room.status === filterStatus;
    const matchesSearch = !searchQuery || room.number.toString().includes(searchQuery);
    
    if (matchesType && matchesStatus && matchesSearch) {
      floors[room.floor].push(room);
    }
  });
  
  gridContainer.innerHTML = '';
  
  const sortedFloors = Object.keys(floors).sort();
  if (sortedFloors.length === 0) {
    gridContainer.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No rooms found matching filters</div>';
    return;
  }
  
  sortedFloors.forEach(floor => {
    if (floors[floor].length === 0) return;
    
    const floorSection = document.createElement('div');
    floorSection.className = 'floor-section';
    
    const floorTitle = document.createElement('div');
    floorTitle.className = 'floor-title';
    
    const floorRooms = floors[floor];
    const floorAvail = floorRooms.filter(r => r.status === 'Available').length;
    floorTitle.innerHTML = `
      <span>Floor ${floor}</span>
      <span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">${floorAvail} of ${floorRooms.length} Available</span>
    `;
    floorSection.appendChild(floorTitle);
    
    const roomGrid = document.createElement('div');
    roomGrid.className = 'room-grid';
    
    floorRooms.forEach(room => {
      const card = document.createElement('div');
      card.className = `room-card ${room.status.toLowerCase()}`;
      card.setAttribute('data-id', room.id);
      
      let statusIcon = 'check-circle';
      if (room.status === 'Occupied') statusIcon = 'user';
      if (room.status === 'Reserved') statusIcon = 'calendar';
      if (room.status === 'Dirty') statusIcon = 'trash-2';
      if (room.status === 'Maintenance') statusIcon = 'wrench';
      
      let housekeepingBadge = '';
      if (room.housekeeping === 'Dirty') housekeepingBadge = `<span class="badge badge-danger" style="margin-top: 4px;">Dirty</span>`;
      else if (room.housekeeping === 'Cleaning in Progress') housekeepingBadge = `<span class="badge badge-warning" style="margin-top: 4px;">Cleaning</span>`;
      else housekeepingBadge = `<span class="badge badge-success" style="margin-top: 4px;">Clean</span>`;
      
      // Find guest name if occupied or reserved
      let guestName = '';
      if (room.status === 'Occupied' || room.status === 'Reserved') {
        const booking = state.bookings.find(b => b.roomNumber === room.number && (b.status === 'Checked-In' || b.status === 'Reserved'));
        if (booking) {
          guestName = `<div style="font-size: 0.8rem; color: var(--text-main); font-weight: 500; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin-top: 4px;">${booking.guestName}</div>`;
        }
      }
      
      card.innerHTML = `
        <div class="room-header">
          <span class="room-number">${room.number}</span>
          <span class="room-type-badge">${room.type}</span>
        </div>
        <div class="room-price">₹${room.rate}<span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;"> / night</span></div>
        ${guestName}
        <div class="room-details">
          <span class="room-status-indicator">
            <span class="status-dot"></span>
            ${room.status}
          </span>
          ${housekeepingBadge}
        </div>
      `;
      
      // Click card to manage
      card.addEventListener('click', () => openRoomManagementModal(room));
      roomGrid.appendChild(card);
    });
    
    floorSection.appendChild(roomGrid);
    gridContainer.appendChild(floorSection);
  });
}

// Room management actions (quick details modal)
function openRoomManagementModal(room) {
  const modal = document.getElementById('roomDetailsModal');
  const detailsDiv = document.getElementById('roomDetailsContent');
  
  let actionsHtml = '';
  let bookingInfo = '';
  
  // Find current active booking for room
  const booking = state.bookings.find(b => b.roomNumber === room.number && (b.status === 'Checked-In' || b.status === 'Reserved'));
  
  if (booking) {
    bookingInfo = `
      <div style="background-color: var(--bg-tertiary); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-top: 15px;">
        <h4 style="margin-bottom: 8px; font-size: 0.9rem; text-transform: uppercase; color: var(--text-muted);">Active Booking: ${booking.id}</h4>
        <p><strong>Guest:</strong> ${booking.guestName}</p>
        <p><strong>Contact:</strong> ${booking.guestPhone} (${booking.guestEmail})</p>
        <p><strong>Dates:</strong> ${booking.checkIn} to ${booking.checkOut} (${calculateNights(booking.checkIn, booking.checkOut)} Nights)</p>
        <p><strong>Status:</strong> <span class="badge ${booking.status === 'Checked-In' ? 'badge-success' : 'badge-warning'}">${booking.status}</span></p>
      </div>
    `;
    
    if (booking.status === 'Reserved') {
      actionsHtml += `
        <button class="btn btn-primary" onclick="performCheckIn('${booking.id}')">
          <i data-lucide="key"></i> Check In Guest
        </button>
      `;
    } else if (booking.status === 'Checked-In') {
      actionsHtml += `
        <button class="btn btn-success" onclick="openCheckoutBilling('${booking.id}')" style="background-color: var(--success); border-color: var(--success);">
          <i data-lucide="credit-card"></i> Process Checkout & Billing
        </button>
        <button class="btn" onclick="openPlaceServiceOrderModal(${room.number})">
          <i data-lucide="shopping-cart"></i> Order Service
        </button>
      `;
    }
  } else {
    // Room is vacant
    if (room.status === 'Available' && room.housekeeping === 'Clean') {
      actionsHtml += `
        <button class="btn btn-primary" onclick="openQuickBookingModal(${room.number}, ${room.rate})">
          <i data-lucide="plus-circle"></i> Quick Book Room
        </button>
      `;
    } else if (room.housekeeping === 'Dirty') {
      actionsHtml += `
        <button class="btn btn-primary" onclick="toggleHousekeepingStatus('${room.id}', 'Cleaning in Progress')">
          <i data-lucide="loader"></i> Start Cleaning
        </button>
      `;
    } else if (room.housekeeping === 'Cleaning in Progress') {
      actionsHtml += `
        <button class="btn btn-success" onclick="toggleHousekeepingStatus('${room.id}', 'Clean')" style="background-color: var(--success); border-color: var(--success);">
          <i data-lucide="check"></i> Mark Clean & Ready
        </button>
      `;
    }
  }
  
  // Cleaning status select
  let cleanOptions = ['Clean', 'Dirty', 'Cleaning in Progress'].map(opt => 
    `<option value="${opt}" ${room.housekeeping === opt ? 'selected' : ''}>${opt}</option>`
  ).join('');
  
  // Room main status select (prevent changing occupied/reserved directly to available)
  let statusDisabled = (room.status === 'Occupied' || room.status === 'Reserved') ? 'disabled' : '';
  let statusOptions = ['Available', 'Maintenance'].map(opt => 
    `<option value="${opt}" ${room.status === opt ? 'selected' : ''}>${opt}</option>`
  ).join('');
  
  detailsDiv.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <div>
        <h2 style="font-size: 1.5rem; font-weight: 700;">Room ${room.number}</h2>
        <p style="color: var(--text-muted); font-size: 0.9rem;">${room.type} &bull; Floor ${room.floor}</p>
      </div>
      <div style="font-size: 1.4rem; font-weight: 700; color: var(--success);">₹${room.rate}<span style="font-size: 0.8rem; font-weight: normal; color: var(--text-muted);">/night</span></div>
    </div>
    
    <div class="form-row">
      <div class="form-group">
        <label>Room Status</label>
        <select class="select-input" id="modalRoomStatusUpdate" ${statusDisabled} onchange="updateRoomConfig('${room.id}', 'status')">
          ${room.status === 'Occupied' || room.status === 'Reserved' ? `<option selected>${room.status}</option>` : ''}
          ${statusOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Housekeeping</label>
        <select class="select-input" id="modalRoomHousekeepingUpdate" onchange="updateRoomConfig('${room.id}', 'housekeeping')">
          ${cleanOptions}
        </select>
      </div>
    </div>
    
    ${bookingInfo}
    
    <div style="display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap;">
      ${actionsHtml}
    </div>
  `;
  
  modal.classList.add('active');
  createIconsSafe();
}

function closeRoomManagementModal() {
  document.getElementById('roomDetailsModal').classList.remove('active');
}

function updateRoomConfig(roomId, type) {
  const room = state.rooms.find(r => r.id === roomId);
  if (!room) return;
  
  if (type === 'status') {
    const newVal = document.getElementById('modalRoomStatusUpdate').value;
    room.status = newVal;
    logActivity(`Room ${room.number} status updated to ${newVal}`, 'maintenance');
  } else if (type === 'housekeeping') {
    const newVal = document.getElementById('modalRoomHousekeepingUpdate').value;
    room.housekeeping = newVal;
    
    // If housekeeping is cleaned and status was maintenance or dirty, make it available
    if (newVal === 'Clean' && room.status === 'Dirty') {
      room.status = 'Available';
    }
    logActivity(`Room ${room.number} housekeeping status set to ${newVal}`, 'maintenance');
  }
  
  saveState();
  closeRoomManagementModal();
  showToast(`Room ${room.number} settings saved.`);
}

function toggleHousekeepingStatus(roomId, newHousekeeping) {
  const room = state.rooms.find(r => r.id === roomId);
  if (!room) return;
  
  room.housekeeping = newHousekeeping;
  if (newHousekeeping === 'Clean' && room.status === 'Dirty') {
    room.status = 'Available';
  }
  
  logActivity(`Room ${room.number} housekeeping updated to ${newHousekeeping}`, 'maintenance');
  saveState();
  closeRoomManagementModal();
  showToast(`Room ${room.number} housekeeping updated to ${newHousekeeping}`);
}

function openQuickBookingModal(roomNumber, rate) {
  closeRoomManagementModal();
  
  // Set type to Walk-In by default (since it's a quick book from Rooms grid)
  const walkInRadio = document.getElementById('bookTypeWalkIn');
  if (walkInRadio) walkInRadio.checked = true;
  
  // Open modal first to trigger default initialization
  openModal('bookingModal');
  
  // Select clicked room
  const select = document.getElementById('bookRoomNumber');
  if (select) {
    select.value = roomNumber;
    updateRoomDetailsPreview();
  }
}

// Check in function
function performCheckIn(bookingId) {
  const booking = state.bookings.find(b => b.id === bookingId);
  if (!booking) return;
  
  const room = state.rooms.find(r => r.number === booking.roomNumber);
  if (!room) return;
  
  // 1. Room occupancy check
  if (room.status === 'Occupied') {
    const currentOccupant = state.bookings.find(b => b.roomNumber === room.number && b.status === 'Checked-In');
    const occupantName = currentOccupant ? currentOccupant.guestName : "another guest";
    showToast(`Cannot check in. Room ${booking.roomNumber} is currently occupied by ${occupantName}.`, 'danger');
    return;
  }
  
  // 2. Room maintenance check
  if (room.status === 'Maintenance') {
    showToast(`Cannot check in. Room ${booking.roomNumber} is currently under maintenance.`, 'danger');
    return;
  }
  
  // 3. Housekeeping cleanliness check
  if (room.housekeeping !== 'Clean') {
    showToast(`Cannot check in. Room ${booking.roomNumber} is currently ${room.housekeeping.toLowerCase()}. Please mark it clean first.`, 'danger');
    return;
  }
  
  // 4. Date-Time validations for check-in
  const now = new Date();
  const checkInTime = new Date(booking.checkIn);
  const checkOutTime = new Date(booking.checkOut);
  
  if (now >= checkOutTime) {
    showToast(`Cannot check in. The scheduled check-out date & time (${checkOutTime.toLocaleString()}) has already passed.`, 'danger');
    return;
  }
  
  // Prevent checking in more than 24 hours in advance of reservation start
  const oneDayInMs = 24 * 60 * 60 * 1000;
  if (checkInTime - now > oneDayInMs) {
    showToast(`Cannot check in. It is too early for this reservation (scheduled check-in: ${checkInTime.toLocaleString()}).`, 'danger');
    return;
  }
  
  booking.status = 'Checked-In';
  room.status = 'Occupied';
  
  logActivity(`Guest ${booking.guestName} checked in to Room ${booking.roomNumber}`, 'check-in');
  saveState();
  closeRoomManagementModal();
  showToast(`Checked in ${booking.guestName} to room ${booking.roomNumber}!`);
}

// ==========================================
// 3. RESERVATIONS PANEL RENDER
// ==========================================
function renderBookings() {
  const bookingsBody = document.getElementById('bookingsTableBody');
  if (!bookingsBody) return;
  
  const search = document.getElementById('bookingSearch').value.toLowerCase();
  const filter = document.getElementById('bookingFilterStatus').value;
  const roomTypeFilter = document.getElementById('bookingFilterRoomType').value;
  const bookingTypeFilter = document.getElementById('bookingFilterType').value;
  
  const filtered = state.bookings.filter(b => {
    const matchesSearch = b.guestName.toLowerCase().includes(search) || 
                          b.roomNumber.toString().includes(search) || 
                          b.id.toLowerCase().includes(search);
    const matchesFilter = !filter || b.status === filter;
    
    // Room Type check
    let matchesRoomType = true;
    if (roomTypeFilter) {
      const room = state.rooms.find(r => r.number === b.roomNumber);
      matchesRoomType = room && room.type === roomTypeFilter;
    }
    
    // Booking Category check
    let matchesBookingType = true;
    if (bookingTypeFilter) {
      matchesBookingType = b.bookingType === bookingTypeFilter;
    }
    
    return matchesSearch && matchesFilter && matchesRoomType && matchesBookingType;
  });
  
  bookingsBody.innerHTML = '';
  
  if (filtered.length === 0) {
    bookingsBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No reservations found</td></tr>`;
    return;
  }
  
  filtered.forEach(b => {
    let statusClass = 'badge-warning';
    if (b.status === 'Checked-In') statusClass = 'badge-success';
    if (b.status === 'Completed') statusClass = 'badge-info';
    if (b.status === 'Cancelled') statusClass = 'badge-danger';
    
    let actionsHtml = '';
    if (b.status === 'Reserved') {
      actionsHtml = `
        <button class="btn btn-sm btn-primary" onclick="performCheckIn('${b.id}')">Check In</button>
        <button class="btn btn-sm btn-danger" onclick="cancelBooking('${b.id}')">Cancel</button>
        <button class="btn btn-sm" onclick="sendWhatsAppConfirmation('${b.id}')" style="background-color: #25D366; border-color: #25D366; color: white;" title="Send WhatsApp Confirmation">Confirm WA</button>
      `;
    } else if (b.status === 'Checked-In') {
      actionsHtml = `
        <button class="btn btn-sm" onclick="openCheckoutBilling('${b.id}')" style="background-color: var(--success); border-color: var(--success);">Checkout</button>
        <button class="btn btn-sm" onclick="sendWhatsAppConfirmation('${b.id}')" style="background-color: #25D366; border-color: #25D366; color: white;" title="Send WhatsApp Check-In Notification">Notify WA</button>
      `;
    } else if (b.status === 'Completed') {
      actionsHtml = `
        <button class="btn btn-sm" onclick="sendWhatsAppConfirmation('${b.id}')" style="background-color: #25D366; border-color: #25D366; color: white;" title="Send WhatsApp Receipt">Receipt WA</button>
      `;
    } else {
      actionsHtml = `<span style="font-size: 0.8rem; color: var(--text-muted);">No actions</span>`;
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${b.id}</strong></td>
      <td>
        <div style="font-weight: 600;">${b.guestName}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${b.guestEmail}</div>
      </td>
      <td><span style="font-size: 1rem; font-weight: 700; color: var(--primary);">${b.roomNumber}</span></td>
      <td>${b.checkIn} to ${b.checkOut}</td>
      <td>${calculateNights(b.checkIn, b.checkOut)}</td>
      <td><span class="badge ${statusClass}">${b.status}</span></td>
      <td>
        <div style="display: flex; gap: 8px;">
          ${actionsHtml}
        </div>
      </td>
    `;
    bookingsBody.appendChild(row);
  });
}

function cancelBooking(bookingId) {
  if (!confirm("Are you sure you want to cancel this booking?")) return;
  const booking = state.bookings.find(b => b.id === bookingId);
  if (!booking) return;
  
  booking.status = 'Cancelled';
  const room = state.rooms.find(r => r.number === booking.roomNumber);
  if (room && room.status === 'Reserved') {
    room.status = 'Available';
  }
  
  logActivity(`Booking ${booking.id} for ${booking.guestName} was cancelled`, 'booking');
  saveState();
  showToast(`Booking ${booking.id} cancelled.`);
}

function sendWhatsAppConfirmation(bookingId) {
  const booking = state.bookings.find(b => b.id === bookingId);
  if (!booking) return;
  
  let cleanPhone = booking.guestPhone.replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = '91' + cleanPhone;
  }
  
  // Validate clean phone number length for real WhatsApp sending
  if (cleanPhone.length < 10 || booking.guestPhone.toLowerCase().includes('x')) {
    showToast("Cannot open WhatsApp. Phone number is a sample placeholder (ends in xxxx).", "warning");
    return;
  }
  
  let message = '';
  if (booking.status === 'Completed') {
    message = `Hello *${booking.guestName}*, checkout receipt from *Avalon Boutique Hotel* 🏨:\n\n` +
      `*Booking ID:* ${booking.id}\n` +
      `*Room Number:* ${booking.roomNumber}\n` +
      `*Grand Total Paid:* ₹${booking.grandTotal || booking.roomCharges}\n` +
      `*Payment Method:* ${booking.paymentMethod || 'Cash'}\n` +
      `*Check-Out Time:* ${new Date(booking.checkOut).toLocaleString()}\n\n` +
      `Thank you for staying with us! We hope to see you again soon.`;
  } else if (booking.status === 'Checked-In') {
    message = `Hello *${booking.guestName}*, check-in notification from *Avalon Boutique Hotel* 🏨:\n\n` +
      `*Booking ID:* ${booking.id}\n` +
      `*Room Number:* ${booking.roomNumber}\n` +
      `*Status:* Checked-In & Active\n` +
      `*Check-Out:* ${new Date(booking.checkOut).toLocaleString()}\n\n` +
      `Enjoy your stay! Contact room service or dial 9 for any assistance.`;
  } else {
    message = `Hello *${booking.guestName}*, booking confirmation from *Avalon Boutique Hotel* 🏨:\n\n` +
      `*Booking ID:* ${booking.id}\n` +
      `*Room Number:* ${booking.roomNumber}\n` +
      `*Status:* Confirmed Reservation\n` +
      `*Check-In:* ${new Date(booking.checkIn).toLocaleString()}\n` +
      `*Check-Out:* ${new Date(booking.checkOut).toLocaleString()}\n\n` +
      `We look forward to welcoming you!`;
  }
  
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
  logActivity(`Shared booking details via WhatsApp for ${booking.id}`, 'booking');
}

function checkBookingRoomConflict(roomNumber, checkInStr, checkOutStr, excludeBookingId = null) {
  const newStart = new Date(checkInStr);
  const newEnd = new Date(checkOutStr);
  
  if (isNaN(newStart.getTime()) || isNaN(newEnd.getTime())) {
    return "Invalid check-in or check-out date-time.";
  }
  
  if (newStart >= newEnd) {
    return "Check-Out date & time must be after Check-In date & time.";
  }
  
  // 1. Check if the room is currently occupied by an active Checked-In occupant (handle overstays)
  const activeOccupant = state.bookings.find(b => 
    b.roomNumber === roomNumber && 
    b.status === 'Checked-In' && 
    b.id !== excludeBookingId
  );
  
  if (activeOccupant) {
    const occupantCheckIn = new Date(activeOccupant.checkIn);
    const now = new Date();
    const scheduledCheckOut = new Date(activeOccupant.checkOut);
    const effectiveCheckout = now > scheduledCheckOut ? now : scheduledCheckOut;
    
    if (newStart < effectiveCheckout && newEnd > occupantCheckIn) {
      return `Room ${roomNumber} is currently occupied by guest ${activeOccupant.guestName} (Checked-In).`;
    }
  }
  
  // 2. Check standard reservations overlap
  const conflicting = state.bookings.find(b => {
    if (b.id === excludeBookingId) return false;
    if (b.roomNumber !== roomNumber) return false;
    if (b.status === 'Cancelled' || b.status === 'Completed') return false;
    
    const bStart = new Date(b.checkIn);
    const bEnd = new Date(b.checkOut);
    
    // Check overlap
    return (newStart < bEnd && newEnd > bStart);
  });
  
  if (conflicting) {
    const formattedStart = new Date(conflicting.checkIn).toLocaleString();
    const formattedEnd = new Date(conflicting.checkOut).toLocaleString();
    return `Room ${roomNumber} is already booked from ${formattedStart} to ${formattedEnd}.`;
  }
  return null;
}

// Update Room details callout preview inside booking modal
function updateRoomDetailsPreview() {
  const roomSelect = document.getElementById('bookRoomNumber');
  const detailsNote = document.getElementById('bookRoomDetailsNote');
  const guestsInput = document.getElementById('bookGuestsCount');
  
  if (!roomSelect || !detailsNote) return;
  
  const roomNum = parseInt(roomSelect.value);
  if (isNaN(roomNum)) {
    detailsNote.style.display = 'none';
    return;
  }
  
  const room = state.rooms.find(r => r.number === roomNum);
  if (!room) {
    detailsNote.style.display = 'none';
    return;
  }
  
  const maxCapacity = ROOM_CAPACITIES[room.type] || 2;
  
  // Set guests count max limit dynamically
  guestsInput.max = maxCapacity;
  if (parseInt(guestsInput.value) > maxCapacity) {
    guestsInput.value = maxCapacity;
  }
  
  let cleanBadge = `<span class="badge ${room.housekeeping === 'Clean' ? 'badge-success' : (room.housekeeping === 'Dirty' ? 'badge-danger' : 'badge-warning')}" style="padding: 2px 6px;">${room.housekeeping}</span>`;
  let statusBadge = `<span class="badge ${room.status === 'Available' ? 'badge-success' : 'badge-danger'}" style="padding: 2px 6px;">${room.status}</span>`;
  
  detailsNote.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <div>Room Type: <strong>${room.type}</strong> &bull; Rate: <strong>₹${room.rate}/night</strong></div>
      <div>Max Occupancy: <strong>${maxCapacity} Guest(s)</strong> &bull; Cleanliness: ${cleanBadge} &bull; Room Status: ${statusBadge}</div>
    </div>
  `;
  detailsNote.style.display = 'block';
}

function handleAddBookingSubmit(e) {
  e.preventDefault();
  
  const form = document.getElementById('bookingForm');
  const guestNameInput = document.getElementById('bookGuestName');
  const guestEmailInput = document.getElementById('bookGuestEmail');
  const guestPhoneInput = document.getElementById('bookGuestPhone');
  const roomSelect = document.getElementById('bookRoomNumber');
  const checkInInput = document.getElementById('bookCheckIn');
  const checkOutInput = document.getElementById('bookCheckOut');
  const idTypeSelect = document.getElementById('bookIdType');
  const idNumberInput = document.getElementById('bookIdNumber');
  const guestsInput = document.getElementById('bookGuestsCount');
  const depositInput = document.getElementById('bookDeposit');
  const specialRequestsInput = document.getElementById('bookSpecialRequests');
  
  // Remove all custom error borders first
  form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
  
  // 1. Guest Name Validation
  const guestName = guestNameInput.value.trim();
  if (guestName.length < 2 || !/^[a-zA-Z\s]{2,50}$/.test(guestName)) {
    guestNameInput.classList.add('is-invalid');
    showToast("Guest name must be 2-50 characters (letters and spaces only).", 'danger');
    guestNameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    guestNameInput.focus();
    return;
  }
  
  // 2. Guest Email Validation
  if (!guestEmailInput.checkValidity()) {
    guestEmailInput.classList.add('is-invalid');
    showToast("Please enter a valid email address.", 'danger');
    guestEmailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    guestEmailInput.focus();
    return;
  }
  
  // 3. Guest Phone Validation
  const phoneVal = guestPhoneInput.value.trim();
  if (!/^\+?[0-9\s\-()xX]{7,20}$/.test(phoneVal)) {
    guestPhoneInput.classList.add('is-invalid');
    showToast("Please enter a valid phone number (7-20 digits or placeholder xxxx).", 'danger');
    guestPhoneInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    guestPhoneInput.focus();
    return;
  }
  
  // 4. Room Selection Validation
  const roomNumber = parseInt(roomSelect.value);
  if (isNaN(roomNumber)) {
    roomSelect.classList.add('is-invalid');
    showToast("Please select a room.", 'danger');
    roomSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    roomSelect.focus();
    return;
  }
  
  const room = state.rooms.find(r => r.number === roomNumber);
  if (!room) {
    roomSelect.classList.add('is-invalid');
    showToast("Selected room is invalid.", 'danger');
    roomSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    roomSelect.focus();
    return;
  }
  
  if (room.status === 'Maintenance') {
    roomSelect.classList.add('is-invalid');
    showToast("This room is under maintenance and cannot be booked.", 'danger');
    roomSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    roomSelect.focus();
    return;
  }
  
  // 5. Date-Time Validations (No Past Date/Times)
  const now = new Date();
  
  const bookingType = document.querySelector('input[name="bookType"]:checked').value;
  let checkInVal = checkInInput.value;
  if (bookingType === 'Walk-In') {
    const freshNow = new Date();
    const tzOffset = freshNow.getTimezoneOffset() * 60000;
    checkInVal = (new Date(freshNow.getTime() - tzOffset)).toISOString().slice(0, 16);
    checkInInput.value = checkInVal;
  }
  const checkOutVal = checkOutInput.value;
  
  if (!checkInVal) {
    checkInInput.classList.add('is-invalid');
    showToast("Please select a check-in date & time.", 'danger');
    checkInInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    checkInInput.focus();
    return;
  }
  
  if (!checkOutVal) {
    checkOutInput.classList.add('is-invalid');
    showToast("Please select a check-out date & time.", 'danger');
    checkOutInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    checkOutInput.focus();
    return;
  }
  
  const checkInDate = new Date(checkInVal);
  const checkOutDate = new Date(checkOutVal);
  
  // 5 minutes grace time for walk-in form latency
  const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
  if (checkInDate < fiveMinAgo) {
    checkInInput.classList.add('is-invalid');
    showToast("Check-In date & time cannot be in the past.", 'danger');
    checkInInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    checkInInput.focus();
    return;
  }
  
  if (checkOutDate <= checkInDate) {
    checkOutInput.classList.add('is-invalid');
    showToast("Check-Out date & time must be after Check-In date & time.", 'danger');
    checkOutInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    checkOutInput.focus();
    return;
  }
  
  // 6. ID Verification Validation
  const idType = idTypeSelect.value;
  if (!idType) {
    idTypeSelect.classList.add('is-invalid');
    showToast("Please select a Government ID Type.", 'danger');
    idTypeSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    idTypeSelect.focus();
    return;
  }
  
  const idNumber = idNumberInput.value.trim();
  if (idNumber.length < 4 || !/^[a-zA-Z0-9\s\-]+$/.test(idNumber)) {
    idNumberInput.classList.add('is-invalid');
    showToast("Please enter a valid ID Number (alphanumeric, spaces and hyphens only, min 4 characters).", 'danger');
    idNumberInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    idNumberInput.focus();
    return;
  }
  
  // 7. Guests Count Validation
  const guestsCount = parseInt(guestsInput.value);
  const maxCapacity = ROOM_CAPACITIES[room.type] || 2;
  if (isNaN(guestsCount) || guestsCount < 1 || guestsCount > maxCapacity) {
    guestsInput.classList.add('is-invalid');
    showToast(`Guests count is invalid. Room ${room.number} capacity is 1 to ${maxCapacity} guests.`, 'danger');
    guestsInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    guestsInput.focus();
    return;
  }
  
  // 8. Deposit Validation
  const deposit = parseFloat(depositInput.value) || 0;
  if (deposit < 0) {
    depositInput.classList.add('is-invalid');
    showToast("Advance deposit cannot be negative.", 'danger');
    depositInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    depositInput.focus();
    return;
  }
  
  const nights = calculateNights(checkInVal, checkOutVal) || 1;
  const roomCharges = nights * room.rate;
  if (deposit > roomCharges) {
    depositInput.classList.add('is-invalid');
    showToast(`Advance deposit (₹${deposit}) cannot exceed total lodging charges of ₹${roomCharges}.`, 'danger');
    depositInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    depositInput.focus();
    return;
  }
  
  // 9. Conflict Check (Fallback)
  const conflictMsg = checkBookingRoomConflict(room.number, checkInVal, checkOutVal);
  if (conflictMsg) {
    roomSelect.classList.add('is-invalid');
    showToast(conflictMsg, 'danger');
    roomSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    roomSelect.focus();
    return;
  }
  
  // Calculate pricing
  const bookingStatus = bookingType === 'Walk-In' ? 'Checked-In' : 'Reserved';
  
  const newBooking = {
    id: "BK-" + (1000 + state.bookings.length + 1),
    roomNumber: room.number,
    guestName: guestName,
    guestEmail: guestEmailInput.value.trim(),
    guestPhone: phoneVal,
    checkIn: checkInVal,
    checkOut: checkOutVal,
    guestsCount: guestsCount,
    idType: idType,
    idNumber: idNumber,
    deposit: deposit,
    specialRequests: specialRequestsInput.value.trim(),
    status: bookingStatus,
    roomCharges: roomCharges,
    paid: false
  };
  
  state.bookings.unshift(newBooking);
  
  // Update Room Status
  if (bookingStatus === 'Checked-In') {
    room.status = 'Occupied';
  } else {
    // If it starts today
    const checkInDateStr = checkInVal.split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];
    if (checkInDateStr <= todayStr) {
      room.status = 'Reserved';
    }
  }
  
  logActivity(`New ${bookingType} booking ${newBooking.id} created for ${guestName} (Room ${room.number})`, 'booking');
  saveState();
  
  // WhatsApp booking confirmation option
  const sendWhatsAppCheckbox = document.getElementById('bookSendWhatsApp');
  if (sendWhatsAppCheckbox && sendWhatsAppCheckbox.checked) {
    setTimeout(() => {
      sendWhatsAppConfirmation(newBooking.id);
    }, 100);
  }
  
  closeModal('bookingModal');
  form.reset();
  
  // Reset preview callout
  detailsNote.style.display = 'none';
  
  showToast(`Booking ${newBooking.id} created successfully!`);
  
  // Move to booked window (Reservations panel)
  switchToPanel('bookings');
}

// Populate available rooms in booking form selector
function populateRoomOptions() {
  const select = document.getElementById('bookRoomNumber');
  if (!select) return;
  
  const checkInInput = document.getElementById('bookCheckIn');
  const checkOutInput = document.getElementById('bookCheckOut');
  
  const checkInVal = checkInInput.value;
  const checkOutVal = checkOutInput.value;
  
  let availableRooms = state.rooms.filter(r => r.status !== 'Maintenance');
  
  // If dates are validly filled, filter conflicted rooms
  if (checkInVal && checkOutVal && new Date(checkInVal) < new Date(checkOutVal)) {
    availableRooms = availableRooms.filter(r => {
      // Return true if there is NO conflict
      return checkBookingRoomConflict(r.number, checkInVal, checkOutVal) === null;
    });
  }
  
  availableRooms.sort((a, b) => a.number - b.number);
  
  if (availableRooms.length === 0) {
    select.innerHTML = '<option value="">No rooms available for selected dates</option>';
  } else {
    select.innerHTML = availableRooms
      .map(r => `<option value="${r.number}">Room ${r.number} (${r.type} - ₹${r.rate}/night)</option>`)
      .join('');
  }
  
  // Update details display
  updateRoomDetailsPreview();
}

// ==========================================
// 4. HOUSEKEEPING PANEL RENDER
// ==========================================
function renderHousekeeping() {
  const tbody = document.getElementById('housekeepingTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  state.rooms.forEach(r => {
    let cleanClass = 'badge-success';
    if (r.housekeeping === 'Dirty') cleanClass = 'badge-danger';
    if (r.housekeeping === 'Cleaning in Progress') cleanClass = 'badge-warning';
    
    let actionBtn = '';
    if (r.housekeeping === 'Dirty') {
      actionBtn = `<button class="btn btn-sm btn-primary" onclick="toggleHousekeepingStatus('${r.id}', 'Cleaning in Progress')">Assign Clean</button>`;
    } else if (r.housekeeping === 'Cleaning in Progress') {
      actionBtn = `<button class="btn btn-sm" onclick="toggleHousekeepingStatus('${r.id}', 'Clean')" style="background-color: var(--success); border-color: var(--success);">Mark Complete</button>`;
    } else {
      actionBtn = `<button class="btn btn-sm btn-danger" onclick="toggleHousekeepingStatus('${r.id}', 'Dirty')">Mark Dirty</button>`;
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>Room ${r.number}</strong></td>
      <td>${r.type}</td>
      <td>Floor ${r.floor}</td>
      <td><span class="badge ${r.status === 'Available' ? 'badge-success' : 'badge-danger'}">${r.status}</span></td>
      <td><span class="badge ${cleanClass}">${r.housekeeping}</span></td>
      <td>
        ${actionBtn}
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ==========================================
// 5. SERVICES & ORDER RENDER
// ==========================================
function renderServices() {
  // Service menu Catalog
  const catalogGrid = document.getElementById('servicesMenuCatalog');
  if (catalogGrid) {
    catalogGrid.innerHTML = state.services.map(s => `
      <div class="service-item-card">
        <div class="service-item-icon">${s.icon}</div>
        <div class="service-item-details">
          <h4>${s.name}</h4>
          <p>${s.desc}</p>
          <div class="service-price-buy">
            <span class="service-price">₹${s.price}</span>
            <button class="btn btn-sm btn-primary" onclick="openOrderDialogue('${s.id}')">Order</button>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  // Active Orders Table
  const ordersTbody = document.getElementById('activeOrdersTableBody');
  if (ordersTbody) {
    ordersTbody.innerHTML = '';
    
    const activeOrders = state.orders.filter(o => o.status !== 'Delivered');
    if (activeOrders.length === 0) {
      ordersTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 16px;">No active service orders</td></tr>`;
      return;
    }
    
    activeOrders.forEach(o => {
      let statusClass = 'badge-warning';
      let actionBtn = '';
      
      if (o.status === 'Pending') {
        actionBtn = `<button class="btn btn-sm btn-primary" onclick="updateOrderStatus('${o.id}', 'In Preparation')">Prepare</button>`;
      } else if (o.status === 'In Preparation') {
        actionBtn = `<button class="btn btn-sm btn-success" onclick="updateOrderStatus('${o.id}', 'Delivered')" style="background-color: var(--success); border-color: var(--success);">Deliver</button>`;
        statusClass = 'badge-info';
      }
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><strong>${o.id}</strong></td>
        <td><span style="font-weight: 700; color: var(--primary);">Room ${o.roomNumber}</span></td>
        <td>${o.itemName} (${o.quantity}x)</td>
        <td>₹${o.price * o.quantity}</td>
        <td><span class="badge ${statusClass}">${o.status}</span></td>
        <td>
          <div style="display: flex; gap: 8px;">
            ${actionBtn}
            <button class="btn btn-sm btn-danger" onclick="cancelOrder('${o.id}')">Cancel</button>
          </div>
        </td>
      `;
      ordersTbody.appendChild(row);
    });
  }
}

function openOrderDialogue(serviceId) {
  const service = state.services.find(s => s.id === serviceId);
  if (!service) return;
  
  // Check if there are active occupied rooms to assign order to
  const occupiedRooms = state.rooms.filter(r => r.status === 'Occupied');
  if (occupiedRooms.length === 0) {
    showToast("There are no occupied rooms. Guests must check-in first before ordering.", 'danger');
    return;
  }
  
  document.getElementById('srvOrderServiceId').value = service.id;
  document.getElementById('srvOrderServiceName').textContent = service.name;
  document.getElementById('srvOrderQty').value = 1;
  
  // Populate rooms list dropdown
  const roomSelect = document.getElementById('srvOrderRoomSelect');
  roomSelect.innerHTML = occupiedRooms.map(r => {
    const booking = state.bookings.find(b => b.roomNumber === r.number && b.status === 'Checked-In');
    const guestName = booking ? ` (${booking.guestName})` : '';
    return `<option value="${r.number}">Room ${r.number}${guestName}</option>`;
  }).join('');
  
  openModal('serviceOrderModal');
}

function openPlaceServiceOrderModal(roomNumber) {
  // Pre-fill room select when ordering from Room Detail view
  const service = state.services[0]; // pick first default
  openOrderDialogue(service.id);
  document.getElementById('srvOrderRoomSelect').value = roomNumber;
}

function handleAddOrderSubmit(e) {
  e.preventDefault();
  
  const serviceId = document.getElementById('srvOrderServiceId').value;
  const roomSelect = document.getElementById('srvOrderRoomSelect');
  const qtyInput = document.getElementById('srvOrderQty');
  
  roomSelect.classList.remove('is-invalid');
  qtyInput.classList.remove('is-invalid');
  
  const roomNumber = parseInt(roomSelect.value);
  if (isNaN(roomNumber) || !roomNumber) {
    roomSelect.classList.add('is-invalid');
    showToast("Please select an occupied room.", 'danger');
    roomSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    roomSelect.focus();
    return;
  }
  
  const qty = parseInt(qtyInput.value);
  if (isNaN(qty) || qty < 1 || qty > 10) {
    qtyInput.classList.add('is-invalid');
    showToast("Please select a valid quantity (1 to 10).", 'danger');
    qtyInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    qtyInput.focus();
    return;
  }
  
  const service = state.services.find(s => s.id === serviceId);
  if (!service) return;
  
  const newOrder = {
    id: "ORD-" + (5000 + state.orders.length + 1),
    roomNumber: roomNumber,
    itemName: service.name,
    category: service.category,
    quantity: qty,
    price: service.price,
    status: "Pending",
    timestamp: new Date().toISOString()
  };
  
  state.orders.push(newOrder);
  logActivity(`Order ${newOrder.id} placed for Room ${roomNumber}: ${qty}x ${service.name}`, 'service');
  saveState();
  closeModal('serviceOrderModal');
  showToast(`Order placed for Room ${roomNumber}!`);
}

function updateOrderStatus(orderId, newStatus) {
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  
  order.status = newStatus;
  logActivity(`Order ${order.id} status updated to ${newStatus}`, 'service');
  saveState();
  showToast(`Order ${order.id} is now ${newStatus}.`);
}

function cancelOrder(orderId) {
  if (!confirm("Cancel this service order?")) return;
  state.orders = state.orders.filter(o => o.id !== orderId);
  logActivity(`Order ${orderId} was cancelled`, 'service');
  saveState();
  showToast(`Order ${orderId} has been deleted.`);
}

// ==========================================
// 6. BILLING & INVOICING PANEL RENDER
// ==========================================
function renderBilling() {
  const tableBody = document.getElementById('billingTableBody');
  if (!tableBody) return;
  
  tableBody.innerHTML = '';
  
  const searchInput = document.getElementById('billingSearch');
  const search = searchInput ? searchInput.value.toLowerCase() : '';
  const roomTypeFilter = document.getElementById('billingFilterRoomType') ? document.getElementById('billingFilterRoomType').value : '';
  const bookingTypeFilter = document.getElementById('billingFilterType') ? document.getElementById('billingFilterType').value : '';
  const statusFilter = document.getElementById('billingFilterStatus') ? document.getElementById('billingFilterStatus').value : 'Unpaid';
  
  // 1. Filter bookings based on user search, room category, booking type, and payment status
  const activeBookings = state.bookings.filter(b => {
    // Payment Status filter
    if (statusFilter === 'Unpaid' && b.status !== 'Checked-In') return false;
    if (statusFilter === 'Paid' && b.status !== 'Completed') return false;
    if (statusFilter === 'All' && b.status !== 'Checked-In' && b.status !== 'Completed') return false;
    
    const matchesSearch = b.guestName.toLowerCase().includes(search) || 
                          b.roomNumber.toString().includes(search) || 
                          b.id.toLowerCase().includes(search);
                          
    // Room Type category filter
    let matchesRoomType = true;
    const room = state.rooms.find(r => r.number.toString() === b.roomNumber.toString());
    if (roomTypeFilter) {
      matchesRoomType = room && room.type === roomTypeFilter;
    }
    
    // Booking Category filter (Walk-In vs Reservation)
    let matchesBookingType = true;
    if (bookingTypeFilter) {
      matchesBookingType = b.bookingType === bookingTypeFilter;
    }
    
    return matchesSearch && matchesRoomType && matchesBookingType;
  });
  
  // 2. Render clear message if no active billings match the search
  if (activeBookings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No billing records match the selected filters.</td></tr>`;
    return;
  }
  
  // 3. Render table rows with clear calculations
  activeBookings.forEach(b => {
    let nights, roomCharges, servicesTotal, grossTotal;
    
    if (b.status === 'Completed') {
      nights = calculateNights(b.checkIn, b.checkOut) || 1;
      roomCharges = b.roomCharges || 0;
      servicesTotal = b.servicesTotal || 0;
      grossTotal = b.grandTotal || (roomCharges + servicesTotal);
    } else {
      const now = new Date();
      const scheduledCheckOut = new Date(b.checkOut);
      const finalCheckOut = now > scheduledCheckOut ? now : scheduledCheckOut;
      nights = calculateNights(b.checkIn, finalCheckOut) || 1;
      const room = state.rooms.find(r => r.number.toString() === b.roomNumber.toString());
      const roomRate = room ? room.rate : 0;
      roomCharges = nights * roomRate;
      const roomOrders = state.orders.filter(o => o.roomNumber.toString() === b.roomNumber.toString());
      servicesTotal = roomOrders.reduce((sum, o) => sum + (o.price * o.quantity), 0);
      grossTotal = roomCharges + servicesTotal;
    }
    
    let statusBadge = '';
    let actionBtn = '';
    
    if (b.status === 'Completed') {
      statusBadge = `<span class="badge badge-success" style="margin-left: 8px;">Paid</span>`;
      actionBtn = `<button class="btn btn-sm btn-success" onclick="openCheckoutBilling('${b.id}')" style="background-color: var(--success); border-color: var(--success);"><i class="lucide-receipt" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> View Receipt</button>`;
    } else {
      statusBadge = `<span class="badge badge-warning" style="margin-left: 8px;">Unpaid</span>`;
      actionBtn = `<button class="btn btn-sm btn-primary" onclick="openCheckoutBilling('${b.id}')">Generate Bill & Checkout</button>`;
    }
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>Room ${b.roomNumber}</strong></td>
      <td>
        <div style="font-weight: 600;">${b.guestName}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">In: ${new Date(b.checkIn).toLocaleString()} | Out: ${new Date(b.checkOut).toLocaleString()}</div>
      </td>
      <td>₹${roomCharges} <span style="font-size: 0.75rem; color: var(--text-muted);">(${nights} night${nights > 1 ? 's' : ''})</span></td>
      <td>₹${servicesTotal}</td>
      <td><strong>₹${grossTotal}</strong>${statusBadge}</td>
      <td>
        ${actionBtn}
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function openCheckoutBilling(bookingId) {
  closeRoomManagementModal();
  
  const booking = state.bookings.find(b => b.id === bookingId);
  if (!booking) return;
  
  const room = state.rooms.find(r => r.number === booking.roomNumber);
  const roomRate = room ? room.rate : 0;
  
  let nights, roomCharges, servicesTotal, taxes, depositPaid, grandTotal, finalCheckOut;
  let roomOrders = [];
  const paymentMethodSelect = document.getElementById('invPaymentMethod');
  const submitButton = document.querySelector('#paymentForm button[type="submit"]');
  
  if (booking.status === 'Completed') {
    // 1. Paid receipt view-only mode
    nights = calculateNights(booking.checkIn, booking.checkOut) || 1;
    roomCharges = booking.roomCharges;
    servicesTotal = booking.servicesTotal || 0;
    taxes = booking.taxes || 0;
    depositPaid = booking.deposit || 0;
    grandTotal = booking.grandTotal || 0;
    roomOrders = booking.paidOrders || [];
    finalCheckOut = new Date(booking.checkOut);
    
    // Disable payment input
    if (paymentMethodSelect) {
      paymentMethodSelect.value = booking.paymentMethod || 'Cash';
      paymentMethodSelect.disabled = true;
    }
    
    // Customize submit button to Close Receipt
    if (submitButton) {
      submitButton.textContent = 'Close Receipt';
      submitButton.style.backgroundColor = 'var(--info)';
      submitButton.style.borderColor = 'var(--info)';
    }
  } else {
    // 2. Unpaid active guest billing
    const now = new Date();
    const scheduledCheckOut = new Date(booking.checkOut);
    
    // Charge up to now if checkout is delayed, otherwise charge up to the scheduled date
    finalCheckOut = now > scheduledCheckOut ? now : scheduledCheckOut;
    nights = calculateNights(booking.checkIn, finalCheckOut) || 1;
    roomCharges = nights * roomRate;
    
    // Sum up room service orders
    roomOrders = state.orders.filter(o => o.roomNumber === booking.roomNumber);
    servicesTotal = roomOrders.reduce((sum, o) => sum + (o.price * o.quantity), 0);
    
    // Apply subtotal, taxes, deposits, and grand total
    const subtotal = roomCharges + servicesTotal;
    taxes = Math.round(subtotal * 0.12); // 12% luxury tax
    depositPaid = booking.deposit || 0;
    grandTotal = Math.max(0, subtotal + taxes - depositPaid);
    
    // Enable payment input
    if (paymentMethodSelect) {
      paymentMethodSelect.value = 'Credit Card';
      paymentMethodSelect.disabled = false;
      paymentMethodSelect.classList.remove('is-invalid');
    }
    
    // Customize submit button to Pay & Complete
    if (submitButton) {
      submitButton.textContent = 'Pay & Complete Checkout';
      submitButton.style.backgroundColor = 'var(--success)';
      submitButton.style.borderColor = 'var(--success)';
    }
  }
  
  // Update form inputs for submission
  document.getElementById('invBookingId').value = booking.id;
  document.getElementById('invGrandTotal').value = grandTotal;
  
  // 4. Inject invoice visual details
  const container = document.getElementById('invoiceContent');
  
  let ordersListHtml = '';
  if (roomOrders.length > 0) {
    ordersListHtml = `
      <tr>
        <th colspan="3" style="padding-top: 15px; font-weight: bold; border-bottom: 2px solid var(--border-color);">Room Service & Extras</th>
      </tr>
      ${roomOrders.map(o => `
        <tr>
          <td>${o.itemName} (x${o.quantity})</td>
          <td class="align-right">₹${o.price}</td>
          <td class="align-right">₹${o.price * o.quantity}</td>
        </tr>
      `).join('')}
    `;
  }
  
  const displayCheckOut = finalCheckOut instanceof Date ? finalCheckOut : new Date(finalCheckOut);
  
  container.innerHTML = `
    <div class="invoice-header">
      <div class="invoice-hotel-info">
        <h2>AVALON BOUTIQUE HOTEL</h2>
        <p>100 Paradise Boulevard, Suite 500</p>
        <p>contact@avalonhotel.com | +1 (555) 777-8888</p>
      </div>
      <div class="invoice-meta">
        <h3 style="color: var(--primary); font-weight: 700;">INVOICE</h3>
        <p>No: INV-${Date.now().toString().slice(-6)}</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>
    </div>
    
    <div class="invoice-billing-to" style="margin-top: 15px;">
      <p style="color: var(--text-muted);">Billing To:</p>
      <strong>${booking.guestName}</strong>
      <p>Phone: ${booking.guestPhone} | Email: ${booking.guestEmail}</p>
      <p>Govt ID: <strong>${booking.idType || 'N/A'} - ${booking.idNumber || 'N/A'}</strong></p>
      <p>Stay Dates: ${new Date(booking.checkIn).toLocaleString()} to ${displayCheckOut.toLocaleString()} (${nights} Night${nights > 1 ? 's' : ''}, Room ${booking.roomNumber} - ${room ? room.type : ''})</p>
    </div>
    
    <table class="invoice-items-table">
      <thead>
        <tr>
          <th>Description</th>
          <th class="align-right">Unit Price</th>
          <th class="align-right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Room Lodging Charge (${nights} Night${nights > 1 ? 's' : ''})</td>
          <td class="align-right">₹${roomRate}</td>
          <td class="align-right">₹${roomCharges}</td>
        </tr>
        ${ordersListHtml}
      </tbody>
    </table>
    
    <div class="invoice-summary">
      <div class="invoice-summary-row">
        <span>Room Charge:</span>
        <span>₹${roomCharges}</span>
      </div>
      <div class="invoice-summary-row">
        <span>Service Orders:</span>
        <span>₹${servicesTotal}</span>
      </div>
      <div class="invoice-summary-row">
        <span>Tax (12%):</span>
        <span>₹${taxes}</span>
      </div>
      <div class="invoice-summary-row">
        <span>Advance Deposit:</span>
        <span style="color: var(--danger); font-weight: 500;">-₹${depositPaid}</span>
      </div>
      <div class="invoice-summary-row total">
        <span>Grand Total:</span>
        <span>₹${grandTotal}</span>
      </div>
    </div>
  `;
  
  openModal('invoiceModal');
}

function handleCheckoutPayment(e) {
  e.preventDefault();
  
  const bookingId = document.getElementById('invBookingId').value;
  const paymentMethodSelect = document.getElementById('invPaymentMethod');
  const paymentMethod = paymentMethodSelect.value;
  
  if (!bookingId) {
    showToast("Invalid booking session.", 'danger');
    return;
  }
  
  const booking = state.bookings.find(b => b.id === bookingId);
  if (!booking) return;
  
  // If already paid, this button functions as a Close Receipt button
  if (booking.status === 'Completed') {
    closeModal('invoiceModal');
    return;
  }
  
  paymentMethodSelect.classList.remove('is-invalid');
  if (!paymentMethod) {
    paymentMethodSelect.classList.add('is-invalid');
    showToast("Please select a payment method.", 'danger');
    paymentMethodSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    paymentMethodSelect.focus();
    return;
  }
  
  // Perform checkout calculations to snapshot invoice details
  const room = state.rooms.find(r => r.number === booking.roomNumber);
  const roomRate = room ? room.rate : 0;
  
  const now = new Date();
  const scheduledCheckOut = new Date(booking.checkOut);
  const finalCheckOut = now > scheduledCheckOut ? now : scheduledCheckOut;
  
  const checkInDate = new Date(booking.checkIn);
  if (finalCheckOut < checkInDate) {
    showToast("Checkout date & time cannot be before the check-in date & time.", 'danger');
    return;
  }
  
  const nights = calculateNights(booking.checkIn, finalCheckOut) || 1;
  const roomCharges = nights * roomRate;
  
  const roomOrders = state.orders.filter(o => o.roomNumber === booking.roomNumber);
  const servicesTotal = roomOrders.reduce((sum, o) => sum + (o.price * o.quantity), 0);
  const subtotal = roomCharges + servicesTotal;
  const taxes = Math.round(subtotal * 0.12);
  const depositPaid = booking.deposit || 0;
  const grandTotal = Math.max(0, subtotal + taxes - depositPaid);
  
  // Format checkOut time to local ISO format YYYY-MM-DDTHH:MM
  const tzOffset = finalCheckOut.getTimezoneOffset() * 60000;
  const localCheckOutStr = (new Date(finalCheckOut.getTime() - tzOffset)).toISOString().slice(0, 16);
  
  // Archive invoice details snapshot directly on the booking
  booking.status = 'Completed';
  booking.paid = true;
  booking.checkOut = localCheckOutStr;
  booking.roomCharges = roomCharges;
  booking.servicesTotal = servicesTotal;
  booking.taxes = taxes;
  booking.grandTotal = grandTotal;
  booking.paidOrders = roomOrders;
  booking.paymentMethod = paymentMethod;
  
  // Set room to Available but DIRTY (requires cleaning after checkout)
  if (room) {
    room.status = 'Available';
    room.housekeeping = 'Dirty';
  }
  
  // Remove room service orders for this room now that they are paid and checkout is done
  state.orders = state.orders.filter(o => o.roomNumber !== booking.roomNumber);
  
  logActivity(`Guest ${booking.guestName} checked out of Room ${booking.roomNumber}. Paid ₹${grandTotal} via ${paymentMethod}`, 'check-out');
  saveState();
  closeModal('invoiceModal');
  showToast(`Checkout complete for Room ${booking.roomNumber}! Room is marked dirty for housekeeping.`);
}

// Modal Toggle Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    const modalBody = modal.querySelector('.modal-body');
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
  }
  if (modalId === 'bookingModal') {
    initializeBookingModalDefaults();
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
  
  // Clear validation styling if booking form is closed
  if (modalId === 'bookingModal') {
    const form = document.getElementById('bookingForm');
    if (form) {
      form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    }
  }
}

function initializeBookingModalDefaults() {
  const now = new Date();
  // Format to YYYY-MM-DDTHH:MM (local timezone)
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(now.getTime() - tzOffset)).toISOString().slice(0, 16);
  
  const checkInInput = document.getElementById('bookCheckIn');
  const checkOutInput = document.getElementById('bookCheckOut');
  const walkInRadio = document.getElementById('bookTypeWalkIn');
  const submitBtn = document.getElementById('bookingSubmitBtn');
  
  if (!checkInInput || !checkOutInput) return;
  
  // Set min check-in to now
  checkInInput.min = localISOTime;
  
  // Default check-out to tomorrow at same time
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const localISOTimeTomorrow = (new Date(tomorrow.getTime() - tzOffset)).toISOString().slice(0, 16);
  
  // Determine checked type and handle inputs
  if (walkInRadio && walkInRadio.checked) {
    checkInInput.value = localISOTime;
    checkInInput.readOnly = true;
    checkInInput.style.opacity = '0.6';
    checkInInput.style.pointerEvents = 'none'; // Lock checking in Walk-in
    checkOutInput.min = localISOTime;
    if (submitBtn) submitBtn.textContent = 'Create Check-In';
  } else {
    checkInInput.readOnly = false;
    checkInInput.style.opacity = '1';
    checkInInput.style.pointerEvents = 'auto';
    checkInInput.min = localISOTime;
    if (submitBtn) submitBtn.textContent = 'Create Reservation';
  }
  
  // Only override values if they are blank or if Walk-In forces check-in to now
  if (!checkInInput.value || (walkInRadio && walkInRadio.checked)) {
    checkInInput.value = localISOTime;
  }
  if (!checkOutInput.value) {
    checkOutInput.value = localISOTimeTomorrow;
  }
  
  checkOutInput.min = checkInInput.value;
  
  populateRoomOptions();
}

// Time Widget Clock
function updateClock() {
  const clock = document.getElementById('clockDisplay');
  if (!clock) return;
  
  const now = new Date();
  clock.innerHTML = `<i class="lucide-clock" style="width: 14px; height: 14px;"></i> ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  createIconsSafe();
}

// Initialize Application
window.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initNavigation();
  
  // Set up forms submit handlers
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleAddBookingSubmit);
  }
  
  const serviceOrderForm = document.getElementById('serviceOrderForm');
  if (serviceOrderForm) {
    serviceOrderForm.addEventListener('submit', handleAddOrderSubmit);
  }
  
  const paymentForm = document.getElementById('paymentForm');
  if (paymentForm) {
    paymentForm.addEventListener('submit', handleCheckoutPayment);
  }
  
  // Booking Modal type selector toggle listeners
  const typeRadios = document.querySelectorAll('input[name="bookType"]');
  typeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      initializeBookingModalDefaults();
    });
  });
  
  // Booking Modal Date-Time inputs change listeners
  const checkInInput = document.getElementById('bookCheckIn');
  const checkOutInput = document.getElementById('bookCheckOut');
  if (checkInInput) {
    checkInInput.addEventListener('change', () => {
      if (checkInInput.value) {
        checkOutInput.min = checkInInput.value;
        const checkInDate = new Date(checkInInput.value);
        const checkOutDate = new Date(checkOutInput.value);
        
        // Auto-advance checkout if it is before checkin
        if (isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
          const tzOffset = checkInDate.getTimezoneOffset() * 60000;
          const tomorrow = new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000);
          checkOutInput.value = (new Date(tomorrow.getTime() - tzOffset)).toISOString().slice(0, 16);
        }
      }
      populateRoomOptions();
    });
  }
  if (checkOutInput) {
    checkOutInput.addEventListener('change', () => {
      populateRoomOptions();
    });
  }
  
  // Booking Modal Room Selector change listener
  const roomSelect = document.getElementById('bookRoomNumber');
  if (roomSelect) {
    roomSelect.addEventListener('change', updateRoomDetailsPreview);
  }
  
  // Initialize select dropdown in booking wizard
  populateRoomOptions();
  
  // Initialize Dashboard Panel active
  document.getElementById('dashboardPanel').classList.add('active');
  updateCurrentPanel();
  
  // Clock Loop
  updateClock();
  setInterval(updateClock, 60000);
});
