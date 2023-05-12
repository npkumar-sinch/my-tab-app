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
  showDetails: boolean = false;
  finaldata: any;
  getUpdateData: any;
  userUpdateDetail: any;
  userValidData: any;
  viewUserData : any;
  finalDatatnList: any;
  callerOutbound: any;
  E911Services: any;
  userList: userOption[] = [
    { value: '0', viewValue: 'User' },
    { value: '1', viewValue: 'Admin' },
    { value: '2', viewValue: 'User1' }
  ];
  constructor(private http: HttpClient) {
    // this.login()
  }

  ngOnInit() {
    // this.login();
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

  // login() {
  //   microsoftTeams.authentication
  //     .getAuthToken()
  //     .then((result) => {
  //       console.log('Success token recieved' + result);
  //       const decodedToken = this.decodeToken(result);
  //       window.alert('Success token recieved.\n\n Hello!' + decodedToken);
  //       this.isLoggedIn = true;
  //     })
  //     .catch((error) => {
  //       console.log('Error getting token: ' + error);
  //       window.alert('Error getting token: ' + error);
  //     });
  // }
  // decodeToken(result: string) {
  //   throw new Error('Method not implemented.');

  // }

  async onSubmitCall() {
    let verifycode = this.mobilenumber;
    console.log("mobile", verifycode)
    if (verifycode != undefined && verifycode == "+(201)-970-9505") {
      console.log("number", this.mobilenumber);
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
        this.finalDatatnList = this.finaldata.tnList
        this.viewUserData = this.finalDatatnList.tnItem[0];
        this.E911Services = this.viewUserData.tnFeature.e911;
        this.callerOutbound = this.viewUserData.tnFeature.callerId;
        console.log("getdata",this.viewUserData)
        if (this.finaldata.statusCode = "200") {
          this.showDetails = true;
        }
        else {
          alert("details not found")
        }
      }, (error) => {
        console.error(error);
      });
    }
    else {
      window.alert("Please check the Given Details")
    }
  }

  async userValidation() {
    let verifycode = this.mobilenumber;
    if (verifycode == undefined || verifycode == "") {
      window.alert("Please Enter the Value")
    }
    else {
      const data = {
        privateKey: "",
        tn: verifycode,
        name: this.finaldata.userData.name,
        streetNum: this.finaldata.userData.origStreetNum,
        streetInfo: this.finaldata.userData.origStreetInfo,
        city: this.finaldata.userData.origCity,
        state: this.finaldata.userData.origState,
        postalCode: this.finaldata.userData.origPostalCode,
        location: "Remote Location 1"
      };
      console.log("payload", data, data.tn)
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      this.http.post(`Services/2.0.0/tnE911Validate`, data, { headers }).subscribe((response) => {
        this.userValidData = response;
        console.log("num", this.finaldata);
        if (this.userValidData.Validation.statusCode = "200") {
          alert("Given Details are Validated")
        }
        else {
          alert("Given details are not Valid")
        }
      }, (error) => {
        console.error(error);
      });
    }
  }

  async UserE911ServiceUpdate() {
    const data = {
      privateKey: "",
      tnFeatureOrder: {
        tnList: {
          tnItem: [
            {
              tn: this.mobilenumber,
              tnFeature: {
                e911: {
                  country: "US",
                  name: this.E911Services.name,
                  origCity: this.E911Services.origCity,
                  origPostalCode: this.E911Services.origPostalCode,
                  origState: this.E911Services.origState,
                  origStreetInfo: this.E911Services.origStreetInfo,
                  origStreetNum: this.E911Services.origStreetNum,
                  removeTnFeature: "N"
                }
              }
            }
          ]
        }
      }
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http.post(`Services/2.0.0/tnFeatureOrder`, data, { headers }).subscribe((response) => {
      // this.userUpdateDetail = response;
      // console.log("num", this.userUpdateDetail);
      this.finaldata = response;
      this.finalDatatnList = this.finaldata.tnList
      this.viewUserData = this.finalDatatnList.tnItem[0];
      this.E911Services = this.viewUserData.tnFeature.e911;
    }, (error) => {
      console.error(error);
    });
  }


}
