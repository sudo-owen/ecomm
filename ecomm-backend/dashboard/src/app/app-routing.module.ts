import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ExperimentsListComponent } from './pages/experiments-list/experiments-list.component';
import { CreateExperimentComponent } from './pages/create-experiment/create-experiment.component';
import { ExperimentDetailComponent } from './pages/experiment-detail/experiment-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'experiments', component: ExperimentsListComponent },
  { path: 'create', component: CreateExperimentComponent },
  { path: 'experiment/:id', component: ExperimentDetailComponent },
];