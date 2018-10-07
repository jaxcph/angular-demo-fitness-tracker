import { Injectable } from '@angular/core';
import { Exercise } from './exercise.module';
import { Subject, throwError } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UiService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private afsSubs: Subscription[] = [];
  private availableExecises: Exercise[] = [];
  private runningExercise: Exercise;

  constructor(private afs: AngularFirestore,
              private uiService: UiService) { }

  startExercise(selectedId: string) {
    this.afs.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
    this.runningExercise = this.availableExecises.find( ex => ex.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  fetchAvailableExecises() {
    this.uiService.loadingStateChange.next(true);
    this.afsSubs.push( this.afs.collection('availableExercises')
          .snapshotChanges()
          .pipe(
            map(result => {
            return result.map( doc => {
              // throw(new Error('heelo'));
              return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.get('name'),
                duration: doc.payload.doc.get('duration'),
                calories: doc.payload.doc.get('calories'),
              };
            });
          })).subscribe((ea: Exercise[]) => {
            this.uiService.loadingStateChange.next(false);
            this.availableExecises = ea;
            this.exercisesChanged.next([...ea]);
          }, error => {
            console.error(error);
            this.uiService.loadingStateChange.next(false);
            this.uiService.showSnackbar('Fetching exercises failed', null, 5000);
            this.exercisesChanged.next(null);
          })
          );
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  completeExercise() {
    this.saveToDatabase({...this.runningExercise, date: new Date(), state: 'completed' });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.saveToDatabase({...this.runningExercise,
       date: new Date(),
       state: 'cancelled',
       duration: this.runningExercise.duration * (progress / 100),
       calories: this.runningExercise.calories * (progress / 100) });

    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  fetchCompletedExercises() {
    this.afsSubs.push(this.afs.collection('finishedExercises')
        .valueChanges()
        .subscribe( (exercises: Exercise[]) => {
        console.log('finishedExercises:valueChange next:');
        console.log(exercises);
        this.finishedExercisesChanged.next(exercises);
      })
    );

  }

  saveToDatabase(exercise: Exercise) {
    this.afs.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.afsSubs.forEach( sub => (sub.unsubscribe()));
  }
}
