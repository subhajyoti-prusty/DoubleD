import { Component, OnInit } from '@angular/core';

interface UserSummary {
  volunteers: number;
  ngos: number;
  admins: number;
  total: number;
}

interface DisasterSummary {
  active: number;
  monitoring: number;
  resolved: number;
  total: number;
}

interface ResourceSummary {
  food: number;
  water: number;
  medical: number;
  shelter: number;
  other: number;
  total: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'NGO' | 'Volunteer';
  status: 'Active' | 'Inactive';
  lastLogin: Date;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  userSummary: UserSummary = {
    volunteers: 0,
    ngos: 0,
    admins: 0,
    total: 0
  };

  disasterSummary: DisasterSummary = {
    active: 0,
    monitoring: 0,
    resolved: 0,
    total: 0
  };

  resourceSummary: ResourceSummary = {
    food: 0,
    water: 0,
    medical: 0,
    shelter: 0,
    other: 0,
    total: 0
  };

  recentUsers: User[] = [];
  recentAlerts: string[] = [];
  recentActivities: {user: string, action: string, time: Date}[] = [];

  activeTab: 'users' | 'disasters' | 'resources' | 'alerts' = 'users';

  userTableColumns = ['ID', 'Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions'];
  userTableData: User[] = [];
  
  chartData = {
    disasterByType: {
      labels: ['Hurricane', 'Flood', 'Earthquake', 'Wildfire', 'Other'],
      data: [5, 8, 3, 6, 2]
    },
    resourceAllocation: {
      labels: ['Food', 'Water', 'Medical', 'Shelter', 'Other'],
      data: [30, 25, 15, 20, 10]
    },
    volunteersByLocation: {
      labels: ['North', 'South', 'East', 'West', 'Central'],
      data: [120, 80, 60, 90, 45]
    }
  };

  ngOnInit(): void {
    this.loadMockData();
  }

  loadMockData(): void {
    // User Summary
    this.userSummary = {
      volunteers: 423,
      ngos: 56,
      admins: 12,
      total: 491
    };

    // Disaster Summary
    this.disasterSummary = {
      active: 12,
      monitoring: 5,
      resolved: 28,
      total: 45
    };

    // Resource Summary
    this.resourceSummary = {
      food: 15000,
      water: 25000,
      medical: 5200,
      shelter: 450,
      other: 3800,
      total: 49450
    };

    // Recent Users
    this.recentUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Volunteer', status: 'Active', lastLogin: new Date('2023-10-15T08:30:00') },
      { id: 2, name: 'Jane Smith', email: 'jane@redcross.org', role: 'NGO', status: 'Active', lastLogin: new Date('2023-10-14T14:20:00') },
      { id: 3, name: 'Admin User', email: 'admin@system.org', role: 'Admin', status: 'Active', lastLogin: new Date('2023-10-15T10:45:00') },
      { id: 4, name: 'Mike Johnson', email: 'mike@rescue.org', role: 'Volunteer', status: 'Inactive', lastLogin: new Date('2023-10-10T09:15:00') }
    ];

    // Recent Alerts
    this.recentAlerts = [
      'Hurricane warning issued for coastal regions',
      'Emergency evacuation ordered for River District',
      'Additional medical teams deployed to Southern Hospital',
      'Supply route blocked due to flooding'
    ];

    // Recent Activities
    this.recentActivities = [
      { user: 'Admin User', action: 'Updated disaster status for Hurricane Alpha', time: new Date('2023-10-15T09:30:00') },
      { user: 'Jane Smith', action: 'Added 500 units of water supplies', time: new Date('2023-10-15T08:45:00') },
      { user: 'System', action: 'Alert broadcast to all volunteers in Zone B', time: new Date('2023-10-15T07:15:00') },
      { user: 'John Doe', action: 'Registered as volunteer for Hurricane Alpha response', time: new Date('2023-10-14T16:20:00') }
    ];

    // User table data
    this.userTableData = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Volunteer', status: 'Active', lastLogin: new Date('2023-10-15T08:30:00') },
      { id: 2, name: 'Jane Smith', email: 'jane@redcross.org', role: 'NGO', status: 'Active', lastLogin: new Date('2023-10-14T14:20:00') },
      { id: 3, name: 'Admin User', email: 'admin@system.org', role: 'Admin', status: 'Active', lastLogin: new Date('2023-10-15T10:45:00') },
      { id: 4, name: 'Mike Johnson', email: 'mike@rescue.org', role: 'Volunteer', status: 'Inactive', lastLogin: new Date('2023-10-10T09:15:00') },
      { id: 5, name: 'Sarah Williams', email: 'sarah@ngo.org', role: 'NGO', status: 'Active', lastLogin: new Date('2023-10-13T11:05:00') },
      { id: 6, name: 'David Brown', email: 'david@example.com', role: 'Volunteer', status: 'Active', lastLogin: new Date('2023-10-12T16:40:00') },
      { id: 7, name: 'Emma Wilson', email: 'emma@rescue.org', role: 'Volunteer', status: 'Active', lastLogin: new Date('2023-10-14T09:25:00') },
      { id: 8, name: 'Robert Miller', email: 'robert@system.org', role: 'Admin', status: 'Active', lastLogin: new Date('2023-10-11T13:15:00') }
    ];
  }

  changeTab(tab: 'users' | 'disasters' | 'resources' | 'alerts'): void {
    this.activeTab = tab;
  }

  changeUserStatus(userId: number, status: 'Active' | 'Inactive'): void {
    const userIndex = this.userTableData.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.userTableData[userIndex].status = status;
    }
  }

  deleteUser(userId: number): void {
    this.userTableData = this.userTableData.filter(user => user.id !== userId);
  }

  sendAlert(message: string): void {
    console.log('Alert sent:', message);
    this.recentAlerts.unshift(message);
    this.recentActivities.unshift({
      user: 'Admin User',
      action: 'Sent alert: ' + message,
      time: new Date()
    });
  }
}
