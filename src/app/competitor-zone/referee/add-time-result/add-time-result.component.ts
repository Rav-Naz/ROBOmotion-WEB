import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-time-result',
  templateUrl: './add-time-result.component.html',
  styleUrls: ['./add-time-result.component.scss']
})
export class AddTimeResultComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      window.close()
    },2000)
  }

}
