import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: []
})
export class LoaderComponent implements OnInit {
  @Input() isLoading = false;

  constructor() { }

  ngOnInit(): void {
  }

}
