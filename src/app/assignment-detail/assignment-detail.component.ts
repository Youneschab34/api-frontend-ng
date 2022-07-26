import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Assignment } from '../assignments/assignment.model';
import { AssignmentsService } from '../shared/assignments.service';
import { AuthService } from '../shared/auth.service';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis?: Assignment;

  constructor(
    private assignmentsService: AssignmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // avant affichage on doit récupérer la valeur du id dans l'URL
    // le "+" force la conversion en number
    const id: number = +this.route.snapshot.params['id'];
    //console.log("ID = " + id);

    // Puis à partir de l'id on demandera au service de nous renvoyer
    // l'assignment correspondant....
    this.assignmentsService.getAssignment(id).subscribe((assignment) => {
      this.assignmentTransmis = assignment;
    });
  }

  onAssignmentRendu() {
    if (this.assignmentTransmis) {
      this.assignmentTransmis.rendu = true;

      this.assignmentsService
        .updateAssignment(this.assignmentTransmis)
        .subscribe((reponse) => {
          console.log('Réponse du serveur : ' + reponse.message);

          // on navigue vers la page d'accueil pour afficher la liste à jour
          this.router.navigate(['/home']);

          this.notificationService.success(
            this.assignmentTransmis?.nom + ' Modifier avec succes!!'
          );
        });
    }
  }

  onDelete() {
    // on envoie un evenement au papa
    if (this.assignmentTransmis) {
      this.assignmentsService
        .deleteAssignment(this.assignmentTransmis)
        .subscribe((reponse) => {
          console.log('Réponse du serveur : ' + reponse.message);

          // on navigue vers la page d'accueil pour afficher la liste à jour
          this.router.navigate(['/home']);

          this.notificationService.success(
            this.assignmentTransmis?.nom + ' Supprimer avec succes!!'
          );
        });
      this.assignmentTransmis = undefined;
    }
  }

  onClickEdit() {
    this.router.navigate(['/assignment', this.assignmentTransmis?.id, 'edit'], {
      queryParams: {
        nom: 'buffa',
        prenom: 'michel',
        debug: true,
      },
      fragment: 'edition',
    });
  }

  isAdmin() {
    return this.authService.loggedIn;
  }
}
