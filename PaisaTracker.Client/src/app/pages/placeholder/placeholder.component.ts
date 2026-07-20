import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  imports: [],
  templateUrl: './placeholder.component.html',
  styleUrl: './placeholder.component.css'
})
export class PlaceholderComponent {
  title = 'Coming soon';

  constructor(route: ActivatedRoute) {
    this.title = route.snapshot.data['title'] ?? 'Coming soon';
  }
}
