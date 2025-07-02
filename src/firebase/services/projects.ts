import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  query, 
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  uploadString,
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth, firestore, storage } from '../config';

// TypeScript interfaces for project data
export interface ProjectFile {
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export interface Project {
  id?: string;
  userId: string;
  
  // Step 1 - Project Basics
  name: string;
  type: string;
  industry: string;
  timeline: string;
  
  // Step 2 - Target Audience & Users
  targetUserGroups: string[];
  userScale: string;
  geographicLocations: string[];
  specificLocation?: string;
  
  // Step 3 - Functional Requirements
  authFeatures: string[];
  dataStorageFeatures: string[];
  coreFeatures: string[];
  otherFeatureText?: string;
  
  // Step 4 - Technical Preferences & Infrastructure
  platforms: string[];
  techStack: string;
  customTechStack?: string;
  hosting: string;
  
  // Step 5 - Budget & Existing Resources
  budgetRange: string;
  existingResources: string[];
  existingMaterials: string[];
  
  // Step 6 - Additional Details & Attachments
  additionalNotes?: string;
  relevantLinks: string[];
  uploadedFiles: ProjectFile[];
  
  // Metadata
  status: 'inProgress' | 'completed' | 'onHold' | 'cancelled';
  createdAt: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  summary?: string; // AI-generated summary
}

// Helper function to wait for auth
const waitForAuth = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        resolve(user.uid);
      } else {
        reject(new Error('User not authenticated'));
      }
    });
  });
};

// Get projects collection reference
const getProjectsCollection = () => collection(firestore, 'projects');

// Create a new project
export const createProject = async (projectData: Omit<Project, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
  try {
    const userId = await waitForAuth();
    
    const projectToSave = {
      ...projectData,
      userId,
      status: projectData.status || 'inProgress',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(getProjectsCollection(), projectToSave);
    console.log('Project created with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (projectId: string, updates: Partial<Project>): Promise<void> => {
  try {
    await waitForAuth();
    
    const projectRef = doc(firestore, 'projects', projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    console.log('Project updated:', projectId);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    await waitForAuth();
    
    // First, get the project to delete associated files
    const projectDoc = await getDoc(doc(firestore, 'projects', projectId));
    if (projectDoc.exists()) {
      const projectData = projectDoc.data() as Project;
      
      // Delete all uploaded files from storage
      if (projectData.uploadedFiles && projectData.uploadedFiles.length > 0) {
        const deletePromises = projectData.uploadedFiles.map(async (file) => {
          try {
            const fileRef = ref(storage, `projects/${projectId}/${file.name}`);
            await deleteObject(fileRef);
          } catch (error) {
            console.error(`Error deleting file ${file.name}:`, error);
          }
        });
        
        await Promise.all(deletePromises);
      }
    }
    
    // Delete the project document
    await deleteDoc(doc(firestore, 'projects', projectId));
    console.log('Project deleted:', projectId);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Get a single project by ID
export const getProject = async (projectId: string): Promise<Project | null> => {
  try {
    const docSnap = await getDoc(doc(firestore, 'projects', projectId));
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Project;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting project:', error);
    throw error;
  }
};

// Get all projects for the current user
export const getUserProjects = async (): Promise<Project[]> => {
  try {
    const userId = await waitForAuth();
    
    const q = query(
      getProjectsCollection(),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const projects: Project[] = [];
    
    querySnapshot.forEach((doc) => {
      projects.push({
        id: doc.id,
        ...doc.data()
      } as Project);
    });
    
    return projects;
  } catch (error) {
    console.error('Error getting user projects:', error);
    throw error;
  }
};

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper function to create a timeout promise
const createTimeoutPromise = (ms: number): Promise<'timeout'> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve('timeout'), ms);
  });
};

// Helper function to perform direct upload
const performDirectUpload = async (
  storageRef: any, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<ProjectFile> => {
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise((resolve, reject) => {
    let hasStarted = false;
    
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        hasStarted = true;
        // Handle progress - check for valid totalBytes to avoid NaN
        if (snapshot.totalBytes && snapshot.totalBytes > 0) {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress.toFixed(2)}% done`);
          if (onProgress) {
            onProgress(progress);
          }
        } else {
          console.log('Upload in progress...');
          if (onProgress) {
            onProgress(0);
          }
        }
      },
      (error) => {
        console.error('Upload error in handler:', error);
        reject(error);
      },
      async () => {
        // Handle successful upload
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const projectFile: ProjectFile = {
            name: file.name,
            size: file.size,
            type: file.type,
            url: downloadURL,
            uploadedAt: new Date()
          };
          console.log('Direct upload successful');
          console.log('File uploaded to Firebase Storage:', {
            path: uploadTask.snapshot.ref.fullPath,
            url: downloadURL,
            fileName: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
          });
          resolve(projectFile);
        } catch (error) {
          reject(error);
        }
      }
    );
    
    // Check if upload starts within 500ms
    setTimeout(() => {
      if (!hasStarted) {
        uploadTask.cancel();
        reject(new Error('Upload failed to start - likely CORS issue'));
      }
    }, 500);
  });
};

// Helper function to perform base64 upload
const performBase64Upload = async (
  storageRef: any, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<ProjectFile> => {
  console.log('Starting base64 upload fallback...');
  
  // Show initial progress
  if (onProgress) {
    onProgress(10);
  }
  
  // Convert to base64
  const base64Data = await fileToBase64(file);
  
  if (onProgress) {
    onProgress(50);
  }
  
  // Upload base64 string
  const snapshot = await uploadString(storageRef, base64Data, 'data_url');
  
  if (onProgress) {
    onProgress(90);
  }
  
  // Get download URL
  const downloadURL = await getDownloadURL(snapshot.ref);
  
  const projectFile: ProjectFile = {
    name: file.name,
    size: file.size,
    type: file.type,
    url: downloadURL,
    uploadedAt: new Date()
  };
  
  if (onProgress) {
    onProgress(100);
  }
  
  console.log('Base64 upload successful');
  console.log('File uploaded to Firebase Storage:', {
    path: `projects/${storageRef._location.path_}`,
    url: downloadURL,
    fileName: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)}MB`
  });
  return projectFile;
};

// Upload a file to Firebase Storage with CORS fallback
export const uploadProjectFile = async (
  projectId: string, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<ProjectFile> => {
  try {
    await waitForAuth();
    
    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 50MB limit');
    }
    
    // Create a storage reference
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `projects/${projectId}/${fileName}`);
    
    console.log(`Uploading file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    
    // Try direct upload with timeout
    try {
      const uploadResult = await Promise.race([
        performDirectUpload(storageRef, file, onProgress),
        createTimeoutPromise(2000) // 2 second timeout
      ]);
      
      if (uploadResult === 'timeout') {
        console.log('Direct upload timed out, falling back to base64...');
        return await performBase64Upload(storageRef, file, onProgress);
      }
      
      return uploadResult as ProjectFile;
    } catch (directError: any) {
      console.error('Direct upload failed:', directError.message || directError);
      
      // Always fallback to base64 for any error
      try {
        return await performBase64Upload(storageRef, file, onProgress);
      } catch (base64Error) {
        console.error('Base64 upload also failed:', base64Error);
        throw new Error(`Failed to upload file: ${base64Error.message || 'Unknown error'}`);
      }
    }
  } catch (error: any) {
    console.error('Error in uploadProjectFile:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
};

// Delete a file from Firebase Storage
export const deleteProjectFile = async (projectId: string, fileName: string): Promise<void> => {
  try {
    await waitForAuth();
    
    const fileRef = ref(storage, `projects/${projectId}/${fileName}`);
    await deleteObject(fileRef);
    
    console.log('File deleted:', fileName);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Define the response type for the Cloud Function
interface GenerateInsightsResponse {
  status: 'success' | 'error';
  insights?: any;
  error?: string;
}

// Generate AI summary for project using Gemini API
export const generateProjectSummary = async (projectData: Omit<Project, 'id' | 'userId' | 'createdAt'>): Promise<any> => {
  try {
    // Get Firebase Functions instance
    const functions = getFunctions();
    
    // Create callable function reference with proper typing
    const generateInsights = httpsCallable<any, GenerateInsightsResponse>(functions, 'generateProjectInsights');
    
    // Prepare data for the backend function
    const requestData = {
      projectData: {
        projectName: projectData.name,
        projectType: projectData.type,
        industry: projectData.industry,
        projectDescription: projectData.additionalNotes || '',
        targetUsers: projectData.targetUserGroups.join(', '),
        geographicLocations: projectData.geographicLocations,
        expectedUserScale: projectData.userScale,
        projectTimeline: projectData.timeline,
        budgetRange: projectData.budgetRange,
        keyFeatures: [...projectData.coreFeatures, ...projectData.authFeatures, ...projectData.dataStorageFeatures],
        designPreferences: [], // Add if available in projectData
        authenticationMethods: projectData.authFeatures,
        dataStorageFeatures: projectData.dataStorageFeatures,
        thirdPartyIntegrations: projectData.otherFeatureText ? [projectData.otherFeatureText] : [],
        competitorUrls: projectData.relevantLinks || [],
        additionalNotes: projectData.additionalNotes || '',
        platforms: projectData.platforms,
        techStack: projectData.customTechStack || projectData.techStack,
        hosting: projectData.hosting,
        existingResources: projectData.existingResources,
        existingMaterials: projectData.existingMaterials
      }
    };
    
    console.log('Calling generateProjectInsights Cloud Function...');
    
    // Call the Cloud Function
    const result = await generateInsights(requestData);
    
    // Check if the result is successful
    if (result.data.status === 'success' && result.data.insights) {
      console.log('AI insights generated successfully');
      return result.data.insights;
    } else {
      throw new Error('Failed to generate insights');
    }
    
  } catch (error: any) {
    console.error('Error generating AI summary:', error);
    
    // If AI generation fails, return a fallback summary
    console.log('Falling back to basic summary generation');
    
    const fallbackSummary = {
      executiveSummary: `${projectData.name} is a ${projectData.type} project in the ${projectData.industry} industry. The project targets ${projectData.targetUserGroups.join(', ')} with an expected user scale of ${projectData.userScale}.`,
      projectFeasibility: {
        score: "N/A",
        assessment: "AI analysis unavailable - manual review recommended",
        keyConsiderations: ["Manual technical assessment required", "Budget and timeline validation needed"]
      },
      technicalRecommendations: {
        suggestedTechStack: {
          frontend: projectData.platforms.includes('web') ? ["React", "Next.js"] : ["React Native"],
          backend: ["Node.js", "Firebase"],
          database: ["Firestore"],
          hosting: [projectData.hosting]
        },
        architecturePattern: "To be determined based on requirements",
        scalabilityConsiderations: ["Review user scale requirements", "Plan for growth"]
      },
      timelineEstimate: {
        totalDuration: projectData.timeline,
        phases: [],
        criticalMilestones: ["Project kickoff", "MVP delivery", "Final delivery"]
      },
      budgetAnalysis: {
        estimatedCost: projectData.budgetRange,
        costBreakdown: {},
        costOptimizationTips: ["Review scope for cost savings", "Consider phased approach"]
      },
      riskAssessment: {
        potentialRisks: [],
        securityConsiderations: ["Authentication implementation", "Data privacy compliance"]
      },
      competitiveAnalysis: {
        marketInsights: "Manual analysis required",
        differentiationOpportunities: [],
        keyFeaturesComparison: "Review competitor features manually"
      },
      nextSteps: ["Schedule project kickoff", "Define detailed requirements", "Create technical specification"],
      generatedAt: new Date(),
      modelUsed: "fallback",
      error: error.message || "AI service unavailable"
    };
    
    return fallbackSummary;
  }
};