import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Home,
  List,
  PlusCircle,
  ChevronLeft,
  FlaskConical
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Output() sidebarToggled = new EventEmitter<boolean>();

  currentPage = 'home';
  isExpanded = true;
  icons = { Home, List, PlusCircle, ChevronLeft, FlaskConical };

  setCurrentPage(page: string) {
    this.currentPage = page;
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.sidebarToggled.emit(!this.isExpanded);
  }
}
