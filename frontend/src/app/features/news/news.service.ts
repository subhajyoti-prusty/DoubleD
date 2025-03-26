import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, timeout, tap } from 'rxjs/operators';

export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: Date;
  source: {
    name: string;
    url: string;
  };
  category?: string;
  relevance?: number; // 1-10 scale for disaster relevance
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  // Primary API: NewsAPI.org
  private primaryApiUrl = 'https://newsapi.org/v2/everything';
  private primaryApiKey = '0b243a3d89b9405a8c0b10a137fb46b8'; // Free NewsAPI key
  
  // Backup API: The Guardian API
  private backupApiUrl = 'https://content.guardianapis.com/search';
  private backupApiKey = 'test'; // Guardian's test API key for development
  
  constructor(private http: HttpClient) { }
  
  getDisasterNews(): Observable<NewsArticle[]> {
    // For demo purposes, return mock data directly to avoid CORS errors
    // In production, these API calls would be routed through a backend proxy
    return of(this.getMockNewsData()).pipe(
      // Simulate network delay
      tap(() => console.log('Fetching mock disaster news data...')),
      map(articles => {
        // Add additional metadata to articles
        return articles.map(article => ({
          ...article,
          category: article.category || this.determineCategory(article.title, article.description),
          relevance: article.relevance || this.calculateRelevance(article.title, article.description),
          location: article.location || this.extractLocation(article.title, article.description)
        }));
      })
    );
  }
  
  private getMockNewsData(): NewsArticle[] {
    return [
      {
        title: 'Hurricane Alpha Strengthens to Category 4, Threatens Coastal Communities',
        description: 'Hurricane Alpha has rapidly intensified to a Category 4 storm with sustained winds of 130 mph as it approaches the southeastern coast.',
        content: 'Hurricane Alpha has rapidly intensified to a Category 4 storm with sustained winds of 130 mph as it approaches the southeastern coast. Authorities have issued mandatory evacuation orders for coastal communities in three states. The National Hurricane Center warns of "catastrophic damage" from winds, storm surge, and flooding. Emergency shelters are being prepared inland, and resources are being mobilized to respond to the storm\'s aftermath.',
        url: 'https://example.com/hurricane-alpha',
        image: 'assets/images/news/hurricane.jpg',
        publishedAt: new Date('2023-10-14T08:30:00'),
        source: {
          name: 'Weather News Network',
          url: 'https://example.com/weather-news'
        },
        category: 'Hurricane',
        relevance: 10,
        location: 'Southeastern United States'
      },
      {
        title: 'Flood Waters Rising in Kerala After Record Rainfall',
        description: 'Kerala state is experiencing its worst flooding in a decade following three days of continuous heavy rainfall.',
        content: 'Kerala state is experiencing its worst flooding in a decade following three days of continuous heavy rainfall. Over 50,000 people have been evacuated to higher ground, and emergency services are working around the clock to rescue those stranded. The state government has opened 210 relief camps, and the national disaster response force has deployed 30 teams to affected areas. Damage to infrastructure is estimated at over $100 million.',
        url: 'https://example.com/kerala-floods',
        image: 'assets/images/news/flood.jpg',
        publishedAt: new Date('2023-10-12T14:45:00'),
        source: {
          name: 'Global Disaster Monitor',
          url: 'https://example.com/global-disaster'
        },
        category: 'Flood',
        relevance: 9,
        location: 'Kerala, India'
      },
      {
        title: 'Magnitude 6.7 Earthquake Strikes California',
        description: 'A powerful earthquake has caused significant damage in Northern California with multiple aftershocks reported.',
        content: 'A magnitude 6.7 earthquake struck Northern California early Thursday morning, causing significant damage to buildings, roads, and infrastructure. Several injuries have been reported, but no fatalities so far. Authorities are conducting search and rescue operations in the most affected areas. The seismic event was felt across multiple counties, with aftershocks continuing to rattle the region. Emergency response teams are assessing structural damage and utility disruptions.',
        url: 'https://example.com/california-earthquake',
        image: 'assets/images/news/earthquake.jpg',
        publishedAt: new Date('2023-10-15T05:20:00'),
        source: {
          name: 'Science & Nature Today',
          url: 'https://example.com/science-nature'
        },
        category: 'Earthquake',
        relevance: 10,
        location: 'Northern California, USA'
      },
      {
        title: 'Australian Wildfires Spread Across Victoria',
        description: 'Firefighters are battling multiple blazes across the state of Victoria as drought conditions worsen.',
        content: 'Firefighters are battling multiple wildfires across the state of Victoria as drought conditions and high temperatures create dangerous conditions. Over 15,000 hectares have already burned, and several communities are under evacuation orders. Air quality warnings have been issued for Melbourne and surrounding areas due to heavy smoke. Wildlife rescue organizations report significant impacts on native fauna, with rehabilitation centers overwhelmed by injured animals.',
        url: 'https://example.com/australia-wildfires',
        image: 'assets/images/news/wildfire.jpg',
        publishedAt: new Date('2023-10-10T22:15:00'),
        source: {
          name: 'Environmental News Daily',
          url: 'https://example.com/environmental-news'
        },
        category: 'Wildfire',
        relevance: 8,
        location: 'Victoria, Australia'
      },
      {
        title: 'Tsunami Alert Issued Following Pacific Earthquake',
        description: 'Countries around the Pacific Rim are on alert after a 7.8 magnitude earthquake triggered tsunami warnings.',
        content: 'Countries around the Pacific Rim are on tsunami alert after a 7.8 magnitude earthquake struck beneath the ocean floor near the Solomon Islands. Initial waves of 0.5 to 1 meter have been observed in some coastal areas. Evacuations are underway in low-lying coastal regions across multiple countries. The Pacific Tsunami Warning Center is monitoring the situation and providing regular updates. Emergency services are on high alert and prepared to respond to potential impacts.',
        url: 'https://example.com/tsunami-alert',
        image: 'assets/images/news/tsunami.jpg',
        publishedAt: new Date('2023-10-13T11:05:00'),
        source: {
          name: 'Ocean Science Institute',
          url: 'https://example.com/ocean-science'
        },
        category: 'Tsunami',
        relevance: 9,
        location: 'Pacific Ocean'
      },
      {
        title: 'Drought Emergency Declared in Western States',
        description: 'Three western states have declared drought emergencies as reservoirs reach critically low levels.',
        content: 'Three western states have declared drought emergencies as reservoirs and groundwater sources reach critically low levels after three years of below-average precipitation. Water restrictions are now in place for agricultural and residential users. The drought is impacting agriculture, with crop yields expected to decrease by 30-40% this year. Wildlife agencies report stress on native species as natural water sources dry up. Long-term climate projections suggest this may represent a "new normal" for the region.',
        url: 'https://example.com/drought-emergency',
        image: 'assets/images/news/drought.jpg',
        publishedAt: new Date('2023-10-08T16:50:00'),
        source: {
          name: 'Climate Watch',
          url: 'https://example.com/climate-watch'
        },
        category: 'Drought',
        relevance: 7,
        location: 'Western United States'
      },
      {
        title: 'Cyclone Mocha Approaches Bangladesh Coast',
        description: 'Authorities are evacuating coastal areas as Cyclone Mocha intensifies in the Bay of Bengal.',
        content: 'Cyclone Mocha has intensified into a severe cyclonic storm in the Bay of Bengal, prompting evacuations along the coastlines of Bangladesh and Myanmar. Wind speeds have reached 120 km/h with gusts up to 150 km/h. Meteorological departments predict the cyclone will make landfall within 48 hours, bringing heavy rainfall, storm surges, and flooding to low-lying areas. Relief camps have been established inland, and fishing activities have been suspended across the region.',
        url: 'https://example.com/cyclone-mocha',
        image: 'assets/images/news/hurricane.jpg',
        publishedAt: new Date('2023-10-11T09:30:00'),
        source: {
          name: 'Asian Weather Center',
          url: 'https://example.com/asian-weather'
        },
        category: 'Hurricane',
        relevance: 9,
        location: 'Bangladesh'
      },
      {
        title: 'Volcanic Activity Increases at Mount Merapi',
        description: 'Indonesia\'s most active volcano shows signs of increased activity with frequent pyroclastic flows.',
        content: 'Mount Merapi in Indonesia has shown increasing volcanic activity over the past week, with authorities raising the alert level to the second-highest status. The volcano has expelled pyroclastic flows and incandescent lava multiple times daily, traveling up to 3 kilometers down its slopes. Residents within a 5-kilometer radius have been advised to evacuate, affecting approximately 15,000 people. Volcanic ash has affected local air quality and disrupted flights at nearby airports.',
        url: 'https://example.com/mount-merapi',
        image: 'assets/images/news/earthquake.jpg',
        publishedAt: new Date('2023-10-09T12:15:00'),
        source: {
          name: 'Geological Hazards Monitor',
          url: 'https://example.com/geo-hazards'
        },
        category: 'Other',
        relevance: 8,
        location: 'Indonesia'
      }
    ];
  }
  
  // Helper method to determine category based on content
  determineCategory(title: string, description: string): string {
    const content = (title + ' ' + (description || '')).toLowerCase();
    
    if (content.includes('hurricane') || content.includes('typhoon') || content.includes('cyclone') || content.includes('storm')) {
      return 'Hurricane';
    } else if (content.includes('flood') || content.includes('inundat') || content.includes('submerge')) {
      return 'Flood';
    } else if (content.includes('earthquake') || content.includes('seismic') || content.includes('tremor') || content.includes('quake')) {
      return 'Earthquake';
    } else if (content.includes('fire') || content.includes('wildfire') || content.includes('blaze') || content.includes('burn')) {
      return 'Wildfire';
    } else if (content.includes('drought') || content.includes('water shortage') || content.includes('dry')) {
      return 'Drought';
    } else if (content.includes('tsunami') || content.includes('tidal wave')) {
      return 'Tsunami';
    }
    
    return 'Other';
  }
  
  // Helper method to calculate relevance score
  calculateRelevance(title: string, description: string): number {
    const content = (title + ' ' + (description || '')).toLowerCase();
    let score = 0;
    
    const keywords = [
      'disaster', 'emergency', 'catastrophe', 'crisis', 'severe', 
      'warning', 'alert', 'evacuation', 'damage', 'destroyed',
      'casualties', 'victims', 'rescue', 'relief', 'aid',
      'death', 'died', 'killed', 'injured', 'stranded'
    ];
    
    keywords.forEach(keyword => {
      if (content.includes(keyword)) {
        score += 1;
      }
    });
    
    return Math.min(Math.max(score, 1), 10); // Ensure score is between 1-10
  }
  
  // Helper method to extract location from title and description
  extractLocation(title: string, description: string): string | undefined {
    const content = (title + ' ' + (description || '')).toLowerCase();
    const commonLocations = [
      'United States', 'USA', 'California', 'Florida', 'Texas', 'New York',
      'India', 'China', 'Japan', 'Australia', 'Indonesia', 'Philippines', 
      'Mexico', 'Brazil', 'Canada', 'Italy', 'Pakistan', 'Thailand', 'Vietnam',
      'Africa', 'Europe', 'Asia', 'Pacific'
    ];
    
    for (const location of commonLocations) {
      if (content.includes(location.toLowerCase())) {
        return location;
      }
    }
    
    return undefined;
  }
} 