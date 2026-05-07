imports: [CommonModule],
import { Component } from '@angular/core';
import { AnimalService } from '../../services/animal-service';

@Component({
  selector: 'app-animal-component',
  imports: [],
  templateUrl: './animal-component.html',
  styleUrl: './animal-component.css',
})
export class AnimalComponent {
  animalList: any = [];

  constructor(private cd: ChangeDetectorRef) { }

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

