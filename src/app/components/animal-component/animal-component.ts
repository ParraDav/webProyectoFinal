import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { AnimalService } from '../../services/animal-service';

@Component({
  selector: 'app-animal-component',
  imports: [CommonModule],
  templateUrl: './animal-component.html',
  styleUrl: './animal-component.css',
})
export class AnimalComponent {
  animalList: any = [];

  constructor(private cd: ChangeDetectorRef, private animalService: AnimalService) { }

  getAllAnimals() {
    this.animalService.getAllAnimalsData().subscribe((data: {}) => {
      this.animalList = data;
      this.cd.detectChanges();
    });
  }
  ngOnInit() {
    this.getAllAnimals();
  }
   ngOnChanges() {
    this.getAllAnimals();
  }
}

