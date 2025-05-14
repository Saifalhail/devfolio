const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Define a callable function named "submitFormData"
// The name is what you will use to call it from your frontend.
exports.submitFormData = functions.https.onCall(async (data, context) => {
  // data is the object sent from your React frontend when calling this function
  // context contains information about the calling user (if authenticated)

  // --- Basic Data Validation (Important!) ---
  // Always validate data on the backend, don't trust the frontend!
  if (!data.name || !data.email || !data.message) {
    // If required fields are missing, throw an error that the client can handle
    throw new functions.https.HttpsError(
        "invalid-argument",
        "Please provide name, email, and message.",
    );
  }

  // You might add more validation here, e.g., check email format, etc.
  // Example:
  // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
  //   throw new functions.https.HttpsError(
  //       "invalid-argument",
  //       "Invalid email format."
  //   );
  // }

  // --- Process and Save the Data ---
  try {
    // Get a reference to the Firestore database
    const db = admin.firestore();
    // Define the data to be saved
    const formDataToSave = {
      name: data.name,
      email: data.email,
      message: data.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      // You could also store the user's ID if they are logged in:
      // userId: context.auth ? context.auth.uid : null
    };

    // Add the data to a collection named "formSubmissions"
    // If this collection doesn't exist, Firestore will create it automatically
    const docRef = await db.collection("formSubmissions").add(formDataToSave);

    console.log(`Form data successfully written with ID: ${docRef.id}`);

    // --- Send a Response Back to the Frontend ---
    return {
      status: "success",
      message: "Your form has been submitted successfully!",
      docId: docRef.id,
    };
  } catch (error) {
    console.error("Error writing form data to Firestore:", error);
    // Throw a specific error if something goes wrong
    throw new functions.https.HttpsError(
        "internal",
        "Unable to process your form submission at this time.",
    );
  }
});