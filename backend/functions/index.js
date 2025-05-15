// Load environment variables from .env file
require('dotenv').config();

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Declare transporter outside, but don't initialize yet
let transporter;

// The helloWorld test function has been removed as it's no longer needed

// Define a callable function named "submitFormData"
// The name is what you will use to call it from your frontend.
exports.submitFormData = functions.https.onCall(async (data, context) => {
  // Log the incoming data for debugging
  console.log("Form submission received with raw data:", data);
  console.log("Form submission data fields:", {
    name: data.name || "[Missing]",
    email: data.email || "[Missing]",
    subject: data.subject || "[No Subject]",
    messageLength: data.message ? data.message.length : 0,
    dataType: typeof data,
    hasDataProperty: data.data ? 'Yes' : 'No'
  });
  
  // Check if data is wrapped in a data property (Firebase callable functions format)
  if (data.data && typeof data.data === 'object') {
    console.log("Unwrapping data from data.data property");
    data = data.data;
  }

  // --- Validate the Input Data ---
  // Check if the required fields are present
  if (!data.name || !data.email || !data.message) {
    console.error("Missing required fields in form submission");
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Please provide name, email, and message."
    );
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    console.error("Invalid email format in form submission");
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Please provide a valid email address."
    );
  }

  // Initialize SendGrid with API key
  const initSendGrid = () => {
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    
    if (!sendgridApiKey) {
      console.error("SendGrid API key is missing");
      return false;
    }
    
    // Set the API key for SendGrid
    sgMail.setApiKey(sendgridApiKey);
    return true;
  };

  // --- Process and Save the Data ---
  try {
    // Log detailed debugging information
    console.log("Function execution started with data:", JSON.stringify({
      name: data.name,
      email: data.email,
      subject: data.subject || "[No Subject]",
      messageLength: data.message ? data.message.length : 0
    }));
    
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const emailRecipient = process.env.EMAIL_RECIPIENT;
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    
    console.log("Email config check:", {
      sendgridApiKeyExists: !!sendgridApiKey,
      toEmailExists: !!process.env.TO_EMAIL,
      fromEmailExists: !!process.env.FROM_EMAIL
    });

    // Try to save to Firestore if available, but don't block the form submission if it fails
    let firestoreSaveSuccessful = false;
    let docId = null;
    
    try {
      console.log("Attempting to save to Firestore...");
      const db = admin.firestore();
      
      // Define the data to be saved
      const formData = {
        name: data.name,
        email: data.email,
        subject: data.subject || "[No Subject]",
        message: data.message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        ipAddress: context.rawRequest?.ip || "Unknown",
        userAgent: context.rawRequest?.headers?.['user-agent'] || "Unknown"
      };
      
      // Save the data to Firestore
      const docRef = await db.collection("contactSubmissions").add(formData);
      docId = docRef.id;
      console.log(`Form data saved to Firestore with ID: ${docId}`);
      firestoreSaveSuccessful = true;
    } catch (firestoreError) {
      // Log the error but continue with the form submission
      console.error("Error saving to Firestore:", firestoreError);
      console.log("Continuing without saving to Firestore...");
    }

    // Now try to send the email using SendGrid
    const toEmail = process.env.TO_EMAIL || 'Saifalhail@gmail.com';
    const fromEmail = process.env.FROM_EMAIL || 'noreply@devfolio.com';
    
    // Initialize SendGrid
    if (initSendGrid()) {
      try {
        console.log("Attempting to send email notification via SendGrid...");
        
        const msg = {
          to: toEmail,
          from: fromEmail,
          subject: `Contact Form: ${data.subject || 'New Message'}`,
          text: `
            Name: ${data.name}
            Email: ${data.email}
            Subject: ${data.subject || 'N/A'}
            Message: ${data.message}
          `,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject || 'N/A'}</p>
            <p><strong>Message:</strong> ${data.message}</p>
          `
        };
        
        await sgMail.send(msg);
        console.log("Email notification sent successfully via SendGrid");
      } catch (emailError) {
        // Log the email error but don't fail the function
        console.error("Error sending email notification:", emailError);
        console.log("Continuing without email notification");
      }
    } else {
      console.log("SendGrid configuration not found. Skipping email notification.");
    }

    // --- Send a Response Back to the Frontend ---
    let responseMessage = "Your form has been submitted successfully!";
    if (!firestoreSaveSuccessful) {
      responseMessage += " (Note: Your submission was not saved to our database, but we received your message)";
    }
    
    return {
      status: "success",
      message: responseMessage,
      docId: docId,
      emailSent: true,
      savedToDatabase: firestoreSaveSuccessful
    };
  } catch (error) {
    // Log detailed error information
    console.error("Error processing form submission:", error);
    console.error("Error stack trace:", error.stack);
    
    if (error.code) {
      console.error("Error code:", error.code);
    }
    
    if (error.details) {
      console.error("Error details:", error.details);
    }
    
    // Throw a more specific error with details
    throw new functions.https.HttpsError(
        "internal",
        `Form submission error: ${error.message || "Unknown error"}`,
        { errorDetails: error.toString() }
    );
  }
});
