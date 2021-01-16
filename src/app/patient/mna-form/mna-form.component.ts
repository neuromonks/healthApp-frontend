import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService, CommonService} from "../../services";
import {Ng2IzitoastService} from "ng2-izitoast";

@Component({
  selector: 'app-mna-form',
  templateUrl: './mna-form.component.html',
  styleUrls: ['./mna-form.component.css']
})
export class MnaFormComponent implements OnInit {
  userData:any;
  mnaForm: FormGroup;
  submitted = false;

  json: any = {
    questionA: {
      label: 'A. Has food intake declined over the past 3 months due to loss\n' +
        'of appetite, digestive problems, chewing or swallowing\n' +
        'difficulties?',
      type: 'radio',
      options: [
        { label: 'severe decrease in food intake', value: 0 },
        { label: ' moderate decrease in food intake', value: 1 },
        {label: ' no decrease in food intake',value:2}
      ],
      validation: {
      "required": true}
    },
    questionB: {
      label: 'B. Weight loss during the last 3 months?',
      type: 'radio',
      options: [
        { label: 'weight loss greater than 3kg (6.6lbs)', value: 0 },
        { label: 'does not know', value: 1 },
        {label: 'weight loss between 1 and 3kg (2.2 and 6.6 lbs)',value:2},
        {label: 'no weight loss',value:3}
      ],
      validation: {
        "required": true}
    },
    questionC: {
      label: 'C. Mobility',
      type: 'radio',
      options: [
        { label: 'bed or chair bound', value: 0 },
        { label: 'able to get out of bed / chair but does not go out', value: 1 },
        {label: 'goes out',value:2},
      ],
      validation: {
        "required": true}
    },
    questionD: {
      label: 'D. Has suffered psychological stress or acute disease in the past 3 months?',
      type: 'radio',
      options: [
        { label: 'yes', value: 0 },
        { label: 'no', value: 1 },
      ],
      validation: {
        "required": true}
    },
    questionE: {
      label: 'E. Neuropsychological problems',
      type: 'radio',
      options: [
        { label: 'severe dementia or depression', value: 0 },
        { label: 'mild dementia', value: 1 },
        {label: 'no psychological problems',value: 2}
      ],
      validation: {
        "required": true}
    },
    questionF: {
      label: 'F. Body Mass Index (BMI) = weight in kg / (height in m) 2',
      type: 'radio',
      options: [
        { label: 'BMI less than 19', value: 0 },
        { label: 'BMI 19 to less than 21', value: 1 },
        {label: 'BMI 21 to less than 23',value: 2},
        {label: 'BMI 23 or greater',value:3}
      ],
      validation: {
        "required": true}
    },
    questionG: {
      label: 'G. Lives independently (not in nursing home or hospital)',
      type: 'radio',
      options: [
        { label: 'yes', value: 0 },
        { label: 'no', value: 1 },
      ],
      validation: {
        "required": true}
    },
    questionH: {
      label: 'H. Takes more than 3 prescription drugs per day',
      type: 'radio',
      options: [
        { label: 'yes', value: 0 },
        { label: 'no', value: 1 },
      ],
      validation: {
        "required": true}
    },
    questionI: {
      label: 'I. Pressure sores or skin ulcers',
      type: 'radio',
      options: [
        { label: 'yes', value: 0 },
        { label: 'no', value: 1 },
      ],
      validation: {
        "required": true}
    },
    questionJ: {
      label: 'J. How many full meals does the patient eat daily?',
      type: 'radio',
      options: [
        { label: '1 meal', value: 0 },
        { label: '2 meals', value: 1 },
        { label: '3 meals', value: 2 },
      ],
      validation: {
        "required": true}
    },
    questionK: {
      label: 'K. Selected consumption markers for protein intake',
      type: 'na',
    },
    questionK1: {
      label: 'K-1. Selected consumption markers for protein intake',
      type: 'radio',
      options: [
        { label: 'no', value: 0 },
        { label: 'yes', value: 1 },

      ],
      validation: {
        "required": true}
    },
    questionK2: {
      label: 'K-2. Two or more servings of legumes or eggs per week',
      type: 'radio',
      options: [
        { label: 'no', value: 0 },
        { label: 'yes', value: 1 },

      ],
      validation: {
        "required": true}
    },
    questionK3: {
      label: 'K-3. Meat, fish or poultry every day',
      type: 'radio',
      options: [
        { label: 'no', value: 0 },
        { label: 'yes', value: 1 },

      ],
      validation: {
        "required": true}
    },
    questionL: {
      label: 'L. Consumes two or more servings of fruit or vegetables per day?',
      type: 'radio',
      options: [
        { label: 'no', value: 0 },
        { label: 'yes', value: 1 },

      ],
      validation: {
        "required": true}
    },
    questionM: {
      label: 'M. How much fluid (water, juice, coffee, tea, milk...) is consumed per day?',
      type: 'radio',
      options: [
        { label: 'less than 3 cups', value: 0 },
        { label: '3 to 5 cups', value: 0.5 },
        { label: 'more than 5 cups', value: 1 },
      ],
      validation: {
        "required": true}
    },
    questionN: {
      label: 'N. Mode of feeding',
      type: 'radio',
      options: [
        { label: 'unable to eat without assistance', value: 0 },
        { label: 'self-fed with some difficulty', value: 1 },
        { label: ' self-fed without any problem', value: 2 },
      ],
      validation: {
        "required": true}
    },
    questionO: {
      label: 'O. Self view of nutritional status',
      type: 'radio',
      options: [
        { label: 'views self as being malnourished', value: 0 },
        { label: 'is uncertain of nutritional state', value: 1 },
        { label: 'views self as having no nutritional problem', value: 2 },
      ],
      validation: {
        "required": true}
    },
    questionP: {
      label: 'P. In comparison with other people of the same age, how does the patient consider his / her health status?',
      type: 'radio',
      options: [
        { label: 'not as good', value: 0},
        { label: 'does not know', value: 0.5 },
        { label: 'as good', value: 1 },
        { label: 'better', value: 1 },
      ],
      validation: {
        "required": true}
    },
    questionQ: {
      label: 'Q.  Mid-arm circumference (MAC) in cm',
      type: 'radio',
      options: [
        { label: 'MAC less than 21', value: 0},
        { label: 'MAC 21 to 22', value: 0.5 },
        { label: 'MAC greater than 22', value: 1 },

      ],
      validation: {
        "required": true}
    },
    questionR: {
      label: 'R. Calf circumference (CC) in cm',
      type: 'radio',
      options: [
        { label: 'CC less than 31', value: 0},
        { label: ' CC 31 or greater', value: 1 },

      ],
      validation: {
        "required": true}
    },
  };

  constructor(private authService:AuthService,
              private commonService:CommonService,
              private builder: FormBuilder,
              private iziToast: Ng2IzitoastService) { }

  ngOnInit() {
    if(!this.authService.isLoggedIn){
      this.commonService.navigateTo('/login');
    }else{
      this.userData = this.authService.getUserInfo();
      if(this.userData.user_type !== 'patient'){
        this.commonService.navigateTo('/login');
      }
    }
    this.mnaForm = this.builder.group({
      questionA: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.mnaForm.controls)
    if (this.mnaForm.invalid) {
      this.iziToast.warning({
        title: 'Error!',
        message: 'Please fill all required fields',
        position: 'topCenter'
      });
      return;
    }
  }

  components(fg: FormGroup) {
    console.log(fg)
  }

}