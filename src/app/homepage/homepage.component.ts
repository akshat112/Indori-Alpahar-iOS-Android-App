import { Component, OnInit } from '@angular/core';
import * as utils from "tns-core-modules/utils/utils";
import { prompt, PromptOptions, PromptResult, capitalizationType, inputType, action, alert } from "tns-core-modules/ui/dialogs";
import { isAndroid } from 'tns-core-modules/ui/page/page';
@Component({
  selector: 'ns-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

public sum:number = null;
public val1;
public val2;
public msg = '';
public showSmsBtn = false;
public items = {
    "poha": {
        "quantity": 0,
        "unitPrice": 12,
        "total": 0
    },
    "jalebi": {
        "quantity": 0,
        "unitPrice": 20,
        "total": 0
    },
    "dhokla": {
        "quantity": 0,
        "unitPrice": 30,
        "total": 0
    }
}

  constructor() { }

  ngOnInit() {
  }

  quantitySelect(item){
    if(item=='jalebi' || item=='dhokla'){
      action("Select quantity", "Cancel", ['50g', '100g', '200g', '250g', '500g', '1000g']).then((result) => {
          if(result == 'Cancel') this.items[item].quantity = 0;
          else this.items[item].quantity = parseInt(result.slice(0,-1))/100;
      });
    } else{
      action("Select quantity", "Cancel", ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']).then((result) => {
          if(result == 'Cancel') this.items[item].quantity = 0;
          else this.items[item].quantity = result;
      });
    }

}
calculate(){
    this.sum = (this.items.poha.unitPrice*this.items.poha.quantity) + (this.items.jalebi.unitPrice*this.items.jalebi.quantity)  + (this.items.dhokla.unitPrice*this.items.dhokla.quantity);
    if(this.sum == 0){
      const alertOptions = {
          title: "No item selected",
          message: "Please select some items to continue",
          okButtonText: "OK",
          cancelable: false // [Android only] Gets or sets if the dialog can be canceled by taping outside of the dialog.
      };
      alert(alertOptions).then(() => {
      });
    } else{
      this.showSmsBtn = true;
      this.msg = "Your order total is: ₹" + this.sum;
    }
}
reset(){
    this.msg = '';
    this.items.poha.quantity = 0;
    this.items.jalebi.quantity = 0;
    this.items.dhokla.quantity = 0;
    this.showSmsBtn = false;
}
open(){
    const promptOptions = {
        title: "Mobile no.",
        message: "Please enter the mobile number",
        okButtonText: "Proceed",
        cancelButtonText: "Cancel",
        inputType: "number"
    };
    prompt(promptOptions).then((r) => {
        if(!r.result){}
        else{
            let message = encodeURIComponent('Order no #'+ Math.ceil((Math.random() * (300 - 100) + 100)) +'\nYour order details:\n============\nPoha: ' + this.items.poha.quantity + '\nJalebi: ' + this.items.jalebi.quantity*100 + 'g\nDhokla: ' + this.items.dhokla.quantity*100 + 'g\n============\nTotal: ₹'+ this.sum);
            if(isAndroid){
                utils.openUrl("sms://"+r.text+"?body="+message);
            }else{
                utils.openUrl("sms://"+r.text+"&body="+message);
            }
        }
    });
  }
}
