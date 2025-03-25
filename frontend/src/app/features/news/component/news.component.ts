import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';

interface NewsItem {
  title: string;
  description: string;
  date: string;
  source: string;
  severity: 'High' | 'Medium' | 'Low';
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  standalone: true,
  imports: [CommonModule, CardModule, BadgeModule]
})
export class NewsComponent implements OnInit {
  newsItems: NewsItem[] = [
    {
      title: 'Flood Warning in Coastal Areas',
      description: 'Heavy rainfall expected in coastal regions. Residents advised to take precautions.',
      date: '2024-03-20',
      source: 'Weather Service',
      severity: 'High'
    },
    {
      title: 'Earthquake in Northern Region',
      description: 'Minor earthquake reported in northern areas. No major damage reported.',
      date: '2024-03-19',
      source: 'Seismic Center',
      severity: 'Medium'
    },
    {
      title: 'Storm Warning Lifted',
      description: 'Previous storm warning has been lifted as weather conditions improve.',
      date: '2024-03-18',
      source: 'Meteorological Department',
      severity: 'Low'
    }
  ];

  ngOnInit() {
    // TODO: Implement API call to fetch real news data
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'info';
    }
  }
} 