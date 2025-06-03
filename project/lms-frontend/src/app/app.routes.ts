import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { AdminserviceComponent } from './component/adminservice/adminservice.component';
import { UserdashboardComponent } from './component/userdashboard/userdashboard.component';
import { AdmindashboardComponent } from './component/admindashboard/admindashboard.component';
import { ProfileComponent } from './component/profile/profile.component';
import { AllusersComponent } from './component/allusers/allusers.component';
import { AddBookComponent } from './component/addbook/addbook.component';
import { HistoryComponent } from './component/history/history.component';
import { AllbooksComponent } from './component/allbooks/allbooks.component';
import { HelpComponent } from './component/help/help.component';
import { EditBookComponent } from './component/editbook/editbook.component';
import { BookDetailsComponent } from './component/bookdetails/bookdetails.component';

//import { CanDeactivateGuard } from './can-deactivate.guard';

export const routes: Routes = [
  {path:'' ,component:LoginComponent},
  {path:'signup',component:SignupComponent},
  
  {path:'userdashboard',component:UserdashboardComponent,
    children:[
      {path:'profile',component:ProfileComponent},
      {path:'history',component:HistoryComponent},
      {path:'allbooks',component:AllbooksComponent},
      {path:'help',component:HelpComponent}
    ]
  },
  {path:'admindashboard',component:AdmindashboardComponent,
    children:[
      {path:'profile',component:ProfileComponent},
      {path:'allusers',component:AllusersComponent},
      {path:'addbook',component:AddBookComponent},
      {path:'admin',component:AdminserviceComponent},
      {path:'editbook/:id',component:EditBookComponent},
      {path:'searchbook',component:AllbooksComponent},
      {path:'bookdetails/:id',component:BookDetailsComponent},
    ]
  },
  
];