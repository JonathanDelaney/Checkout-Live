import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-snowflakes',
  templateUrl: './snowflakes.component.html',
  styleUrls: ['./snowflakes.component.css']
})
export class SnowflakesComponent implements OnInit {

  snowflakesAmount = Array(17);

  constructor() { }

  ngOnInit(): void {
  }

}
