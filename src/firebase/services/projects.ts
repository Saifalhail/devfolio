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

// Upload a file to Firebase Storage with CORS fallback
export const uploadProjectFile = async (
  projectId: string, 
  file: File,
  onProgress?: (progress: number) => void
): Promise<ProjectFile> => {
  try {
    await waitForAuth();
    
    // Create a storage reference
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `projects/${projectId}/${fileName}`);
    
    // Try normal upload first
    try {
      console.log('Attempting direct file upload...');
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Handle progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            if (onProgress) {
              onProgress(progress);
            }
          },
          async (error) => {
            // If CORS error, try base64 fallback
            console.error('Direct upload failed:', error);
            if (error.message && error.message.includes('CORS')) {
              console.log('CORS error detected, falling back to base64 upload...');
              try {
                // Convert file to base64
                const base64Data = await fileToBase64(file);
                
                // Upload as base64
                const snapshot = await uploadString(storageRef, base64Data, 'data_url');
                const downloadURL = await getDownloadURL(snapshot.ref);
                
                const projectFile: ProjectFile = {
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  url: downloadURL,
                  uploadedAt: new Date()
                };
                
                console.log('Base64 upload successful');
                resolve(projectFile);
              } catch (base64Error) {
                console.error('Base64 upload also failed:', base64Error);
                reject(base64Error);
              }
            } else {
              reject(error);
            }
          },
          async () => {
            // Handle successful direct upload
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
              resolve(projectFile);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (directError: any) {
      // If direct upload fails immediately, try base64
      console.error('Direct upload failed immediately:', directError);
      console.log('Attempting base64 upload fallback...');
      
      const base64Data = await fileToBase64(file);
      const snapshot = await uploadString(storageRef, base64Data, 'data_url');
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      const projectFile: ProjectFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: downloadURL,
        uploadedAt: new Date()
      };
      
      console.log('Base64 fallback upload successful');
      if (onProgress) {
        onProgress(100);
      }
      
      return projectFile;
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
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

// Generate AI summary for project (placeholder for future implementation)
export const generateProjectSummary = async (projectData: Omit<Project, 'id' | 'userId' | 'createdAt'>): Promise<string> => {
  // This is a placeholder for AI integration
  // In a real implementation, this would call an AI service (OpenAI, Claude, etc.)
  // to generate a comprehensive project summary based on all the input data
  
  const summary = `
    ${projectData.name} is a ${projectData.type} project in the ${projectData.industry} industry. 
    The project targets ${projectData.targetUserGroups.join(', ')} with an expected user scale of ${projectData.userScale}. 
    It will be available in ${projectData.geographicLocations.join(', ')}. 
    Key features include ${projectData.coreFeatures.slice(0, 3).join(', ')}, 
    with ${projectData.authFeatures.length > 0 ? 'authentication capabilities' : 'no authentication'} 
    and ${projectData.dataStorageFeatures.length > 0 ? 'data storage requirements' : 'minimal data storage needs'}. 
    The project will be built for ${projectData.platforms.join(', ')} platforms 
    with a ${projectData.budgetRange} budget and ${projectData.timeline} timeline.
  `.trim();
  
  return summary;
};