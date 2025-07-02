// Load environment variables from .env file
require('dotenv').config();

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require('@sendgrid/mail');
const { GoogleGenerativeAI } = require("@google/generative-ai");

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

// Generate AI insights for project using Gemini API
exports.generateProjectInsights = functions.https.onCall(async (data, context) => {
  console.log("Generating project insights with Gemini API");
  
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated to generate project insights"
    );
  }

  // Validate input
  if (!data.projectData || typeof data.projectData !== 'object') {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Project data is required"
    );
  }

  const projectData = data.projectData;
  
  // Check if Gemini API key is configured
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error("Gemini API key not configured");
    throw new functions.https.HttpsError(
      "failed-precondition",
      "AI service is not configured. Please contact support."
    );
  }

  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    
    // Use gemini-2.0-flash model (fast model without thinking mode)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    });

    // Create a detailed prompt with all project information
    const prompt = `You are an expert software project analyst working with a solo software developer. Analyze the following project details and provide comprehensive insights in JSON format.

CONTEXT:
You are analyzing a project for a solo software developer who specializes in:
- Full-stack web development (React, Node.js, Firebase)
- Mobile applications (React Native, Flutter)
- Custom software solutions
- Modern tech stacks and cloud services
- Serving clients globally with high-quality, scalable solutions

IMPORTANT CONSIDERATIONS FOR YOUR ANALYSIS:
- Timeline estimates should be realistic for ONE developer
- Recommend cost-effective solutions suitable for startups/SMEs
- Prioritize maintainability and scalability
- Suggest phased approaches when appropriate
- Consider the developer's expertise with React/Firebase ecosystem
- Factor in time for testing, deployment, and client feedback

PROJECT DETAILS:
- Project Name: ${projectData.projectName || 'Unnamed Project'}
- Industry: ${projectData.industry?.label || 'Not specified'}
- Project Type: ${projectData.projectType || 'Not specified'}
- Description: ${projectData.projectDescription || 'No description provided'}
- Target Users: ${projectData.targetUsers || 'Not specified'}
- Geographic Locations: ${projectData.geographicLocations?.map(loc => loc.label).join(', ') || 'Not specified'}
- Expected User Scale: ${projectData.expectedUserScale || 'Not specified'}
- Timeline: ${projectData.projectTimeline || 'Not specified'}
- Budget Range: ${projectData.budgetRange || 'Not specified'}
- Key Features: ${projectData.keyFeatures?.join(', ') || 'No features specified'}
- Design Preferences: ${projectData.designPreferences?.join(', ') || 'No preferences specified'}
- Authentication Methods: ${projectData.authenticationMethods?.join(', ') || 'Not specified'}
- Data Storage Features: ${projectData.dataStorageFeatures?.join(', ') || 'Not specified'}
- Third-party Integrations: ${projectData.thirdPartyIntegrations?.join(', ') || 'None specified'}
- Competitor URLs: ${projectData.competitorUrls?.join(', ') || 'None provided'}
- Additional Notes: ${projectData.additionalNotes || 'None'}

Please provide a comprehensive analysis in the following JSON format:
{
  "executiveSummary": "A 2-3 sentence overview of the project and its viability",
  "projectFeasibility": {
    "score": "1-10 score",
    "assessment": "Brief assessment of technical feasibility",
    "keyConsiderations": ["List of 3-5 key points to consider"]
  },
  "technicalRecommendations": {
    "suggestedTechStack": {
      "frontend": ["List of recommended frontend technologies"],
      "backend": ["List of recommended backend technologies"],
      "database": ["Recommended database solutions"],
      "hosting": ["Recommended hosting platforms"]
    },
    "architecturePattern": "Recommended architecture pattern (e.g., MVC, microservices, serverless)",
    "scalabilityConsiderations": ["List of 2-3 scalability considerations"]
  },
  "timelineEstimate": {
    "totalDuration": "Estimated total project duration",
    "phases": [
      {
        "name": "Phase name",
        "duration": "Duration estimate",
        "deliverables": ["List of deliverables"]
      }
    ],
    "criticalMilestones": ["List of 3-4 critical milestones"]
  },
  "budgetAnalysis": {
    "estimatedCost": "Cost estimate range based on provided budget",
    "costBreakdown": {
      "development": "Percentage or amount",
      "design": "Percentage or amount",
      "testing": "Percentage or amount",
      "deployment": "Percentage or amount",
      "maintenance": "First year maintenance estimate"
    },
    "costOptimizationTips": ["List of 2-3 ways to optimize costs"]
  },
  "riskAssessment": {
    "potentialRisks": [
      {
        "risk": "Risk description",
        "impact": "High/Medium/Low",
        "mitigation": "Mitigation strategy"
      }
    ],
    "securityConsiderations": ["List of 3-4 security considerations"]
  },
  "competitiveAnalysis": {
    "marketInsights": "Brief market analysis based on competitors",
    "differentiationOpportunities": ["List of 3-4 ways to differentiate"],
    "keyFeaturesComparison": "How the proposed features compare to market"
  },
  "nextSteps": ["Ordered list of 5-7 recommended next steps"]
}

Ensure your response is valid JSON and provides actionable, specific insights based on the project details provided.`;

    // Generate insights with Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Raw Gemini response received");
    
    // Parse the JSON response
    let insights;
    try {
      // Extract JSON from the response (in case it's wrapped in markdown code blocks)
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/({[\s\S]*})/);
      const jsonText = jsonMatch ? jsonMatch[1] : text;
      insights = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.error("Raw response:", text);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to parse AI response. Please try again."
      );
    }

    // Add metadata
    const insightsWithMetadata = {
      ...insights,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      modelUsed: "gemini-2.0-flash",
      userId: context.auth.uid
    };

    // Log success
    console.log("Project insights generated successfully");

    return {
      status: "success",
      insights: insightsWithMetadata
    };

  } catch (error) {
    console.error("Error generating project insights:", error);
    
    // Handle specific Gemini API errors
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "AI service configuration error. Please contact support."
      );
    }
    
    if (error.message?.includes("RATE_LIMIT")) {
      throw new functions.https.HttpsError(
        "resource-exhausted",
        "AI service is temporarily unavailable due to high demand. Please try again later."
      );
    }

    // Generic error
    throw new functions.https.HttpsError(
      "internal",
      "Failed to generate project insights. Please try again.",
      { errorDetails: error.toString() }
    );
  }
});
