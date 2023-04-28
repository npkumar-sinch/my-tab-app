import { Component } from '@angular/core';
import * as microsoftTeams from '@microsoft/teams-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {MatExpansionModule} from '@angular/material/expansion'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-tab-app';
  isLoggedIn: boolean = false;
  details: any
  mobilenumber: any;
  panelOpenState: boolean = false;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    microsoftTeams.app.initialize().then(() => {
      // Check the initial theme user chose and respect it
      microsoftTeams.app.getContext().then((context) => {
        window.alert(JSON.stringify(context));
        this.details = JSON.stringify(context);
        console.log("Details", this.details)
      }).catch((error) => {
        window.alert(error)
      });
    })
  }

  login() {
    microsoftTeams.authentication
      .getAuthToken()
      .then((result) => {
        console.log('Success token recieved' + result);
        const decodedToken = this.decodeToken(result);
        window.alert('Success token recieved.\n\n Hello!' + decodedToken);
        this.isLoggedIn = true;
      })
      .catch((error) => {
        console.log('Error getting token: ' + error);
        window.alert('Error getting token: ' + error);
      });
  }
  decodeToken(result: string) {
    throw new Error('Method not implemented.');

  }

  async onSubmitCall() {
    let verifycode = this.mobilenumber;
    console.log("mobile",verifycode)
    if(verifycode != undefined){
      console.log("number",this.mobilenumber)
      const data = {
        tnMask: verifycode
      };
      const apiUrl = '/Services/2.0.0/tnDetail';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      this.http.post(`/Services/2.0.0/tnDetail`, data, { headers }).subscribe((response) => {
        console.log(response);
      }, (error) => {
        console.error(error);
      });
    }
    else{
      window.alert("Please Enter the Value")
    }
   
  }

}
