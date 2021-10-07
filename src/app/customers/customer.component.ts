import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn} from '@angular/forms';

import { Customer } from './customer';


//<-------------Custom validator

// function ratingRange(c: AbstractControl):{[key: string]: boolean} | null {
//       if(c.value !== null && (isNaN(c.value)|| c.value<1 || c.value>5 )){
//           return {'range': true}
//       }
//       return null;

// }

//---.custom validator with params

function ratingRange(min: number, max:  number): ValidatorFn{

  return (c: AbstractControl):{[key: string]: boolean} | null =>{
    if(c.value !== null && (isNaN(c.value)|| c.value<min || c.value>max )){
        return {'range': true}
    }
    return null;

}
}

function emailMatcher(c:AbstractControl):{[key: string]: boolean}| null{
  const emailControl= c.get('email');
  const confirmControl= c.get('confirmEmail');
  if(emailControl.pristine===true || confirmControl.pristine===true){
    return null;
  }
  if(emailControl.value === confirmControl.value){
    return null;
  }
  return {'match': true}
}


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  customer = new Customer();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {

    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        confirmEmail: ['', Validators.required],
      }, {validator: emailMatcher}),
      notification: 'email',
      phone: '',
      sendCatalog: true,
      rating: [null, ratingRange(1, 5)], 
    });

  //   this.customerForm= new FormGroup({
  //     firstName: new FormControl(),
  //     lastName: new FormControl(),
  //     email: new FormControl(),
  //     sendCatalog: new FormControl(true),
  //   });
    
  
    }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData(){
    // this.customerForm.setValue({
    //   firstName: 'Joaquin',
    //   lastName: 'Mata',
    //   email: 'joaquin.mata@ubroapps.com',
    //   sendCatalog: false,
    // });
    this.customerForm.patchValue({
      firstName: 'Joaquin',
      lastName: 'Mata',
    });
  }

  setNotification(notifyVia: string){
    const phoneControl = this.customerForm.get('phone');
    if(notifyVia==='text'){
      phoneControl.setValidators(Validators.required);
    }else{
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

}
