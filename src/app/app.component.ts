import { Component } from '@angular/core';
import * as microsoftTeams from '@microsoft/teams-js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
export interface userOption {
  value: string;
  viewValue: string;
}

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
  showDetails:boolean = false;
  finaldata: any;
  userList: userOption[] = [
    {value: 'steak-0', viewValue: 'User'},
    {value: 'pizza-1', viewValue: 'Admin'},
    {value: 'tacos-2', viewValue: 'User1'}
  ];
  constructor(private http: HttpClient) {
    this.login()
  }

  ngOnInit() {
    this.login();
    microsoftTeams.app.initialize().then(() => {
      // Check the initial theme user chose and respect it
      microsoftTeams.app.getContext().then((context) => {
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
    if(verifycode != undefined && verifycode == "+(201)-970-9505" ){
      console.log("number",this.mobilenumber);
      const data = {
        privateKey: "",
          tnSearchList: {
            tnSearchItem: [
              {
                tnMask: verifycode
              }
            ]
          },
          pageSort: {
            size: 1,
            page: 1
          }
      };
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
  
      this.http.post(`/Services/2.0.0/tnDetail`, data, { headers }).subscribe((response) => {
        this.finaldata = response;
        console.log("num",this.finaldata);
        if(this.finaldata.userData.statusCode= "200"){
          this.showDetails = true
        }
       else{
        alert("details not found")
       }
      }, (error) => {
        console.error(error);
      });
    }
    else{
      window.alert("Please check the Given Details")
    }
   
  }

}
