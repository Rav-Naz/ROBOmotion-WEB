import { RobotsService } from './../../../../services/robots.service';
import { AuthService } from './../../../../services/auth.service';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Robot } from 'src/app/models/robot';

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.scss'],
  host: {
    'class': 'router-flex'
  }
})
export class RobotComponent {

  private oldName: string = "";
  public form: FormGroup;
  public loading: boolean = false;
  private subs: Subscription = new Subscription;
  public robot: Robot | null = null;

  constructor(private route: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService, private robotService: RobotsService) {

    const robot_uuid = this.route.snapshot.paramMap.get('robot_uuid');
    const sub1 = this.robotService.userRobots$.subscribe((roboty) => {
      if (roboty !== null && roboty !== undefined) {
        this.robot = roboty?.find((rob) => rob.robot_uuid == robot_uuid)
        this.oldName = this.robot!.nazwa_robota;
        this.form = this.formBuilder.group({
          robot_name: [this.oldName, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]]
        });
      };
    });
    this.form = this.formBuilder.group({
      robot_name: [this.oldName, [Validators.required, Validators.minLength(2), Validators.maxLength(40)]]
    });
    this.subs.add(sub1)

  }


  onSubmit() {
    if (this.isFormGroupValid) {

    }
  }

  enterSubmit(event: any) {
    if (event.keyCode === 13) this.onSubmit();
  }

  public get isChanged() {
    return this.form.get('robot_name')?.value !== this.oldName;
  }

  get isFormGroupValid() {
    return this.form.valid && !this.isLoading && this.authService.canModify;
  }

  get isLoading() {
    return this.loading;
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

}
