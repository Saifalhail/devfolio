const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
}

// API routes
// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
  }
  
  // In a real app, you'd want to:
  // 1. Validate the email format
  // 2. Send an email notification
  // 3. Store in a database
  
  // For demo purposes, we'll just save to a JSON file
  const contactsFile = path.join(dataDir, 'contacts.json');
  let contacts = [];
  
  if (fs.existsSync(contactsFile)) {
    const fileContent = fs.readFileSync(contactsFile, 'utf8');
    contacts = JSON.parse(fileContent);
  }
  
  contacts.push({
    id: Date.now(),
    name,
    email,
    subject: subject || '',
    message,
    date: new Date().toISOString()
  });
  
  fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2), 'utf8');
  
  res.json({ success: true, message: 'Message received! We will contact you soon.' });
});

// Newsletter signup
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide an email address' });
  }
  
  // Similar to above, in a real app you'd validate and store in a database
  const subscribersFile = path.join(dataDir, 'subscribers.json');
  let subscribers = [];
  
  if (fs.existsSync(subscribersFile)) {
    const fileContent = fs.readFileSync(subscribersFile, 'utf8');
    subscribers = JSON.parse(fileContent);
  }
  
  // Check if already subscribed
  if (subscribers.some(sub => sub.email === email)) {
    return res.json({ success: false, message: 'You are already subscribed!' });
  }
  
  subscribers.push({
    id: Date.now(),
    email,
    date: new Date().toISOString()
  });
  
  fs.writeFileSync(subscribersFile, JSON.stringify(subscribers, null, 2), 'utf8');
  
  res.json({ success: true, message: 'Successfully subscribed to our newsletter!' });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
