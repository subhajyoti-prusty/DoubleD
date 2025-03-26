import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId?: string; // For direct messages
  channelId?: string;   // For channel messages
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: {
    type: 'image' | 'document' | 'location';
    url: string;
    name?: string;
    size?: number;
    coordinates?: {
      lat: number;
      lng: number;
    };
  }[];
  priority: 'normal' | 'urgent' | 'emergency';
  category?: 'general' | 'resource' | 'rescue' | 'medical' | 'evacuation' | 'update';
}

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'disaster' | 'team' | 'region' | 'general';
  disasterId?: string; // If related to a specific disaster
  members: string[]; // Array of user IDs
  createdAt: Date;
  isPublic: boolean;
  lastActivity?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  
  private channelsSubject = new BehaviorSubject<Channel[]>([]);
  public channels$ = this.channelsSubject.asObservable();
  
  // Mock active user for the session
  private currentUserIdSubject = new BehaviorSubject<string>('user-123');
  public currentUserId$ = this.currentUserIdSubject.asObservable();
  
  // Mock active channel for the session
  private currentChannelIdSubject = new BehaviorSubject<string>('channel-sf-earthquake');
  public currentChannelId$ = this.currentChannelIdSubject.asObservable();
  
  // In a production app, this would be an environment variable
  private apiUrl = 'api/messages'; // This would be the actual API URL
  
  // Mock data
  private mockMessages: Message[] = [
    {
      id: 'msg-1',
      senderId: 'user-456',
      senderName: 'Emergency Coordinator',
      channelId: 'channel-sf-earthquake',
      content: 'Update: Emergency teams are being dispatched to the Marina District. All volunteers in the area please report to the command post at Beach and Divisadero.',
      timestamp: new Date('2023-10-15T09:15:00'),
      isRead: true,
      priority: 'urgent',
      category: 'update'
    },
    {
      id: 'msg-2',
      senderId: 'user-789',
      senderName: 'Medical Team Lead',
      channelId: 'channel-sf-earthquake',
      content: 'Need additional medical supplies at the SF General Hospital triage area. Specifically requiring bandages, splints, and IV fluids.',
      timestamp: new Date('2023-10-15T10:30:00'),
      isRead: true,
      priority: 'emergency',
      category: 'medical'
    },
    {
      id: 'msg-3',
      senderId: 'user-123',
      senderName: 'You',
      recipientId: 'user-456',
      content: 'I\'m heading to the Marina District command post with a team of 5 volunteers. ETA 20 minutes.',
      timestamp: new Date('2023-10-15T09:45:00'),
      isRead: true,
      priority: 'normal',
      category: 'general'
    },
    {
      id: 'msg-4',
      senderId: 'user-456',
      senderName: 'Emergency Coordinator',
      recipientId: 'user-123',
      content: 'Roger that. We\'ll be expecting you. Please bring any available water supplies if possible.',
      timestamp: new Date('2023-10-15T09:50:00'),
      isRead: false,
      priority: 'normal',
      category: 'resource'
    },
    {
      id: 'msg-5',
      senderId: 'user-789',
      senderName: 'Medical Team Lead',
      channelId: 'channel-medical',
      content: 'All medical personnel: We\'re setting up a secondary triage at Civic Center. Need at least 10 volunteers with first aid experience.',
      timestamp: new Date('2023-10-15T11:15:00'),
      isRead: false,
      priority: 'urgent',
      category: 'medical',
      attachments: [
        {
          type: 'location',
          url: 'https://maps.example.com/civic-center',
          coordinates: {
            lat: 37.7796,
            lng: -122.4174
          }
        }
      ]
    }
  ];
  
  private mockChannels: Channel[] = [
    {
      id: 'channel-sf-earthquake',
      name: 'SF Earthquake Response',
      description: 'Coordination channel for the San Francisco earthquake response efforts',
      type: 'disaster',
      disasterId: 'sf-earthquake-2023',
      members: ['user-123', 'user-456', 'user-789', 'user-101', 'user-202'],
      createdAt: new Date('2023-10-15T08:45:00'),
      isPublic: true,
      lastActivity: new Date('2023-10-15T11:15:00')
    },
    {
      id: 'channel-medical',
      name: 'Medical Team',
      description: 'Channel for all medical personnel and volunteers with medical training',
      type: 'team',
      disasterId: 'sf-earthquake-2023',
      members: ['user-123', 'user-789', 'user-303', 'user-404'],
      createdAt: new Date('2023-10-15T09:00:00'),
      isPublic: false,
      lastActivity: new Date('2023-10-15T11:15:00')
    },
    {
      id: 'channel-marina-district',
      name: 'Marina District Operations',
      description: 'Coordination for rescue and relief efforts in the Marina District',
      type: 'region',
      disasterId: 'sf-earthquake-2023',
      members: ['user-123', 'user-456', 'user-505', 'user-606'],
      createdAt: new Date('2023-10-15T09:30:00'),
      isPublic: true,
      lastActivity: new Date('2023-10-15T10:45:00')
    }
  ];
  
  constructor(private http: HttpClient) {
    // Initialize with mock data
    this.messagesSubject.next(this.mockMessages);
    this.channelsSubject.next(this.mockChannels);
    
    // In a real app, we would establish a WebSocket connection here
    this.simulateRealTimeMessages();
  }
  
  // Method to simulate real-time incoming messages (for demo purposes)
  private simulateRealTimeMessages() {
    // In a real app, this would be handled by WebSockets
    setTimeout(() => {
      const newMessage: Message = {
        id: `msg-${this.mockMessages.length + 1}`,
        senderId: 'user-505',
        senderName: 'Search & Rescue Team',
        channelId: 'channel-marina-district',
        content: 'We\'ve completed search operations on blocks 1-5 of Chestnut Street. Moving to blocks 6-10 now. Three survivors extracted and transported to medical.',
        timestamp: new Date(),
        isRead: false,
        priority: 'normal',
        category: 'rescue'
      };
      
      this.mockMessages = [...this.mockMessages, newMessage];
      this.messagesSubject.next(this.mockMessages);
      
      // Update channel last activity
      this.updateChannelLastActivity('channel-marina-district');
      
      // Simulate another message after a delay
      setTimeout(() => {
        const urgentMessage: Message = {
          id: `msg-${this.mockMessages.length + 1}`,
          senderId: 'user-456',
          senderName: 'Emergency Coordinator',
          channelId: 'channel-sf-earthquake',
          content: 'ALERT: Aftershock detected. Magnitude 4.5. All personnel move to open areas and await further instructions.',
          timestamp: new Date(),
          isRead: false,
          priority: 'emergency',
          category: 'update'
        };
        
        this.mockMessages = [...this.mockMessages, urgentMessage];
        this.messagesSubject.next(this.mockMessages);
        
        // Update channel last activity
        this.updateChannelLastActivity('channel-sf-earthquake');
      }, 120000); // 2 minutes after first message
    }, 60000); // 1 minute after loading
  }
  
  private updateChannelLastActivity(channelId: string) {
    const index = this.mockChannels.findIndex(c => c.id === channelId);
    if (index !== -1) {
      const updatedChannel = {
        ...this.mockChannels[index],
        lastActivity: new Date()
      };
      
      this.mockChannels = [
        ...this.mockChannels.slice(0, index),
        updatedChannel,
        ...this.mockChannels.slice(index + 1)
      ];
      
      this.channelsSubject.next(this.mockChannels);
    }
  }
  
  // Get all messages for the current user (direct messages + channels they belong to)
  getAllMessages(): Observable<Message[]> {
    return this.currentUserId$.pipe(
      map(userId => {
        const userChannels = this.mockChannels
          .filter(channel => channel.members.includes(userId))
          .map(channel => channel.id);
        
        return this.mockMessages.filter(message => 
          (message.recipientId === userId) || 
          (message.senderId === userId) ||
          (message.channelId && userChannels.includes(message.channelId))
        );
      })
    );
  }
  
  // Get direct messages between current user and another user
  getDirectMessages(otherUserId: string): Observable<Message[]> {
    return this.currentUserId$.pipe(
      map(userId => {
        return this.mockMessages.filter(message => 
          (message.senderId === userId && message.recipientId === otherUserId) ||
          (message.senderId === otherUserId && message.recipientId === userId)
        );
      })
    );
  }
  
  // Get messages for a specific channel
  getChannelMessages(channelId: string): Observable<Message[]> {
    // Filter mock data by channel ID
    const channelMessages = this.mockMessages.filter(m => m.channelId === channelId);
    return of(channelMessages);
    
    // Real implementation would be:
    /*
    return this.http.get<Message[]>(`${this.apiUrl}/channel/${channelId}`)
      .pipe(
        catchError(error => {
          console.error(`Error fetching messages for channel ${channelId}`, error);
          return of([]);
        })
      );
    */
  }
  
  // Get all channels the current user is a member of
  getUserChannels(): Observable<Channel[]> {
    return this.currentUserId$.pipe(
      map(userId => {
        return this.mockChannels.filter(channel => 
          channel.members.includes(userId)
        );
      })
    );
  }
  
  // Send a new message
  sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Observable<Message> {
    // Create a new message with a generated ID
    const newMessage: Message = {
      ...message,
      id: `msg-${this.mockMessages.length + 1}`,
      timestamp: new Date(),
      isRead: false
    };
    
    // Add to mock data
    this.mockMessages = [...this.mockMessages, newMessage];
    this.messagesSubject.next(this.mockMessages);
    
    // Update channel last activity if it's a channel message
    if (newMessage.channelId) {
      this.updateChannelLastActivity(newMessage.channelId);
    }
    
    return of(newMessage);
    
    // Real implementation would be:
    /*
    return this.http.post<Message>(`${this.apiUrl}`, message)
      .pipe(
        tap(newMessage => {
          const currentMessages = this.messagesSubject.value;
          this.messagesSubject.next([...currentMessages, newMessage]);
          
          if (newMessage.channelId) {
            // Update channel last activity
            this.updateChannelActivity(newMessage.channelId);
          }
        }),
        catchError(error => {
          console.error('Error sending message', error);
          throw error;
        })
      );
    */
  }
  
  // Create a new channel
  createChannel(channel: Omit<Channel, 'id' | 'createdAt' | 'lastActivity'>): Observable<Channel> {
    // Create a new channel with a generated ID
    const newChannel: Channel = {
      ...channel,
      id: `channel-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      lastActivity: new Date()
    };
    
    // Add to mock data
    this.mockChannels = [...this.mockChannels, newChannel];
    this.channelsSubject.next(this.mockChannels);
    
    return of(newChannel);
    
    // Real implementation would be:
    /*
    return this.http.post<Channel>(`${this.apiUrl}/channels`, channel)
      .pipe(
        tap(newChannel => {
          const currentChannels = this.channelsSubject.value;
          this.channelsSubject.next([...currentChannels, newChannel]);
        }),
        catchError(error => {
          console.error('Error creating channel', error);
          throw error;
        })
      );
    */
  }
  
  // Add a user to a channel
  addUserToChannel(channelId: string, userId: string): Observable<Channel> {
    // Find and update channel in mock data
    const index = this.mockChannels.findIndex(c => c.id === channelId);
    
    if (index === -1) {
      return of(null as any);
    }
    
    const channel = this.mockChannels[index];
    
    // Check if user is already a member
    if (channel.members.includes(userId)) {
      return of(channel);
    }
    
    const updatedChannel: Channel = {
      ...channel,
      members: [...channel.members, userId]
    };
    
    this.mockChannels = [
      ...this.mockChannels.slice(0, index),
      updatedChannel,
      ...this.mockChannels.slice(index + 1)
    ];
    
    this.channelsSubject.next(this.mockChannels);
    
    return of(updatedChannel);
    
    // Real implementation would be:
    /*
    return this.http.post<Channel>(`${this.apiUrl}/channels/${channelId}/members`, { userId })
      .pipe(
        tap(updatedChannel => {
          const currentChannels = this.channelsSubject.value;
          const index = currentChannels.findIndex(c => c.id === channelId);
          
          if (index !== -1) {
            const newChannels = [...currentChannels];
            newChannels[index] = updatedChannel;
            this.channelsSubject.next(newChannels);
          }
        }),
        catchError(error => {
          console.error(`Error adding user ${userId} to channel ${channelId}`, error);
          throw error;
        })
      );
    */
  }
  
  // Mark messages as read
  markAsRead(messageIds: string[]): Observable<boolean> {
    let updated = false;
    
    // Update each message in the mock data
    const updatedMessages = this.mockMessages.map(message => {
      if (messageIds.includes(message.id) && !message.isRead) {
        updated = true;
        return { ...message, isRead: true };
      }
      return message;
    });
    
    if (updated) {
      this.mockMessages = updatedMessages;
      this.messagesSubject.next(this.mockMessages);
    }
    
    return of(updated);
    
    // Real implementation would be:
    /*
    return this.http.post<any>(`${this.apiUrl}/read`, { messageIds })
      .pipe(
        map(() => {
          const currentMessages = this.messagesSubject.value;
          const updatedMessages = currentMessages.map(message => {
            if (messageIds.includes(message.id)) {
              return { ...message, isRead: true };
            }
            return message;
          });
          
          this.messagesSubject.next(updatedMessages);
          return true;
        }),
        catchError(error => {
          console.error('Error marking messages as read', error);
          return of(false);
        })
      );
    */
  }
  
  // Set active channel for the session
  setCurrentChannel(channelId: string): void {
    this.currentChannelIdSubject.next(channelId);
    
    // Mark all unread messages in this channel as read
    const channelMessages = this.mockMessages
      .filter(m => m.channelId === channelId && !m.isRead)
      .map(m => m.id);
    
    if (channelMessages.length > 0) {
      this.markAsRead(channelMessages).subscribe();
    }
  }
  
  // Get unread message count
  getUnreadCount(): Observable<number> {
    return this.currentUserId$.pipe(
      map(userId => {
        const userChannels = this.mockChannels
          .filter(channel => channel.members.includes(userId))
          .map(channel => channel.id);
        
        return this.mockMessages.filter(message => 
          !message.isRead && 
          ((message.recipientId === userId) || 
           (message.channelId && userChannels.includes(message.channelId)))
        ).length;
      })
    );
  }
  
  // Get unread message count for a specific channel
  getChannelUnreadCount(channelId: string): Observable<number> {
    return this.currentUserId$.pipe(
      map(userId => {
        return this.mockMessages.filter(message => 
          !message.isRead && 
          message.channelId === channelId
        ).length;
      })
    );
  }
  
  // Get emergency messages
  getEmergencyMessages(): Observable<Message[]> {
    return this.currentUserId$.pipe(
      map(userId => {
        const userChannels = this.mockChannels
          .filter(channel => channel.members.includes(userId))
          .map(channel => channel.id);
        
        return this.mockMessages.filter(message => 
          message.priority === 'emergency' && 
          ((message.recipientId === userId) || 
           (message.channelId && userChannels.includes(message.channelId)))
        );
      })
    );
  }
} 