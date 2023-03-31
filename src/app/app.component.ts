import { Component } from '@angular/core';
import * as microsoftTeams from '@microsoft/teams-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-tab-app';
  constructor() {
    microsoftTeams.initialize();
    microsoftTeams.authentication.getAuthToken({
      successCallback: (token) => {
        console.log('Token:', token);
      },
      failureCallback: (error) => {
        console.error('SSO login failed:', error);
      }
    });
    
  }

  login(){
    
    microsoftTeams.authentication.authenticate({
      // url: 'https://" + window.location.host',
      url: 'https://a2bc-2001-4490-4c89-8792-945d-4829-eea2-1122.in.ngrok.io/',
      // width: 600,
      // height: 535,
      successCallback: (result: any) => {
        console.log('SSO login succeeded:', result);
      },
      failureCallback: (error: any) => {
        console.error('SSO login failed:', error);
      }
    });
  }
  }
