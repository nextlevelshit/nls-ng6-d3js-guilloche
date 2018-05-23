import { ConfigForm } from './forms/config.form';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { environment as env } from '../environments/environment';
import { Param } from './models/param.model';
import { Config } from './models/config.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public canvasParam: Param;
  public config: any | null;
  public configForm: FormGroup;
  public scaleOnWheel: boolean;

  @HostListener('mousewheel', ['$event'])
  private onMousewheel(event) {
    this.config = {...this.configForm.value};

    if (this.scaleOnWheel) {
      const delta = Math.sign(event.deltaY);
      const step = env.controls.wheelStep;

      if (delta > 0) {
        if (this.config.scale === 1 - step) {
          return;
        }
        this.config.scale += step;
      } else {
        if (this.config.scale === step) {
          return;
        }
        this.config.scale -= step;
      }
      this.config.scale = Math.round(this.config.scale / step) * step;
    }
    this.configForm.reset({...this.config});
    this.updateGraphs();
  }

  constructor() {
    this.config = env.formDefaults;
    this.configForm = ConfigForm;
  }

  ngOnInit() {
    this.configForm.reset({...this.config});
  }

  public updateGraphs() {
    this.config = {...this.configForm.value};
  }

  public exportSvg() {
    alert('Feature coming');
  }
}
