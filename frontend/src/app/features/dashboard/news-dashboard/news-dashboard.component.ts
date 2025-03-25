import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';

interface NewsItem {
  title: string;
  description: string;
  date: string;
  source: string;
  severity: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-news-dashboard',
  template: `
    <div class="news-container">
      <h2>Latest Disaster News</h2>
      <div class="news-grid">
        <p-card *ngFor="let news of newsItems" [style]="{'margin-bottom': '1rem'}">
          <ng-template pTemplate="header">
            <div class="news-header">
              <span class="severity-badge" [ngClass]="news.severity">{{news.severity}}</span>
              <span class="news-date">{{news.date}}</span>
            </div>
            <h3>{{news.title}}</h3>
          </ng-template>
          <p>{{news.description}}</p>
          <ng-template pTemplate="footer">
            <div class="news-footer">
              <span class="news-source">Source: {{news.source}}</span>
            </div>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    .news-container {
      padding: 20px;
    }
    .news-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .news-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .severity-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      text-transform: uppercase;
    }
    .severity-badge.high {
      background-color: #ffebee;
      color: #c62828;
    }
    .severity-badge.medium {
      background-color: #fff3e0;
      color: #ef6c00;
    }
    .severity-badge.low {
      background-color: #e8f5e9;
      color: #2e7d32;
    }
    .news-date {
      color: #666;
      font-size: 0.9rem;
    }
    .news-footer {
      margin-top: 10px;
      color: #666;
      font-size: 0.9rem;
    }
  `]
})
export class NewsDashboardComponent implements OnInit {
  newsItems: NewsItem[] = [
    {
      title: 'Major Earthquake Strikes Coastal Region',
      description: 'A 7.2 magnitude earthquake has affected the coastal region, causing significant damage to infrastructure.',
      date: '2024-03-25',
      source: 'National Disaster Center',
      severity: 'high'
    },
    {
      title: 'Flood Warning Issued for River Valley',
      description: 'Heavy rainfall has caused water levels to rise in the river valley area.',
      date: '2024-03-24',
      source: 'Weather Service',
      severity: 'medium'
    },
    {
      title: 'Wildfire Containment Progress',
      description: 'Firefighters have made significant progress in containing the wildfire in the northern region.',
      date: '2024-03-23',
      source: 'Forest Service',
      severity: 'low'
    }
  ];

  constructor() {}

  ngOnInit() {
    // TODO: Implement API call to fetch real news data
  }
} 