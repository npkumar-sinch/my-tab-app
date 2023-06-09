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
  viewUserData: any;
  finalDatatnList: any;
  callerOutbound: any;
  E911Services: any;
  hideAccordian: boolean = false;
  hideNetworkAccordian: boolean = false;
  hideCallFeatureAccordian: boolean = false;
  hideOutboundAccordian: boolean = false;
  hidethirdPartyAccordian: boolean = false;
  hideLocationAccordian: boolean = false;
  hideE911Accordian: boolean = false

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
    if (verifycode != undefined && verifycode !== "") {
      console.log("number", this.mobilenumber);
      const data = {
        privateKey: "",
        tnMask: verifycode,
        tnSearchList: {
          tnSearchItem: [
            {
              tnMask: ""
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
        if (this.finaldata.tnList.tnItem.length !== 0) {
          this.showDetails = true;
        }
        else {
          alert("Details Are not Found")
        }
        this.finalDatatnList = this.finaldata.tnList
        this.viewUserData = this.finalDatatnList.tnItem[0];
        this.E911Services = this.viewUserData.tnFeature.e911;
        this.callerOutbound = this.viewUserData.tnFeature.callerId;
        console.log("getdata", this.viewUserData)


      }, (error) => {
        console.error(error);
      });
    }
    else {
      window.alert("Please check the Given Details")
    }
  }

  async userValidation() {
    const data = {
      privateKey: "",
      tnFeatureOrder: {
        tnList: {
          tn: this.mobilenumber,
          name: this.E911Services.name,
          streetNum: this.E911Services.origStreetNum,
          streetInfo: this.E911Services.origStreetInfo,
          city: this.E911Services.origCity,
          state: this.E911Services.origState,
          postalCode: this.E911Services.origPostalCode,
          location: "Remote Location 1"
        }
      }
    }
    console.log("payload", data)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http.post(`Services/2.0.0/tnE911Validate`, data, { headers }).subscribe((response) => {
      this.userValidData = response;
      console.log("num", this.userValidData);
      if (this.userValidData.statusCode = "200") {
        alert("Given Details are Validated")
      }
      else {
        alert("Given details are not Valid")
      }
    }, (error) => {
      console.error(error);
    });
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
    console.log("payloaddata", data)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http.post(`Services/2.0.0/tnFeatureOrder`, data, { headers }).subscribe((response) => {
      this.finaldata = response;
      if (this.finaldata.statusCode = "200") {
        alert("Given Details are Updated");
      }
      else {
        alert("Something Went Wrong")

      }
      console.log("updateresponse", response)
      this.finalDatatnList = this.finaldata.tnList
      this.viewUserData = this.finalDatatnList.tnItem[0];
      this.E911Services = this.viewUserData.tnFeature.e911;
      this.E911Services.origCity = this.viewUserData.tnFeature.e911.origCity
    }, (error) => {
      console.error(error);
    });
  }

  async updateCaller() {
    const data = {
      privateKey: "",
      tnFeatureOrder: {
        tnList: {
          tnItem: [
            {
              tn: this.mobilenumber,
              tnFeature: {
                callerId: {
                  callingName: this.callerOutbound.callingName,
                  cnamDip: "Y",
                  removeTnFeature: "N"
                }
              }
            }
          ]
        }
      }
    }
    console.log("calpayload",data)
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    this.http.post(`Services/2.0.0/tnFeatureOrder`, data, { headers }).subscribe((response) => {
      this.userValidData = response;
      console.log("num", this.userValidData);
      if (this.userValidData.statusCode = "200") {
        alert("Details are updated")
      }
      else {
        alert("Something Went Wrong, Please check the Given Details")
      }
    }, (error) => {
      console.error(error);
    });
  }

  handleE911Change(event: any) {
    if (event.target.checked) {
      this.hideE911Accordian = true;
    } else {
      console.log('Checkbox is unchecked');
      this.hideE911Accordian = false;
    }
  }

  handlelocationChange(event: any) {
    if (event.target.checked) {
      this.hideLocationAccordian = true;
    } else {
      console.log('Checkbox is unchecked');
      this.hideLocationAccordian = false;
    }
  }

  handlethirdPartyChange(event: any) {
    if (event.target.checked) {
      this.hidethirdPartyAccordian = true;
    } else {
      console.log('Checkbox is unchecked');
      this.hidethirdPartyAccordian = false;
    }
  }

  handleoutboundChange(event: any) {
    if (event.target.checked) {
      this.hideOutboundAccordian = true;
    } else {
      console.log('Checkbox is unchecked');
      this.hideOutboundAccordian = false;
    }
  }

  handleCallFeatureChange(event: any) {
    if (event.target.checked) {
      this.hideCallFeatureAccordian = true;
    } else {
      console.log('Checkbox is unchecked');
      this.hideCallFeatureAccordian = false;
    }
  }

  handleNetworkcallChange(event: any){
    if (event.target.checked) {
      this.hideNetworkAccordian = true;
    } else {
      console.log('Checkbox is unchecked');
      this.hideNetworkAccordian = false;
    }
  }


}
