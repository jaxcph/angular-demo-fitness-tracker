import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.module';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { UiService } from '../../shared/ui.service';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  // @Output() trainingStart = new EventEmitter<void>();
   exercises: Exercise [] = [];
  exerciseSubscription: Subscription;
  public isLoading = false;
  private loadingSub: Subscription;

  constructor(private trainingService: TrainingService,
              private uiService: UiService) { }

  fetchExercises() {
      this.loadingSub = this.uiService.loadingStateChange.subscribe( state => { this.isLoading = state; });
      this.trainingService.fetchAvailableExecises();
      this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe( e => (this.exercises = e) );
  }

  ngOnInit() {
    this.fetchExercises();
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
    this.loadingSub.unsubscribe();
  }


  onStartTraining(form: NgForm) {
  this.trainingService.startExercise(form.value.exercise);
  }


}
