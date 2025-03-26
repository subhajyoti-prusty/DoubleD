<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { NewsService, NewsArticle } from './news.service';
=======
import { Component } from '@angular/core';
>>>>>>> c0b01643d8e827ce0af2549620d6cd9a5cd1001c

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
<<<<<<< HEAD
export class NewsComponent implements OnInit {
  newsArticles: NewsArticle[] = [];
  filteredArticles: NewsArticle[] = [];
  isLoading = true;
  error = '';
  searchTerm = '';
  categoryFilter: string | null = null;
  usedFallbackData = true; // Set to true since we're now always using mock data
  
  categories = [
    'All Categories',
    'Hurricane',
    'Flood',
    'Earthquake',
    'Wildfire',
    'Drought',
    'Tsunami',
    'Other'
  ];

  selectedArticle: NewsArticle | null = null;

  constructor(private newsService: NewsService) { }

  ngOnInit(): void {
    this.fetchNews();
  }

  fetchNews(): void {
    this.isLoading = true;
    this.error = '';
    
    this.newsService.getDisasterNews().subscribe(
      (articles) => {
        if (articles.length === 0) {
          this.error = 'No disaster news found.';
        } else {
          this.newsArticles = articles;
          this.filteredArticles = [...this.newsArticles];
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('News service error:', error);
        this.error = typeof error === 'string' ? error : 'Failed to load news. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  retryFetchNews(): void {
    this.fetchNews();
  }

  filterArticles(): void {
    this.filteredArticles = this.newsArticles.filter(article => {
      // Apply category filter
      if (this.categoryFilter && this.categoryFilter !== 'All Categories' && article.category !== this.categoryFilter) {
        return false;
      }
      
      // Apply search term
      if (this.searchTerm && !this.articleMatchesSearch(article, this.searchTerm)) {
        return false;
      }
      
      return true;
    });
  }

  private articleMatchesSearch(article: NewsArticle, term: string): boolean {
    const searchTerm = term.toLowerCase();
    return !!(
      article.title.toLowerCase().includes(searchTerm) ||
      article.description.toLowerCase().includes(searchTerm) ||
      article.content.toLowerCase().includes(searchTerm) ||
      (article.location && article.location.toLowerCase().includes(searchTerm)) ||
      (article.source.name && article.source.name.toLowerCase().includes(searchTerm))
    );
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.filterArticles();
  }

  onCategoryChange(category: string): void {
    this.categoryFilter = category === 'All Categories' ? null : category;
    this.filterArticles();
  }

  selectArticle(article: NewsArticle): void {
    this.selectedArticle = article;
  }

  closeArticleDetail(): void {
    this.selectedArticle = null;
  }

  getRelevanceBadgeClass(relevance: number): string {
    if (relevance >= 9) return 'critical';
    if (relevance >= 7) return 'high';
    if (relevance >= 5) return 'medium';
    return 'low';
  }

  formatDate(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      return 'Date unavailable';
    }
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60); // diff in minutes
    
    if (diff < 60) {
      return `${diff} minute${diff !== 1 ? 's' : ''} ago`;
    } else if (diff < 1440) { // less than a day
      const hours = Math.floor(diff / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diff < 43200) { // less than 30 days
      const days = Math.floor(diff / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
=======
export class NewsComponent {

>>>>>>> c0b01643d8e827ce0af2549620d6cd9a5cd1001c
}
