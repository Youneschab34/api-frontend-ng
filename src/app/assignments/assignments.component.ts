import { Component, Inject, OnInit } from '@angular/core';
import { AssignmentsService } from '../shared/assignments.service';
import { Assignment } from './assignment.model';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';
import { AuthService } from '../shared/auth.service';
import { NotificationService } from '../shared/notification.service';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  titre = 'Liste des assignments';
  couleur = 'violet';
  // Pour la pagination
  page: number = 1;
  limit: number = 5;
  totalDocs: number = 0;
  totalPages: number = 0;
  hasPrevPage: boolean = false;
  prevPage: number = 0;
  hasNextPage: boolean = false;
  nextPage: number = 0;

  // pour l'affichage en table
  displayedColumns: string[] = [
    'demo-id',
    'demo-nom',
    'demo-dateDeRendu',
    'demo-rendu',
    'actions',
  ];
  clickedRows = new Set<Assignment>();
  assignments: Assignment[] = [];

  constructor(
    private assignmentService: AssignmentsService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void {
    // appelé AVANT l'affichage (juste après le constructeur)
    console.log('AVANT AFFICHAGE');
    // on va demander au service de nous renvoyer les données (les assignments)
    // typiquement : le service envoie une requête AJAX sur un web service
    // du cloud...

    this.getAssignments();
  }
  deconnexion() {
    this.authService.logOut();
    this.router.navigate(['/authen']);
  }
  showAssignment(assignment: Assignment) {
    let route = 'assignment/' + assignment.id;
    this.router.navigate([route]);
  }
  initialiserLaBaseAvecDonneesDeTest() {
    this.assignmentService.peuplerBDAvecForkJoin().subscribe(() => {
      console.log(
        '##### initialiserLaBaseAvecDonneesDeTest : DONNES AJOUTEES ! ######'
      );
      // et on va afficher la liste des assignments
      this.router.navigate(['/home'], { replaceUrl: true });
    });
  }
  deletAssignment(assignment: Assignment) {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: assignment,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result) {
        this.assignmentService
          .deleteAssignment(assignment)
          .subscribe((reponse) => {
            console.log('Réponse du serveur : ' + reponse.message);
            this.getAssignments();
            this.notifService.success(
              assignment.nom + ' Supprimer avec succees'
            );
          });
      }
    });
  }

  getAssignments() {
    console.log('On demande les assignments au service');
    this.assignmentService
      .getAssignmentsPagine(this.page, this.limit)
      .subscribe((data) => {
        // quand on rentre ici on sait que les données sont prêtes
        console.log('données reçues');
        this.assignments = data.docs;
        this.page = data.page;

        this.limit = data.limit;
        this.totalDocs = data.totalDocs;
        this.totalPages = data.totalPages;
        this.hasPrevPage = data.hasPrevPage;
        this.prevPage = data.prevPage;
        this.hasNextPage = data.hasNextPage;
        this.nextPage = data.nextPage;
        console.log('données reçues');
      });

    console.log('demande envoyée au service');
  }
  pageSuivante() {
    if (this.hasNextPage) {
      this.page = this.nextPage;
      this.getAssignments();
    }
  }

  pagePrecedente() {
    if (this.hasPrevPage) {
      this.page = this.prevPage;
      this.getAssignments();
    }
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignments();
  }

  premierePage() {
    this.page = 1;
    this.getAssignments();
  }
}
