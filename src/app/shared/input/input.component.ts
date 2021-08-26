import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() group!: FormGroup;
  @Input() controlName!: string;
  @Input() nameKey!: string;
  
  constructor(private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    setInterval(() => {
      this.ref.detectChanges()
      console.log(this.getErrors)
    },2000)
  }

  get isFormInvalid() {
    return !this.group.get(this.controlName)?.valid && this.group.get(this.controlName)?.touched;
  }

  get getErrors() {
    var control = this.group.get(this.controlName);
    var keys = control?.errors ? Object.keys(control?.errors) : [];
    return keys;
  }

}
