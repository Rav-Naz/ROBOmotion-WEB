import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-building-plan',
  templateUrl: './building-plan.component.html',
  styleUrls: ['./building-plan.component.scss']
})
export class BuildingPlanComponent {

  constructor(public translate: TranslateService) {}


}
