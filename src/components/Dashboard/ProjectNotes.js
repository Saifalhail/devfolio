import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import SkeletonLoader from '../Common/SkeletonLoader';
import { FaRegStickyNote, FaMicrophone, FaPaperPlane, FaStop, FaTrash } from 'react-icons/fa';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const ProjectNotes = ({ projectId, projectName }) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Fetch notes from Firestore
  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const notesRef = collection(db, 'projectNotes');
        const q = query(
          notesRef, 
          where('projectId', '==', projectId),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const notesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        
        setNotes(notesList);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchNotes();
    }
  }, [projectId]);

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordingTime(0);
    }

    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await saveAudioNote(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert(t('notes.microphoneError', 'Could not access microphone. Please check permissions.'));
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Save audio note to Firebase
  const saveAudioNote = async (audioBlob) => {
    try {
      setIsLoading(true);
      
      // Upload to Firebase Storage
      const fileName = `audio-notes/${projectId}/${currentUser.uid}-${Date.now()}.webm`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, audioBlob);
      const audioUrl = await getDownloadURL(storageRef);
      
      // Save metadata to Firestore
      await addDoc(collection(db, 'projectNotes'), {
        projectId,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'User',
        type: 'audio',
        content: '',
        audioUrl,
        fileName,
        createdAt: serverTimestamp()
      });
      
      // Refresh notes
      const notesRef = collection(db, 'projectNotes');
      const q = query(
        notesRef, 
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const notesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      
      setNotes(notesList);
    } catch (error) {
      console.error('Error saving audio note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add text note
  const addTextNote = async (e) => {
    e.preventDefault();
    
    if (!newNote.trim()) return;
    
    try {
      setIsLoading(true);
      
      await addDoc(collection(db, 'projectNotes'), {
        projectId,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'User',
        type: 'text',
        content: newNote,
        createdAt: serverTimestamp()
      });
      
      setNewNote('');
      
      // Refresh notes
      const notesRef = collection(db, 'projectNotes');
      const q = query(
        notesRef, 
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const notesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      
      setNotes(notesList);
    } catch (error) {
      console.error('Error adding text note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete note
  const deleteNote = async (noteId, fileName) => {
    if (!window.confirm(t('notes.confirmDelete', 'Are you sure you want to delete this note?'))) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'projectNotes', noteId));
      
      // If it's an audio note, delete from Storage as well
      if (fileName) {
        const storageRef = ref(storage, fileName);
        await deleteObject(storageRef);
      }
      
      // Update state
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const noteDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // If the note is from today
    if (noteDate.getTime() === today.getTime()) {
      return t('notes.today', 'Today at') + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If the note is from yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (noteDate.getTime() === yesterday.getTime()) {
      return t('notes.yesterday', 'Yesterday at') + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show full date
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <NotesContainer>
      <NotesHeader>
        <h3>
          <FaRegStickyNote />
          {t('notes.title', 'Project Notes')} - {projectName}
        </h3>
      </NotesHeader>
      
      <NotesForm onSubmit={addTextNote}>
        <NoteInput
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder={t('notes.placeholder', 'Add a note about this project...')}
          disabled={isLoading || isRecording}
        />
        <NoteActions>
          {isRecording ? (
            <RecordingIndicator>
              <RecordingTime>{formatTime(recordingTime)}</RecordingTime>
              <StopButton onClick={stopRecording} aria-label={t('notes.stopRecording', 'Stop Recording')}>
                <FaStop />
              </StopButton>
            </RecordingIndicator>
          ) : (
            <RecordButton 
              type="button"
              onClick={startRecording}
              disabled={isLoading}
              aria-label={t('notes.startRecording', 'Start Recording')}
            >
              <FaMicrophone />
            </RecordButton>
          )}
          <SubmitButton 
            type="submit" 
            disabled={!newNote.trim() || isLoading || isRecording}
            aria-label={t('notes.addNote', 'Add Note')}
          >
            <FaPaperPlane />
          </SubmitButton>
        </NoteActions>
      </NotesForm>
      
      {isLoading && notes.length === 0 ? (
        <NotesList aria-hidden="true">
          {Array.from({ length: 3 }).map((_, idx) => (
            <NoteItemSkeleton key={idx}>
              <SkeletonHeader>
                <SkeletonLoader width="40%" height="0.9rem" />
              </SkeletonHeader>
              <SkeletonBody>
                <SkeletonLoader height="0.8rem" style={{ marginBottom: '0.4rem' }} />
                <SkeletonLoader height="0.8rem" />
              </SkeletonBody>
            </NoteItemSkeleton>
          ))}
        </NotesList>
      ) : notes.length === 0 ? (
        <EmptyState>
          <p>{t('notes.empty', 'No notes yet. Add your first note above.')}</p>
        </EmptyState>
      ) : (
        <NotesList>
          {notes.map(note => (
            <NoteItem key={note.id} type={note.type}>
              <NoteHeader>
                <NoteAuthor>{note.userName}</NoteAuthor>
                <NoteTime>{formatDate(note.createdAt)}</NoteTime>
                <DeleteButton 
                  onClick={() => deleteNote(note.id, note.fileName)}
                  aria-label={t('notes.delete', 'Delete Note')}
                >
                  <FaTrash />
                </DeleteButton>
              </NoteHeader>
              
              {note.type === 'text' ? (
                <NoteContent>{note.content}</NoteContent>
              ) : (
                <AudioContainer>
                  <audio controls src={note.audioUrl}>
                    {t('notes.audioNotSupported', 'Your browser does not support the audio element.')}
                  </audio>
                </AudioContainer>
              )}
            </NoteItem>
          ))}
        </NotesList>
      )}
    </NotesContainer>
  );
};

// Styled Components
const NotesContainer = styled.div`
  background: rgba(18, 20, 44, 0.8);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(205, 62, 253, 0.1);
`;

const NotesHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    color: #fff;
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: #cd3efd;
    }
  }
`;

const NotesForm = styled.form`
  display: flex;
  margin-bottom: 1.5rem;
  gap: 0.5rem;
`;

const NoteInput = styled.textarea`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(205, 62, 253, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #fff;
  resize: none;
  height: 60px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(205, 62, 253, 0.4);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const NoteActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RecordButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: #cd3efd;
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: rgba(205, 62, 253, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.3)' : '#cd3efd'};
  border: none;
  border-radius: 8px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: rgba(205, 62, 253, 0.2);
  }
`;

const RecordingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(244, 67, 54, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% { background: rgba(244, 67, 54, 0.1); }
    50% { background: rgba(244, 67, 54, 0.2); }
    100% { background: rgba(244, 67, 54, 0.1); }
  }
`;

const RecordingTime = styled.span`
  color: #F44336;
  font-size: 0.8rem;
  font-weight: 500;
`;

const StopButton = styled.button`
  background: #F44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #D32F2F;
  }
  
  svg {
    font-size: 0.7rem;
  }
`;


const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
`;


const NotesList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NoteItem = styled.div`
  background: ${props => props.type === 'audio' ? 'rgba(33, 150, 243, 0.05)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 8px;
  padding: 1rem;
  border-left: 3px solid ${props => props.type === 'audio' ? '#2196F3' : '#cd3efd'};
`;

const NoteHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
`;

const NoteAuthor = styled.span`
  color: #fff;
  font-weight: 500;
  font-size: 0.9rem;
`;

const NoteTime = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  margin-left: auto;
`;

const DeleteButton = styled.button`
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  border: none;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #F44336;
  }
  
  svg {
    font-size: 0.8rem;
  }
`;

const NoteContent = styled.p`
  color: #fff;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
`;

const AudioContainer = styled.div`
  audio {
    width: 100%;
    height: 36px;
    border-radius: 18px;
    background: rgba(33, 150, 243, 0.1);
  }
`;

const NoteItemSkeleton = styled(NoteItem)`
  border-left-color: rgba(205, 62, 253, 0.1);
`;

const SkeletonHeader = styled(NoteHeader)`
  align-items: center;
`;

const SkeletonBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

export default ProjectNotes;
