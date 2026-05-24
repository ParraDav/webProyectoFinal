import { Component, ChangeDetectorRef } from '@angular/core';
import { proyectoFinalService } from '../../services/proyectoFinal-service';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proyectoFinal-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './proyectoFinal-component.html',
  styleUrls: ['./proyectoFinal-component.css'],
})
//lo que diga "animal" revisarlo
export class proyectoFinalComponent {
  animalList: any[] = [];
  animalForm!: FormGroup;
  idAnimal!: number;
  editableAnimal: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private animalService: proyectoFinalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.animalForm = this.formBuilder.group({
      nombre: '',
      edad: 0,
      tipo: '',
    });

    this.getAllAnimals();
  }

  getAllAnimals() {
    this.animalService.getAllAnimalsData().subscribe((data: any) => {
      this.animalList = data;
      this.cd.detectChanges();
    });
  }

  newAnimalEntry() {
    this.animalService.newAnimal(this.animalForm.value).subscribe(() => {
      this.router.navigate(['/inicio']).then(() => {
        this.newMessage('Registro exitoso');
        this.getAllAnimals();
        this.animalForm.reset({
          nombre: '',
          edad: 0,
          tipo: '',
        });
      });
    });
  }

  toggleEditAnimal(id: number) {
    this.idAnimal = id;
    this.editableAnimal = !this.editableAnimal;

    this.animalService.getOneAnimal(id).subscribe((data: any) => {
      this.animalForm.patchValue({
        nombre: data.nombre,
        edad: data.edad,
        tipo: data.tipo,
      });
    });
  }

  updateAnimalEntry() {
    const filteredData: any = {};

    for (let key in this.animalForm.value) {
      if (
        this.animalForm.value[key] !== '' &&
        this.animalForm.value[key] !== null
      ) {
        filteredData[key] = this.animalForm.value[key];
      }
    }

    this.animalService
      .updateAnimal(this.idAnimal, filteredData)
      .subscribe(() => {
        this.newMessage('Animal editado');
        this.getAllAnimals();
        this.editableAnimal = false;
      });
  }

  newMessage(messageText: string) {
    this.toastr
      .success('Clic aquí para actualizar la lista', messageText)
      .onTap.pipe(take(1))
      .subscribe(() => {
        this.getAllAnimals();
      });
  }
  deleteAnimalEntry(id: any) {
    console.log(id)
    this.animalService.deleteAnimal(id).subscribe(
      () => {
        //Enviando mensaje de confirmación
        this.newMessage("Animal eliminado");
      }
    );
  }


}